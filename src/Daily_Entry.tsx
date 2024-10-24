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
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Save, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { openDB } from "idb";

// Request persistent storage
async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
    console.log(`Storage persisted: ${isPersisted}`);
  }
}

// Initialize IndexedDB
async function initDB() {
  return openDB("journalDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("entries")) {
        db.createObjectStore("entries", { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

// Save entry to IndexedDB
async function saveEntry(entry, image) {
  const db = await initDB();
  await db.add("entries", { entry, image, date: new Date() });
}

export default function DailyEntry() {
  const [entry, setEntry] = useState("");
  const [image, setImage] = useState(null);
  const { toast } = useToast();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    await requestPersistentStorage();
    await saveEntry(entry, image);

    toast({
      title: "Entry Saved",
      description: "Your gratitude entry has been saved successfully.",
    });
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
              <CardTitle>Daily Gratitude Entry</CardTitle>
              <div className="w-10" /> {/* Spacer for alignment */}
            </div>
            <CardDescription>
              Reflect on your day and practice gratitude
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Textarea
                placeholder="What are you grateful for today? How did you grow? What brought you joy?"
                className="min-h-[200px]"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
              />
              <div>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image" className="cursor-pointer block">
                  <div className="border-2 border-dashed border-input rounded-lg p-4 text-center hover:border-primary transition-colors">
                    {image ? (
                      <img
                        src={image}
                        alt="Uploaded"
                        className="mx-auto max-h-40 object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground">
                          Click to upload an image (optional)
                        </span>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} className="w-full">
              <Save className="mr-2 h-4 w-4" /> Save Entry
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
