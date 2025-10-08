"use client";

import { MoreVertical, Edit, Trash2, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvitationCardProps } from "@/components/guest-list/guestList.types";
import GuestFieldsView from "@/components/guest-list/GuestFieldsView";
import GuestFieldsEdit from "@/components/guest-list/GuestFieldsEdit";

export default function InvitationCard({
  entry,
  isEditing,
  editForm,
  onEdit,
  onRemove,
  onSave,
  onCancel,
  onFormChange,
  isSaving,
}: InvitationCardProps) {
  const displayName =
    entry.inviteGroupName ||
    (entry.guestB ? `${entry.guestA} & ${entry.guestB}` : entry.guestA);

  return (
    <li className="rounded-xl bg-white border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-3 gap-2">
        {isEditing && editForm ? (
          <Input
            value={editForm.inviteGroupName || ""}
            onChange={(e) =>
              onFormChange({
                ...editForm,
                inviteGroupName: e.target.value || null,
              })
            }
            placeholder={
              entry.guestB ? `${entry.guestA} & ${entry.guestB}` : entry.guestA
            }
            className="text-lg font-semibold font-handwritten-font"
            disabled={isSaving}
          />
        ) : (
          <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
        )}
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              className="h-8"
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={onSave}
              className="h-8"
              disabled={isSaving}
            >
              <Check className="w-4 h-4 mr-1" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1 hover:bg-gray-100 rounded transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onRemove}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="space-y-2">
        {isEditing && editForm ? (
          <GuestFieldsEdit
            editForm={editForm}
            onFormChange={onFormChange}
            disabled={isSaving}
          />
        ) : (
          <GuestFieldsView entry={entry} />
        )}
      </div>

      <div className="flex justify-between mt-3 text-xs text-gray-600 font-medium">
        {entry.createdAt && (
          <p>
            Created:{" "}
            {new Date(entry.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
        {entry.lastUpdatedAt && (
          <p>
            Updated:{" "}
            {new Date(entry.lastUpdatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </li>
  );
}
