"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
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
  Check,
  CreditCard,
  Download,
  ExternalLink,
  Sparkles,
  Globe,
  Camera,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";

// Mock data - would come from DB in real app
const currentPlan = {
  name: "Free",
  features: [
    "Beautiful wedding website",
    "Guest list management",
    "RSVP tracking",
    "Seating chart planner",
    "Memory uploads (500MB)",
    "5 free templates",
  ],
};

const subscriptions = [
  {
    id: "sub_1",
    name: "Custom Domain",
    description: "yourdomain.com",
    price: 49,
    period: "year",
    status: "active",
    nextBilling: "June 15, 2025",
    startDate: "June 15, 2024",
  },
];

const oneTimePurchases = [
  {
    id: "purchase_1",
    name: "Premium Templates Pack",
    description: "Access to 25+ premium templates",
    price: 29,
    purchaseDate: "December 10, 2024",
    status: "active",
  },
];

const paymentHistory = [
  {
    id: "inv_003",
    date: "December 10, 2024",
    description: "Premium Templates Pack",
    amount: 29,
    status: "paid",
  },
  {
    id: "inv_002",
    date: "June 15, 2024",
    description: "Custom Domain - Annual",
    amount: 49,
    status: "paid",
  },
  {
    id: "inv_001",
    date: "June 10, 2024",
    description: "Premium Templates Pack",
    amount: 29,
    status: "refunded",
  },
];

const paymentMethods = [
  {
    id: "pm_1",
    type: "visa",
    last4: "4242",
    expiry: "12/26",
    isDefault: true,
  },
];

const availableUpgrades = [
  {
    id: "premium",
    name: "Premium",
    price: 29,
    period: "one-time",
    icon: Sparkles,
    description: "Unlock premium templates and extra storage",
    features: [
      "25+ premium templates",
      "10GB memory storage",
      "Remove branding",
      "Priority support",
    ],
    purchased: true,
  },
  {
    id: "custom-domain",
    name: "Custom Domain",
    price: 49,
    period: "per year",
    icon: Globe,
    description: "Your wedding site on your own domain",
    features: [
      "Custom domain hosting",
      "SSL certificate",
      "50GB memory storage",
      "Custom email addresses",
    ],
    purchased: true,
  },
  {
    id: "storage-boost",
    name: "Storage Boost",
    price: 19,
    period: "one-time",
    icon: Camera,
    description: "Add 25GB more storage for memories",
    features: [
      "Additional 25GB storage",
      "Never lose a photo",
      "Stack with other purchases",
    ],
    purchased: false,
  },
];

export function ApplicationBillingSettings() {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<
    string | null
  >(null);

  const handleCancelSubscription = (subId: string) => {
    setSelectedSubscription(subId);
    setCancelDialogOpen(true);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="font-serif text-xl">Current Plan</CardTitle>
              <CardDescription>
                Your active plan and included features
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {currentPlan.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {currentPlan.features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">
            Active Subscriptions
          </CardTitle>
          <CardDescription>Recurring payments for your account</CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-secondary/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">
                          {sub.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-xs bg-accent/20 text-accent-foreground border-accent/30"
                        >
                          Active
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {sub.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Next billing: {sub.nextBilling} · ${sub.price}/
                        {sub.period}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-shrink-0">
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleCancelSubscription(sub.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No active subscriptions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* One-Time Purchases */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">
            One-Time Purchases
          </CardTitle>
          <CardDescription>
            Features you've purchased permanently
          </CardDescription>
        </CardHeader>
        <CardContent>
          {oneTimePurchases.length > 0 ? (
            <div className="space-y-4">
              {oneTimePurchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-secondary/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">
                          {purchase.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-xs bg-accent/20 text-accent-foreground border-accent/30"
                        >
                          Lifetime
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {purchase.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Purchased: {purchase.purchaseDate} · ${purchase.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No one-time purchases yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Upgrades */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">
            Available Upgrades
          </CardTitle>
          <CardDescription>
            Enhance your wedding planning experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {availableUpgrades.map((upgrade) => (
              <div
                key={upgrade.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border ${
                  upgrade.purchased
                    ? "border-primary/30 bg-primary/5"
                    : "border-border"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      upgrade.purchased ? "bg-primary/20" : "bg-secondary"
                    }`}
                  >
                    <upgrade.icon
                      className={`h-5 w-5 ${
                        upgrade.purchased
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">
                        {upgrade.name}
                      </h4>
                      {upgrade.purchased && (
                        <Badge className="text-xs bg-primary text-primary-foreground">
                          <Check className="h-3 w-3 mr-1" />
                          Purchased
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {upgrade.description}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                      {upgrade.features.slice(0, 2).map((feature) => (
                        <span
                          key={feature}
                          className="text-xs text-muted-foreground flex items-center gap-1"
                        >
                          <Check className="h-3 w-3 text-primary" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:flex-shrink-0">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ${upgrade.price}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {upgrade.period}
                    </p>
                  </div>
                  {!upgrade.purchased && (
                    <Button size="sm" className="whitespace-nowrap">
                      Purchase
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="font-serif text-xl">
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your saved payment methods
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-14 rounded bg-secondary flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground capitalize">
                          {method.type} •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expiry}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No payment methods saved</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="font-serif text-xl">
                Payment History
              </CardTitle>
              <CardDescription>View and download your invoices</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block">
                    <p className="text-sm text-muted-foreground w-28">
                      {payment.date}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {payment.description}
                    </p>
                    <p className="text-xs text-muted-foreground sm:hidden">
                      {payment.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      ${payment.amount}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        payment.status === "paid"
                          ? "bg-accent/20 text-accent-foreground border-accent/30"
                          : payment.status === "refunded"
                          ? "bg-muted text-muted-foreground"
                          : "bg-amber-500/20 text-amber-700 border-amber-500/30"
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">
              Cancel Subscription?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your Custom Domain subscription?
              Your domain will remain active until the end of your current
              billing period.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">What happens when you cancel:</p>
              <ul className="mt-2 space-y-1 text-amber-700">
                <li>
                  • Your custom domain will stop working after June 15, 2025
                </li>
                <li>• Your site will revert to a marriednext.com subdomain</li>
                <li>• You can resubscribe anytime to restore your domain</li>
              </ul>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={() => setCancelDialogOpen(false)}
            >
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
