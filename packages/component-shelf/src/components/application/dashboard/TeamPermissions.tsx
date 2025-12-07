"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { MoreVertical } from "lucide-react";

export type Role = "spouse" | "family_member" | "wedding_planner";

export interface Collaborator {
  id: string;
  email: string;
  role: Role;
  joinedAt: string;
}

export interface PendingInvitation {
  id: string;
  email: string;
  role: Role;
  status: string;
  sentAt: string;
}

const roleLabels: Record<Role, string> = {
  spouse: "Spouse",
  family_member: "Family Member",
  wedding_planner: "Wedding Planner",
};

const inviteFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["spouse", "family_member", "wedding_planner"]),
});

type InviteFormData = z.infer<typeof inviteFormSchema>;

export interface ApplicationTeamPermissionsProps {
  currentUser: {
    email: string;
    role: Role;
  };
  collaborators: Collaborator[];
  pendingInvitations?: PendingInvitation[];
  onInvite?: (email: string, role: Role) => void;
  onRemove?: (collaboratorId: string) => void;
  onRevokeInvitation?: (invitationId: string) => void;
  onRoleChange?: (collaboratorId: string, newRole: Role) => void;
  onInvitationRoleChange?: (invitationId: string, newRole: Role) => void;
  onUserRoleChange?: (newRole: Role) => void;
  isInviting?: boolean;
  isRemoving?: boolean;
}

