import React from "react";
import { BarChart, Calendar, Globe, Mail, MapPin, MessageCircle, Phone, Shield, Users, Box, Settings, Lock, Sparkles, Search } from "lucide-react";

export const features = [
  {
    area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]",
    icon: React.createElement(MessageCircle, { className: "h-4 w-4" }),
    title: "Real-time Communication",
    description: "Instant messaging and notifications between students, parents, and teachers.",
  },
  {
    area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]",
    icon: React.createElement(BarChart, { className: "h-4 w-4" }),
    title: "Progress Tracking",
    description:
      "Monitor student performance and attendance in real-time.",
  },
  {
    area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]",
    icon: React.createElement(Users, { className: "h-4 w-4" }),
    title: "Resource Sharing",
    description: "Easy sharing of educational materials and assignments.",
  },
  {
    area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]",
    icon: React.createElement(Shield, { className: "h-4 w-4" }),
    title: "Secure Platform",
    description:
      "End-to-end encryption and privacy protection for all users.",
  },
  {
    area: "md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]",
    icon: React.createElement(Globe, { className: "h-4 w-4" }),
    title: "Global Access",
    description: "Access your educational resources from anywhere in the world",
  },
];

export const featuresOld = [
  {
    title: "Real-time Communication",
    description: "Instant messaging and notifications between students, parents, and teachers.",
    icon: MessageCircle,
  },
  {
    title: "Progress Tracking",
    description: "Monitor student performance and attendance in real-time.",
    icon: BarChart,
  },
  {
    title: "Resource Sharing",
    description: "Easy sharing of educational materials and assignments.",
    icon: Users,
  },
  {
    title: "Secure Platform",
    description: "End-to-end encryption and privacy protection for all users.",
    icon: Shield,
  },
  {
    title: "Global Access",
    description: "Access your educational resources from anywhere in the world.",
    icon: Globe,
  },
]

export const steps = [
  {
    title: "Sign Up",
    description: "Create your account and choose your role (student, parent, or teacher).",
  },
  {
    title: "Set Up Profile",
    description: "Complete your profile with relevant information and preferences.",
  },
  {
    title: "Connect",
    description: "Link with other users and join relevant groups or classes.",
  },
  {
    title: "Start Learning",
    description: "Begin using the platform's features to enhance your educational experience.",
  },
]

  export const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Thompson",
      designation: "VP of Technology at FutureNet",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

export const testimonialsOld = [
  {
    name: "Sarah Johnson",
    role: "Parent",
    content:
      "Afrivas has transformed how I stay connected with my child's education. The real-time updates and easy communication with teachers are invaluable.",
    avatar: "/placeholder.svg?height=64&width=64",
  },
  {
    name: "Michael Chen",
    role: "Teacher",
    content:
      "As an educator, I appreciate how Afrivas streamlines communication and resource sharing. It's made my job much more efficient.",
    avatar: "/placeholder.svg?height=64&width=64",
  },
  {
    name: "Emily Rodriguez",
    role: "Student",
    content:
      "I love how easy it is to access my assignments and communicate with my teachers. Afrivas has made learning more engaging.",
    avatar: "/placeholder.svg?height=64&width=64",
  },
]

export const faqs = [
  {
    question: "How do I get started with Afrivas?",
    answer:
      "Simply sign up for an account, choose your role (student, parent, or teacher), and follow the setup wizard to complete your profile.",
      meta: "Getting Started"
  },
  {
    question: "Is Afrivas secure for educational use?",
    answer:
      "Yes, we use industry-standard encryption and security measures to protect all user data and communications.",
      meta: "Security"
  },
  {
    question: "Can I access Afrivas on mobile devices?",
    answer: "Afrivas is fully responsive and works on all devices, including smartphones and tablets.",
      meta: "Mobile Access"
  },
  {
    question: "How much does Afrivas cost?",
    answer:
      "We offer various pricing plans to suit different needs. Contact our sales team for detailed pricing information.",
      meta: "Pricing"
  },
  {
    question: "What kind of support is available?",
    answer:
      "We provide 24/7 customer support through email, chat, and phone. Our knowledge base also contains helpful guides and tutorials.",
      meta: "Support"
  },
]

export const contactInfo = [
  {
    title: "Give us a call",
    description: "We're available Monday to Friday, 9am to 5pm.",
    icon: Phone,
    action: "Call Us",
    href: "tel:+1234567890",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    buttonColor: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
  },
  {
    title: "Send an email",
    description: "We'll get back to you within 24 hours.",
    icon: Mail,
    action: "Email Us",
    href: "mailto:info@example.com",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    buttonColor: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
  },
  {
    title: "Visit our office",
    description: "123 Education St, Tech City, TC 12345",
    icon: MapPin,
    action: "Get Directions",
    href: "https://maps.google.com",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    buttonColor: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
  },
]