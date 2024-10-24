"use client";

import { useState } from "react";
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
import { motion } from "framer-motion";
import { format, subYears, getYear } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

// This is mock data. In a real application, you'd fetch this from your backend.
const mockEntries = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  date: subYears(new Date(), Math.floor(i / 365)),
  content: `This is entry ${
    i + 1
  }. Today, I'm grateful for the beautiful sunset I witnessed. The sky was painted with vibrant hues of orange and pink, reminding me of the beauty that surrounds us every day. It made me pause and appreciate the simple moments in life. I also had a great conversation with an old friend, which brought back fond memories and made me realize how fortunate I am to have such lasting relationships. Lastly, I'm thankful for the progress I made on my personal project today. Even though it was challenging, I persevered and learned something new in the process.`,
  image: i % 3 === 0 ? "/placeholder.svg?height=200&width=300" : null,
}));

export default function History() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(
    getYear(new Date()).toString()
  );
  const entriesPerPage = 10;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    const entry = mockEntries.find(
      (e) => e.date.toDateString() === date?.toDateString()
    );
    if (entry) {
      setSelectedEntry(entry);
    } else {
      setSelectedEntry(null);
    }
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = mockEntries.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const years = Array.from(
    new Set(mockEntries.map((entry) => getYear(entry.date)))
  );

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
                  <motion.li
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle>
                              {format(entry.date, "MMMM d, yyyy")}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm line-clamp-3">
                              {entry.content}
                            </p>
                          </CardContent>
                        </Card>
                      </DrawerTrigger>
                      <DrawerContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DrawerHeader>
                          <DrawerTitle>
                            {format(entry.date, "MMMM d, yyyy")}
                          </DrawerTitle>
                          <DrawerDescription>
                            Your journal entry for this date
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="mt-4 mb-10 space-y-2 flex justify-center">
                          <p className="text-sm w-10/12">{entry.content}</p>
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
                  {currentPage} /{" "}
                  {Math.ceil(mockEntries.length / entriesPerPage)}
                </span>
                <Button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={indexOfLastEntry >= mockEntries.length}
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
                  year={parseInt(selectedYear)}
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
                      ? format(selectedEntry.date, "MMMM d, yyyy")
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
                            {selectedEntry.content}
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
                            {format(selectedEntry.date, "MMMM d, yyyy")}
                          </DrawerTitle>
                          <DrawerDescription>
                            Your journal entry for this date
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="mt-4 space-y-4">
                          <p className="text-sm">{selectedEntry.content}</p>
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
