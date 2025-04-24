"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Keyboard, Sparkles, Users, Star, ArrowRight, X } from "lucide-react"
import { motion, useInView, useAnimation } from "framer-motion"

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [hasSelectedQuestion, setHasSelectedQuestion] = useState(false)
  const [isWebcamOn, setIsWebcamOn] = useState(false)

  const predefinedQuestions = [
    {
      question: "How does eye tracking work?",
      answer:
        "Our eye tracking technology uses your webcam to detect eye movements and translate them into cursor movements on the screen.",
    },
    {
      question: "Is Galactic Typist accessible?",
      answer:
        "Yes! Galactic Typist is designed to be accessible for people with various motor impairments, allowing hands-free typing and computer control.",
    },
    {
      question: "What devices are supported?",
      answer:
        "Galactic Typist works on most modern computers with a webcam. We support Windows, Mac, and Linux operating systems.",
    },
    {
      question: "How accurate is the typing?",
      answer:
        "With proper calibration, Galactic Typist achieves over 95% accuracy for most users. The accuracy improves as you use the system more.",
    },
    {
      question: "Can I try before buying?",
      answer:
        "Absolutely! We offer a free 14-day trial with full functionality so you can experience the benefits before purchasing.",
    },
  ]

  const handleQuestionSelect = (questionObj) => {
    // Add the question to chat
    setChatMessages((prev) => [...prev, { type: "question", text: questionObj.question }])

    // Simulate typing delay before showing answer
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { type: "answer", text: questionObj.answer }])
      setHasSelectedQuestion(true)

      // Reset after a few seconds to allow asking another question
      setTimeout(() => {
        setHasSelectedQuestion(false)
      }, 3000)
    }, 500)
  }
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden hero-gradient">
        <div className="absolute top-20 right-10 animate-float-slow">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 opacity-20 blur-xl"></div>
        </div>
        <div className="absolute bottom-10 left-10 animate-float-medium">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-300 to-purple-500 opacity-20 blur-xl"></div>
        </div>

        <div className="container px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col justify-center space-y-4"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  <span className="gradient-text pink-glow">Gaze Typing</span> Keyboard Demo
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Experience the Galactic Typist in action! Navigate the keyboard with your eyes, select keys by
                  blinking, and complete space-themed missions to earn points.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300"
                >
                  <Link href="/get-started">Get Started</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-pink-300 dark:border-pink-700 hover:bg-pink-100 dark:hover:bg-pink-900 transition-all duration-300"
                >
                  <Link href="/demo">Try Demo</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative lg:ml-auto"
            >
              <div className="relative mx-auto w-full max-w-[500px] rounded-xl border border-pink-200 dark:border-pink-800 bg-white/50 dark:bg-pink-950/50 p-2 shadow-xl shadow-pink-200/50 dark:shadow-pink-900/50 backdrop-blur-sm">
                <div className="relative rounded-lg overflow-hidden">
                  <WebcamFeed isActive={isWebcamOn} />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white text-center p-2 rounded-lg bg-pink-500/70 backdrop-blur-sm">
                    <p className="font-medium">Try typing "hello world" to see dynamic word suggestions!</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-pink-500/30">
                  New!
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-10 -left-10 w-20 h-20 floating animation-delay-200">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 opacity-70 blur-md"></div>
                  <div
                    className="absolute inset-2 rounded-full bg-white dark:bg-pink-950 flex items-center justify-center cursor-pointer z-10"
                    onClick={() => setChatOpen((prev) => !prev)}
                  >
                    <Sparkles className="h-8 w-8 text-pink-500" />
                  </div>

                  {/* Interactive Chatbot */}
                  {chatOpen && (
                    <div className="absolute -right-4 top-0 translate-x-full w-72 animate-in">
                      <div className="bg-white dark:bg-pink-950 rounded-lg shadow-lg border border-pink-200 dark:border-pink-800 overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-3 flex justify-between items-center">
                          <h3 className="text-white font-medium text-sm">Galactic Assistant</h3>
                          <X
                            className="h-4 w-4 text-white cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              setChatOpen(false)
                            }}
                          />
                        </div>

                        <div className="p-3 max-h-60 overflow-y-auto flex flex-col gap-2">
                          {chatMessages.map((msg, i) => (
                            <div
                              key={i}
                              className={`${
                                msg.type === "answer"
                                  ? "bg-pink-100 dark:bg-pink-900 ml-4"
                                  : "bg-gray-100 dark:bg-gray-800 mr-4"
                              } p-2 rounded-lg text-xs`}
                            >
                              {msg.text}
                            </div>
                          ))}
                        </div>

                        {!hasSelectedQuestion && (
                          <div className="p-3 border-t border-pink-200 dark:border-pink-800">
                            <p className="text-xs text-muted-foreground mb-2">How can I help you today?</p>
                            <div className="flex flex-col gap-2">
                              {predefinedQuestions.map((q, i) => (
                                <button
                                  key={i}
                                  className="text-xs text-left p-2 bg-pink-50 dark:bg-pink-900/50 hover:bg-pink-100 dark:hover:bg-pink-900 rounded-md transition-colors"
                                  onClick={() => handleQuestionSelect(q)}
                                >
                                  {q.question}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="absolute -left-2 top-4 w-4 h-4 bg-white dark:bg-pink-950 border-l border-t border-pink-200 dark:border-pink-800 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 w-16 h-16 floating animation-delay-500">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 opacity-70 blur-md"></div>
                  <div
                    className={`absolute inset-2 rounded-full ${isWebcamOn ? "bg-pink-500 dark:bg-pink-600" : "bg-white dark:bg-pink-950"} flex items-center justify-center cursor-pointer transition-colors duration-300`}
                    onClick={() => setIsWebcamOn((prev) => !prev)}
                    role="button"
                    aria-label={isWebcamOn ? "Turn webcam off" : "Turn webcam on"}
                    aria-pressed={isWebcamOn}
                    tabIndex={0}
                  >
                    {isWebcamOn ? <Eye className="h-6 w-6 text-white" /> : <Eye className="h-6 w-6 text-pink-500" />}
                    {isWebcamOn && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 bg-gradient-to-b from-pink-50 to-white dark:from-pink-900 dark:to-pink-950">
        <div className="container px-4 md:px-6">
          <AnimatedSection>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border border-pink-300 dark:border-pink-700 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300">
                  How to Use
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text pink-glow">
                  Galactic Typist
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Master the eye-tracking keyboard with these simple instructions
                </p>
              </div>
            </div>
          </AnimatedSection>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12 staggered-animation">
            <AnimatedCard>
              <div className="p-6 rounded-2xl bg-white dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800 shadow-lg shadow-pink-200/20 dark:shadow-pink-900/20 card-hover">
                <div className="rounded-full w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Eye Movement</h3>
                <p className="text-muted-foreground">Look left or right to navigate between keys or suggestions.</p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.1}>
              <div className="p-6 rounded-2xl bg-white dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800 shadow-lg shadow-pink-200/20 dark:shadow-pink-900/20 card-hover">
                <div className="rounded-full w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-4">
                  <Keyboard className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Key Selection</h3>
                <p className="text-muted-foreground">Blink to select a key or suggestion.</p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <div className="p-6 rounded-2xl bg-white dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800 shadow-lg shadow-pink-200/20 dark:shadow-pink-900/20 card-hover">
                <div className="rounded-full w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Word Suggestions</h3>
                <p className="text-muted-foreground">Use the "S" key to toggle suggestion mode for word predictions.</p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <div className="p-6 rounded-2xl bg-white dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800 shadow-lg shadow-pink-200/20 dark:shadow-pink-900/20 card-hover">
                <div className="rounded-full w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Missions</h3>
                <p className="text-muted-foreground">Complete missions to earn points and level up!</p>
              </div>
            </AnimatedCard>
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300"
            >
              <Link href="/usage">
                View Full Instructions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-20 bg-gradient-to-b from-white to-pink-50 dark:from-pink-950 dark:to-pink-900">
        <div className="container px-4 md:px-6">
          <AnimatedSection>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border border-pink-300 dark:border-pink-700 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300">
                  Applications
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text pink-glow">
                  Endless Possibilities
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover the many ways Galactic Typist can be used
                </p>
              </div>
            </div>
          </AnimatedSection>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <AnimatedCard>
              <Card className="overflow-hidden border-pink-200 dark:border-pink-800 shadow-xl shadow-pink-200/20 dark:shadow-pink-900/20 card-hover">
                <div className="aspect-video relative bg-gradient-to-br from-pink-300 to-purple-400 dark:from-pink-600 dark:to-purple-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Accessibility className="h-16 w-16 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Assistive technology</h3>
                  <p className="text-muted-foreground mb-4">
                    Assistive technology for individuals with motor impairments.
                  </p>
                  <div className="flex items-center text-pink-500">
                    <ArrowRight className="h-4 w-4 mr-1" />
                    <Link href="/applications" className="text-sm font-medium hover:underline">
                      Learn more
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.1}>
              <Card className="overflow-hidden border-pink-200 dark:border-pink-800 shadow-xl shadow-pink-200/20 dark:shadow-pink-900/20 card-hover">
                <div className="aspect-video relative bg-gradient-to-br from-pink-300 to-purple-400 dark:from-pink-600 dark:to-purple-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Educational tool</h3>
                  <p className="text-muted-foreground mb-4">
                    Educational tool for learning to type without physical keyboards.
                  </p>
                  <div className="flex items-center text-pink-500">
                    <ArrowRight className="h-4 w-4 mr-1" />
                    <Link href="/applications" className="text-sm font-medium hover:underline">
                      Learn more
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <Card className="overflow-hidden border-pink-200 dark:border-pink-800 shadow-xl shadow-pink-200/20 dark:shadow-pink-900/20 card-hover">
                <div className="aspect-video relative bg-gradient-to-br from-pink-300 to-purple-400 dark:from-pink-600 dark:to-purple-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Gamepad className="h-16 w-16 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Gaming interface</h3>
                  <p className="text-muted-foreground mb-4">Gaming interface for gaze-based interaction.</p>
                  <div className="flex items-center text-pink-500">
                    <ArrowRight className="h-4 w-4 mr-1" />
                    <Link href="/applications" className="text-sm font-medium hover:underline">
                      Learn more
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <Card className="overflow-hidden border-pink-200 dark:border-pink-800 shadow-xl shadow-pink-200/20 dark:shadow-pink-900/20 card-hover">
                <div className="aspect-video relative bg-gradient-to-br from-pink-300 to-purple-400 dark:from-pink-600 dark:to-purple-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MessageSquare className="h-16 w-16 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Accessibility feature</h3>
                  <p className="text-muted-foreground mb-4">Accessibility feature for hands-free communication.</p>
                  <div className="flex items-center text-pink-500">
                    <ArrowRight className="h-4 w-4 mr-1" />
                    <Link href="/applications" className="text-sm font-medium hover:underline">
                      Learn more
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-pink-50 to-white dark:from-pink-900 dark:to-pink-950 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 opacity-20 blur-3xl"></div>
        </div>

        <div className="container px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text pink-glow">
                Ready to Experience the Future of Typing?
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Join thousands of users who have discovered a new way to interact with technology.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 text-lg px-8 py-6">
                  Get Started Today
                </Button>
                <Button
                  variant="outline"
                  className="border-pink-300 dark:border-pink-700 hover:bg-pink-100 dark:hover:bg-pink-900 transition-all duration-300 text-lg px-8 py-6"
                >
                  Watch Demo Video
                </Button>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-pink-500 fill-pink-500" />
                <Star className="h-5 w-5 text-pink-500 fill-pink-500" />
                <Star className="h-5 w-5 text-pink-500 fill-pink-500" />
                <Star className="h-5 w-5 text-pink-500 fill-pink-500" />
                <Star className="h-5 w-5 text-pink-500 fill-pink-500" />
                <span className="text-sm font-medium">5.0 Rating</span>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-pink-500 fill-pink-500" />
                <Star className="h-5 w-5 text-pink-500 fill-pink-500" />
                <Star className="h-5 w-5 text-pink-500 fill-pink-500" />
                <Star className="h-5 w-5 text-pink-500 fill-pink-500" />
                <Star className="h-5 w-5 text-pink-500 fill-pink-500" />
                <span className="text-sm font-medium">5.0 Rating</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

// Animation components
function AnimatedSection({ children, delay = 0 }) {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedCard({ children, delay = 0 }) {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, threshold: 0.1 })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

// WebcamFeed component
function WebcamFeed({ isActive = false }) {
  const videoRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let stream = null

    async function setupWebcam() {
      if (!isActive) {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks()
          tracks.forEach((track) => track.stop())
          videoRef.current.srcObject = null
        }
        return
      }

      try {
        const constraints = {
          video: {
            width: 600,
            height: 400,
            facingMode: "user",
          },
        }

        stream = await navigator.mediaDevices.getUserMedia(constraints)

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            setIsLoading(false)
          }
        }
      } catch (err) {
        console.error("Error accessing webcam:", err)
        setHasError(true)
        setIsLoading(false)
      }
    }

    setupWebcam()

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isActive])

  return (
    <div className="aspect-video bg-gradient-to-br from-pink-900 to-purple-900 rounded-lg w-full">
      {isActive && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      )}

      {isActive && hasError && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
          <p>
            Camera access is needed for the full experience.
            <br />
            Please allow camera permissions and refresh.
          </p>
        </div>
      )}

      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
          <p>
            Click the eye button to activate the webcam
            <br />
            and try the eye-tracking experience.
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`rounded-lg w-full h-full object-cover ${!isActive || isLoading || hasError ? "opacity-0" : "opacity-100"}`}
      />
    </div>
  )
}

// Missing imports
import { BookOpen, Gamepad, MessageSquare, Accessibility } from "lucide-react"
