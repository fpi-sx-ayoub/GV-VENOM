import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Zap, Shield, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              GV VENOM
            </span>
          </div>
          <div className="flex gap-3">
            <Link href="/vip-login">
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                VIP Login
              </Button>
            </Link>
            <Link href="/admin-login">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Free Fire <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Likes System</span>
              </h1>
              <p className="text-xl text-slate-300">
                Boost your Free Fire profile with our premium VIP likes service. Fast, reliable, and secure.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Instant Delivery</h3>
                  <p className="text-slate-400">Get likes delivered instantly to your Free Fire profile</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Secure & Safe</h3>
                  <p className="text-slate-400">Your account is protected with industry-standard security</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">24/7 Support</h3>
                  <p className="text-slate-400">Our team is always here to help you</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4">
              <Link href="/vip-login">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Get Started
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-8 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
                  <div className="text-sm text-slate-400 mb-2">Player ID</div>
                  <div className="text-2xl font-bold text-white">13708567247</div>
                  <div className="text-sm text-purple-400 mt-2">FPI☠︎SX</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/20">
                    <div className="text-xs text-slate-400">Likes Before</div>
                    <div className="text-2xl font-bold text-white">61</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/20">
                    <div className="text-xs text-slate-400">Likes After</div>
                    <div className="text-2xl font-bold text-purple-400">72</div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/20">
                  <div className="text-xs text-slate-400">Likes Given</div>
                  <div className="text-2xl font-bold text-green-400">+11</div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Send Likes Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-purple-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-slate-400 mt-2">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                1M+
              </div>
              <div className="text-slate-400 mt-2">Likes Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-slate-400 mt-2">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-400">
          <p>&copy; 2026 GV VENOM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
