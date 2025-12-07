 "use client";

import { useState } from "react";
import type { ApplicationLinkComponent } from "../link-types";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import {
  ArrowLeft,
  Globe,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Play,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface ApplicationConnectDomainArticleProps {
  Link?: ApplicationLinkComponent;
}

export function ApplicationConnectDomainArticle({
  Link = "a",
}: ApplicationConnectDomainArticleProps) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyToClipboard = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(label);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const aRecordIp = "76.76.21.21";
  const nameservers = ["ns1.vercel-dns.com", "ns2.vercel-dns.com"];

  return (
    <div className="py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/help"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Link>
        </div>

        {/* Article Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">
              <Globe className="h-3 w-3 mr-1" />
              Domains & URLs
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />5 min read
            </Badge>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
            How to Connect Your Domain
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn how to connect your own custom domain to your Married Next
            wedding website for a personalized URL like{" "}
            <span className="font-medium text-foreground">
              sarahandjohn.com
            </span>
            .
          </p>
        </div>

        {/* Upgrade Notice */}
        <Card className="border-amber-200 bg-amber-50/50 mb-10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-amber-100">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">
                  Custom Domain Add-on Required
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Connecting your own domain requires the Custom Domain add-on
                  ($49/year). This covers hosting on your domain — you'll need
                  to purchase the domain itself separately from a registrar like
                  Namecheap, Google Domains, or Porkbun.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Tutorial */}
        <div className="mb-10">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-4">
            Video Tutorial
          </h2>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="How to Connect Your Domain - Video Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
            <Play className="h-4 w-4" />
            Watch the full walkthrough (3:32)
          </p>
        </div>

        {/* Prerequisites */}
        <Card className="border-border mb-10">
          <CardHeader>
            <CardTitle className="font-serif text-xl">
              Before You Begin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Purchase your domain
                  </span>{" "}
                  — Buy your desired domain from a registrar (Namecheap, Google
                  Domains, Porkbun, GoDaddy, etc.)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Upgrade your account
                  </span>{" "}
                  — Add the Custom Domain add-on from your account settings.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Access your DNS settings
                  </span>{" "}
                  — Log in to your domain registrar's dashboard
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Step by Step Guide */}
        <div className="mb-10">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-6">
            Step-by-Step Guide
          </h2>

          {/* Step 1 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                1
              </div>
              <h3 className="font-medium text-lg text-foreground">
                Add your domain in Settings
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground mb-4">
                Go to{" "}
                <Link
                  href="/dashboard/settings"
                  className="text-primary hover:underline"
                >
                  Dashboard → Settings
                </Link>{" "}
                and scroll down to the Domain Settings section. Enter your
                domain name (e.g., sarahandjohn.com) and click "Add Domain".
              </p>
              <Card className="border-border bg-muted/30">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Tip:</span>{" "}
                    For most wedding websites, we recommend using the root
                    domain (sarahandjohn.com) rather than a subdomain
                    (www.sarahandjohn.com).
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                2
              </div>
              <h3 className="font-medium text-lg text-foreground">
                Configure your DNS records
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground mb-4">
                Log in to your domain registrar and navigate to DNS settings.
                You can configure your domain using either method below:
              </p>

              <Tabs defaultValue="a-record" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="a-record">
                    A Record (Recommended)
                  </TabsTrigger>
                  <TabsTrigger value="nameservers">Nameservers</TabsTrigger>
                </TabsList>

                <TabsContent value="a-record">
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-4">
                        Add an A record pointing to our IP address. This is the
                        quickest method and works with all registrars.
                      </p>
                      <div className="bg-muted rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Type</p>
                            <p className="font-mono font-medium text-foreground">
                              A
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Name</p>
                            <p className="font-mono font-medium text-foreground">
                              @
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Value</p>
                            <div className="flex items-center gap-2">
                              <p className="font-mono font-medium text-foreground">
                                {aRecordIp}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(aRecordIp, "ip")}
                              >
                                {copiedValue === "ip" ? (
                                  <Check className="h-3 w-3 text-primary" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-muted-foreground">
                          If you also want{" "}
                          <span className="font-medium">www</span> to work, add
                          a CNAME record pointing www to your root domain.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="nameservers">
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-4">
                        Alternatively, point your domain's nameservers to ours
                        for full DNS management.
                      </p>
                      <div className="space-y-3 mb-4">
                        {nameservers.map((ns, index) => (
                          <div
                            key={ns}
                            className="flex items-center justify-between bg-muted rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">
                                NS{index + 1}
                              </span>
                              <span className="font-mono text-sm font-medium text-foreground">
                                {ns}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(ns, ns)}
                            >
                              {copiedValue === ns ? (
                                <Check className="h-3 w-3 text-primary" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-muted-foreground">
                          Nameserver changes can take up to 48 hours to
                          propagate globally.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                3
              </div>
              <h3 className="font-medium text-lg text-foreground">
                Wait for verification
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground mb-4">
                Once configured, return to your Settings page. We'll
                automatically verify your DNS configuration. This usually takes
                a few minutes, but can take up to 48 hours depending on your
                registrar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Card className="flex-1 border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Pending
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Waiting for DNS propagation
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="flex-1 border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Verified
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your domain is connected!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                4
              </div>
              <h3 className="font-medium text-lg text-foreground">
                You're done!
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground">
                Once verified, your wedding website will be live at your custom
                domain. We automatically handle SSL certificates, so your site
                will be secure with HTTPS.
              </p>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <Card className="border-border mb-10">
          <CardHeader>
            <CardTitle className="font-serif text-xl">
              Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">
                Domain stuck on "Pending"?
              </h4>
              <p className="text-sm text-muted-foreground">
                DNS changes can take up to 48 hours to propagate. If it's been
                longer, double-check your DNS records match exactly what's shown
                above. Some registrars require you to remove existing records
                first.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">
                Getting a "DNS_PROBE_FINISHED_NXDOMAIN" error?
              </h4>
              <p className="text-sm text-muted-foreground">
                This usually means DNS hasn't propagated yet. Try clearing your
                browser cache or testing from a different device.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">
                SSL certificate errors?
              </h4>
              <p className="text-sm text-muted-foreground">
                We provision SSL certificates automatically, but this can take
                up to 24 hours after verification. If you're still seeing issues
                after that, contact support.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="mb-10">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-4">
            Related Articles
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/help/customize-subdomain" className="group">
              <Card className="h-full border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Customizing your subdomain
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Learn how to change your free subdomain URL
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/help/dns-configuration" className="group">
              <Card className="h-full border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    DNS configuration guide
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Advanced DNS settings and CNAME setup
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/help/domain-troubleshooting" className="group">
              <Card className="h-full border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Troubleshooting domain issues
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Common problems and how to fix them
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/help/pricing-tiers" className="group">
              <Card className="h-full border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Understanding pricing tiers
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    What's included in each plan
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Helpful CTA */}
        <Card className="border-border bg-muted/30">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h3 className="font-medium text-foreground mb-1">
                  Was this article helpful?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Let us know if you found what you were looking for.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  Yes, thanks!
                </Button>
                <Button variant="outline" size="sm">
                  I need more help
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
