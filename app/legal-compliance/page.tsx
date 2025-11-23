"use client"

import React from "react"

export default function LegalCompliancePage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800/90 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 md:p-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Legal Compliance</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This page summarizes key legal and regulatory obligations relevant to the use of the Afrivas platform.
          </p>
        </header>

        <section className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
          <h2 className="text-lg font-semibold">1. Lawful Basis for Processing</h2>
          <p>
            Afrivas operates in cooperation with educational institutions and processes personal data on the basis
            of contractual necessity, legitimate interests in providing educational services, and compliance with
            applicable legal and regulatory requirements.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
          <h2 className="text-lg font-semibold">2. Institutional Responsibilities</h2>
          <p>
            Institutions using Afrivas remain responsible for defining how the platform is used within their
            programs, determining data retention periods, and ensuring that their use of the platform aligns with
            local education, privacy, and record-keeping laws.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
          <h2 className="text-lg font-semibold">3. User Responsibilities</h2>
          <p>
            Users must access the platform only with authorized credentials, respect confidentiality of academic
            records, and follow their institution&apos;s policies and any applicable codes of conduct when using the
            system.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
          <h2 className="text-lg font-semibold">4. Data Retention and Audit</h2>
          <p>
            Activity on the platform may be logged for security, audit, and academic integrity purposes. Retention
            periods are determined by institutional policy and applicable law.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
          <h2 className="text-lg font-semibold">5. Changes and Updates</h2>
          <p>
            Legal and regulatory requirements may evolve over time. Institutions and Afrivas may update their
            practices and documentation to remain compliant, and users may be asked to review updated terms.
          </p>
        </section>

        <footer className="pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          This Legal Compliance summary does not replace the full legal documentation. Please refer to the official
          institutional terms, policies, and agreements for authoritative requirements.
        </footer>
      </div>
    </div>
  )
}
