import { NavLink, Outlet, useNavigate } from 'react-router-dom'

// ── NAV ──
const navItems = [
  { to: "Overview",    label: "Overview",    icon: "⊞" },
  { to: "transaction", label: "Transactions", icon: "⇄" },
  { to: "invoices",     label: "Invoices",     icon: "◻" },
  // { to: "accounts",     label: "Accounts",     icon: "≡" },
  { to: "settings",      label: "settings",      icon: "⁕" },
  { to: "staff",        label: "Staff",        icon: "👥" },
];

const greetingHour = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardLayout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <div className="w-[220px] bg-[#1A1A2E] min-h-screen flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-400 flex items-center justify-center font-extrabold text-base text-[#1A1A2E]">₦</div>
            <div>
              <p className="m-0 font-bold text-white text-sm">Books-Flow</p>
              <p className="m-0 text-[10px] text-white/40">Isla Books Ltd</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              // end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? 'bg-orange-50 text-orange-600 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>



          ))}


        </nav>

        {/* User */}
        {/* <div className="px-4 py-4 border-t border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-rose-300 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              👤
            </div>
            <div className="overflow-hidden">
              <p className="text-stone-700 text-xs font-semibold truncate">You</p>
              <p className="text-stone-400 text-xs truncate">dev1@liquidlift.app</p>
            </div>
          </div>
        </div> */}
        
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-stone-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-stone-400 text-xs">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1 className="text-stone-800 font-bold text-lg leading-tight">{greetingHour()} 👋</h1>
          </div>
          {/* <button className="bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm shadow-orange-200">
            + New
          </button> */}
        </header>

        {/* Page */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
