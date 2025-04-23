"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Keyboard, Sparkles, Volume2, Star, Heart } from "lucide-react"

export default function UsagePage() {
  return (
    <div className="container py-12 md:py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text pink-glow">
            How to Use Galactic Typist
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            Master the eye-tracking keyboard with these simple instructions
          </p>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AnimatedCard>
          <Card className="border-pink-200 dark:border-pink-800 shadow-lg shadow-pink-200/20 dark:shadow-pink-900/20 overflow-hidden card-hover">
            <div className="h-2 bg-gradient-to-r from-pink-400 to-purple-500"></div>
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Eye Movement</h3>
              <p className="text-muted-foreground">
                Look left or right to navigate between keys or suggestions. The system tracks your eye movements to
                determine which key you're focusing on.
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.1}>
          <Card className="border-pink-200 dark:border-pink-800 shadow-lg shadow-pink-200/20 dark:shadow-pink-900/20 overflow-hidden card-hover">
            <div className="h-2 bg-gradient-to-r from-pink-400 to-purple-500"></div>
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-4">
                <Keyboard className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Key Selection</h3>
              <p className="text-muted-foreground">
                Blink deliberately to select a key or suggestion. The system distinguishes between natural blinks and
                intentional selection blinks.
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <Card className="border-pink-200 dark:border-pink-800 shadow-lg shadow-pink-200/20 dark:shadow-pink-900/20 overflow-hidden card-hover">
            <div className="h-2 bg-gradient-to-r from-pink-400 to-purple-500"></div>
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Word Suggestions</h3>
              <p className="text-muted-foreground">
                Use the "S" key to toggle suggestion mode for word predictions. Use the "Yes" key to accept the top
                suggested word and save time typing.
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.3}>
          <Card className="border-pink-200 dark:border-pink-800 shadow-lg shadow-pink-200/20 dark:shadow-pink-900/20 overflow-hidden card-hover">
            <div className="h-2 bg-gradient-to-r from-pink-400 to-purple-500"></div>
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-4">
                <Volume2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Text-to-Speech</h3>
              <p className="text-muted-foreground">
                Use the "🔊" key to read the typed text aloud. This feature helps verify what you've typed and enables
                vocal communication.
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      <div className="mt-12 space-y-8">
        <AnimatedSection>
          <h2 className="text-2xl font-bold tracking-tighter gradient-text pink-glow">Detailed Instructions</h2>
        </AnimatedSection>

        <div className="space-y-4">
          <AnimatedCard>
            <div className="border border-pink-200 dark:border-pink-800 rounded-lg p-6 bg-white/50 dark:bg-pink-950/50 backdrop-blur-sm shadow-lg shadow-pink-200/20 dark:shadow-pink-900/20">
              <div className="flex items-center mb-4">
                <div className="rounded-full w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mr-3">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-pink-600 dark:text-pink-400">Getting Started</h3>
              </div>
              <ol className="space-y-3 list-decimal list-inside">
                <li className="text-muted-foreground">
                  Position yourself in front of your webcam, ensuring your face is clearly visible
                </li>
                <li className="text-muted-foreground">
                  Complete the quick calibration process by following the on-screen prompts
                </li>
                <li className="text-muted-foreground">
                  Start by practicing with simple words to get comfortable with the eye tracking
                </li>
                <li className="text-muted-foreground">
                  Gradually increase your typing speed as you become more familiar with the system
                </li>
              </ol>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.1}>
            <div className="border border-pink-200 dark:border-pink-800 rounded-lg p-6 bg-white/50 dark:bg-pink-950/50 backdrop-blur-sm shadow-lg shadow-pink-200/20 dark:shadow-pink-900/20">
              <div className="flex items-center mb-4">
                <div className="rounded-full w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mr-3">
                  <Keyboard className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-pink-600 dark:text-pink-400">Special Keys</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="font-semibold text-pink-500 mr-2">S:</span>
                  <span className="text-muted-foreground">Toggle suggestion mode for word predictions</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-pink-500 mr-2">Yes:</span>
                  <span className="text-muted-foreground">Accept the top suggested word</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-pink-500 mr-2">←:</span>
                  <span className="text-muted-foreground">Delete the last character</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-pink-500 mr-2">_:</span>
                  <span className="text-muted-foreground">Add a space</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-pink-500 mr-2">🔊:</span>
                  <span className="text-muted-foreground">Read the typed text aloud</span>
                </li>
              </ul>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <div className="border border-pink-200 dark:border-pink-800 rounded-lg p-6 bg-white/50 dark:bg-pink-950/50 backdrop-blur-sm shadow-lg shadow-pink-200/20 dark:shadow-pink-900/20">
              <div className="flex items-center mb-4">
                <div className="rounded-full w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mr-3">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-pink-600 dark:text-pink-400">Missions and Achievements</h3>
              </div>
              <p className="mb-4 text-muted-foreground">Complete missions to earn points and level up!</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="font-semibold text-pink-500 mr-2">Beginner:</span>
                  <span className="text-muted-foreground">Type your first 10 words</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-pink-500 mr-2">Explorer:</span>
                  <span className="text-muted-foreground">Use all special keys at least once</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-pink-500 mr-2">Communicator:</span>
                  <span className="text-muted-foreground">Type a complete sentence</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-pink-500 mr-2">Speed Typer:</span>
                  <span className="text-muted-foreground">Type 5 words in under 30 seconds</span>
                </li>
              </ul>
            </div>
          </AnimatedCard>
        </div>
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
