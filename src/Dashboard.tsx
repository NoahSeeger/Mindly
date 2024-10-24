"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { BookHeart, Settings, Bell, PlusCircle, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
// You'll need to install react-calendar-heatmap
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
//Importt link from react router dom
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { setTheme, theme } = useTheme();

  // Sample data for the heatmap
  const today = new Date();
  const heatmapValues = Array.from({ length: 365 }, (_, i) => ({
    date: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 364 + i
    ),
    count: Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0,
  }));

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
              classForValue={(value) => {
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
                <p className="text-5xl font-bold text-primary">7</p>
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

      <Button
        className="fixed bottom-6 right-6 rounded-full shadow-lg"
        size="lg"
        asChild
      >
        <Link to="/daily_entry">
          <PlusCircle className="mr-2 h-5 w-5" /> New Entry
        </Link>
      </Button>
    </div>
  );
}
