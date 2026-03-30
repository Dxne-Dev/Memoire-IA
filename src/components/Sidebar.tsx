import { NavLink, useNavigate } from 'react-router-dom'
import { Home, PenTool, BarChart2, Plus, Clock, User, Leaf, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { clsx } from 'clsx'

const NAV = [
  { label: 'Dashboard',  to: '/dashboard', Icon: Home      },
  { label: 'Mémoires',   to: '/projects',  Icon: PenTool   },
  { label: 'Analyser',   to: '/documents', Icon: BarChart2 },
  { label: 'Nouveau',    to: '/new',       Icon: Plus      },
  { label: 'Historique', to: '/history',   Icon: Clock     },
]

interface SidebarProps {
  open: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function Sidebar({ open, onMouseEnter, onMouseLeave }: SidebarProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <aside 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={clsx(
        'fixed top-3 left-3 bottom-3 z-40 flex flex-col transition-all duration-300 ease-in-out',
        'rounded-[2rem] glass-dark shadow-[0_8px_40px_rgba(0,0,0,0.5)]',
        'bg-[#0d2b22]/70',
        open ? 'w-52' : 'w-[4.5rem]',
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-20 flex-shrink-0 relative">
        <NavLink to="/dashboard"
          className="flex items-center justify-center w-11 h-11 rounded-full
            bg-white/15 border border-white/25 text-white
            hover:scale-105 transition-transform duration-200 shadow-inner"
        >
          <Leaf className="w-5 h-5" fill="white" stroke="white" strokeWidth={1.5} />
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-2 overflow-hidden px-3">
        {NAV.map(({ label, to, Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => clsx(
              'relative flex items-center h-12 rounded-full group transition-all duration-200',
              isActive ? 'bg-white shadow-sm' : 'hover:bg-white/10'
            )}
          >
            {({ isActive }) => (
              <>
                <span className={clsx(
                  'relative z-10 flex items-center justify-center w-12 h-12 flex-shrink-0 transition-colors duration-200',
                  isActive ? 'text-[#0d2b22]' : 'text-white/55 group-hover:text-white',
                )}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
                </span>
                {open && (
                  <span className={clsx(
                    'relative z-10 ml-1 pr-4 text-sm font-semibold whitespace-nowrap transition-colors duration-200',
                    isActive ? 'text-[#0d2b22]' : 'text-white/65 group-hover:text-white',
                  )}>
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User / Footer */}
      <div className="flex-shrink-0 p-3 pb-5 space-y-2">
        {/* Sign out */}
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl
            text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs font-semibold"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {open && 'Déconnexion'}
        </button>

        {/* Avatar */}
        {open ? (
          <div className="flex items-center gap-3 px-3 py-2.5
            bg-white/6 border border-white/8 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 rounded-full bg-emerald-500/25 border border-emerald-400/25
              flex items-center justify-center text-xs font-bold text-emerald-300 flex-shrink-0">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'E'}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {user?.email?.split('@')[0] || 'Étudiant'}
              </p>
              <p className="text-xs text-white/30 truncate">Compte actif</p>
            </div>
          </div>
        ) : (
          <div className="w-11 h-11 mx-auto flex items-center justify-center rounded-full
            bg-white/6 border border-white/8 text-white/40 transition-colors">
            <User className="w-5 h-5" />
          </div>
        )}
      </div>
    </aside>
  )
}
