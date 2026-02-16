'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

useEffect(() => {
  let channel

  async function init() {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      window.location.href = '/'
      return
    }

    setUser(data.user)
    await fetchBookmarks()

    channel = supabase
      .channel('realtime-bookmarks')
      .on(
        'postgres_changes',
        {
          event: 'DELETE', // 👈 listen specifically for delete
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${data.user.id}`,
        },
        (payload) => {
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== payload.old.id)
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${data.user.id}`,
        },
        (payload) => {
          setBookmarks((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()
  }

  init()

  return () => {
    if (channel) supabase.removeChannel(channel)
  }
}, [])


  async function checkUser() {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      window.location.href = '/'
    } else {
      setUser(data.user)
      fetchBookmarks()
      subscribeRealtime(data.user.id)
    }
  }

  async function fetchBookmarks() {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    setBookmarks(data || [])
  }

  function subscribeRealtime(userId) {
    supabase
      .channel('realtime-bookmarks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchBookmarks()
        }
      )
      .subscribe()
  }

  async function addBookmark(e) {
    e.preventDefault()
    if (!title || !url) return

    await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ])

    setTitle('')
    setUrl('')
  }

  async function deleteBookmark(id) {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 px-6 py-10">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back 👋
          </h1>
          <p className="text-gray-600">
            Manage your saved links in one place
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition hover:cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Total Bookmarks</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {bookmarks.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Synced</h3>
          <p className="text-3xl font-bold text-green-600">Live ⚡</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Security</h3>
          <p className="text-3xl font-bold text-purple-600">Private 🔐</p>
        </div>
      </div>

      {/* Add Bookmark Card */}
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-6">
          Add New Bookmark
        </h2>

        <form
          onSubmit={addBookmark}
          className="grid md:grid-cols-3 gap-4"
        >
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <input
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <button className="bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition hover:cursor-pointer">
            Add
          </button>
        </form>
      </div>

      {/* Bookmarks List */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">
          Your Bookmarks
        </h2>

        {bookmarks.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
            No bookmarks yet.
            <br />
            Start by adding your first link 🚀
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bookmarks.map((b) => (
              <div
                key={b.id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">
                    {b.title}
                  </h3>
                  <a
                    href={b.url}
                    target="_blank"
                    className="text-blue-600 text-sm break-all"
                  >
                    {b.url}
                  </a>
                </div>

                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="text-red-500 hover:text-red-700 transition hover:cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
