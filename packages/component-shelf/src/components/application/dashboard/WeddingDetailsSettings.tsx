"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
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
  Heart,
  MapPin,
  Calendar,
  Clock,
  Globe,
  Map,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Link2,
  ExternalLink,
  Copy,
  Check,
  Crown,
  RefreshCw,
  Trash2,
  Info,
} from "lucide-react";

const weddingDetailsSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  nameA: z.string().min(1, "Partner 1 name is required"),
  nameB: z.string().min(1, "Partner 2 name is required"),
  eventDate: z.string().min(1, "Event date is required"),
  eventTime: z.string().min(1, "Event time is required"),
  locationName: z.string().optional(),
  mapsEmbedUrl: z.string().optional(),
  mapsShareUrl: z.string().optional(),
  preferredAddressLine1: z.string().optional(),
  preferredAddressLine2: z.string().optional(),
  preferredCity: z.string().optional(),
  preferredState: z.string().optional(),
  preferredZipCode: z.string().optional(),
  preferredCountry: z.string().optional(),
});

const domainSettingsSchema = z.object({
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(63, "Subdomain must be at most 63 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Subdomain can only contain lowercase letters, numbers, and hyphens"
    ),
  customDomain: z.string().optional(),
});

type WeddingDetailsFormData = z.infer<typeof weddingDetailsSchema>;
type DomainSettingsFormData = z.infer<typeof domainSettingsSchema>;

export interface DomainSettings {
  subdomain: string;
  customDomain: string | null;
  hasCustomDomainUpgrade: boolean;
  domainVerified: boolean;
}

export interface WeddingDetailsData {
  displayName: string;
  nameA: string;
  nameB: string;
  eventDate: string;
  eventTime: string;
  locationName?: string;
  mapsEmbedUrl?: string;
  mapsShareUrl?: string;
  preferredAddressLine1?: string;
  preferredAddressLine2?: string;
  preferredCity?: string;
  preferredState?: string;
  preferredZipCode?: string;
  preferredCountry?: string;
}

export interface ApplicationWeddingDetailsSettingsProps {
  weddingDetails: WeddingDetailsData;
  domainSettings: DomainSettings;
  onSave?: (data: WeddingDetailsFormData) => Promise<void>;
  isSaving?: boolean;
  onSaveSubdomain?: (subdomain: string) => Promise<void>;
  onSaveCustomDomain?: (customDomain: string) => Promise<void>;
  onDeleteCustomDomain?: () => Promise<void>;
  isSavingDomain?: boolean;
}

