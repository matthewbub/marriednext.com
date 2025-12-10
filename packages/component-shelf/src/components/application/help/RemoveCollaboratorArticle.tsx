"use client";

import type { ApplicationLinkComponent } from "../link-types";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  ArrowLeft,
  Users,
  Clock,
  CheckCircle2,
  UserMinus,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";

interface ApplicationRemoveCollaboratorArticleProps {
  Link?: ApplicationLinkComponent;
}

export function ApplicationRemoveCollaboratorArticle({
  Link = "a",
}: ApplicationRemoveCollaboratorArticleProps) {
  return (
    <div className="py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/help"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Link>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">
              <Users className="h-3 w-3 mr-1" />
              Getting Started
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />2 min read
            </Badge>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
            How Do I Remove Someone From My Wedding Website?
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn how to remove a collaborator's access to your wedding website
            and guest list, or revoke a pending invitation.
          </p>
        </div>

        <Card className="border-amber-200 bg-amber-50/50 mb-10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">
                  This Action is Immediate
                </h3>
                <p className="text-sm text-muted-foreground">
                  When you remove a collaborator, they will immediately lose
                  access to your wedding website and guest list. They will not
                  be notified, but they will see an error if they try to access
                  the dashboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-10">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-6">
            Removing an Active Collaborator
          </h2>
          <p className="text-muted-foreground mb-6">
            Follow these steps to remove someone who has already accepted your
            invitation and has access to your wedding.
          </p>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                1
              </div>
              <h3 className="font-medium text-lg text-foreground">
                Sign in to Your Account
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground mb-4">
                Sign in to your MarriedNext account at{" "}
                <Link
                  href="https://marriednext.com"
                  className="text-primary hover:underline"
                >
                  marriednext.com
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                2
              </div>
              <h3 className="font-medium text-lg text-foreground">
                Go to "My Wedding"
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground mb-4">
                Navigate to your wedding dashboard by selecting{" "}
                <span className="font-medium text-foreground">
                  "My Wedding"
                </span>{" "}
                from the main navigation.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                3
              </div>
              <h3 className="font-medium text-lg text-foreground">
                Open the Permissions Panel
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground mb-4">
                Select your user icon from the navigation menu, then choose the{" "}
                <span className="font-medium text-foreground">
                  "Invite Co-Planner"
                </span>{" "}
                button to access the permissions panel.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                4
              </div>
              <h3 className="font-medium text-lg text-foreground">
                Find the Collaborator
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground mb-4">
                Scroll down to the{" "}
                <span className="font-medium text-foreground">
                  "Collaborators"
                </span>{" "}
                section. You'll see a list of everyone who currently has access
                to your wedding.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                5
              </div>
              <h3 className="font-medium text-lg text-foreground">
                Open the Options Menu
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground mb-4">
                Click the three-dot menu{" "}
                <span className="inline-flex items-center justify-center w-6 h-6 rounded border border-border bg-muted">
                  <MoreVertical className="h-3 w-3" />
                </span>{" "}
                next to the collaborator you want to remove.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                6
              </div>
              <h3 className="font-medium text-lg text-foreground">
                Select "Remove Collaborator"
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground mb-4">
                Click{" "}
                <span className="font-medium text-foreground">
                  "Remove Collaborator"
                </span>{" "}
                from the dropdown menu.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                7
              </div>
              <h3 className="font-medium text-lg text-foreground">
                Confirm Removal
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground mb-4">
                A confirmation dialog will appear. Click{" "}
                <span className="font-medium text-foreground">"Remove"</span> to
                confirm. The collaborator will immediately lose access to your
                wedding.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-6">
            Revoking a Pending Invitation
          </h2>
          <p className="text-muted-foreground mb-6">
            If someone hasn't accepted your invitation yet, you can revoke it to
            prevent them from joining.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Navigate to the Permissions Panel
                </h4>
                <p className="text-sm text-muted-foreground">
                  Follow steps 1-3 above to access the permissions panel.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Find the Pending Invitation
                </h4>
                <p className="text-sm text-muted-foreground">
                  Look for the "Pending Invitations" section. Pending
                  invitations are shown with an amber "PENDING" badge.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Revoke the Invitation
                </h4>
                <p className="text-sm text-muted-foreground">
                  Click the three-dot menu next to the invitation and select
                  "Revoke Invitation". Confirm in the dialog that appears.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-border mb-10">
          <CardHeader>
            <CardTitle className="font-serif text-xl">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">
                Will they be notified when I remove them?
              </h4>
              <p className="text-sm text-muted-foreground">
                No, collaborators are not automatically notified when removed.
                However, they will see an error if they try to access your
                wedding dashboard.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">
                Can I re-invite someone after removing them?
              </h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can send a new invitation to anyone you've previously
                removed. They'll need to accept the new invitation to regain
                access.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">
                What happens to changes they made?
              </h4>
              <p className="text-sm text-muted-foreground">
                All changes made by the collaborator (guest list edits, website
                updates, etc.) will remain. Removing them only prevents future
                access.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">
                Can I remove myself from a wedding?
              </h4>
              <p className="text-sm text-muted-foreground">
                No, you cannot remove yourself. If you're a collaborator on
                someone else's wedding, you'll need to ask the wedding owner to
                remove you.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-10">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-4">
            Related Articles
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/help/invite-collaborator" className="group">
              <Card className="h-full border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Inviting your spouse or co-planner
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Learn how to invite collaborators to help manage your
                    wedding
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/help/adding-guests" className="group">
              <Card className="h-full border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Adding guests and invitations
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Learn how to add guests to your wedding guest list
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

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
