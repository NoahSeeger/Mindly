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
import { PlusCircle, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
// import { Layout } from "@/components/layout";

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
  const [selectedTemplate, setSelectedTemplate] = useState(
    predefinedTemplates[0]
  );
  const { toast } = useToast();

  const handleSaveTemplate = () => {
    if (newTemplate.title && newTemplate.content) {
      const newTemplateWithId = { ...newTemplate, id: Date.now() };
      setTemplates([...templates, newTemplateWithId]);
      setNewTemplate({ title: "", content: "" });
      setIsCreating(false);
      setSelectedTemplate(newTemplateWithId);
      toast({
        title: "Template Saved",
        description: "Your new template has been created and selected.",
      });
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    toast({
      title: "Template Selected",
      description: `"${template.title}" will be used for your next entry.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Journal Templates
      </h1>
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={`cursor-pointer transition-all ${
                selectedTemplate.id === template.id
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => handleSelectTemplate(template)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {template.title}
                  {selectedTemplate.id === template.id && (
                    <Check className="text-primary h-5 w-5" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm">
                  {template.content}
                </pre>
              </CardContent>
              <CardFooter>
                <Button
                  variant={
                    selectedTemplate.id === template.id ? "default" : "outline"
                  }
                  className="w-full"
                >
                  {selectedTemplate.id === template.id
                    ? "Selected"
                    : "Select Template"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {!isCreating && (
        <Button onClick={() => setIsCreating(true)} className="w-full mb-8">
          <PlusCircle className="mr-2 h-4 w-4" /> Create Custom Template
        </Button>
      )}

      {isCreating && (
        <Card className="mb-8">
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
  );
}
