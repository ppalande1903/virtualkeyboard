import Link from "next/link"
import { Facebook, Github, Instagram, Linkedin, Twitter, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-pink-200 dark:border-pink-800 bg-white/50 dark:bg-pink-950/50 backdrop-blur-md">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold gradient-text pink-glow">Galactic Typist</h3>
            <p className="text-sm text-muted-foreground">
              Revolutionary eye-tracking keyboard technology for hands-free typing and communication.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-pink-400 hover:text-pink-500 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-pink-400 hover:text-pink-500 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-pink-400 hover:text-pink-500 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-pink-400 hover:text-pink-500 transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-pink-400 hover:text-pink-500 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-pink-500 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-pink-500 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-muted-foreground hover:text-pink-500 transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link href="/applications" className="text-muted-foreground hover:text-pink-500 transition-colors">
                  Applications
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/usage" className="text-muted-foreground hover:text-pink-500 transition-colors">
                  Usage Guide
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-muted-foreground hover:text-pink-500 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-pink-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-pink-500 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-pink-500 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-pink-500 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-pink-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-pink-500 transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-pink-200 dark:border-pink-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground mb-4 md:mb-0 flex items-center">
              &copy; {new Date().getFullYear()} Galactic Typist. Made with
              <Heart className="h-3 w-3 mx-1 text-pink-500 animate-pulse" />
              All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-pink-500 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-pink-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-xs text-muted-foreground hover:text-pink-500 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300">
            Join Our Newsletter
          </Button>
        </div>
      </div>
    </footer>
  )
}
