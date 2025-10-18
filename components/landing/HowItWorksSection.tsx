"use client";

import { cn } from "@/lib/utils";
import { User, BookOpen, GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// The props for a single step card
interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

/**
 * A single step card within the "How It Works" section.
 * It displays an icon, title, description, and a list of benefits.
 */
const StepCard: React.FC<StepCardProps> = ({
  icon,
  title,
  description,
  benefits,
}) => (
  <div
    className={cn(
      "relative rounded-2xl border bg-card p-6 text-card-foreground transition-all duration-300 ease-in-out",
      "hover:scale-105 hover:shadow-lg hover:border-primary/50 hover:bg-muted"
    )}
  >
    {/* Icon */}
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-primary">
      {icon}
    </div>
    {/* Title and Description */}
    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
    <p className="mb-6 text-muted-foreground">{description}</p>
    {/* Benefits List */}
    <ul className="space-y-3">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center gap-3">
          <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
          </div>
          <span className="text-muted-foreground">{benefit}</span>
        </li>
      ))}
    </ul>
  </div>
);

export function HowItWorksSection() {
  const stepsData = [
    {
      icon: <User className="h-6 w-6" />,
      title: "Login to Your Account",
      description: "Login with the account credentials sent to your email by your school",
      benefits: [
        "Fast signin process",
        "Secure data protection",
        "Personalized dashboard access",
      ],
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Access Courses and Resources",
      description: "Browse and enroll in courses, assignments, and learning materials designed for your needs.",
      benefits: [
        "Rich content library",
        "Progress tracking tools",
        "Interactive learning modules",
      ],
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Engage and Collaborate",
      description: "Connect with peers, teachers, and parents to discuss, share, and support your educational journey.",
      benefits: [
        "Real-time communication",
        "Group collaboration features",
        "Community forums and events",
      ],
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full bg-background py-16 sm:py-24"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Getting started with Afrivas is simple. Follow these steps to begin your educational journey.
          </p>
        </div>

        {/* Step Indicators with Connecting Line */}
        <div className="relative mx-auto mb-8 w-full max-w-7xl">
          <div
            aria-hidden="true"
            className="absolute left-[25%] top-1/2 h-0.5 w-[75%] -translate-y-1/2 bg-border"
          ></div>
          {/* Use grid to align numbers with the card grid below */}
          <div className="relative grid grid-cols-3">
            {stepsData.map((_, index) => (
              <div
                key={index}
                // Center the number within its grid column
                className="flex h-8 w-8 items-center justify-center justify-self-center rounded-full bg-muted font-semibold text-foreground ring-4 ring-background"
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stepsData.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              benefits={step.benefits}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/auth/signup">
            <Button size="lg" className="gap-2">
              Start Your Journey
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}