import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-5xl w-full mb-4 mt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Simple Pricing</h1>
          <p className="text-stone-600 text-lg">
            Choose the plan that works best for your special day
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="relative bg-white/50 backdrop-blur-md border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Self Service</CardTitle>
              <CardDescription className="text-lg">
                Perfect for couples who want to manage their own wedding website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-5xl font-bold">$9</span>
                <span className="text-stone-600 text-lg"> / year</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Manage your guest list</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Registry tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Basic templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-violet-700 hover:bg-violet-800">
                Get Started
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative bg-white/50 backdrop-blur-md border-violet-300 border-2 shadow-xl">
            <div className="absolute top-0 right-0 bg-violet-700 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
              Popular
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Custom</CardTitle>
              <CardDescription className="text-lg">
                Fully customized website tailored to your vision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-5xl font-bold">$299</span>
                <span className="text-stone-600 text-lg"> / year</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Everything in Self Service</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Custom design and branding</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Advanced features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Dedicated consultation</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-violet-700 hover:bg-violet-800">
                Contact Us
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="text-violet-700 hover:text-violet-800 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
