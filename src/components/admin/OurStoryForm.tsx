"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface StoryItem {
  id: string;
  heading: string;
  text: string;
  photoUrl: string;
}

interface OurStoryFormData {
  stories: StoryItem[];
}

interface OurStoryFormProps {
  defaultStories?: StoryItem[];
  onSubmit: (stories: StoryItem[]) => void;
}

export default function OurStoryForm({
  defaultStories = [],
  onSubmit,
}: OurStoryFormProps) {
  const { register, handleSubmit, control } = useForm<OurStoryFormData>({
    defaultValues: {
      stories: defaultStories,
    },
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "stories",
  });

  const handleAddStory = () => {
    const newId =
      Math.max(...fields.map((field) => Number.parseInt(field.id)), 0) + 1;
    const newStory = {
      id: newId.toString(),
      heading: "",
      text: "",
      photoUrl: "",
    };
    append(newStory);
  };

  const handleUpdateStory = (
    id: string,
    field: keyof StoryItem,
    value: string
  ) => {
    const storyIndex = fields.findIndex((story) => story.id === id);
    if (storyIndex !== -1) {
      const updatedStory = { ...fields[storyIndex], [field]: value };
      update(storyIndex, updatedStory);
    }
  };

  const handleDeleteStory = (id: string) => {
    const storyIndex = fields.findIndex((story) => story.id === id);
    if (storyIndex !== -1) {
      remove(storyIndex);
    }
  };

  const handleSaveStories = (data: OurStoryFormData) => {
    onSubmit(data.stories);
  };

  return (
    <form onSubmit={handleSubmit(handleSaveStories)} className="space-y-12">
      {/* Header Section */}
      <div className="border-b border-gray-300 pb-6">
        <h2 className="text-3xl font-semibold mb-2">Our Story</h2>
        <p className="text-lg text-gray-700">
          Add and manage your story sections with photos and descriptions
        </p>
      </div>

      {/* Story Items */}
      <div className="space-y-12">
        {fields.map((story, index) => (
          <div
            key={story.id}
            className="space-y-6 pb-8 border-b border-gray-300 last:border-b-0 last:pb-0"
          >
            {/* Story Index */}
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Story {index + 1}</h3>
              <button
                type="button"
                onClick={() => handleDeleteStory(story.id)}
                className="p-2 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <Label
                htmlFor={`heading-${story.id}`}
                className="text-base font-medium"
              >
                Heading
              </Label>
              <Input
                id={`heading-${story.id}`}
                type="text"
                placeholder="e.g., How we met"
                className="text-lg py-6"
                {...register(`stories.${index}.heading`)}
                onChange={(e) =>
                  handleUpdateStory(story.id, "heading", e.target.value)
                }
              />
            </div>

            {/* Text */}
            <div className="space-y-3">
              <Label
                htmlFor={`text-${story.id}`}
                className="text-base font-medium"
              >
                Story Text
              </Label>
              <Textarea
                id={`text-${story.id}`}
                placeholder="Tell your story..."
                className="text-base min-h-32 resize-none leading-relaxed"
                {...register(`stories.${index}.text`)}
                onChange={(e) =>
                  handleUpdateStory(story.id, "text", e.target.value)
                }
              />
            </div>

            {/* Photo URL */}
            <div className="space-y-3">
              <Label
                htmlFor={`photo-${story.id}`}
                className="text-base font-medium"
              >
                Photo URL
              </Label>
              <Input
                id={`photo-${story.id}`}
                type="text"
                placeholder="https://example.com/photo.jpg"
                className="text-sm py-6"
                {...register(`stories.${index}.photoUrl`)}
                onChange={(e) =>
                  handleUpdateStory(story.id, "photoUrl", e.target.value)
                }
              />
              <p className="text-sm text-gray-700">
                Direct URL to your story photo
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button type="submit" variant="primary">
          Save Stories
        </Button>
        <Button type="button" onClick={handleAddStory} variant="secondary">
          <Plus className="w-5 h-5" />
          Add Story
        </Button>
      </div>
    </form>
  );
}
