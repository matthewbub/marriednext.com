"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Globe,
  Map,
  Home,
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

interface WeddingDetails {
  displayName: string;
  nameA: string;
  nameB: string;
  eventDate: string;
  eventTime: string;
  locationName: string;
  locationAddress: string;
  mapsEmbedUrl: string;
  mapsShareUrl: string;
  preferredAddressLine1: string;
  preferredAddressLine2: string;
  preferredCity: string;
  preferredState: string;
  preferredZipCode: string;
  preferredCountry: string;
}

interface DomainSettings {
  subdomain: string;
  customDomain: string | null;
  hasCustomDomainUpgrade: boolean;
  domainVerified: boolean;
}

const initialDetails: WeddingDetails = {
  displayName: "Sarah & Michael's Wedding",
  nameA: "Sarah",
  nameB: "Michael",
  eventDate: "2025-06-15",
  eventTime: "16:00",
  locationName: "Rosewood Gardens Estate",
  locationAddress: "1234 Garden Lane, Napa Valley, CA 94558",
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18...",
  mapsShareUrl: "https://maps.google.com/?q=Rosewood+Gardens+Estate",
  preferredAddressLine1: "1234 Garden Lane",
  preferredAddressLine2: "",
  preferredCity: "Napa Valley",
  preferredState: "CA",
  preferredZipCode: "94558",
  preferredCountry: "United States",
};

const initialDomainSettings: DomainSettings = {
  subdomain: "sarah-and-michael",
  customDomain: null,
  hasCustomDomainUpgrade: false,
  domainVerified: false,
};

