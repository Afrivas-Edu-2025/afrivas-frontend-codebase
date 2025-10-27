'use client'
import RadialOrbitalTimeline from "@/components/effect-components/radial-orbital-timeline"
import { Calendar, FileText, Code, User, Clock, BarChart3 } from "lucide-react"
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

const GradientAboutCard = ({ title, description, uppercase = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();

      // Calculate mouse position relative to card center
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      setMousePosition({ x, y });

      // Calculate rotation (limited range for subtle effect)
      const rotateX = -(y / rect.height) * 5; // Max 5 degrees rotation
      const rotateY = (x / rect.width) * 5; // Max 5 degrees rotation

      setRotation({ x: rotateX, y: rotateY });
    }
  };

  // Reset rotation when not hovering
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-[32px] overflow-hidden w-full"
      style={{
        height: "auto",
        minHeight: "300px",
        transformStyle: "preserve-3d",
        backgroundColor: "#0e131f",
        boxShadow: "0 -10px 100px 10px rgba(8, 177, 248, 0.25), 0 0 10px 0 rgba(0, 0, 0, 0.5)",
      }}
      initial={{ y: 0 }}
      animate={{
        y: isHovered ? -5 : 0,
        rotateX: rotation.x,
        rotateY: rotation.y,
        perspective: 1000,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Subtle glass reflection overlay */}
      <motion.div
        className="absolute inset-0 z-35 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.05) 100%)",
          backdropFilter: "blur(2px)",
        }}
        animate={{
          opacity: isHovered ? 0.7 : 0.5,
          rotateX: -rotation.x * 0.2,
          rotateY: -rotation.y * 0.2,
          z: 1,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      />

      {/* Dark background with black gradient like in the image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #000000 70%)",
        }}
        animate={{
          z: -1
        }}
      />

      {/* Noise texture overlay */}
      <motion.div
        className="absolute inset-0 opacity-30 mix-blend-overlay z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        animate={{
          z: -0.5
        }}
      />

      {/* Subtle finger smudge texture for realism */}
      <motion.div
        className="absolute inset-0 opacity-10 mix-blend-soft-light z-11 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='smudge'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01' numOctaves='3' seed='5' stitchTiles='stitch'/%3E%3CfeGaussianBlur stdDeviation='10'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23smudge)'/%3E%3C/svg%3E")`,
          backdropFilter: "blur(1px)",
        }}
        animate={{
          z: -0.25
        }}
      />

      {/* Blue glow effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2/3 z-20"
        style={{
          background: `radial-gradient(circle at 30% 70%, rgba(0, 123, 255, 0.15), rgba(0, 0, 0, 0) 35%), radial-gradient(circle at 70% 20%, rgba(88, 129, 234, 0.15), rgba(0, 0, 0, 0) 45%)`,
          filter: "blur(10px)",
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0.5,
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-30 p-8"
        animate={{
          z: 10
        }}
      >
        <motion.div
          className={`uppercase text-sm font-semibold tracking-widest ${uppercase ? 'text-blue-100' : 'text-blue-200'} mb-2`}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.6 } }}
        >
          {uppercase ? title.toUpperCase() : title}
        </motion.div>

        <motion.h3
          className="text-2xl md:text-3xl font-[500] text-white"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.8 } }}
        >
          {title}
        </motion.h3>

        <motion.p
          className="text-muted-foreground text-sm"
          style={{
            lineHeight: 1.5,
            fontWeight: 350,
            color: 'rgb(156 163 175)'
          }}
          initial={{ filter: "blur(3px)", opacity: 0.7 }}
          animate={{
            textShadow: isHovered ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
            filter: "blur(0px)",
            opacity: 0.85,
            transition: { duration: 1.2, delay: 0.4 }
          }}
        >
          {description}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default function AboutPage() {
    const timelineData = [
  {
    id: 1,
    title: "Classes",
    date: "Jan 2024",
    content: "All your classes in one place.",
    category: "classes",
    icon: Calendar,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Notes",
    date: "Feb 2024",
    content: "All your college notes in one place.",
    category: "Notes",
    icon: FileText,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Assignment",
    date: "Mar 2024",
    content: "All your assignments in one place.",
    category: "Assignment",
    icon: Code,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "Grades",
    date: "Apr 2024",
    content: "All your grades in one place.",
    category: "Grades",
    icon: BarChart3,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 5,
    title: "Tracker",
    date: "May 2024",
    content: "Track your progress and stay organized.",
    category: "Tracker",
    icon: Clock,
    relatedIds: [4],
    status: "pending" as const,
    energy: 10,
  },
];

  return ( 
    <section id="about-us" className="flex justify-center align-center py-16 md:py-24 dark:bg-gray-800 rounded h-auto ">
      <div className="container">
        <h2 className="mb-2 text-3xl font-bold md:text-4xl text-lemon-100">About Us</h2>
        <p className="mb-8 text-muted-foreground">Why Choose Us?</p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {/* Focus Card */}
          <GradientAboutCard 
            title="Focus" 
            description="We focus on creating intuitive tools that enhance communication and collaboration in educational settings, making it easier for students, parents, and educators to work together toward academic success."
            uppercase={true}
          />

          {/* Vision Card */}
          <GradientAboutCard 
            title="Vision" 
            description="Our vision is to transform education through technology, creating a world where every student has the support they need to succeed, and where parents and educators can work together seamlessly."
            uppercase={true}
          />
          
          {/* Mission Card */}
          <GradientAboutCard 
            title="Mission" 
            description="Our mission is to provide innovative solutions that bridge the gap between home and school, empowering all stakeholders in education to communicate effectively and collaborate productively."
            uppercase={false}
          />
        </div>

      
        <RadialOrbitalTimeline timelineData={timelineData} />
      </div>
    </section>
  )
}