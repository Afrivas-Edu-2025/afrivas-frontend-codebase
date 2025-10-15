"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { contactInfo } from "./data"

export function ContactSection() {
  return (
    <section id="contact-us" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Contact Us</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            We're here to help you with any questions or concerns.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {contactInfo.map((contact, index) => (
            <Card key={index} className="border-0 shadow-md bg-white dark:bg-gray-900">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${contact.bgColor}`}>
                  <contact.icon className={`h-6 w-6 ${contact.iconColor}`} />
                </div>
                <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-gray-100">
                  {contact.title}
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  {contact.description}
                </p>
                <Link
                  href={contact.href}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  className={`inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none ${contact.buttonColor}`}
                >
                  {contact.action}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <div className="mx-auto mt-16 max-w-2xl">
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Send us a message
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                We'll get back to you as soon as possible.
              </p>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="John Doe"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="john@example.com"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="How can we help you?"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us how we can help you with our platform"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}