"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/effect-components/animated-beam";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

const LecturerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
      fill="#000000"
    />
    <path
      d="M18 8L20 10L18 12L16 10L18 8Z"
      fill="#FFD700"
    />
  </svg>
);

const StudentIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
      fill="#000000"
    />
  </svg>
);

const CourseHubIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      fill="#000000"
    />
    <path
      d="M2 17L12 22L22 17"
      fill="#000000"
    />
    <path
      d="M2 12L12 17L22 12"
      fill="#000000"
    />
  </svg>
);

export function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex h-[600px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-10 md:shadow-xl mt-16"
      ref={containerRef}
    >

      <div className="flex size-full flex-row max-w-2xl max-h-[400px] items-center justify-between gap-10">
       
        {/* Lecturers (Left) */}
        <div className="flex flex-col items-center justify-between h-full">
          <div className="flex flex-col items-center">
            <Circle ref={div1Ref} className="border-blue-500">
              <LecturerIcon />
            </Circle>
            <div className="mt-2 text-center text-sm">
              <p className="font-semibold text-primary">Dr. Alice Turay</p>
              <p className="text-primary">Civic Education</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Circle ref={div2Ref} className="border-primary">
              <LecturerIcon />
            </Circle>
            <div className="mt-2 text-center text-sm">
              <p className="font-semibold text-primary">Prof. John Sesay</p>
              <p className="text-primary">Comp Math</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Circle ref={div3Ref} className="border-primary">
              <LecturerIcon />
            </Circle>
            <div className="mt-2 text-center text-sm">
              <p className="font-semibold text-primary">Dr. Frank Wilson Bio</p>
              <p className="text-primary">Natural Language Processing</p>
            </div>
          </div>
        </div>

        {/* Course Hub (Center) */}
        <div className="flex flex-col items-center">
          <Circle ref={div4Ref} className="size-16 border-green-500">
            <CourseHubIcon />
          </Circle>
          <div className="mt-2 text-center text-sm">
            <p className="font-semibold text-green-500">AFRIVAS</p>
            {/* <p className="text-green-400"></p> */}
          </div>
        </div>

        {/* Students (Right) */}
        <div className="flex flex-col items-center justify-between h-full">
          <div className="flex flex-col items-center">
            <Circle ref={div5Ref} className="border-lemon-100">
              <StudentIcon />
            </Circle>
            <div className="mt-2 text-center text-sm">
              <p className="font-semibold text-lemon-100">Alusine Kamara</p>
              <p className="text-lemon-100">Data Structure</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Circle ref={div6Ref} className="border-lemon-100">
              <StudentIcon />
            </Circle>
            <div className="mt-2 text-center text-sm">
              <p className="font-semibold text-lemon-100">Emma Bangura</p>
              <p className="text-lemon-100/50">Data Science</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Circle ref={div7Ref} className="border-lemon-100">
              <StudentIcon />
            </Circle>
            <div className="mt-2 text-center text-sm">
              <p className="font-semibold text-lemon-100">Grace Jamiru</p>
              <p className="text-lemon-100/50">Social Science</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-50}
        endXOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        curvature={0}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={50}
        endXOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-50}
        endXOffset={10}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        curvature={0}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={50}
        endXOffset={10}
        reverse
      />
    </div>
  );
}