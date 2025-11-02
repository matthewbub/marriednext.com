"use client";

import { useState } from "react";
import { MoreVertical, Mail, Trash2, RefreshCw, Edit } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CollaboratorInvitation } from "./permissions.types";
import clsx from "clsx";

interface CollaboratorInvitationCardProps {
  invitation: CollaboratorInvitation;
  currentUserRole: "spouse" | "family" | "planner";
  onRemove: (id: string) => void;
  onResend: (id: string) => void;
  onCopyInviteUrl: (id: string) => void;
  onChangeRole?: (id: string, newRole: "spouse" | "family" | "planner") => void;
}

const roleLabels = {
  spouse: "Spouse",
  family: "Family Member",
  planner: "Wedding Planner",
};

const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  declined: "bg-gray-100 text-gray-500 border-gray-200",
};

const statusLabels = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
};

export function CollaboratorInvitationCard({
  invitation,
  currentUserRole,
  onRemove,
  onResend,
  onCopyInviteUrl,
  onChangeRole,
}: CollaboratorInvitationCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(invitation.role);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteDialog(false);
    onRemove(invitation.id);
  };

  const handleResendClick = () => {
    onResend(invitation.id);
  };

  const handleCopyInviteUrl = () => {
    onCopyInviteUrl(invitation.id);
  };

  const handleChangeRoleClick = () => {
    setSelectedRole(invitation.role);
    setShowRoleDialog(true);
  };

  const handleRoleConfirm = () => {
    if (onChangeRole && selectedRole !== invitation.role) {
      onChangeRole(invitation.id, selectedRole);
    }
    setShowRoleDialog(false);
  };

  const canChangeRole =
    currentUserRole === "spouse" && invitation.status === "accepted";
  const showResendAndCopy =
    invitation.status === "pending" || invitation.status === "declined";
  const canRemove = invitation.role === "spouse";

  return (
    <li className="rounded-xl bg-white border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate text-gray-900">
            {invitation.email}
          </h3>
          <div className="flex gap-3 mt-2 flex-wrap items-center">
            <span className="text-sm text-gray-600">
              {roleLabels[invitation.role]}
            </span>
            <span
              className={clsx(
                "text-xs font-medium px-2 py-1 rounded border",
                statusColors[invitation.status]
              )}
            >
              {statusLabels[invitation.status]}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Open invitation menu"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {showResendAndCopy && (
              <>
                <DropdownMenuItem
                  onClick={handleResendClick}
                  className="cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Email
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleCopyInviteUrl}
                  className="cursor-pointer"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Copy Invite URL
                </DropdownMenuItem>
              </>
            )}
            {canChangeRole && (
              <DropdownMenuItem
                onClick={handleChangeRoleClick}
                className="cursor-pointer"
              >
                <Edit className="w-4 h-4 mr-2" />
                Change Role
              </DropdownMenuItem>
            )}
            {canRemove && (
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {invitation.message && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700 italic">{invitation.message}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between text-xs text-gray-600 font-medium">
        <p>
          Sent:{" "}
          {new Date(invitation.sentAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        {invitation.acceptedAt && (
          <p>
            Accepted:{" "}
            {new Date(invitation.acceptedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
        {invitation.declinedAt && (
          <p>
            Declined:{" "}
            {new Date(invitation.declinedAt).toLocaleDateString("en-US", {
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
            <AlertDialogTitle>Remove Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the invitation for{" "}
              {invitation.email}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {canChangeRole && (
        <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Change Role</AlertDialogTitle>
              <AlertDialogDescription>
                Update the role for {invitation.email}. This will change their
                designation in the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <label
                htmlFor="role-select"
                className="block text-sm font-medium mb-2"
              >
                Select Role
              </label>
              <Select
                value={selectedRole}
                onValueChange={(value: "spouse" | "family" | "planner") =>
                  setSelectedRole(value)
                }
              >
                <SelectTrigger id="role-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="family">Family Member</SelectItem>
                  <SelectItem value="planner">Wedding Planner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRoleConfirm}>
                Update Role
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </li>
  );
}
