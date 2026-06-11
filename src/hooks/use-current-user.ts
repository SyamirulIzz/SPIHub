
"use client"

import { useState, useEffect } from "react"
import { USERS, User } from "@/lib/mock-data"

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<User>(USERS[0])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedUserId = localStorage.getItem("simulated_user_id")
    const foundUser = USERS.find(u => u.id === savedUserId)
    if (foundUser) {
      setCurrentUser(foundUser)
    }
    setIsLoaded(true)
  }, [])

  const switchUser = (userId: string) => {
    localStorage.setItem("simulated_user_id", userId)
    window.location.reload()
  }

  return { currentUser, switchUser, isLoaded }
}
