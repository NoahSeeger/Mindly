"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { BookHeart, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { openDB } from "idb";
import { differenceInCalendarDays } from "date-fns";
import { Link } from "react-router-dom";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

// Function to open the IndexedDB database
async function openDatabase() {
  return openDB("journalDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("entries")) {
        db.createObjectStore("entries", { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

// Function to retrieve all entries from IndexedDB
async function getAllEntries() {
  const db = await openDatabase();
  const transaction = db.transaction("entries", "readonly");
  const objectStore = transaction.objectStore("entries");
  return await objectStore.getAll();
}

// Function to calculate the current streak
function calculateStreak(entries: any[]): number {
  if (!entries.length) return 0;

  // Sort entries by date in descending order
  const sortedEntries = entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    const diffDays = differenceInCalendarDays(currentDate, entryDate);

    if (diffDays === 0 || diffDays === 1) {
      streak++;
      currentDate = entryDate;
    } else {
      break;
    }
  }

  return streak;
}

interface HeatmapValue {
  date: string;
  count: number;
}

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { setTheme, theme } = useTheme();
  const [streak, setStreak] = useState(0);
  const [heatmapValues, setHeatmapValues] = useState<HeatmapValue[]>([]);

  useEffect(() => {
    // Load entries and calculate the current streak
    async function loadEntriesAndCalculateStreak() {
      try {
        const entries = await getAllEntries();
        const currentStreak = calculateStreak(entries);
        setStreak(currentStreak);

        // Prepare heatmap values
        const values = entries.map((entry: any) => ({
          date: entry.date,
          count: 1, // Assuming each entry is a single count
        }));
        setHeatmapValues(values);
      } catch (error) {
        console.error("Error loading entries from IndexedDB:", error);
      }
    }

    loadEntriesAndCalculateStreak();
  }, []);

  const today = new Date();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <BookHeart className="h-6 w-6" />
            Daily Gratitude Journal
          </h1>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/settings">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Gratitude Journey</CardTitle>
            <CardDescription>Track your daily entries</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarHeatmap
              startDate={
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() - 364
                )
              }
              endDate={today}
              values={heatmapValues}
              classForValue={(value: HeatmapValue | null) => {
                if (!value) {
                  return "color-empty";
                }
                return `color-scale-${value.count}`;
              }}
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Streak</CardTitle>
              <CardDescription>Keep up the great work!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-5xl font-bold text-primary">{streak}</p>
                <p className="text-sm text-muted-foreground">Days</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Review past entries</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
