'use client';

import { Button } from "@/components/ui/button"
import { ChatBubble } from "@/components/chat-bubble"
import { VetCard } from "@/components/vet-card"
import { TestimonialCard } from "@/components/testimonial-card"
import { ArrowRight, MessageCircle, Smartphone, Brain, Stethoscope } from 'lucide-react'
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { Bot } from 'lucide-react';
import vetImage from "@/assets/images/vet.jpg"
import vetImage2 from "@/assets/images/vet-2.jpg"
import vetImage3 from "@/assets/images/vet-3.jpg"
import testimonialImage1 from "@/assets/images/testimonial-1.jpg"
import testimonialImage2 from "@/assets/images/testimonial-2.jpg"
import testimonialImage3 from "@/assets/images/testimonial-3.jpg"
import test from "node:test";

export default function Home() {
  return (
    <main className="min-h-screen pt-16">
      <HeroSection />
      <HowItWorksSection />
      <TestimonialSection />
    </main>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 paw-pattern opacity-5"></div>
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left Column */}
          <div className="relative z-10">
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold">
                <span className="gradient-text">AI-Powered</span><br />
                <span className="gradient-text">Pet Health</span><br />
                Assistant
              </h1>
            </motion.div>
            <motion.p 
              className="text-lg text-muted-foreground mb-8 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Get instant answers to your pet's health and wellness questions from our AI veterinarian, anytime, anywhere.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/chat">
                <Button size="lg" className="rounded-full bg-primary text-white hover:bg-primary/90">
                  Ask FurSure AI
                  <MessageCircle className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <div className="mt-12 space-y-4">
              <ChatBubble 
                message="Hello! What questions do you have about your pet's health today? 🐾"
                timestamp="10:57 AM"
                className="ml-8"
                role="assistant"
              />
              <ChatBubble 
                message="Hi FurSure AI, my cat has been drinking more water than usual. Should I be concerned?"
                timestamp="11:34 AM"
                avatar={testimonialImage3.src}
                role="user"
              />
              <ChatBubble 
                message="Increased thirst in cats can be a sign of various health issues. It's important to monitor this change. Here are some possible reasons and next steps..."
                timestamp="11:35 AM"
                className="ml-8"
                role="assistant"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={vetImage2} 
                alt="Pet owner using FurSure AI app"
                width={600}
                height={700}
                className="rounded-2xl mx-auto shadow-lg"
                priority
              />
            </motion.div>
            <VetCard
              name="FurSure AI"
              image={vetImage3.src}
              className="absolute bottom-12 right-12"
            />
            <motion.div
              className="absolute -top-4 -left-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src={vetImage}
                alt="AI analyzing pet health data"
                width={120}
                height={120}
                className="rounded-xl shadow-md"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      icon: Smartphone,
      title: "Ask a Question",
      description: "Open the FurSure AI app and type in your pet health question."
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our advanced AI processes your question and analyzes it against a vast database of veterinary knowledge."
    },
    {
      icon: Stethoscope,
      title: "Get Expert Advice",
      description: "Receive personalized, vet-approved advice and recommendations for your pet's health concern."
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">
            How <span className="gradient-text">FurSure AI</span> Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button size="lg" className="mt-12 rounded-full bg-primary text-white hover:bg-primary/90">
              Try FurSure AI Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TestimonialSection() {
  const testimonials = [
    {
      name: "Sarah L.",
      avatar: testimonialImage1.src,
      rating: 5,
      testimonial: "FurSure AI helped me understand my dog's symptoms quickly. It's like having a vet on call 24/7!"
    },
    {
      name: "Mike R.",
      avatar: testimonialImage2.src,
      rating: 5,
      testimonial: "I was skeptical at first, but FurSure AI's advice for my cat's diet was spot on. Highly recommended!"
    },
    {
      name: "Emily T.",
      avatar: testimonialImage3.src,
      rating: 4,
      testimonial: "The app is so easy to use, and the AI gives clear, actionable advice. It's been a game-changer for my pet's health."
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-accent/10 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            What Pet Parents Are Saying About <span className="gradient-text">FurSure AI</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
          </div>
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button size="lg" className="rounded-full bg-primary text-white hover:bg-primary/90">
              Join Happy Pet Parents
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

