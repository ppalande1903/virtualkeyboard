"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accessibility, BookOpen, Gamepad, MessageSquare, ArrowRight, Sparkles } from "lucide-react"

export default function ApplicationsPage() {
  return (
    <div className="container py-12 md:py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text pink-glow">Applications</h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            Discover the many ways Galactic Typist can be used
          </p>
        </div>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        <AnimatedCard>
          <Card className="overflow-hidden border-pink-200 dark:border-pink-800 shadow-xl shadow-pink-200/20 dark:shadow-pink-900/20 card-hover">
            <div className="aspect-video relative bg-gradient-to-br from-pink-300 to-purple-400 dark:from-pink-600 dark:to-purple-700 flex items-center justify-center">
              <Accessibility className="h-16 w-16 text-white" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent"></div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Assistive Technology</h3>
              <p className="text-muted-foreground mb-4">Assistive technology for individuals with motor impairments.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Enables independent communication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Works with existing assistive devices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Customizable for different abilities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Integrates with smart home systems</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.1}>
          <Card className="overflow-hidden border-pink-200 dark:border-pink-800 shadow-xl shadow-pink-200/20 dark:shadow-pink-900/20 card-hover">
            <div className="aspect-video relative bg-gradient-to-br from-pink-300 to-purple-400 dark:from-pink-600 dark:to-purple-700 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-white" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent"></div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Educational Tool</h3>
              <p className="text-muted-foreground mb-4">
                Educational tool for learning to type without physical keyboards.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Gamified learning experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Teaches digital accessibility concepts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Develops focus and concentration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Progress tracking and analytics</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <Card className="overflow-hidden border-pink-200 dark:border-pink-800 shadow-xl shadow-pink-200/20 dark:shadow-pink-900/20 card-hover">
            <div className="aspect-video relative bg-gradient-to-br from-pink-300 to-purple-400 dark:from-pink-600 dark:to-purple-700 flex items-center justify-center">
              <Gamepad className="h-16 w-16 text-white" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent"></div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Gaming Interface</h3>
              <p className="text-muted-foreground mb-4">Gaming interface for gaze-based interaction.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Hands-free game controls</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Enhanced immersion in VR/AR</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Accessible gaming for all abilities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Developer SDK for game integration</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.3}>
          <Card className="overflow-hidden border-pink-200 dark:border-pink-800 shadow-xl shadow-pink-200/20 dark:shadow-pink-900/20 card-hover">
            <div className="aspect-video relative bg-gradient-to-br from-pink-300 to-purple-400 dark:from-pink-600 dark:to-purple-700 flex items-center justify-center">
              <MessageSquare className="h-16 w-16 text-white" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent"></div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Accessibility Feature</h3>
              <p className="text-muted-foreground mb-4">Accessibility feature for hands-free communication.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Medical and clean room environments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Cooking and workshop scenarios</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Multitasking productivity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span className="text-muted-foreground">Integration with messaging platforms</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      <div className="mt-16 text-center">
        <AnimatedSection>
          <div className="relative inline-block">
            <h2 className="text-2xl font-bold mb-4 gradient-text pink-glow">Have a unique application in mind?</h2>
            <div className="absolute -top-4 -right-4 w-8 h-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 opacity-70 animate-ping"></div>
              <div className="absolute inset-1 rounded-full bg-white dark:bg-pink-950 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-pink-500" />
              </div>
            </div>
          </div>
          <p className="max-w-2xl mx-auto mb-8 text-muted-foreground">
            Our developer API and SDK allow for custom integrations and applications. Contact our team to discuss your
            specific needs and how Galactic Typist can be tailored to your use case.
          </p>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300">
            <Link href="/contact" className="flex items-center">
              Contact Our Team
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </AnimatedSection>
      </div>
    </div>
  )
}

function AnimatedCard({ children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedSection({ children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}
