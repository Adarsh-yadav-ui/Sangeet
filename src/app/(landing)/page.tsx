"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Music2,
  Radio,
  ListMusic,
  Heart,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Authenticated, Unauthenticated } from "convex/react";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <Header theme={theme} setTheme={setTheme} />
      <Hero />
      <Features />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
}

function Header({
  theme,
  setTheme,
}: {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={theme === "dark" ? "/logo_dark.svg" : "/logo_white.svg"}
            alt="Sangeet"
            className="h-8 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <div className="hidden items-center gap-2">
            <Music2 className="w-8 h-8 text-fuchsia-500" />
            <span className="text-2xl font-bold">Sangeet</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium hover:text-fuchsia-500 transition-colors"
          >
            Features
          </a>
          <a
            href="#about"
            className="text-sm font-medium hover:text-fuchsia-500 transition-colors"
          >
            About
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium hover:text-fuchsia-500 transition-colors"
          >
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <Unauthenticated>
            <Button
              className="bg-emerald-400 hover:bg-emerald-600 transition-all duration-200 hover:scale-115 active:scale-95"
              asChild
            >
              <SignInButton mode="modal" />
            </Button>
            <Button
              className="bg-emerald-400 hover:bg-emerald-600 transition-all duration-200 hover:scale-115 active:scale-95"
              asChild
            >
              <SignUpButton mode="modal" />
            </Button>
          </Unauthenticated>
          <Authenticated>
            <UserButton />
          </Authenticated>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Millions of songs. Zero limits.</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Music for
            <span className="block bg-linear-to-r from-fuchsia-500 to-teal-500 bg-clip-text text-transparent">
              every moment
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Stream unlimited music, discover new artists, create playlists, and
            share your passion with millions of listeners worldwide.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-full text-lg font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-500/25">
              <Play className="w-5 h-5 fill-current" />
              Start listening free
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 hover:border-fuchsia-500 dark:hover:border-fuchsia-500 rounded-full text-lg font-semibold transition-all hover:scale-105 active:scale-95">
              View plans
            </button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-600">
            No credit card required • Cancel anytime
          </p>
        </div>

        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-linear-to-r from-fuchsia-500/20 to-teal-500/20 blur-3xl rounded-full"></div>
          <div className="relative bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Discover Weekly", "Release Radar", "Daily Mix"].map(
                (playlist, idx) => (
                  <PlaylistCard key={idx} title={playlist} index={idx} />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlaylistCard({ title, index }: { title: string; index: number }) {
  const colors = [
    "from-purple-500 to-pink-500",
    "from-fuchsia-500 to-teal-500",
    "from-orange-500 to-red-500",
  ];
  return (
    <div className="group bg-gray-800 hover:bg-gray-750 rounded-xl p-4 transition-all cursor-pointer hover:scale-105">
      <div
        className={`w-full aspect-square bg-linear-to-br ${colors[index]} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}
      >
        <Music2 className="w-16 h-16 text-white/80" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 bg-fuchsia-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <Play className="w-6 h-6 text-white fill-current ml-1" />
          </div>
        </div>
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">Your personalized mix</p>
    </div>
  );
}

function Features() {
  const features = [
    {
      icon: Music2,
      title: "Unlimited Music",
      description:
        "Access millions of songs across all genres, from the latest hits to timeless classics.",
      color: "emerald",
    },
    {
      icon: Radio,
      title: "Live Radio",
      description:
        "Tune into curated radio stations and discover new music tailored to your taste.",
      color: "blue",
    },
    {
      icon: ListMusic,
      title: "Smart Playlists",
      description:
        "AI-powered playlists that adapt to your mood, activity, and listening history.",
      color: "purple",
    },
    {
      icon: Heart,
      title: "Offline Listening",
      description:
        "Download your favorite tracks and enjoy music anywhere, even without internet.",
      color: "pink",
    },
    {
      icon: TrendingUp,
      title: "High Quality Audio",
      description:
        "Experience crystal-clear sound with lossless audio streaming up to 320kbps.",
      color: "orange",
    },
    {
      icon: Users,
      title: "Social Sharing",
      description:
        "Share playlists, follow friends, and see what the world is listening to.",
      color: "teal",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to
            <span className="block text-fuchsia-500">enjoy music</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Powerful features designed for music lovers, by music lovers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: typeof Music2;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: "bg-fuchsia-500/10 text-fuchsia-500",
    blue: "bg-blue-500/10 text-blue-500",
    purple: "bg-purple-500/10 text-purple-500",
    pink: "bg-pink-500/10 text-pink-500",
    orange: "bg-orange-500/10 text-orange-500",
    teal: "bg-teal-500/10 text-teal-500",
  };

  return (
    <div className="group p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-fuchsia-500/50 dark:hover:border-fuchsia-500/50 transition-all hover:shadow-lg hover:shadow-fuchsia-500/10 hover:-translate-y-1">
      <div
        className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function Stats() {
  const stats = [
    { value: "100M+", label: "Active Users" },
    { value: "80M+", label: "Songs" },
    { value: "4M+", label: "Podcasts" },
    { value: "180+", label: "Countries" },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-linear-to-br from-fuchsia-500 to-teal-600 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Join millions of music lovers worldwide
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-emerald-100 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold">
          Ready to start your
          <span className="block text-fuchsia-500">musical journey?</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Get 3 months of Premium for free. Cancel anytime.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button className="w-full sm:w-auto px-8 py-4 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-full text-lg font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-500/25">
            Get started free
          </button>
          <button className="w-full sm:w-auto px-8 py-4 text-lg font-semibold hover:text-fuchsia-500 transition-colors">
            See pricing options
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Mobile Apps", "Desktop App"],
    Company: ["About", "Careers", "Press", "News"],
    Support: ["Help Center", "Contact", "Privacy", "Terms"],
  };

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Music2 className="w-8 h-8 text-fuchsia-500" />
              <span className="text-2xl font-bold">Sangeet</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Music for every moment. Stream unlimited songs and podcasts.
            </p>
          </div>
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-500 text-sm transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 Sangeet. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-fuchsia-500 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-fuchsia-500 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-fuchsia-500 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
