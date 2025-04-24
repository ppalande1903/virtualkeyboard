import type React from "react"
import type { Metadata } from "next"
import { Quicksand } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { SparklesCore } from "@/components/sparkles"

const quicksand = Quicksand({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Galactic Typist | Eye-Tracking Keyboard Technology",
  description: "Revolutionary eye-tracking keyboard technology for hands-free typing and communication",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={quicksand.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="flex min-h-screen flex-col bg-gradient-to-b from-pink-50 to-white dark:from-pink-950 dark:to-pink-900 overflow-hidden">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <SparklesCore
                id="tsparticlesfullpage"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={10}
                className="h-full w-full"
                particleColor="#FF69B4"
              />
            </div>
            <div className="relative z-10">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
