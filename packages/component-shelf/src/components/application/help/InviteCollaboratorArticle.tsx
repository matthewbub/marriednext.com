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
  UserPlus,
  Mail,
  LogIn,
  ChevronRight,
} from "lucide-react";

interface ApplicationInviteCollaboratorArticleProps {
  Link?: ApplicationLinkComponent;
}

export function ApplicationInviteCollaboratorArticle({
  Link = "a",
}: ApplicationInviteCollaboratorArticleProps) {
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
            How Do I Invite My Spouse To My Wedding Website?
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn how to invite your partner or another co-planner to help
            manage your wedding website and guest list together.
          </p>
        </div>

        <Card className="border-border mb-10">
          <CardHeader>
            <CardTitle className="font-serif text-xl">
              What You'll Need
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    A MarriedNext account
                  </span>{" "}
                  — You'll need to be signed in to your account
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Your collaborator's email address
                  </span>{" "}
                  — The email your partner or co-planner will use to create
                  their account
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="mb-10">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-6">
            Step-by-Step Guide
          </h2>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                1
              </div>
              <h3 className="font-medium text-lg text-foreground">
                Sign in or Create an Account
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground mb-4">
                If you haven't already, sign in to your MarriedNext account or
                create a new one at{" "}
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
                Once signed in, navigate to your wedding dashboard by selecting{" "}
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
                Open the Invite Co-Planner Option
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground mb-4">
                Select your user icon from the navigation menu, then choose the{" "}
                <span className="font-medium text-foreground">
                  "Invite Co-Planner"
                </span>{" "}
                button.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                4
              </div>
              <h3 className="font-medium text-lg text-foreground">
                Invite a Collaborator
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground mb-4">
                Select the{" "}
                <span className="font-medium text-foreground">
                  "Invite Collaborator"
                </span>{" "}
                button in the top right corner of the permissions panel.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                5
              </div>
              <h3 className="font-medium text-lg text-foreground">
                Enter Their Email Address
              </h3>
            </div>
            <div className="ml-11">
              <p className="text-muted-foreground mb-4">
                Provide your collaborator's email address in the form and submit
                the invitation. They'll receive an email with instructions to
                join your wedding planning.
              </p>
              <Card className="border-border bg-muted/30">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Tip:</span>{" "}
                    Make sure to use the email address your partner checks
                    regularly, as they'll need to click the invitation link to
                    accept.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-6">
            What Happens Next?
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  They Receive an Email Invitation
                </h4>
                <p className="text-sm text-muted-foreground">
                  Your collaborator will receive an email from MarriedNext with
                  a link to accept the invitation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <LogIn className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  They Create a MarriedNext Account
                </h4>
                <p className="text-sm text-muted-foreground">
                  If they don't already have an account, they'll be prompted to
                  create one at MarriedNext.com using the same email address.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  They Accept the Invitation
                </h4>
                <p className="text-sm text-muted-foreground">
                  Once signed in, they'll be prompted to "Accept Invitation" to
                  join your wedding and gain access to help manage your website
                  and guest list.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-border mb-10">
          <CardHeader>
            <CardTitle className="font-serif text-xl">
              Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">
                They didn't receive the invitation email?
              </h4>
              <p className="text-sm text-muted-foreground">
                Ask them to check their spam or junk folder. If it's not there,
                you can resend the invitation from the permissions panel.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">
                The invitation link expired?
              </h4>
              <p className="text-sm text-muted-foreground">
                Invitations are valid for 7 days. If the link has expired,
                simply send a new invitation from your dashboard.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">
                They already have an account with a different email?
              </h4>
              <p className="text-sm text-muted-foreground">
                The invitation must be sent to the same email address associated
                with their MarriedNext account. Either update the invitation to
                match their existing account email, or have them sign up with
                the email you invited.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-10">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-4">
            Related Articles
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
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
            <Link href="/help/customizing-website" className="group">
              <Card className="h-full border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Customizing your website
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tips for personalizing your wedding website
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
