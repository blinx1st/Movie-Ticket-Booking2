"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Settings, Lock, Bell, Moon, Sun, Save } from "lucide-react";

export default function SettingsPage() {
  const [currentTab, setCurrentTab] = useState("general"); // 'general' | 'security' | 'notifications'

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black dark:text-white">Account Settings</h2>
        <nav>
          <ol className="flex items-center gap-2 text-sm font-medium">
            <li><Link href="/admin/dashboard" className="hover:text-blue-600">Home / Admin /</Link></li>
            <li className="text-blue-600">Settings</li>
          </ol>
        </nav>
      </div>

      {/* Tabs / Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 space-x-6">
        {[
          { id: 'general', name: 'General', icon: Settings },
          { id: 'security', name: 'Security', icon: Lock },
          { id: 'notifications', name: 'Notifications', icon: Bell },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold transition-colors ${
              currentTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <tab.icon className="w-4 h-4"/> {tab.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-gray-700 dark:bg-gray-800 p-6 md:p-8">
        
        {currentTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-black dark:text-white">General Preferences</h3>
            <p className="text-gray-500">Manage display language, theme, and timezone.</p>
            
            {/* Theme Toggle Example */}
            <div className="flex items-center justify-between border-t pt-4 border-gray-200 dark:border-gray-700">
                <div>
                    <p className="font-medium text-black dark:text-white">App Theme</p>
                    <p className="text-sm text-gray-500">Choose between Light or Dark Mode.</p>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-400 hover:ring-2 ring-blue-500 transition">
                        <Sun className="w-5 h-5"/>
                    </button>
                    <button className="p-2 rounded-full bg-blue-600 text-white hover:ring-2 ring-blue-500 transition">
                         <Moon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
          </div>
        )}

        {currentTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-black dark:text-white">Security & Password</h3>
            <p className="text-gray-500">Change your password and manage two-factor authentication.</p>
            
            <div className="max-w-md space-y-4">
                <input type="password" placeholder="Current Password" className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none dark:border-gray-600 dark:bg-gray-700"/>
                <input type="password" placeholder="New Password" className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none dark:border-gray-600 dark:bg-gray-700"/>
                <input type="password" placeholder="Confirm New Password" className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none dark:border-gray-600 dark:bg-gray-700"/>
                <button className="flex items-center gap-2 rounded bg-red-600 py-3 px-6 font-medium text-white hover:bg-red-700 transition">
                    <Lock className="w-5 h-5"/> Change Password
                </button>
            </div>
          </div>
        )}

        {currentTab === 'notifications' && (
             <div className="space-y-6">
                <h3 className="text-xl font-bold text-black dark:text-white">Notification Preferences</h3>
                <p className="text-gray-500">Control how you receive updates about new bookings and system alerts.</p>
                
                <div className="flex items-center justify-between border-t pt-4 border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-black dark:text-white">Email Alerts for New Booking</p>
                    {/* Toggle Switch Placeholder */}
                    <div className="w-12 h-6 rounded-full bg-green-500 relative cursor-pointer">
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform translate-x-full"></div>
                    </div>
                </div>
             </div>
        )}
        
      </div>
    </div>
  );
}