export function ApplicationWeddingDetailsSettings() {
  const [details, setDetails] = useState<WeddingDetails>(initialDetails);
  const [savedDetails, setSavedDetails] =
    useState<WeddingDetails>(initialDetails);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const [domainSettings, setDomainSettings] = useState<DomainSettings>(
    initialDomainSettings
  );
  const [savedDomainSettings, setSavedDomainSettings] =
    useState<DomainSettings>(initialDomainSettings);
  const [subdomainInput, setSubdomainInput] = useState(
    initialDomainSettings.subdomain
  );
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [dnsTab, setDnsTab] = useState<"a-record" | "nameservers">("a-record");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasChanges = JSON.stringify(details) !== JSON.stringify(savedDetails);
  const hasDomainChanges = subdomainInput !== savedDomainSettings.subdomain;

  const updateField = (field: keyof WeddingDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
    setSaveStatus("idle");
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavedDetails(details);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const handleReset = () => {
    setDetails(savedDetails);
    setSaveStatus("idle");
  };

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveSubdomain = async () => {
    setSaveStatus("saving");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDomainSettings((prev) => ({ ...prev, subdomain: subdomainInput }));
    setSavedDomainSettings((prev) => ({ ...prev, subdomain: subdomainInput }));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const handleSaveCustomDomain = async () => {
    if (!customDomainInput.trim()) return;
    setSaveStatus("saving");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDomainSettings((prev) => ({
      ...prev,
      customDomain: customDomainInput.trim(),
      domainVerified: false,
    }));
    setSavedDomainSettings((prev) => ({
      ...prev,
      customDomain: customDomainInput.trim(),
      domainVerified: false,
    }));
    setCustomDomainInput("");
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const handleVerifyDomain = async () => {
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsVerifying(false);
  };

  const handleDeleteDomain = async () => {
    setSaveStatus("saving");
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDomainSettings((prev) => ({
      ...prev,
      customDomain: null,
      domainVerified: false,
    }));
    setSavedDomainSettings((prev) => ({
      ...prev,
      customDomain: null,
      domainVerified: false,
    }));
    setShowDeleteConfirm(false);
    setSaveStatus("idle");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header - Sticky */}
      <div className="sticky top-14 z-10 bg-background/95 backdrop-blur-md border-b border-border -mx-6 px-6 py-4 -mt-6 mb-6">
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
                variant="outline"
                onClick={handleReset}
                className="gap-2 bg-transparent"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saveStatus === "saving"}
              className="gap-2"
            >
              {saveStatus === "saving" ? (
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
            You have unsaved changes. Don't forget to save before leaving this
            page.
          </p>
        </div>
      )}

      {/* Couple Names Section */}
      <Card>
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
            <div className="space-y-2">
              <Label htmlFor="nameA">Partner 1 Name</Label>
              <Input
                id="nameA"
                value={details.nameA}
                onChange={(e) => updateField("nameA", e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameB">Partner 2 Name</Label>
              <Input
                id="nameB"
                value={details.nameB}
                onChange={(e) => updateField("nameB", e.target.value)}
                placeholder="First name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={details.displayName}
              onChange={(e) => updateField("displayName", e.target.value)}
              placeholder="e.g., Sarah & Michael's Wedding"
            />
            <p className="text-xs text-muted-foreground">
              This is how your wedding will be titled on your website and in
              browser tabs
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Date & Time Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-serif text-xl">Date & Time</CardTitle>
              <CardDescription>
                When your special day will take place
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Wedding Date</Label>
              <div className="relative">
                <Input
                  id="eventDate"
                  type="date"
                  value={details.eventDate}
                  onChange={(e) => updateField("eventDate", e.target.value)}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventTime">Ceremony Time</Label>
              <div className="relative">
                <Input
                  id="eventTime"
                  type="time"
                  value={details.eventTime}
                  onChange={(e) => updateField("eventTime", e.target.value)}
                  className="pl-10"
                />
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Venue Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-serif text-xl">
                Venue Information
              </CardTitle>
              <CardDescription>Where your wedding will be held</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="locationName">Venue Name</Label>
            <Input
              id="locationName"
              value={details.locationName}
              onChange={(e) => updateField("locationName", e.target.value)}
              placeholder="e.g., Rosewood Gardens Estate"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locationAddress">Full Address</Label>
            <Input
              id="locationAddress"
              value={details.locationAddress}
              onChange={(e) => updateField("locationAddress", e.target.value)}
              placeholder="Full venue address"
            />
            <p className="text-xs text-muted-foreground">
              This address will be displayed on your website for guests
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Maps Integration Section */}
      <Card>
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
          <div className="space-y-2">
            <Label htmlFor="mapsEmbedUrl">Google Maps Embed URL</Label>
            <div className="relative">
              <Input
                id="mapsEmbedUrl"
                value={details.mapsEmbedUrl}
                onChange={(e) => updateField("mapsEmbedUrl", e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="pl-10 font-mono text-xs"
              />
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <p className="text-xs text-muted-foreground">
              Get this from Google Maps &gt; Share &gt; Embed a map
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mapsShareUrl">Google Maps Share Link</Label>
            <div className="relative">
              <Input
                id="mapsShareUrl"
                value={details.mapsShareUrl}
                onChange={(e) => updateField("mapsShareUrl", e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="pl-10 font-mono text-xs"
              />
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <p className="text-xs text-muted-foreground">
              Direct link for "Get Directions" button
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Mailing Address Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-serif text-xl">
                Venue Location
              </CardTitle>
              <CardDescription>
                Detailed address for your wedding venue
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preferredAddressLine1">Address Line 1</Label>
            <Input
              id="preferredAddressLine1"
              value={details.preferredAddressLine1}
              onChange={(e) =>
                updateField("preferredAddressLine1", e.target.value)
              }
              placeholder="Street address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredAddressLine2">Address Line 2</Label>
            <Input
              id="preferredAddressLine2"
              value={details.preferredAddressLine2}
              onChange={(e) =>
                updateField("preferredAddressLine2", e.target.value)
              }
              placeholder="Apartment, suite, unit, etc. (optional)"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredCity">City</Label>
              <Input
                id="preferredCity"
                value={details.preferredCity}
                onChange={(e) => updateField("preferredCity", e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredState">State / Province</Label>
              <Input
                id="preferredState"
                value={details.preferredState}
                onChange={(e) => updateField("preferredState", e.target.value)}
                placeholder="State"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredZipCode">ZIP / Postal Code</Label>
              <Input
                id="preferredZipCode"
                value={details.preferredZipCode}
                onChange={(e) =>
                  updateField("preferredZipCode", e.target.value)
                }
                placeholder="ZIP code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredCountry">Country</Label>
              <Input
                id="preferredCountry"
                value={details.preferredCountry}
                onChange={(e) =>
                  updateField("preferredCountry", e.target.value)
                }
                placeholder="Country"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
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
          {/* Free Subdomain */}
          <div className="space-y-3">
            <Label htmlFor="subdomain">Your Free Subdomain</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="subdomain"
                  value={subdomainInput}
                  onChange={(e) =>
                    setSubdomainInput(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  placeholder="your-names"
                  className="pr-32"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  .marriednext.com
                </span>
              </div>
              <Button
                onClick={handleSaveSubdomain}
                disabled={!hasDomainChanges || saveStatus === "saving"}
                size="default"
              >
                {saveStatus === "saving" ? "Saving..." : "Save"}
              </Button>
            </div>
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
                        sarahandmichael.com
                      </span>{" "}
                      or{" "}
                      <span className="font-medium text-foreground">
                        thesmiths.wedding
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
                        This upgrade allows you to connect a domain you already
                        own. The domain itself is not included — you'll need to
                        purchase one from a registrar like{" "}
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
                    <Button className="gap-2" asChild>
                      <a href="/dashboard/billing">
                        <Crown className="h-4 w-4" />
                        Upgrade for $49/year
                      </a>
                    </Button>
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
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={customDomainInput}
                        onChange={(e) =>
                          setCustomDomainInput(e.target.value.toLowerCase())
                        }
                        placeholder="yourdomain.com"
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSaveCustomDomain}
                        disabled={!customDomainInput.trim()}
                      >
                        Add Domain
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter the domain you want to connect (without https://)
                    </p>
                  </div>
                ) : (
                  /* Domain Configuration UI */
                  <div className="space-y-4">
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
                              Update your DNS settings at your domain registrar
                              to complete the connection.
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
                                  Changing nameservers transfers DNS management.
                                  You may need to recreate existing records.
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
                          <div className="flex justify-end gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setShowDeleteConfirm(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteDomain}
                            >
                              Remove Domain
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
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saveStatus === "saving"}
                >
                  {saveStatus === "saving" ? "Saving..." : "Save"}
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
    </div>
  );
}
