import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { clsx } from 'clsx'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#071510]">
      <Sidebar 
        open={sidebarOpen} 
        onMouseEnter={() => setSidebarOpen(true)} 
        onMouseLeave={() => setSidebarOpen(false)} 
      />
      <main className={clsx(
        "flex-1 min-h-screen overflow-x-hidden transition-all duration-300 ease-in-out",
        sidebarOpen ? "ml-[220px]" : "ml-[82px]"
      )}>
        <Outlet />
      </main>
    </div>
  )
}
