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
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Pencil, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const predefinedTemplates = [
  {
    id: 1,
    title: "Daily Gratitude",
    content:
      "Today, I am grateful for:\n\nA challenge I overcame:\n\nSomething I'm looking forward to:",
  },
  {
    id: 2,
    title: "Reflection",
    content:
      "Three things that went well today:\n\nOne thing I learned:\n\nHow I'll make tomorrow even better:",
  },
  {
    id: 3,
    title: "Goal Setting",
    content:
      "My main goal for today is:\n\nSteps I'll take to achieve it:\n\nPotential obstacles and how I'll overcome them:",
  },
];

export default function Templates() {
  const [templates, setTemplates] = useState(predefinedTemplates);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ title: "", content: "" });
  const { toast } = useToast();

  const handleSaveTemplate = () => {
    if (newTemplate.title && newTemplate.content) {
      setTemplates([...templates, { ...newTemplate, id: Date.now() }]);
      setNewTemplate({ title: "", content: "" });
      setIsCreating(false);
      toast({
        title: "Template Saved",
        description: "Your new template has been created successfully.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Journal Templates</h1>
          <Button onClick={() => setIsCreating(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Template
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{template.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm">
                    {template.content}
                  </pre>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {isCreating && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Create Custom Template</CardTitle>
              <CardDescription>
                Design your own journaling template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="title">Template Title</Label>
                  <Input
                    id="title"
                    value={newTemplate.title}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, title: e.target.value })
                    }
                    placeholder="Enter template title"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Template Content</Label>
                  <Textarea
                    id="content"
                    value={newTemplate.content}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        content: e.target.value,
                      })
                    }
                    placeholder="Enter your custom prompts and questions here..."
                    className="min-h-[200px]"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate}>Save Template</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}