export function ApplicationTeamPermissions({
  currentUser,
  collaborators: propsCollaborators,
  pendingInvitations = [],
  onInvite,
  onRemove,
  onRevokeInvitation,
  onRoleChange,
  onInvitationRoleChange,
  onUserRoleChange,
  isInviting = false,
  isRemoving = false,
}: ApplicationTeamPermissionsProps) {
  const [userRole, setUserRole] = useState<Role>(currentUser.role);
  const [internalCollaborators, setInternalCollaborators] =
    useState<Collaborator[]>(propsCollaborators);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] =
    useState<Collaborator | null>(null);
  const [selectedInvitation, setSelectedInvitation] =
    useState<PendingInvitation | null>(null);

  const inviteForm = useForm<InviteFormData>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      role: "family_member",
    },
  });

  const collaborators =
    onInvite || onRemove || onRoleChange
      ? propsCollaborators
      : internalCollaborators;

  const handleInvite = (data: InviteFormData) => {
    if (onInvite) {
      onInvite(data.email, data.role);
    } else {
      const newCollaborator: Collaborator = {
        id: crypto.randomUUID(),
        email: data.email,
        role: data.role,
        joinedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      setInternalCollaborators([...internalCollaborators, newCollaborator]);
    }
    inviteForm.reset();
    setShowInviteDialog(false);
  };

  const handleDialogChange = (open: boolean) => {
    setShowInviteDialog(open);
    if (!open) {
      inviteForm.reset();
    }
  };

  const handleRemove = () => {
    if (selectedCollaborator) {
      if (onRemove) {
        onRemove(selectedCollaborator.id);
      } else {
        setInternalCollaborators(
          internalCollaborators.filter((c) => c.id !== selectedCollaborator.id)
        );
      }
      setSelectedCollaborator(null);
      setShowRemoveDialog(false);
    }
  };

  const handleRoleChange = (collaboratorId: string, newRole: Role) => {
    if (onRoleChange) {
      onRoleChange(collaboratorId, newRole);
    } else {
      setInternalCollaborators(
        internalCollaborators.map((c) =>
          c.id === collaboratorId ? { ...c, role: newRole } : c
        )
      );
    }
  };

  const handleInvitationRoleChange = (invitationId: string, newRole: Role) => {
    if (onInvitationRoleChange) {
      onInvitationRoleChange(invitationId, newRole);
    }
  };

  const handleRevokeInvitation = () => {
    if (selectedInvitation && onRevokeInvitation) {
      onRevokeInvitation(selectedInvitation.id);
    }
    setSelectedInvitation(null);
    setShowRevokeDialog(false);
  };

  const handleUserRoleChange = (newRole: Role) => {
    setUserRole(newRole);
    if (onUserRoleChange) {
      onUserRoleChange(newRole);
    }
  };

  return (
    <div className="space-y-8 pb-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-foreground">
            Permissions
          </h1>
          <p className="text-muted-foreground mt-2">
            Invite collaborators to help manage your wedding website. All
            collaborators have full admin access.
          </p>
        </div>
        <Dialog open={showInviteDialog} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="shrink-0">Invite Collaborator</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                Invite Collaborator
              </DialogTitle>
              <DialogDescription className="text-base">
                Invite someone to help manage your wedding website. All
                collaborators have full admin access to view and edit settings,
                guest lists, and content.
              </DialogDescription>
            </DialogHeader>
            <Form {...inviteForm}>
              <form
                onSubmit={inviteForm.handleSubmit(handleInvite)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={inviteForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="collaborator@example.com"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={inviteForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          position="popper"
                          className="z-100"
                          onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="family_member">
                            Family Member
                          </SelectItem>
                          <SelectItem value="wedding_planner">
                            Wedding Planner
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isInviting}
                  className="w-full h-12"
                >
                  Send Invitation
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Your Role
        </p>
        <div className="p-5 rounded-lg border-2 border-primary/30 bg-card">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {currentUser.email}
                </span>
                <Badge className="bg-blue-600 hover:bg-blue-600 text-white text-xs px-2 py-0.5">
                  YOU
                </Badge>
              </div>
              <p className="text-muted-foreground">{roleLabels[userRole]}</p>
              <p className="text-sm text-muted-foreground">
                This is your account. Change your role to reflect your
                involvement in the wedding planning.
              </p>
            </div>
            <Select
              value={userRole}
              onValueChange={(v) => handleUserRoleChange(v as Role)}
            >
              <SelectTrigger className="w-[160px] shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="family_member">Family Member</SelectItem>
                <SelectItem value="wedding_planner">Wedding Planner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {collaborators.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Collaborators
          </p>
          <div className="space-y-3">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="p-5 rounded-lg border border-border bg-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {collaborator.email}
                    </p>
                    <p className="text-muted-foreground">
                      {roleLabels[collaborator.role]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Joined: {collaborator.joinedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={collaborator.role}
                      onValueChange={(v) =>
                        handleRoleChange(collaborator.id, v as Role)
                      }
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="family_member">
                          Family Member
                        </SelectItem>
                        <SelectItem value="wedding_planner">
                          Wedding Planner
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 bg-transparent"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setSelectedCollaborator(collaborator);
                            setShowRemoveDialog(true);
                          }}
                        >
                          Remove Collaborator
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingInvitations.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Pending Invitations
          </p>
          <div className="space-y-3">
            {pendingInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="p-5 rounded-lg border border-dashed border-amber-500/50 bg-amber-50/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {invitation.email}
                      </p>
                      <Badge
                        variant="outline"
                        className="border-amber-500 text-amber-700 bg-amber-100 text-xs px-2 py-0.5"
                      >
                        PENDING
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {roleLabels[invitation.role]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Invited: {invitation.sentAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={invitation.role}
                      onValueChange={(v) =>
                        handleInvitationRoleChange(invitation.id, v as Role)
                      }
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="family_member">
                          Family Member
                        </SelectItem>
                        <SelectItem value="wedding_planner">
                          Wedding Planner
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 bg-transparent"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setSelectedInvitation(invitation);
                            setShowRevokeDialog(true);
                          }}
                        >
                          Revoke Invitation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">
              Remove Collaborator?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedCollaborator?.email} from
              your wedding team? They will immediately lose access to your
              wedding details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">
              Revoke Invitation?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the invitation sent to{" "}
              {selectedInvitation?.email}? They will no longer be able to join
              your wedding team using this invitation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeInvitation}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
