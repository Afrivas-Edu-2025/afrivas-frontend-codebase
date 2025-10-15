"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function UserRolesSection() {
  const [activeTab, setActiveTab] = useState("students")

  return (
    <section id="roles" className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Tailored for Everyone in Education
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Afrivas provides specialized features for each role in the educational ecosystem.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="parents">Parents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students" className="mt-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">For Students</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Access all your courses, assignments, and grades in one place. Stay organized and connected with
                  your teachers and peers.
                </p>
                <ul className="space-y-3">
                  {[
                    "Track your academic progress in real-time",
                    "Submit assignments and receive feedback",
                    "Access learning resources anytime, anywhere",
                    "Communicate with teachers and classmates",
                    "Get notified about important deadlines",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/student/signup">
                  <Button className="mt-4">Sign Up as Student</Button>
                </Link>
              </div>
              <div className="relative mx-auto">
                <div className="relative rounded-2xl overflow-hidden border-8 border-gray-800 shadow-xl max-w-xs mx-auto">
                  <Image
                    src="/images/STUDENT.png"
                    width={300}
                    height={600}
                    alt="Student dashboard"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="teachers" className="mt-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">For Teachers</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your classes, track student performance, and communicate with students and parents
                  efficiently.
                </p>
                <ul className="space-y-3">
                  {[
                    "Create and manage assignments and assessments",
                    "Track student attendance and participation",
                    "Communicate with students and parents",
                    "Share learning resources and materials",
                    "Generate performance reports and analytics",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/teacher/login">
                  <Button className="mt-4">Sign Up as Teacher</Button>
                </Link>
              </div>
              <div className="relative mx-auto">
                <div className="relative rounded-2xl overflow-hidden border-8 border-gray-800 shadow-xl max-w-xs mx-auto">
                  <Image
                    src="/images/DASHBOARD.png"
                    width={300}
                    height={600}
                    alt="Teacher dashboard"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="parents" className="mt-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">For Parents</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Stay informed about your child's education. Monitor progress, communicate with teachers, and
                  support learning.
                </p>
                <ul className="space-y-3">
                  {[
                    "Monitor your child's academic progress",
                    "View attendance and assignment completion",
                    "Communicate directly with teachers",
                    "Receive notifications about important events",
                    "Access school announcements and updates",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup">
                  <Button className="mt-4">Sign Up as Parent</Button>
                </Link>
              </div>
              <div className="relative mx-auto">
                <div className="relative rounded-2xl overflow-hidden border-8 border-gray-800 shadow-xl max-w-xs mx-auto">
                  <Image
                    src="/placeholder.svg?height=600&width=300"
                    width={300}
                    height={600}
                    alt="Parent dashboard"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}