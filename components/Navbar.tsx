"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Sun, Moon, Menu, X, User } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { scrollY } = useScroll()

  // Transform scroll position to navbar opacity and blur
  const navbarOpacity = useTransform(scrollY, [0, 100], [0.7, 0.95])
  const navbarBlur = useTransform(scrollY, [0, 100], [8, 20])
  const navbarScale = useTransform(scrollY, [0, 100], [1, 0.98])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    console.log(user)
  })
  const getDashboardLink = () => {
    switch (user?.role) {
      case 'STUDENT':
        return '/student/dashboard'
      case 'LECTURER':
        return '/lecturer/dashboard'
      case 'ADMIN':
        return '/admin/dashboard'
      default:
        return '#'
    }
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-7xl pt-4"
      style={{
        scale: navbarScale
      }}
    >
      <div className="container px-4">
        <motion.div
          className={`rounded-2xl backdrop-blur-xl p-4 shadow-glass border transition-all duration-500 ${isScrolled
            ? "bg-white/80 dark:bg-gray-900/80 border-white/30 dark:border-gray-700/30 shadow-3d"
            : "bg-white/60 dark:bg-gray-900/60 border-white/20 dark:border-gray-700/20 shadow-glass"
            }`}
          style={{
            backdropFilter: `blur(${navbarBlur}px)`,
          }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <motion.div
                  className="relative p-1 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-lemon-100/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Image
                    src="/images/logo.webp"
                    width={32}
                    height={32}
                    alt="Afrivas Logo"
                    className="relative z-10 rounded-md transition-transform duration-300 group-hover:rotate-3"
                  />
                </motion.div>
                <span className="font-bold text-primary-100 group-hover:text-primary-100/80 transition-colors duration-300">Afrivas</span>
              </Link>

              <nav className="hidden md:flex gap-1">
                {[
                  { href: "/", label: "Home" },
                  { href: "#about-us", label: "About" },
                  { href: "#features", label: "Features" },
                  { href: "#contact-us", label: "Contact" }
                ].map((item, index) => (
                  <motion.div key={item.href} className="relative">
                    <Link
                      href={item.href}
                      className="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:text-primary-100 relative z-10 block"
                    >
                      {item.label}
                    </Link>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-100/10 to-lemon-100/10 rounded-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200/50 hover:border-primary-100/30 bg-white/20 hover:bg-primary-100/10 dark:border-gray-700/50 dark:hover:border-primary-100/30 dark:bg-gray-900/20 dark:hover:bg-primary-100/10 backdrop-blur-md transition-all duration-300"
                aria-label="Toggle theme"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-100/10 to-lemon-100/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-700 dark:text-gray-300" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-700 dark:text-gray-300" />
              </motion.button>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link href="/profile">
                    <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      router.push("/login")
                    }}
                    className="rounded-md border border-blue-600 px-4 py-1 text-sm font-medium text-blue-600 bg-white/30 hover:bg-white/50 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login">
                    <motion.button
                      className="rounded-xl bg-primary-100 hover:bg-primary-100/90 px-4 py-2 text-sm font-medium text-white shadow-glass hover:shadow-neon-primary transition-all duration-300 backdrop-blur-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Login
                    </motion.button>
                  </Link>
                  {/* <Link href="/signup">
                    <motion.button 
                      className="rounded-xl border border-primary-100/30 px-4 py-2 text-sm font-medium text-primary-100 bg-white/20 hover:bg-primary-100/10 dark:bg-gray-900/20 dark:hover:bg-primary-100/10 backdrop-blur-md transition-all duration-300 shadow-glass hover:border-primary-100/50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign Up
                    </motion.button>
                  </Link> */}
                </div>
              )}

              <motion.button
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 hover:bg-primary-100/10 dark:bg-gray-900/20 dark:hover:bg-primary-100/10 backdrop-blur-md transition-all duration-300 border border-gray-200/20 hover:border-primary-100/30"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? <X className="h-5 w-5 text-gray-700 dark:text-gray-300" /> : <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
                </motion.div>
              </motion.button>
            </div>
          </div>

          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-4 pt-4 border-t border-white/20 dark:border-gray-700/20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col gap-1">
                {[
                  { href: "/", label: "Home" },
                  { href: "#about-us", label: "About" },
                  { href: "#features", label: "Features" },
                  { href: "#contact-us", label: "Contact" }
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-primary-100/10 hover:text-primary-100 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div
                className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/20 dark:border-gray-700/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {user ? (
                  <>
                    <Link href="/profile" className="w-full">
                      <motion.button
                        className="w-full rounded-xl bg-primary-100 hover:bg-primary-100/90 px-4 py-3 text-sm font-medium text-white shadow-glass transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Profile
                      </motion.button>
                    </Link>
                    <motion.button
                      onClick={() => {
                        logout()
                        router.push("/login")
                      }}
                      className="w-full rounded-xl border border-primary-100/30 px-4 py-3 text-sm font-medium text-primary-100 bg-white/20 hover:bg-primary-100/10 dark:bg-gray-900/20 dark:hover:bg-primary-100/10 backdrop-blur-md transition-all duration-300 shadow-glass"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="w-full">
                      <motion.button
                        className="w-full rounded-xl bg-primary-100 hover:bg-primary-100/90 px-4 py-3 text-sm font-medium text-white shadow-glass transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Login
                      </motion.button>
                    </Link>
                    {/* <Link href="/signup" className="w-full">
                      <motion.button 
                        className="w-full rounded-xl border border-primary-100/30 px-4 py-3 text-sm font-medium text-primary-100 bg-white/20 hover:bg-primary-100/10 dark:bg-gray-900/20 dark:hover:bg-primary-100/10 backdrop-blur-md transition-all duration-300 shadow-glass"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Sign Up
                      </motion.button>
                    </Link> */}
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.header>
  )
}