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
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { openDB } from "idb";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [notificationTime, setNotificationTime] = useState("20:00");
  const [theme, setTheme] = useState("system");
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const db = await openDB("MyTestDatabase", 1, {
        upgrade(db) {
          db.createObjectStore("settings");
        },
      });

      await db.put(
        "settings",
        {
          notifications,
          notificationTime,
          theme,
        },
        "userSettings"
      );

      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const requestPersistentStorage = async () => {
    Notification.requestPermission();
    if (navigator.storage && navigator.storage.persist) {
      try {
        const isPersisted = await navigator.storage.persist();
        console.log(`Storage persisted: ${isPersisted}`);
        toast({
          title: "Storage Permission",
          description: isPersisted
            ? "Persistent storage granted."
            : "Persistent storage request denied. Please ensure your site is secure and try again.",
        });
      } catch (error) {
        console.error("Error requesting persistent storage:", error);
        toast({
          title: "Error",
          description:
            "Failed to request persistent storage. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      console.log("Persistent storage is not supported by this browser.");
      toast({
        title: "Storage Permission",
        description: "Persistent storage is not supported by this browser.",
      });
    }
  };

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
              <Label htmlFor="storage-permission">
                Request Storage Permission
              </Label>
              <Button
                onClick={requestPersistentStorage}
                id="storage-permission"
              >
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
