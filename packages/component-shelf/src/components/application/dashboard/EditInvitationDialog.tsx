"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../../../components/ui/form";
import {
  User,
  UserPlus,
  Users,
  Trash2,
  Plus,
  Mail,
  Check,
  X,
  Clock,
} from "lucide-react";
import {
  useEditInvitationDialogStore,
  type Invitation,
} from "../../../stores/editInvitationDialogStore";

const guestSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  isAttending: z.boolean().nullable(),
  hasPlusOne: z.boolean(),
});

const invitationSchema = z.object({
  id: z.string(),
  groupName: z.string().min(1, "Invitation name is required"),
  email: z
    .union([z.string().email("Invalid email"), z.literal(""), z.null()])
    .optional(),
  guests: z.array(guestSchema).min(1, "At least one guest is required"),
});

type InvitationFormData = z.infer<typeof invitationSchema>;

interface EditInvitationDialogProps {
  onSave: (invitation: Invitation) => void;
  isSaving?: boolean;
}

export function EditInvitationDialog({
  onSave,
  isSaving = false,
}: EditInvitationDialogProps) {
  const { isOpen, invitation, closeDialog, reset } =
    useEditInvitationDialogStore();

  const form = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
    defaultValues: invitation
      ? {
          ...invitation,
          guests: invitation.guests.map((g) => ({ ...g })),
        }
      : undefined,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "guests",
  });

  useEffect(() => {
    if (invitation) {
      form.reset({
        ...invitation,
        email: invitation.email ?? undefined,
        guests: invitation.guests.map((g) => ({ ...g })),
      });
    }
  }, [invitation, form]);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSaving) {
      closeDialog();
      reset();
      form.reset();
    }
  };

  const onSubmit = (data: InvitationFormData) => {
    onSave({
      ...data,
      email: data.email === "" ? null : data.email ?? null,
    } as Invitation);
  };

  const getAttendanceValue = (isAttending: boolean | null): string => {
    if (isAttending === true) return "yes";
    if (isAttending === false) return "no";
    return "pending";
  };

  const parseAttendanceValue = (value: string): boolean | null => {
    if (value === "yes") return true;
    if (value === "no") return false;
    return null;
  };

  const addGuest = () => {
    append({
      id: `new-${Date.now()}`,
      name: "",
      isAttending: null,
      hasPlusOne: false,
    });
  };

  const removeGuest = (index: number) => {
    if (fields.length <= 1) return;
    remove(index);
  };

  const watchedGuests =
    useWatch({
      control: form.control,
      name: "guests",
    }) || [];

  const isSingleGuest =
    watchedGuests.length === 1 && !watchedGuests[0]?.hasPlusOne;
  const isGuestPlusOne =
    watchedGuests.length === 1 && watchedGuests[0]?.hasPlusOne;
  const isGroup = watchedGuests.length > 1;

  if (!invitation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} key={invitation?.id}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif flex items-center gap-2">
            Edit Invitation
            {isSingleGuest && (
              <Badge variant="secondary" className="font-normal">
                <User className="h-3 w-3 mr-1" />
                Single
              </Badge>
            )}
            {isGuestPlusOne && (
              <Badge variant="secondary" className="font-normal">
                <UserPlus className="h-3 w-3 mr-1" />
                +1
              </Badge>
            )}
            {isGroup && (
              <Badge variant="secondary" className="font-normal">
                <Users className="h-3 w-3 mr-1" />
                Group
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Update invitation details and manage guest responses.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="details" className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="guests">
                  Guests ({watchedGuests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invitation Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., The Smith Family"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is how the invitation will appear in your list
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            className="pl-9"
                            {...field}
                            value={field.value || ""}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Used for sending digital invitations and reminders
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="guests" className="space-y-4 mt-4">
                {fields.map((field, index) => {
                  const guest = watchedGuests[index];
                  return (
                    <div
                      key={field.id}
                      className="rounded-lg border border-border p-4 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {guest?.name
                              ? guest.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()
                              : "?"}
                          </div>
                          <div>
                            <p className="font-medium">Guest {index + 1}</p>
                            {guest?.hasPlusOne && (
                              <p className="text-xs text-muted-foreground">
                                Has +1
                              </p>
                            )}
                          </div>
                        </div>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeGuest(index)}
                            disabled={isSaving}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`guests.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Guest name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`guests.${index}.isAttending`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>RSVP Status</FormLabel>
                              <Select
                                value={getAttendanceValue(field.value)}
                                onValueChange={(v) =>
                                  field.onChange(parseAttendanceValue(v))
                                }
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pending">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      Pending
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="yes">
                                    <div className="flex items-center gap-2">
                                      <Check className="h-4 w-4 text-green-600" />
                                      Attending
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="no">
                                    <div className="flex items-center gap-2">
                                      <X className="h-4 w-4 text-red-500" />
                                      Declined
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`guests.${index}.hasPlusOne`}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                                className="h-4 w-4 rounded border-input"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              Allow plus one
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                  onClick={addGuest}
                  disabled={isSaving}
                >
                  <Plus className="h-4 w-4" />
                  Add Another Guest
                </Button>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
