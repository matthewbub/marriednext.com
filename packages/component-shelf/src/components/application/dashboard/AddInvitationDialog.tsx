"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { toast } from "sonner";
import clsx from "clsx";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";
import { SeparatorDoubleLine } from "../../../components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import {
  User,
  UserPlus,
  Users,
  Plus,
  Trash2,
  Mail,
  InfoIcon,
} from "lucide-react";
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
  guestNames: z.array(z.object({ value: z.string() })),
  email: z
    .union([z.string().email("Invalid email"), z.literal(""), z.null()])
    .optional(),
});

type AddInvitationFormData = z.infer<typeof addInvitationSchema>;

interface AddInvitationDialogProps {
  onSubmit?: (data: AddInvitationPayload) => void;
  isSubmitting?: boolean;
}

interface FormSectionProps {
  title: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}

function FormSection({
  title,
  optional,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={clsx("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        {optional && (
          <span className="text-xs text-muted-foreground/60">optional</span>
        )}
      </div>
      {children}
    </div>
  );
}

const defaultValues: AddInvitationFormData = {
  invitationType: "single",
  groupName: "",
  guestName: "",
  guestNames: [{ value: "" }],
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
  const lastInvitationTypeRef = useRef<"single" | "plusone" | "group">(
    "single"
  );
  const wasSubmittingRef = useRef(false);

  const form = useForm<AddInvitationFormData>({
    resolver: zodResolver(addInvitationSchema as any),
    defaultValues: {
      ...defaultValues,
      invitationType,
    },
  });

  const { fields, append, remove } = useFieldArray<AddInvitationFormData>({
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
    if (
      wasSubmittingRef.current &&
      !isSubmitting &&
      lastSubmittedGuestsRef.current
    ) {
      const guests = lastSubmittedGuestsRef.current;
      const guestNamesText =
        guests.length === 1
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
        ? (data.guestNames || [])
            .map((item) => item.value)
            .filter((name) => name.trim() !== "")
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
        data.invitationType === "group" ? data.groupName?.trim() || null : null,
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
    <Sheet
      open={isOpen}
      onOpenChange={(open) => (open ? openDialog() : handleClose())}
    >
      <SheetTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Invitation
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">
            Add New Invitation
          </SheetTitle>
          <SheetDescription className="text-base">
            Create an invitation for a single guest, guest with +1, or a group
            of guests.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 px-4"
          >
            <div className="flex-1 space-y-6">
              <FormSection title="Invitation Type">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={
                      watchedInvitationType === "single" ? "default" : "outline"
                    }
                    className="flex-col h-auto py-4 gap-1.5"
                    onClick={() => setInvitationType("single")}
                  >
                    <User className="h-6 w-6" />
                    <span className="text-sm">Single</span>
                  </Button>
                  <Button
                    type="button"
                    variant={
                      watchedInvitationType === "plusone"
                        ? "default"
                        : "outline"
                    }
                    className="flex-col h-auto py-4 gap-1.5"
                    onClick={() => setInvitationType("plusone")}
                  >
                    <UserPlus className="h-6 w-6" />
                    <span className="text-sm">Guest +1</span>
                  </Button>
                  <Button
                    type="button"
                    variant={
                      watchedInvitationType === "group" ? "default" : "outline"
                    }
                    className="flex-col h-auto py-4 gap-1.5"
                    onClick={() => setInvitationType("group")}
                  >
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Group</span>
                  </Button>
                </div>
              </FormSection>

              {/* <SeparatorDoubleLine /> */}

              <FormSection title="Guest Details">
                {watchedInvitationType === "group" && (
                  <div className="mb-12">
                    <FormField
                      control={form.control}
                      name="groupName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name of the group (optional)</FormLabel>
                          <FormControl>
                            <Input
                              className="h-11"
                              placeholder="e.g., The Smith Family"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <InfoIcon className="h-4 w-4" />
                            Guests in group can use this name to RSVP to the
                            event.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {watchedInvitationType === "group" ? (
                  <div className="space-y-3">
                    <FormLabel>Guest Names</FormLabel>
                    {fields.map((field, index) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={`guestNames.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <div className="relative flex-1">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="h-11 pl-10"
                                    placeholder="Full name as written on invitation"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="shrink-0 h-11 w-11 text-muted-foreground hover:text-destructive"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            {index === fields.length - 1 && (
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                Full name as written on the invitation
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-fit gap-2 h-10"
                        onClick={() => append({ value: "" })}
                      >
                        <Plus className="h-4 w-4" />
                        Add Guest
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <FormField
                      control={form.control}
                      name="guestName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guest Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="h-11 pl-10"
                                placeholder="Full name as written on invitation"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchedInvitationType === "plusone" && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                        <UserPlus className="h-4 w-4" />
                        Guest can bring one additional person
                      </p>
                    )}
                  </div>
                )}
              </FormSection>

              <SeparatorDoubleLine />

              <FormSection title="Contact" optional>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="h-11 pl-10"
                            type="email"
                            placeholder="guest@email.com"
                            {...field}
                            value={field.value || ""}
                          />
                        </div>
                      </FormControl>
                      {watchedInvitationType === "group" && (
                        <p className="text-sm text-muted-foreground">
                          Primary contact for the group
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>
            </div>

            <SheetFooter className="px-0 pt-6">
              <div className="flex items-center justify-between py-1">
                <Label
                  htmlFor="add-another"
                  className="text-sm font-normal cursor-pointer text-muted-foreground"
                >
                  Add another invitation after saving
                </Label>
                <Switch
                  id="add-another"
                  checked={addAnother}
                  onCheckedChange={setAddAnother}
                />
              </div>
              <div className="flex justify-end gap-2 w-full">
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
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
