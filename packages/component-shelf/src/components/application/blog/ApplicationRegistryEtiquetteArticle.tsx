import type { ApplicationLinkComponent } from "../link-types";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Gift,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Share2,
  Bookmark,
  ChevronRight,
} from "lucide-react";

interface ApplicationRegistryEtiquetteArticleProps {
  Link?: ApplicationLinkComponent;
}

export function ApplicationRegistryEtiquetteArticle({
  Link = "a",
}: ApplicationRegistryEtiquetteArticleProps) {
  return (
    <div className="pt-24 pb-16 px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">
              <Gift className="h-3 w-3 mr-1" />
              Etiquette
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />8 min read
            </Badge>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-4 text-balance">
            The Complete Guide to Wedding Registry Etiquette
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Everything you need to know about creating a thoughtful registry
            that works for you and your guests — from timing to thank-you notes.
          </p>
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                November 25, 2025
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Video Section */}
        <div className="mb-10">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Wedding Registry Etiquette Guide"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            Watch our quick guide to registry etiquette (4:12)
          </p>
        </div>

        {/* Article Content */}
        <article className="prose prose-slate max-w-none">
          {/* Intro */}
          <p className="text-lg text-muted-foreground leading-relaxed">
            Creating a wedding registry can feel awkward — you're essentially
            making a list of things you want people to buy you. But here's the
            thing: guests <em>want</em> to give you something meaningful. A
            thoughtful registry actually makes their lives easier and ensures
            you receive gifts you'll genuinely use and love.
          </p>

          {/* Quick Tips Card */}
          <Card className="my-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-serif text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Quick Registry Etiquette Rules
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">
                    Register 6-8 months before the wedding
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">
                    Include items at various price points ($25 to $250+)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">
                    Never include registry info on the invitation itself
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">
                    Send thank-you notes within 2-3 weeks of receiving gifts
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 1 */}
          <h2 className="font-serif text-2xl font-medium text-foreground mt-10 mb-4">
            When to Create Your Registry
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The ideal time to set up your registry is{" "}
            <strong className="text-foreground">
              6-8 months before your wedding
            </strong>
            . This gives you enough time to thoughtfully curate your list before
            engagement parties and bridal showers, where guests often start
            purchasing gifts.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            If you're having an engagement party, try to have at least a basic
            registry ready. You don't need everything finalized — you can (and
            should) add items as you think of them. Just make sure there are
            enough options across different price ranges.
          </p>

          {/* Section 2 */}
          <h2 className="font-serif text-2xl font-medium text-foreground mt-10 mb-4">
            How Many Items Should You Register For?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A good rule of thumb is to register for{" "}
            <strong className="text-foreground">
              2-3 items per invited guest
            </strong>
            . If you're inviting 100 guests, aim for 200-300 items. This sounds
            like a lot, but remember:
          </p>
          <ul className="space-y-2 my-4">
            <li className="flex items-start gap-3">
              <ChevronRight className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">
                Some guests will buy multiple smaller items
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ChevronRight className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">
                Guests from different events (shower vs. wedding) may both give
                gifts
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ChevronRight className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">
                You want options remaining even close to the wedding date
              </span>
            </li>
          </ul>

          {/* Price Range Card */}
          <Card className="my-8 border-border">
            <CardContent className="p-6">
              <h3 className="font-serif text-lg font-medium text-foreground mb-4">
                Suggested Price Distribution
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Under $50</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-[40%] h-full bg-primary rounded-full" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      40%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">$50 - $100</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-[30%] h-full bg-primary rounded-full" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      30%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">$100 - $200</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-[20%] h-full bg-primary rounded-full" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      20%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">$200+</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-[10%] h-full bg-primary rounded-full" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      10%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <h2 className="font-serif text-2xl font-medium text-foreground mt-10 mb-4">
            How to Share Your Registry (Without Being Tacky)
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The golden rule:{" "}
            <strong className="text-foreground">
              never include registry information on your wedding invitation
            </strong>
            . The invitation is about celebrating your union, not soliciting
            gifts.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Instead, here are appropriate ways to share your registry:
          </p>

          <div className="space-y-4 my-6">
            <Card className="border-border">
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground mb-1">
                  Your Wedding Website
                </h4>
                <p className="text-sm text-muted-foreground">
                  This is the most common and accepted place. Add a dedicated
                  "Registry" page with links to each store.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground mb-1">
                  Shower Invitations
                </h4>
                <p className="text-sm text-muted-foreground">
                  It's acceptable (even expected) to include registry info on
                  bridal shower invitations since the event is specifically
                  about gifts.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground mb-1">
                  Word of Mouth
                </h4>
                <p className="text-sm text-muted-foreground">
                  Let your parents, wedding party, and close friends know. They
                  can share when guests ask (and guests will ask).
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Warning Card */}
          <Card className="my-8 border-amber-200 bg-amber-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    What About Cash Funds?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Cash or honeymoon funds are increasingly common, but some
                    guests (especially older relatives) may feel uncomfortable
                    giving cash. Consider offering both traditional items and a
                    fund option. Frame it positively: "Your presence is gift
                    enough, but for those who have asked, we've registered
                    at..." rather than directly asking for money.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <h2 className="font-serif text-2xl font-medium text-foreground mt-10 mb-4">
            The Thank-You Note Timeline
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Thank-you notes are non-negotiable. Here's the timeline:
          </p>
          <ul className="space-y-2 my-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">
                <strong className="text-foreground">Pre-wedding gifts:</strong>{" "}
                Send within 2 weeks of receiving
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">
                <strong className="text-foreground">Wedding day gifts:</strong>{" "}
                Send within 3 months after the wedding
              </span>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Each note should be handwritten and specific. Mention the actual
            gift and how you plan to use it. Generic "thank you for the gift"
            messages feel impersonal.
          </p>

          {/* Section 5 */}
          <h2 className="font-serif text-2xl font-medium text-foreground mt-10 mb-4">
            Handling Duplicate or Unwanted Gifts
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Despite your best registry efforts, you may receive duplicates or
            off-registry items that don't suit your taste. Here's how to handle
            it gracefully:
          </p>
          <ul className="space-y-2 my-4">
            <li className="flex items-start gap-3">
              <ChevronRight className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">
                <strong className="text-foreground">
                  Always send a thank-you note
                </strong>{" "}
                — enthusiasm for the gift itself is optional, gratitude for the
                thought is not
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ChevronRight className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">
                <strong className="text-foreground">Return discreetly</strong> —
                most stores allow returns, and what the giver doesn't know won't
                hurt them
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ChevronRight className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">
                <strong className="text-foreground">
                  Re-gift thoughtfully
                </strong>{" "}
                — if you can't return it, someone else might love it (just keep
                track so you don't re-gift to the original giver)
              </span>
            </li>
          </ul>

          {/* Final Tips */}
          <h2 className="font-serif text-2xl font-medium text-foreground mt-10 mb-4">
            Final Thoughts
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The most important thing to remember is that a registry is a
            kindness to your guests, not a demand. People want to celebrate your
            marriage with something meaningful. By creating a thoughtful,
            well-organized registry, you're helping them do exactly that.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            And remember — some guests will go off-registry no matter what.
            Accept it graciously, send a heartfelt thank-you, and move on. In
            five years, you won't remember the duplicate toaster. You'll
            remember the love and support that surrounded your wedding.
          </p>
        </article>

        {/* Author / CTA */}
        <Card className="mt-12 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6 md:p-8">
            <div className="text-center">
              <Gift className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                Ready to Build Your Wedding Website?
              </h3>
              <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
                Married Next makes it easy to share your registry, collect
                RSVPs, and keep guests informed — all in one beautiful, free
                platform.
              </p>
              <Button asChild>
                <Link href="/">
                  Get Started Free
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        <div className="mt-12">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-6">
            Related Articles
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/blog/rsvp-follow-up" className="group">
              <Card className="h-full border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-3 text-xs">
                    Etiquette
                  </Badge>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                    How to Follow Up on Missing RSVPs (Politely)
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Scripts and strategies for getting those final headcounts.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/blog/budget-wedding-tips" className="group">
              <Card className="h-full border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-3 text-xs">
                    Budget
                  </Badge>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                    Planning a Beautiful Wedding on a Budget
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Where to splurge, where to save, and how to prioritize.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
