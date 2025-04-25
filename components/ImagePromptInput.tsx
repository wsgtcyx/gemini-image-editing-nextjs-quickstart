"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { Textarea } from "./ui/textarea";

interface ImagePromptInputProps {
  onSubmit: (prompt: string) => void;
  isEditing: boolean;
  isLoading: boolean;
}

export function ImagePromptInput({
  onSubmit,
  isEditing,
  isLoading,
}: ImagePromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
      setPrompt("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">
          {isEditing
            ? "Describe how you want to edit the image"
            : "Describe the image you want to generate"}
        </p>
      </div>

      <Textarea
        id="prompt"
        className="border-secondary resize-none"
        placeholder={
          isEditing
            ? "Example: Make the background blue and add a rainbow..."
            : "Example: A 3D rendered image of a pig with wings and a top hat flying over a futuristic city..."
        }
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
      />

      <Button
        type="submit"
        disabled={!prompt.trim() || isLoading}
        className="w-full bg-primary hover:bg-primary/90"
      >
        <Wand2 className="w-4 h-4 mr-2" />
        {isEditing ? "Edit Image" : "Generate Image"}
      </Button>
    </form>
  );
}
