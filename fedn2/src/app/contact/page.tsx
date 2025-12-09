"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Clock3 } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#020d1e] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#1d4ed8,transparent_28%),radial-gradient(circle_at_80%_0%,#0ea5e9,transparent_25%),radial-gradient(circle_at_70%_70%,#6b21a8,transparent_24%)] opacity-30 blur-[120px]" />

      <header className="border-b border-white/10 bg-[#020d1e]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-100/80">Group6</p>
            <h1 className="text-2xl font-bold">Contact</h1>
            <p className="text-sm text-gray-400">We would love to hear from you.</p>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:border-white/40"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
            <h3 className="text-lg font-semibold">Contact info</h3>
            <p className="mt-1 text-sm text-gray-300">Reach us via email, phone, or visit our HQ.</p>
            <div className="mt-4 space-y-3 text-sm text-gray-200">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p>support@group6movie.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <p>+84 1900 123 456</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="font-semibold text-white">Office</p>
                  <p>123 Nguyen Trai, Hanoi, Vietnam</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="font-semibold text-white">Hours</p>
                  <p>Mon - Sun: 8:00 - 22:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
            <h3 className="text-lg font-semibold">Need quick help?</h3>
            <p className="mt-2 text-sm text-gray-300">
              Check our FAQ or start a new ticket from your profile if you have issues with bookings or payments.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link
                href="/booking"
                className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
              >
                Book a ticket
              </Link>
              <Link
                href="/user/profile"
                className="rounded-xl border border-white/15 px-4 py-2 font-semibold hover:border-white/40"
              >
                Go to Profile
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
