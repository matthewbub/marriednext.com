"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface QAItem {
  id: string;
  question: string;
  answer: string;
}

interface QAFormData {
  qaItems: QAItem[];
}

interface QAFormProps {
  defaultQAItems?: QAItem[];
  onSubmit: (qaItems: QAItem[]) => void;
}

export default function QAForm({ defaultQAItems = [], onSubmit }: QAFormProps) {
  const { register, handleSubmit, control } = useForm<QAFormData>({
    defaultValues: {
      qaItems: defaultQAItems,
    },
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "qaItems",
  });

  const updateItem = (
    id: string,
    field: "question" | "answer",
    value: string
  ) => {
    const itemIndex = fields.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
      const updatedItem = { ...fields[itemIndex], [field]: value };
      update(itemIndex, updatedItem);
    }
  };

  const deleteItem = (id: string) => {
    const itemIndex = fields.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
      remove(itemIndex);
    }
  };

  const addItem = () => {
    const newItem: QAItem = {
      id: Date.now().toString(),
      question: "New Question",
      answer: "Answer goes here",
    };
    append(newItem);
  };

  const handleSaveQA = (data: QAFormData) => {
    onSubmit(data.qaItems);
  };

  return (
    <form onSubmit={handleSubmit(handleSaveQA)} className="space-y-12">
      {/* Header */}
      <div className="border-b border-gray-300 pb-6">
        <h2 className="text-3xl font-semibold mb-2">Q&A</h2>
        <p className="text-lg text-gray-700">
          Manage frequently asked questions
        </p>
      </div>

      {/* QA Items */}
      <div className="space-y-8">
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="pb-8 border-b border-gray-300 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0 space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Question</Label>
                  <Input
                    placeholder="Question"
                    className="text-lg py-6"
                    {...register(`qaItems.${index}.question`)}
                    onChange={(e) =>
                      updateItem(item.id, "question", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Answer</Label>
                  <Textarea
                    placeholder="Answer"
                    className="text-base min-h-24 leading-relaxed"
                    {...register(`qaItems.${index}.answer`)}
                    onChange={(e) =>
                      updateItem(item.id, "answer", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex-shrink-0 pt-8">
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-2 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="submit"
          className="inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors text-base"
        >
          Save Q&A
        </button>
        <button
          type="button"
          onClick={addItem}
          className="border-2 border-gray-400 px-8 py-3 uppercase tracking-wider hover:bg-gray-100 transition-colors text-base flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Question
        </button>
      </div>
    </form>
  );
}
