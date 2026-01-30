"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

export function ThemeSwitch() {
  const { setTheme, theme } = useTheme()

  return (
    <Switch
      id="theme"
      checked={theme === 'dark'}
      onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle dark mode"
    />
  )
}