export function ApplicationWeddingDetailsSettings({
  weddingDetails,
  domainSettings: initialDomainSettings,
  onSave,
  isSaving = false,
  onSaveSubdomain,
  onSaveCustomDomain,
  onDeleteCustomDomain,
  isSavingDomain = false,
}: ApplicationWeddingDetailsSettingsProps) {
  const form = useForm<WeddingDetailsFormData>({
    resolver: zodResolver(weddingDetailsSchema as any),
    defaultValues: {
      displayName: weddingDetails.displayName,
      nameA: weddingDetails.nameA,
      nameB: weddingDetails.nameB,
      eventDate: weddingDetails.eventDate,
      eventTime: weddingDetails.eventTime,
      locationName: weddingDetails.locationName || "",
      mapsEmbedUrl: weddingDetails.mapsEmbedUrl || "",
      mapsShareUrl: weddingDetails.mapsShareUrl || "",
      preferredAddressLine1: weddingDetails.preferredAddressLine1 || "",
      preferredAddressLine2: weddingDetails.preferredAddressLine2 || "",
      preferredCity: weddingDetails.preferredCity || "",
      preferredState: weddingDetails.preferredState || "",
      preferredZipCode: weddingDetails.preferredZipCode || "",
      preferredCountry: weddingDetails.preferredCountry || "",
    },
    mode: "onChange",
  });

  const domainForm = useForm<DomainSettingsFormData>({
    resolver: zodResolver(domainSettingsSchema as any),
    defaultValues: {
      subdomain: initialDomainSettings.subdomain,
      customDomain: "",
    },
    mode: "onChange",
  });

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [domainError, setDomainError] = useState<string | null>(null);

  const [domainSettings, setDomainSettings] = useState<DomainSettings>(
    initialDomainSettings
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [dnsTab, setDnsTab] = useState<"a-record" | "nameservers">("a-record");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setDomainSettings(initialDomainSettings);
  }, [initialDomainSettings]);

  useEffect(() => {
    domainForm.reset({
      subdomain: initialDomainSettings.subdomain,
      customDomain: "",
    });
  }, [initialDomainSettings.subdomain, domainForm]);

  const hasChanges = form.formState.isDirty;
  const hasDomainChanges = domainForm.formState.isDirty;

  const handleSave = form.handleSubmit(async (data) => {
    if (onSave) {
      setSaveStatus("saving");
      try {
        await onSave(data);
        form.reset(data);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    }
  });

  const handleReset = () => {
    form.reset();
    setSaveStatus("idle");
  };

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveSubdomain = domainForm.handleSubmit(async (data) => {
    if (!onSaveSubdomain) return;
    setDomainError(null);
    domainForm.clearErrors("subdomain");
    setSaveStatus("saving");
    try {
      await onSaveSubdomain(data.subdomain);
      setDomainSettings((prev) => ({ ...prev, subdomain: data.subdomain }));
      domainForm.reset({ ...data, customDomain: "" });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save subdomain";
      setDomainError(errorMessage);
      domainForm.setError("subdomain", {
        type: "server",
        message: errorMessage,
      });
      setTimeout(() => {
        setSaveStatus("idle");
        setDomainError(null);
      }, 5000);
    }
  });

  const handleSaveCustomDomain = domainForm.handleSubmit(async (data) => {
    if (!data.customDomain?.trim() || !onSaveCustomDomain) return;
    setDomainError(null);
    domainForm.clearErrors("customDomain");
    setSaveStatus("saving");
    try {
      await onSaveCustomDomain(data.customDomain.trim());
      setDomainSettings((prev) => ({
        ...prev,
        customDomain: data.customDomain!.trim(),
        domainVerified: false,
      }));
      domainForm.reset({
        subdomain: domainForm.getValues("subdomain"),
        customDomain: "",
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save custom domain";
      setDomainError(errorMessage);
      domainForm.setError("customDomain", {
        type: "server",
        message: errorMessage,
      });
      setTimeout(() => {
        setSaveStatus("idle");
        setDomainError(null);
      }, 5000);
    }
  });

  const handleVerifyDomain = async () => {
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsVerifying(false);
  };

  const handleDeleteDomain = async () => {
    if (!onDeleteCustomDomain) return;
    setDomainError(null);
    setSaveStatus("saving");
    try {
      await onDeleteCustomDomain();
      setDomainSettings((prev) => ({
        ...prev,
        customDomain: null,
        domainVerified: false,
      }));
      setShowDeleteConfirm(false);
      setSaveStatus("idle");
    } catch (error) {
      setSaveStatus("error");
      setDomainError(
        error instanceof Error
          ? error.message
          : "Failed to delete custom domain"
      );
      setShowDeleteConfirm(false);
      setTimeout(() => {
        setSaveStatus("idle");
        setDomainError(null);
      }, 5000);
    }
  };

  const generateDomainSuggestions = () => {
    const nameA = weddingDetails.nameA.toLowerCase().replace(/[^a-z]/g, "");
    const nameB = weddingDetails.nameB.toLowerCase().replace(/[^a-z]/g, "");

    if (!nameA || !nameB) {
      return {
        first: "yournames.com",
        second: "yournames.wedding",
      };
    }

    return {
      first: `${nameA}and${nameB}.com`,
      second: `${nameA}${nameB}.wedding`,
    };
  };

  const domainSuggestions = generateDomainSuggestions();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Form {...form}>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Page Header - Sticky */}
          <div className="sticky top-14 z-10 backdrop-blur-md border-b border-border -mx-6 px-6 py-4 -mt-6 mb-6">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-semibold text-foreground">
                  Wedding Details
                </h1>
                <p className="text-muted-foreground mt-1">
                  Update your wedding information used across your website and
                  invitations
                </p>
              </div>
              <div className="flex items-center gap-3">
                {hasChanges && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="gap-2 bg-transparent"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={!hasChanges || isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : saveStatus === "saved" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Unsaved Changes Banner */}
          {hasChanges && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800">
                You have unsaved changes. Don't forget to save before leaving
                this page.
              </p>
            </div>
          )}

          {/* Couple Names Section */}
          <Card id="couple-information">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-serif text-xl">
                    Couple Information
                  </CardTitle>
                  <CardDescription>
                    Your names as they'll appear on your wedding website
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nameA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partner 1 Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nameB"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partner 2 Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Sarah & Michael's Wedding"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is how your wedding will be titled on your website
                      and in browser tabs
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Date & Time Section */}
          <Card id="date-time">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-serif text-xl">
                    Date & Time
                  </CardTitle>
                  <CardDescription>
                    When your special day will take place
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wedding Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="date" className="pl-10" {...field} />
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ceremony Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="time" className="pl-10" {...field} />
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Maps Integration Section */}
          <Card id="maps-integration">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                  <Map className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-serif text-xl">
                    Maps Integration
                  </CardTitle>
                  <CardDescription>
                    Help guests find your venue with embedded maps
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="mapsEmbedUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Maps Embed URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="https://www.google.com/maps/embed?pb=..."
                          className="pl-10 font-mono text-xs"
                          {...field}
                        />
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Get this from Google Maps &gt; Share &gt; Embed a map
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mapsShareUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Maps Share Link</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="https://maps.google.com/?q=..."
                          className="pl-10 font-mono text-xs"
                          {...field}
                        />
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Direct link for "Get Directions" button
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Venue Location Section */}
          <Card id="venue-location">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-serif text-xl">
                    Venue Location
                  </CardTitle>
                  <CardDescription>
                    Where your wedding will be held
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="locationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Rosewood Gardens Estate"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="my-8" />
              <FormField
                control={form.control}
                name="preferredAddressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1 (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredAddressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apartment, suite, unit, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preferredCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Province (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preferredZipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP / Postal Code (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="ZIP code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bottom Save Bar (sticky on mobile) */}
          <div className="lg:hidden fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border">
            <div className="flex items-center justify-between gap-3">
              {hasChanges ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Unsaved changes
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                    <Button type="submit" size="sm" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">
                  All changes saved
                </span>
              )}
            </div>
          </div>

          {/* Spacer for mobile bottom bar */}
          <div className="lg:hidden h-20" />
        </form>
      </Form>

      {/* Domain Settings - Separate from main form */}
      <Card id="domain-settings">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
              <Link2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-serif text-xl">
                Domain Settings
              </CardTitle>
              <CardDescription>
                Customize your wedding website URL
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...domainForm}>
            {/* Free Subdomain */}
            <div className="space-y-3">
              <FormField
                control={domainForm.control}
                name="subdomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Free Subdomain</FormLabel>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, "");
                              field.onChange(value);
                            }}
                            placeholder="your-names"
                            className="pr-32"
                          />
                        </FormControl>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          .marriednext.com
                        </span>
                      </div>
                      <Button
                        onClick={handleSaveSubdomain}
                        disabled={!hasDomainChanges || isSavingDomain}
                        size="default"
                        type="button"
                      >
                        {isSavingDomain ? "Saving..." : "Save"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {domainError && saveStatus === "error" && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                  <p className="text-sm text-destructive">{domainError}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <a
                  href={`https://${domainSettings.subdomain}.marriednext.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  https://{domainSettings.subdomain}.marriednext.com
                  <ExternalLink className="h-3 w-3" />
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() =>
                    copyToClipboard(
                      `https://${domainSettings.subdomain}.marriednext.com`,
                      "subdomain"
                    )
                  }
                >
                  {copiedField === "subdomain" ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              {/* Custom Domain - Upsell or Configuration */}
              {!domainSettings.hasCustomDomainUpgrade ? (
                /* Upsell Card - Updated copy to clarify domain not included */
                <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 shrink-0">
                      <Crown className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-semibold text-foreground">
                        Connect Your Own Domain
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">
                        Already own a domain like{" "}
                        <span className="font-medium text-foreground">
                          {domainSuggestions.first}
                        </span>{" "}
                        or{" "}
                        <span className="font-medium text-foreground">
                          {domainSuggestions.second}
                        </span>
                        ? Connect it to your Married Next website.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          Connect any domain you already own
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          Free SSL certificate included
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          Keep your subdomain as a backup
                        </li>
                      </ul>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border mb-4">
                        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Note:
                          </span>{" "}
                          This upgrade allows you to connect a domain you
                          already own. The domain itself is not included —
                          you'll need to purchase one from a registrar like{" "}
                          <a
                            href="https://namecheap.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Namecheap
                          </a>
                          ,{" "}
                          <a
                            href="https://domains.google"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Google Domains
                          </a>
                          , or{" "}
                          <a
                            href="https://porkbun.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Porkbun
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Custom Domain Configuration */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">
                        Custom Domain
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Connect your own domain to your wedding website
                      </p>
                    </div>
                    {domainSettings.customDomain &&
                      domainSettings.domainVerified && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 text-xs font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Connected
                        </span>
                      )}
                  </div>

                  {/* Info note for upgraded users */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Enter a domain you own below. Don't have one yet? Purchase
                      from{" "}
                      <a
                        href="https://namecheap.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Namecheap
                      </a>
                      ,{" "}
                      <a
                        href="https://domains.google"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google Domains
                      </a>
                      , or{" "}
                      <a
                        href="https://porkbun.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Porkbun
                      </a>
                      .
                    </p>
                  </div>

                  {!domainSettings.customDomain ? (
                    /* Add Domain Form */
                    <FormField
                      control={domainForm.control}
                      name="customDomain"
                      render={({ field }) => (
                        <FormItem>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value.toLowerCase();
                                    field.onChange(value);
                                  }}
                                  placeholder="yourdomain.com"
                                  className="flex-1"
                                />
                              </FormControl>
                              <Button
                                onClick={handleSaveCustomDomain}
                                disabled={
                                  !field.value?.trim() || isSavingDomain
                                }
                                type="button"
                              >
                                {isSavingDomain ? "Saving..." : "Add Domain"}
                              </Button>
                            </div>
                            {domainError && saveStatus === "error" && (
                              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                                <p className="text-sm text-destructive">
                                  {domainError}
                                </p>
                              </div>
                            )}
                            <FormDescription>
                              Enter the domain you want to connect (without
                              https://)
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  ) : (
                    /* Domain Configuration UI */
                    <div className="space-y-4">
                      {domainError && saveStatus === "error" && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                          <p className="text-sm text-destructive">
                            {domainError}
                          </p>
                        </div>
                      )}
                      {/* Current Domain Display */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <a
                              href={`https://${domainSettings.customDomain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-foreground hover:text-primary flex items-center gap-1"
                            >
                              {domainSettings.customDomain}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!domainSettings.domainVerified && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-medium">
                              <AlertCircle className="h-3 w-3" />
                              Not Connected
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleVerifyDomain}
                            disabled={isVerifying}
                          >
                            <RefreshCw
                              className={`h-4 w-4 ${
                                isVerifying ? "animate-spin" : ""
                              }`}
                            />
                          </Button>
                        </div>
                      </div>

                      {/* DNS Configuration (show when not verified) */}
                      {!domainSettings.domainVerified && (
                        <div className="space-y-4">
                          {/* Warning Banner */}
                          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-amber-800">
                                Your domain isn't connected yet
                              </p>
                              <p className="text-sm text-amber-700 mt-1">
                                Update your DNS settings at your domain
                                registrar to complete the connection.
                              </p>
                            </div>
                          </div>

                          {/* DNS Tabs */}
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant={
                                dnsTab === "a-record" ? "default" : "outline"
                              }
                              onClick={() => setDnsTab("a-record")}
                              className="justify-center"
                            >
                              DNS Records
                            </Button>
                            <Button
                              variant={
                                dnsTab === "nameservers" ? "default" : "outline"
                              }
                              onClick={() => setDnsTab("nameservers")}
                              className="justify-center"
                            >
                              Nameservers
                            </Button>
                          </div>

                          {dnsTab === "a-record" && (
                            <div className="rounded-lg border border-border overflow-hidden">
                              <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-700 border border-green-500/20">
                                  Recommended
                                </span>
                                <span className="text-sm font-medium">
                                  A Record
                                </span>
                              </div>
                              <div className="p-4">
                                <p className="text-sm text-muted-foreground mb-4">
                                  Add this record at your DNS provider to point
                                  your domain to Married Next.
                                </p>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="border-b border-border">
                                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                                          Type
                                        </th>
                                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                                          Name
                                        </th>
                                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                                          Value
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="py-2 px-3">
                                          <code className="px-2 py-1 rounded bg-muted text-xs font-mono">
                                            A
                                          </code>
                                        </td>
                                        <td className="py-2 px-3">
                                          <div className="flex items-center gap-2">
                                            <code className="px-2 py-1 rounded bg-muted text-xs font-mono">
                                              @
                                            </code>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 px-2"
                                              onClick={() =>
                                                copyToClipboard("@", "name")
                                              }
                                            >
                                              {copiedField === "name" ? (
                                                <Check className="h-3 w-3 text-green-600" />
                                              ) : (
                                                <Copy className="h-3 w-3" />
                                              )}
                                            </Button>
                                          </div>
                                        </td>
                                        <td className="py-2 px-3">
                                          <div className="flex items-center gap-2">
                                            <code className="px-2 py-1 rounded bg-muted text-xs font-mono">
                                              216.198.79.1
                                            </code>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 px-2"
                                              onClick={() =>
                                                copyToClipboard(
                                                  "216.198.79.1",
                                                  "ip"
                                                )
                                              }
                                            >
                                              {copiedField === "ip" ? (
                                                <Check className="h-3 w-3 text-green-600" />
                                              ) : (
                                                <Copy className="h-3 w-3" />
                                              )}
                                            </Button>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}

                          {dnsTab === "nameservers" && (
                            <div className="rounded-lg border border-border overflow-hidden">
                              <div className="px-4 py-3 bg-muted/50 border-b border-border">
                                <span className="text-sm font-medium">
                                  Nameservers
                                </span>
                              </div>
                              <div className="p-4 space-y-4">
                                <p className="text-sm text-muted-foreground">
                                  Update your domain's nameservers to enable
                                  Vercel DNS.
                                </p>
                                <div className="space-y-2">
                                  {[
                                    "ns1.vercel-dns.com",
                                    "ns2.vercel-dns.com",
                                  ].map((ns, i) => (
                                    <div
                                      key={ns}
                                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                    >
                                      <code className="text-sm font-mono">
                                        {ns}
                                      </code>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2"
                                        onClick={() =>
                                          copyToClipboard(ns, `ns${i}`)
                                        }
                                      >
                                        {copiedField === `ns${i}` ? (
                                          <Check className="h-3 w-3 text-green-600" />
                                        ) : (
                                          <Copy className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                  <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                  <p className="text-xs text-blue-700">
                                    Changing nameservers transfers DNS
                                    management. You may need to recreate
                                    existing records.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              onClick={handleVerifyDomain}
                              disabled={isVerifying}
                              className="flex-1 sm:flex-none"
                            >
                              {isVerifying ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Checking...
                                </>
                              ) : (
                                "Check Domain Status"
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setShowDeleteConfirm(true)}
                              className="flex-1 sm:flex-none text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Domain
                            </Button>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            DNS changes can take up to 48 hours to propagate
                            worldwide.
                          </p>
                        </div>
                      )}

                      {/* Delete Confirmation Dialog */}
                      {showDeleteConfirm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                          <div
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setShowDeleteConfirm(false)}
                          />
                          <div className="relative z-10 w-full max-w-md p-6 bg-card border border-border rounded-xl shadow-lg">
                            <h3 className="font-serif text-xl font-semibold mb-2">
                              Remove custom domain?
                            </h3>
                            <p className="text-sm text-muted-foreground mb-6">
                              This will disconnect{" "}
                              <span className="font-medium">
                                {domainSettings.customDomain}
                              </span>{" "}
                              from your wedding website. Your site will still be
                              accessible via your subdomain.
                            </p>
                            {domainError && saveStatus === "error" && (
                              <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                                <p className="text-sm text-destructive">
                                  {domainError}
                                </p>
                              </div>
                            )}
                            <div className="flex justify-end gap-3">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowDeleteConfirm(false);
                                  setDomainError(null);
                                }}
                                disabled={isSavingDomain}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteDomain}
                                disabled={isSavingDomain}
                              >
                                {isSavingDomain
                                  ? "Removing..."
                                  : "Remove Domain"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
