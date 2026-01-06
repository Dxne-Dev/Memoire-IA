'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { setTheme } = useTheme();

  useEffect(() => {
    async function syncUserTheme() {
      try {
        const res = await fetch('/api/user/me');
        if (!res.ok) return;
        const user = await res.json();
        if (user?.theme_preference) {
          setTheme(user.theme_preference);
        }
      } catch {}
    }
    syncUserTheme();
  }, [setTheme]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
