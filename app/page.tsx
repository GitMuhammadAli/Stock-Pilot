"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, BarChart2, Clock, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FC } from "react"
import DashboardPreview from "@/components/DashboardPreview"

interface FeatureCardProps {
  icon: FC<{ className?: string }>;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: FC<FeatureCardProps> = ({ icon: Icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-[#1C2333] p-6 rounded-xl border border-[#2C3444] hover:border-[#B6F400]/30 transition-all h-full"
    >
      <div className="bg-[#B6F400] p-3 rounded-lg inline-block mb-4">
        <Icon className="h-6 w-6 text-[#0B0F1A]" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  )
}

interface TestimonialCardProps {
  initial: string;
  name: string;
  role: string;
  quote: string;
  delay: number;
}

const TestimonialCard: FC<TestimonialCardProps> = ({ initial, name, role, quote, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-[#1C2333] p-6 rounded-xl border border-[#2C3444] h-full flex flex-col"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-[#B6F400] rounded-full flex items-center justify-center text-[#0B0F1A] font-bold text-xl flex-shrink-0">
          {initial}
        </div>
        <div className="ml-4">
          <h4 className="font-bold">{name}</h4>
          <p className="text-gray-400">{role}</p>
        </div>
      </div>
      <p className="text-gray-300 flex-grow">"{quote}"</p>
    </motion.div>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center"
          >

            <div className="flex flex-col sm:flex-row justify-center items-center mb-8 mt-0 px-4 w-full gap-4 sm:gap-6 md:gap-8">
              <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] transition-all duration-300 hover:scale-105">
              <a href="https://www.fontspace.com/category/ai"><img src="https://see.fontimg.com/api/rf5/YqOoa/OTE1ZjI2ZmM4ZmUyNDlhOGI5Yjc0OGZmOWQwNzgyYWEudHRm/U3RvY2s/warriot-tech-italic.png?r=fs&h=86&w=1500&fg=B6F400&bg=FFFFFF&tb=1&s=57" alt="Ai fonts" /></a>
              </div>
              <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] transition-all duration-300 hover:scale-105">
              <a href="https://www.fontspace.com/category/ai"><img src="https://see.fontimg.com/api/rf5/YqOoa/OTE1ZjI2ZmM4ZmUyNDlhOGI5Yjc0OGZmOWQwNzgyYWEudHRm/UGlsb3Q/warriot-tech-italic.png?r=fs&h=86&w=1500&fg=B6F400&bg=FFFFFF&tb=1&s=57" alt="Ai fonts" /></a>
                
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6 p-2 bg-[#1C2333] rounded-full"
            >
              <div className="bg-[#B6F400] text-[#0B0F1A] px-4 py-1 rounded-full font-medium">
                Inventory Management Reimagined
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Manage Your Inventory <br className="hidden sm:block" />
              <span className="text-[#B6F400]">Smarter, Not Harder</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl"
            >
              StockPilot helps businesses optimize inventory, reduce costs, and prevent stockouts with powerful
              analytics and real-time tracking.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto"
            >
              <Button
                asChild
                className="bg-[#B6F400] hover:bg-[#9ED900] text-[#0B0F1A] font-bold py-3 px-8 rounded-lg flex items-center justify-center text-lg transition-all w-full"
              >
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-[#2C3444] hover:border-[#B6F400] text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center text-lg transition-all w-full"
              >
                <Link href="/login">Log In</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 5V19M12 19L5 12M12 19L19 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-[#0B0F1A]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose StockPilot?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our platform is designed to give you complete control over your inventory
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Zap}
              title="Real-time Tracking"
              description="Monitor your inventory levels across all locations in real-time"
              delay={0.1}
            />
            <FeatureCard
              icon={BarChart2}
              title="Smart Analytics"
              description="Make data-driven decisions with powerful analytics and insights"
              delay={0.2}
            />
            <FeatureCard
              icon={Clock}
              title="Automated Reordering"
              description="Set up automatic reordering based on custom thresholds"
              delay={0.3}
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Reliable"
              description="Your data is always secure and available when you need it"
              delay={0.4}
            />
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="py-20 bg-[#0F1424]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Dashboard</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get a complete overview of your inventory at a glance
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-xl overflow-hidden shadow-xl border border-[#2C3444]"
          >
            {/* <img src="/placeholder.svg?height=1080&width=1920" alt="StockPilot Dashboard" className="w-full h-auto" /> */}
            <DashboardPreview />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] to-transparent opacity-70"></div>
            <div className="relative bottom-0 left-0 right-0 p-4 pt-4 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* <h3 className="text-2xl font-bold mb-2 text-[#B6F400]">Intuitive Interface</h3>
                <p className="text-white mb-4 max-w-md">
                  Our dashboard is designed to be easy to use while providing all the information you need at your
                  fingertips.
                </p> */}
                <Button asChild className="bg-[#B6F400] hover:bg-[#9ED900] text-[#0B0F1A] font-bold">
                  <Link href="/dashboard">Try it now</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-[#0B0F1A]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Businesses</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See what our customers have to say about StockPilot
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              initial="A"
              name="Alex Thompson"
              role="Retail Manager"
              quote="StockPilot has transformed how we manage inventory. We've reduced stockouts by 85% and improved cash flow significantly."
              delay={0.1}
            />
            <TestimonialCard
              initial="S"
              name="Sarah Johnson"
              role="Operations Director"
              quote="The analytics in StockPilot helped us identify $50,000 in excess inventory we were able to liquidate. Game changer!"
              delay={0.2}
            />
            <TestimonialCard
              initial="M"
              name="Michael Chen"
              role="Supply Chain Manager"
              quote="We've cut our inventory management time by 60% while improving accuracy. The automated alerts are a lifesaver."
              delay={0.3}
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-[#1C2333]">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Optimize Your Inventory?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Join thousands of businesses that trust StockPilot to manage their inventory efficiently
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              className="bg-[#B6F400] hover:bg-[#9ED900] text-[#0B0F1A] font-bold py-3 px-8 rounded-lg inline-flex items-center justify-center text-lg"
            >
              <Link href="/register">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0B0F1A] py-10 border-t border-[#2C3444]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-[#B6F400]">StockPilot</h2>
              <p className="text-gray-400">Intelligent Inventory Management</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-gray-300 hover:text-white">
                About
              </Link>
              <Link href="/features" className="text-gray-300 hover:text-white">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white">
                Pricing
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} StockPilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

