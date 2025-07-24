'use client'

import type React from 'react'
import { createContext, useContext, useState } from 'react'

interface ThemeContextType {
   isDark: boolean
   toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
   const [isDark, setIsDark] = useState(false)

   const toggleTheme = () => {
      setIsDark(!isDark)
   }

   return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
   const context = useContext(ThemeContext)
   if (context === undefined) {
      throw new Error('useTheme must be used within a ThemeProvider')
   }
   return context
}
