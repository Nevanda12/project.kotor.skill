'use client'

import { useEffect } from 'react'

export default function DataInitializer() {
  useEffect(() => {
    const seedDatabase = async () => {
      try {
        // Check if database has users
        const usersRes = await fetch('/api/users')
        if (usersRes.ok) {
          const users = await usersRes.json()
          if (users.length === 0) {
            // Seed the database
            console.log('Seeding database...')
            await fetch('/api/seed', { method: 'POST' })
            console.log('Database seeded successfully')
            // Reload the page to load the new data
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          }
        }
      } catch (error) {
        console.error('Error initializing data:', error)
      }
    }

    seedDatabase()
  }, [])

  return null
}
