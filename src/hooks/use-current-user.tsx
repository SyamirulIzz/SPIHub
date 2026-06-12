
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { USERS, User } from "@/lib/mock-data"

interface UserContextType {
  currentUser: User | null
  isLoaded: boolean
  login: (email: string) => boolean
  logout: () => void
  switchUser: (userId: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
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
    // Use window.location for hard redirect on logout to clear all states
    window.location.href = "/login"
  }

  const switchUser = (userId: string) => {
    localStorage.setItem("simulated_user_id", userId)
    window.location.reload()
  }

  return (
    <UserContext.Provider value={{ currentUser, isLoaded, login, logout, switchUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useCurrentUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useCurrentUser must be used within a UserProvider")
  }
  return context
}
