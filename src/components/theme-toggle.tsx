"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"
import { SidebarMenuButton } from "./ui/sidebar"
import { useLanguage } from "@/context/language-context"

const translations = {
    en: {
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
    },
    pt: {
        darkMode: 'Modo Escuro',
        lightMode: 'Modo Claro',
    }
}

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const { language } = useLanguage()
  const t = translations[language]

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <>
        <div className="group-data-[collapsible=icon]:hidden flex w-full items-center justify-between rounded-md p-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:cursor-pointer" onClick={toggleTheme}>
            <span>{t.darkMode}</span>
            <Switch
                id="theme-toggle"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                className="hover:cursor-pointer"
            />
        </div>
        <div className="hidden group-data-[collapsible=icon]:block">
            <SidebarMenuButton onClick={toggleTheme} tooltip={theme === 'dark' ? t.lightMode : t.darkMode}>
                {theme === 'dark' ? <Sun/> : <Moon />}
            </SidebarMenuButton>
        </div>
    </>
  )
}
