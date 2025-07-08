import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KCNA Exam Simulator - Kubernetes and Cloud Native Associate Practice",
  description:
    "Free KCNA (Kubernetes and Cloud Native Associate) exam simulator with 90 practice questions, 40-minute timer, and detailed explanations. Test your Kubernetes knowledge and prepare for certification.",
  keywords: [
    "KCNA",
    "Kubernetes",
    "Cloud Native",
    "Certification",
    "Exam",
    "Practice",
    "Test",
    "Simulator",
    "CNCF",
    "Container",
    "Orchestration",
    "DevOps",
  ],
  authors: [{ name: "KCNA Exam Simulator" }],
  creator: "KCNA Exam Simulator",
  publisher: "KCNA Exam Simulator",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kcna-exam-sim.vercel.app/",
    title: "KCNA Exam Simulator - Kubernetes Certification Practice",
    description:
      "Free KCNA exam simulator with 90 practice questions, timer, and detailed explanations. Perfect for Kubernetes certification preparation.",
    siteName: "KCNA Exam Simulator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KCNA Exam Simulator - Kubernetes Certification Practice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KCNA Exam Simulator - Kubernetes Certification Practice",
    description:
      "Free KCNA exam simulator with 90 practice questions and detailed explanations. Prepare for your Kubernetes certification.",
    images: ["/og-image.png"],
    creator: "@kcna_simulator",
  },
  alternates: {
    canonical: "https://kcna-exam-sim.vercel.app/",
  },
  category: "Education",
  classification: "Education, Technology, Certification",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kcna-exam-sim.vercel.app/"),
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KCNA Exam" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="KCNA Exam Simulator" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "KCNA Exam Simulator",
              description:
                "Free KCNA (Kubernetes and Cloud Native Associate) exam simulator with practice questions and detailed explanations.",
              url: "https://kcna-exam-sim.vercel.app/",
              sameAs: [],
              educationalCredentialAwarded: "KCNA Certification Preparation",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "KCNA Practice Exams",
                itemListElement: [
                  {
                    "@type": "Course",
                    name: "KCNA Practice Exam",
                    description:
                      "90 questions covering Kubernetes fundamentals, container orchestration, and cloud native technologies",
                    provider: {
                      "@type": "Organization",
                      name: "KCNA Exam Simulator",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
