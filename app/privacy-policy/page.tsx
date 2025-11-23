"use client"

import React from "react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800/90 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 md:p-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This page provides an overview of how Afrivas collects, uses, and protects personal and academic
            information on the platform.
          </p>
        </header>

        <section className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
          <h2 className="text-lg font-semibold">1. Data We Collect</h2>
          <p>
            Afrivas processes information that is necessary to create and manage user accounts and to deliver
            academic and administrative services. This typically includes identification details, academic
            records, institutional affiliations, and usage information generated when you use the platform.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
          <h2 className="text-lg font-semibold">2. How We Use Your Data</h2>
          <p>
            Your information is used to authenticate you, authorize your access to relevant features, personalize
            your experience, support academic workflows, and comply with institutional and legal obligations.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
          <h2 className="text-lg font-semibold">3. Access and Disclosure</h2>
          <p>
            Access to your data is limited to you and authorized staff at your institution who require it to
            perform their academic or administrative duties. Afrivas does not sell your personal data.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
          <h2 className="text-lg font-semibold">4. Security Measures</h2>
          <p>
            We use technical and organizational safeguards designed to protect your information from unauthorized
            access, alteration, or loss. You are responsible for keeping your login credentials secure.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
          <h2 className="text-lg font-semibold">5. Your Choices</h2>
          <p>
            Depending on your institution&apos;s policies and applicable law, you may have rights to access, correct,
            or request deletion of certain data. Please contact your institution or Afrivas support for more
            information.
          </p>
        </section>

        <footer className="pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          This Privacy Policy is a high-level summary. For institution-specific details and the full legal terms,
          please refer to the official documentation shared by your institution.
        </footer>
      </div>
    </div>
  )
}
