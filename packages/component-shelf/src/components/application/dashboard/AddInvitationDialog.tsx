"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { User, UserPlus, Users, Plus, Trash2 } from "lucide-react";
import { useAddInvitationDialogStore } from "../../../stores/addInvitationDialogStore";

export type AddInvitationPayload = {
  guests: string[];
  hasPlusOne: boolean;
  inviteGroupName: string | null;
  email: string | null;
};

const addInvitationSchema = z.object({
  invitationType: z.enum(["single", "plusone", "group"]),
  groupName: z.string().optional(),
  guestName: z.string().optional(),
  guestNames: z.array(z.string()).optional(),
  email: z
    .union([z.string().email("Invalid email"), z.literal(""), z.null()])
    .optional(),
});

type AddInvitationFormData = z.infer<typeof addInvitationSchema>;

interface AddInvitationDialogProps {
  onSubmit?: (data: AddInvitationPayload) => void;
  isSubmitting?: boolean;
}

const defaultValues: AddInvitationFormData = {
  invitationType: "single",
  groupName: "",
  guestName: "",
  guestNames: [""],
  email: "",
};

export function AddInvitationDialog({
  onSubmit,
  isSubmitting = false,
}: AddInvitationDialogProps) {
  const {
    isOpen,
    invitationType,
    openDialog,
    closeDialog,
    setInvitationType,
    reset: resetStore,
  } = useAddInvitationDialogStore();

  const [addAnother, setAddAnother] = useState(false);
  const lastSubmittedGuestsRef = useRef<string[] | null>(null);
  const lastInvitationTypeRef = useRef<"single" | "plusone" | "group">("single");
  const wasSubmittingRef = useRef(false);

  const form = useForm<AddInvitationFormData>({
    resolver: zodResolver(addInvitationSchema),
    defaultValues: {
      ...defaultValues,
      invitationType,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "guestNames",
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        ...defaultValues,
        invitationType,
      });
    } else {
      form.reset({
        ...defaultValues,
        invitationType: "single",
      });
    }
  }, [isOpen, invitationType, form]);

  useEffect(() => {
    if (wasSubmittingRef.current && !isSubmitting && lastSubmittedGuestsRef.current) {
      const guests = lastSubmittedGuestsRef.current;
      const guestNamesText = guests.length === 1 
        ? guests[0]
        : guests.length === 2
        ? `${guests[0]} and ${guests[1]}`
        : `${guests[0]} and ${guests.length - 1} others`;
      
      toast.success("Invitation added", {
        description: guestNamesText,
      });

      if (addAnother && !isOpen) {
        const timer = setTimeout(() => {
          form.reset({
            ...defaultValues,
            invitationType: lastInvitationTypeRef.current,
          });
          setInvitationType(lastInvitationTypeRef.current);
          openDialog();
        }, 100);
        return () => clearTimeout(timer);
      }

      lastSubmittedGuestsRef.current = null;
    }
    wasSubmittingRef.current = isSubmitting;
  }, [isSubmitting, addAnother, isOpen, form, invitationType, openDialog]);

  const handleClose = () => {
    closeDialog();
    resetStore();
    setAddAnother(false);
    form.reset({
      ...defaultValues,
      invitationType: "single",
    });
  };

  const handleSubmit = (data: AddInvitationFormData) => {
    const guests =
      data.invitationType === "group"
        ? (data.guestNames || []).filter((name) => name.trim() !== "")
        : data.guestName?.trim()
        ? [data.guestName.trim()]
        : [];

    if (guests.length === 0) {
      return;
    }

    const payload: AddInvitationPayload = {
      guests,
      hasPlusOne: data.invitationType === "plusone",
      inviteGroupName:
        data.invitationType === "group"
          ? (data.groupName?.trim() || null)
          : null,
      email: data.email?.trim() || null,
    };

    if (onSubmit) {
      lastSubmittedGuestsRef.current = guests;
      lastInvitationTypeRef.current = data.invitationType;
      wasSubmittingRef.current = true;
      onSubmit(payload);
    } else {
      handleClose();
    }
  };

  const watchedInvitationType = useWatch({
    control: form.control,
    name: "invitationType",
    defaultValue: invitationType,
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? openDialog() : handleClose())}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Invitation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">Add New Invitation</DialogTitle>
          <DialogDescription>
            Create an invitation for a single guest, guest with +1, or a group
            of guests.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <FormLabel>Invitation Type</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={watchedInvitationType === "single" ? "default" : "outline"}
                  className="flex-col h-auto py-3 gap-1"
                  onClick={() => setInvitationType("single")}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs">Single</span>
                </Button>
                <Button
                  type="button"
                  variant={watchedInvitationType === "plusone" ? "default" : "outline"}
                  className="flex-col h-auto py-3 gap-1"
                  onClick={() => setInvitationType("plusone")}
                >
                  <UserPlus className="h-5 w-5" />
                  <span className="text-xs">Guest +1</span>
                </Button>
                <Button
                  type="button"
                  variant={watchedInvitationType === "group" ? "default" : "outline"}
                  className="flex-col h-auto py-3 gap-1"
                  onClick={() => setInvitationType("group")}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Group</span>
                </Button>
              </div>
            </div>

            {watchedInvitationType === "group" && (
              <FormField
                control={form.control}
                name="groupName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., The Smith Family"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchedInvitationType === "group" ? (
              <div className="space-y-2">
                <FormLabel>Guest Names</FormLabel>
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`guestNames.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              placeholder="Full name"
                              {...field}
                            />
                          </FormControl>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="shrink-0"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => append("")}
                >
                  <Plus className="h-4 w-4" />
                  Add Guest
                </Button>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="guestName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="guest@email.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedInvitationType === "plusone" && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
                <UserPlus className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Plus One Enabled</p>
                  <p className="text-muted-foreground">
                    Guest can bring one additional person
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between space-x-2 py-2">
              <Label htmlFor="add-another" className="text-sm font-normal cursor-pointer">
                Add another invitation
              </Label>
              <Switch
                id="add-another"
                checked={addAnother}
                onCheckedChange={setAddAnother}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
