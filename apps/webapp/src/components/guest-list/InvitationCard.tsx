"use client";

import { useState } from "react";
import { MoreVertical, Edit, Trash2, Check, X, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  onCollapse,
  root,
}: InvitationCardProps) {
  const Root = root || "li";
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const safeGuests = Array.isArray(entry.guests) ? entry.guests : [];
  const guestNames = safeGuests
    .map((g) => g?.nameOnInvitation)
    .filter(Boolean) as string[];
  const guestCount = guestNames.length;

  const getDefaultDisplayName = () => {
    if (guestCount === 0) return "Unnamed Group";
    if (guestCount === 1) return guestNames[0];
    if (guestCount === 2) return `${guestNames[0]} & ${guestNames[1]}`;
    return `${guestNames[0]} Group`;
  };

  const displayName = entry.inviteGroupName || getDefaultDisplayName();

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteDialog(false);
    onRemove();
  };

  return (
    <Root className="rounded-xl bg-white border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all">
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
            placeholder={getDefaultDisplayName()}
            className="text-lg font-semibold font-handwritten-font"
            disabled={isSaving}
          />
        ) : (
          <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
        )}
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="h-8"
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={onSave} className="h-8" disabled={isSaving}>
              <Check className="w-4 h-4 mr-1" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            {onCollapse && (
              <button
                onClick={onCollapse}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Collapse"
              >
                <ChevronUp className="w-4 h-4 text-gray-600" />
              </button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Open guest menu"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteClick}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Guest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {displayName}? This action cannot
              be undone and will remove all associated invitation data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Root>
  );
}
