"use client";

import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useWebsiteBuilderStore,
  type PageId,
} from "@/lib/stores/websiteBuilderStore";
import DateCountdownEditor from "@/components/admin/DateCountdownEditor";
import LocationEditor from "@/components/admin/LocationEditor";

export default function Editor() {
  const selectedPage = useWebsiteBuilderStore((state) => state.selectedPage);
  const editMode = useWebsiteBuilderStore((state) => state.editMode);
  const setSelectedPage = useWebsiteBuilderStore(
    (state) => state.setSelectedPage
  );
  const setEditMode = useWebsiteBuilderStore((state) => state.setEditMode);

  const pages: {
    id: PageId;
    name: string;
    path?: string;
    hasPhotos: boolean;
    hasLabels: boolean;
  }[] = [
    { id: "home", name: "Home", path: "", hasPhotos: true, hasLabels: true },
    {
      id: "our-story",
      name: "Our Story",
      path: "/our-story",
      hasPhotos: true,
      hasLabels: true,
    },
    {
      id: "photos",
      name: "Photos",
      path: "/photos",
      hasPhotos: true,
      hasLabels: true,
    },
    {
      id: "wedding-party",
      name: "Wedding Party",
      path: "/wedding-party",
      hasPhotos: false,
      hasLabels: true,
    },
    {
      id: "q-and-a",
      name: "Q & A",
      path: "/q-and-a",
      hasPhotos: false,
      hasLabels: true,
    },
    {
      id: "travel",
      name: "Travel",
      path: "/travel",
      hasPhotos: false,
      hasLabels: true,
    },
    {
      id: "registry",
      name: "Registry",
      path: "/registry",
      hasPhotos: false,
      hasLabels: true,
    },
  ];

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold mb-1">Website Builder</h2>
        <p className="text-sm text-gray-600">
          Edit photos and labels for your wedding website
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3 uppercase tracking-wide text-gray-700">
            Pages
          </h3>
          <nav className="space-y-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedPage(page.id)}
                className={clsx(
                  "w-full text-left px-3 py-2 rounded-md transition-colors text-sm font-medium flex items-center justify-between group",
                  selectedPage === page.id
                    ? "bg-black text-white"
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                <span>{page.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <DateCountdownEditor />

        <LocationEditor />

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-3 uppercase tracking-wide text-gray-700">
            Edit Content
          </h3>
          <div className="space-y-2">
            <Button
              variant={editMode === "photos" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() =>
                setEditMode(editMode === "photos" ? null : "photos")
              }
            >
              Edit Photos
            </Button>
            <Button
              variant={editMode === "labels" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() =>
                setEditMode(editMode === "labels" ? null : "labels")
              }
            >
              Edit Labels
            </Button>
          </div>
        </div>

        {editMode === "photos" && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-3 text-sm">Photo Editor</h4>
            <p className="text-xs text-gray-600 mb-3">
              Click on photos in the preview to edit them
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Image URL
                </label>
                <Input
                  type="text"
                  placeholder="https://..."
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Alt Text
                </label>
                <Input
                  type="text"
                  placeholder="Description of image"
                  className="text-sm"
                />
              </div>
              <Button size="sm" className="w-full">
                Update Photo
              </Button>
            </div>
          </div>
        )}

        {editMode === "labels" && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-3 text-sm">Label Editor</h4>
            <p className="text-xs text-gray-600 mb-3">
              Edit text labels for the selected page
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Heading
                </label>
                <Input
                  type="text"
                  placeholder="Edit heading text"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Edit description text"
                  className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 rounded-md"
                />
              </div>
              <Button size="sm" className="w-full">
                Update Label
              </Button>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-3 uppercase tracking-wide text-gray-700">
            Theme Settings
          </h3>
          <p className="text-xs text-gray-500">Coming soon...</p>
        </div>
      </div>

      <div className="border-t pt-4 mt-auto">
        <Button className="w-full" size="lg">
          Publish Changes
        </Button>
      </div>
    </div>
  );
}
