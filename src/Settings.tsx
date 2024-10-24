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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
// import indexed db

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [notificationTime, setNotificationTime] = useState("20:00");
  const [theme, setTheme] = useState("system");
  const { toast } = useToast();

  const handleSave = () => {
    // Here you would typically save the settings to your backend
    let db;
    const request = indexedDB.open("MyTestDatabase");
    request.onerror = (event) => {
      console.error("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onsuccess = (event) => {
      console.log("Success!");
      db = event.target.result;
    };
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  // Request persistent storage
  async function requestPersistentStorage() {
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist();
      console.log(`Storage persisted: ${isPersisted}`);
      toast({
        title: "Storage Permission",
        description: isPersisted
          ? "Persistent storage granted."
          : "Persistent storage request denied. Please ensure your site is secure and try again.",
      });
    } else {
      console.log("Persistent storage is not supported by this browser.");
      toast({
        title: "Storage Permission",
        description: "Persistent storage is not supported by this browser.",
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Back to Dashboard</span>
                </Link>
              </Button>
              <CardTitle>Settings</CardTitle>
              <div className="w-10" /> {/* Spacer for alignment */}
            </div>
            <CardDescription>
              Customize your journaling experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Daily Reminder</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a notification to write your daily entry
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            {notifications && (
              <div className="space-y-2">
                <Label htmlFor="notification-time">Reminder Time</Label>
                <Input
                  id="notification-time"
                  type="time"
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="theme">Request Storage Permission</Label>
              <Button onClick={requestPersistentStorage} className="">
                Request Permission
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">Theme Preference</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} className="w-full">
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
