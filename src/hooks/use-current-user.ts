
"use client"

import { useState, useEffect } from "react"
import { USERS, User } from "@/lib/mock-data"

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedUserId = localStorage.getItem("simulated_user_id")
    const foundUser = USERS.find(u => u.id === savedUserId)
    if (foundUser) {
      setCurrentUser(foundUser)
    }
    setIsLoaded(true)
  }, [])

  const login = (email: string) => {
    const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (user) {
      localStorage.setItem("simulated_user_id", user.id)
      setCurrentUser(user)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("simulated_user_id")
    setCurrentUser(null)
    window.location.href = "/login"
  }

  const switchUser = (userId: string) => {
    localStorage.setItem("simulated_user_id", userId)
    window.location.reload()
  }

  return { currentUser, login, logout, switchUser, isLoaded }
}
