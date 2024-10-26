"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";

import { motion } from "framer-motion";
import { format, subYears, getYear } from "date-fns";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

// Open the IndexedDB database
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("journalDB", 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("entries")) {
        db.createObjectStore("entries", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event: Event) => {
      const target = event.target as IDBOpenDBRequest;
      reject(`Database error: ${target.error}`);
    };
  });
}

// Define the Entry interface
interface Entry {
  id: number;
  date: string;
  entry: string;
  image?: string;
}

// Retrieve all entries from the IndexedDB
async function getAllEntries(): Promise<Entry[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("entries", "readonly");
    const objectStore = transaction.objectStore("entries");
    const request = objectStore.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event: Event) => {
      const target = event.target as IDBRequest;
      reject(`Error fetching entries: ${target.error}`);
    };
  });
}

const trailingActions = (entry: Entry, onDelete: (entry: Entry) => void) => (
  <TrailingActions>
    <SwipeAction destructive={true} onClick={() => onDelete(entry)}>
      <Trash2 className="bg-red-500 flex justify-end w-full h-full" />
    </SwipeAction>
  </TrailingActions>
);

// Function to handle deleting an entry from IndexedDB
async function deleteEntry(
  entry: Entry,
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>
) {
  const db = await openDatabase();
  const transaction = db.transaction("entries", "readwrite");
  const objectStore = transaction.objectStore("entries");

  objectStore.delete(entry.id).onsuccess = () => {
    // Update the state and re-load entries from IndexedDB
    setEntries([]);
    async function loadEntries() {
      try {
        const storedEntries = await getAllEntries();
        setEntries(storedEntries);
        console.log("Loaded entries from IndexedDB:", storedEntries);
      } catch (error) {
        console.error("Error loading entries from IndexedDB:", error);
      }
    }

    loadEntries();
  };
}

export default function History() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(
    getYear(new Date()).toString()
  );
  const entriesPerPage = 10;

  useEffect(() => {
    // Load data from IndexedDB
    async function loadEntries() {
      try {
        const storedEntries = await getAllEntries();
        setEntries(storedEntries);
        console.log("Loaded entries from IndexedDB:", storedEntries);
      } catch (error) {
        console.error("Error loading entries from IndexedDB:", error);
      }
    }

    loadEntries();
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    const entry = entries.find(
      (e) => new Date(e.date).toDateString() === date?.toDateString()
    );
    if (entry) {
      setSelectedEntry(entry);
    } else {
      setSelectedEntry(null);
    }
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const years = Array.from(
    new Set(entries.map((entry) => getYear(new Date(entry.date))))
  );

  const handleDeleteEntry = (entry: Entry) => {
    deleteEntry(entry, setEntries);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary">Journal History</h1>
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Entries</CardTitle>
              <CardDescription>
                Browse through your past journal entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {currentEntries.map((entry) => (
                  <SwipeableList fullSwipe={true}>
                    <SwipeableListItem
                      key={entry.id}
                      trailingActions={trailingActions(
                        entry,
                        handleDeleteEntry
                      )}
                    >
                      <motion.li
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardHeader>
                                <CardTitle>
                                  {format(new Date(entry.date), "MMMM d, yyyy")}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm line-clamp-3">
                                  {entry.entry}
                                </p>
                              </CardContent>
                            </Card>
                          </DrawerTrigger>
                          <DrawerContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DrawerHeader>
                              <DrawerTitle>
                                {format(new Date(entry.date), "MMMM d, yyyy")}
                              </DrawerTitle>
                              <DrawerDescription>
                                Your journal entry for this date
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="mt-4 mb-10 space-y-2">
                              <p className="text-sm px-5">{entry.entry}</p>
                              {entry.image && (
                                <img
                                  src={entry.image}
                                  alt="Journal entry image"
                                  className="w-full h-auto rounded-md"
                                />
                              )}
                            </div>
                          </DrawerContent>
                        </Drawer>
                      </motion.li>
                    </SwipeableListItem>
                  </SwipeableList>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <span>
                  {currentPage} / {Math.ceil(entries.length / entriesPerPage)}
                </span>
                <Button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={indexOfLastEntry >= entries.length}
                  variant="outline"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
                <CardDescription>
                  Choose a year and date to view your entry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <motion.div
              key={selectedEntry?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedEntry
                      ? format(new Date(selectedEntry.date), "MMMM d, yyyy")
                      : "No Entry"}
                  </CardTitle>
                  <CardDescription>
                    {selectedEntry
                      ? "Your journal entry for this date"
                      : "There is no entry for the selected date"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedEntry ? (
                    <Drawer>
                      <DrawerTrigger asChild>
                        <div className="space-y-4 cursor-pointer">
                          <p className="text-sm line-clamp-3">
                            {selectedEntry.entry}
                          </p>
                          {selectedEntry.image && (
                            <img
                              src={selectedEntry.image}
                              alt="Journal entry image"
                              className="w-full h-auto rounded-md"
                            />
                          )}
                          <Button variant="outline" className="w-full">
                            Read Full Entry
                          </Button>
                        </div>
                      </DrawerTrigger>
                      <DrawerContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DrawerHeader>
                          <DrawerTitle>
                            {format(
                              new Date(selectedEntry.date),
                              "MMMM d, yyyy"
                            )}
                          </DrawerTitle>
                          <DrawerDescription>
                            Your journal entry for this date
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="mt-4 space-y-4">
                          <p className="text-sm">{selectedEntry.entry}</p>
                          {selectedEntry.image && (
                            <img
                              src={selectedEntry.image}
                              alt="Journal entry image"
                              className="w-full h-auto rounded-md"
                            />
                          )}
                        </div>
                      </DrawerContent>
                    </Drawer>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Select a date with an entry to view its contents.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
