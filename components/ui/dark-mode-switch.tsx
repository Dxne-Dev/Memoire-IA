"use client"

import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Sun, Moon } from "lucide-react"

export function DarkModeSwitch() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const handleThemeChange = async (checked: boolean) => {
    const newTheme = checked ? "dark" : "light"
    setTheme(newTheme)
    try {
      await fetch("/api/user/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme })
      })
    } catch {}
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className={`w-4 h-4 transition-transform duration-300 ${isDark ? 'scale-90 opacity-60' : 'scale-100 opacity-100'}`} />
      <Switch
        checked={isDark}
        onCheckedChange={handleThemeChange}
        aria-label="Toggle dark mode"
        className="transition-colors duration-300 bg-input data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-purple-600 data-[state=unchecked]:bg-gray-200"
      />
      <Moon className={`w-4 h-4 transition-transform duration-300 ${isDark ? 'scale-100 opacity-100' : 'scale-90 opacity-60'}`} />
    </div>
  )
}
