'use client'

import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-800">
          SmartBookmark
        </h1>
        <button
          onClick={login}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition hover:cursor-pointer"
        >
          Sign in with Google
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16">
        
        {/* Left Side */}
        <div className="max-w-xl space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Save Your Favorite Links.
            <br />
            Access Them Anywhere.
          </h2>

          <p className="text-lg text-gray-600">
            SmartBookmark is a simple, private, real-time bookmark manager 
            powered by Google login and Supabase. 
            Your links stay secure and instantly synced across tabs.
          </p>

          <div className="flex gap-4">
            <button
              onClick={login}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition hover:cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="mt-10 md:mt-0">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
            alt="Productivity workspace"
            className="rounded-2xl shadow-2xl w-[500px] object-cover"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16 px-8 md:px-20">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why SmartBookmark?
        </h3>

        <div className="grid md:grid-cols-3 gap-10 text-center">
          
          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3">🔐 Private</h4>
            <p className="text-gray-600">
              Each user’s bookmarks are fully private using secure row-level security.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3">⚡ Real-Time</h4>
            <p className="text-gray-600">
              Add a bookmark in one tab and see it appear instantly in another.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3">☁️ Cloud-Based</h4>
            <p className="text-gray-600">
              Access your bookmarks from anywhere with secure Google login.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600">
        © {new Date().getFullYear()} SmartBookmark — Built with Next.js & Supabase
      </footer>
    </div>
  )
}
