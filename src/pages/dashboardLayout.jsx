import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

// ── NAV ──
const navItems = [
  { to: "",            label: "Overview",     icon: "⊞", end: true },
  { to: "transaction", label: "Transactions", icon: "⇄" },
  { to: "invoices",     label: "Invoices",     icon: "◻" },
  { to: "settings",      label: "Settings",      icon: "⁕" },
  { to: "staff",        label: "Staff",        icon: "👥" },
];

const greetingHour = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [companyName, setCompanyName] = useState(() => {
    return user ? localStorage.getItem(`company_${user.uid}`) || 'Books-Flow Partner' : 'Books-Flow Partner';
  });
  const [ sidebarOpen, setSidebarOpen]=useState("");
  useEffect(() => {
    async function loadCompany() {
      if (!user) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().companyName) {
          setCompanyName(docSnap.data().companyName);
          localStorage.setItem(`company_${user.uid}`, docSnap.data().companyName);
        }
      } catch (err) {
        console.error("Error loading company name in layout: ", err);
      }
    }
    loadCompany();
  }, [user]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/');
    });
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[220px] bg-[#1A1A2E] flex flex-col overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 text-white/60 hover:text-white text-xl z-10"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg text-3xl flex items-center justify-center font-extrabold  text-[#1A1A2E]">📚</div>
            <div>
              <p className="m-0 font-bold text-white text-sm">Books-Flow</p>
              <p className="m-0 text-[10px] text-white/40 truncate w-[120px]">{companyName}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? 'bg-teal-500/20 text-teal-400 font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Sign Out */}
        {user && (
          <div className="px-4 py-4 border-t border-white/10 mt-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-[#1A1A2E] text-xs font-bold shadow-sm">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : '👤'}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-white text-xs font-semibold truncate m-0">{user.displayName || 'User'}</p>
                <p className="text-white/40 text-[10px] truncate m-0">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-semibold transition-all text-center cursor-pointer border border-red-500/20"
            >
              Sign Out ⤶
            </button>
          </div>
        )}
      </div>


      {/* Main */}
      <div className="flex flex-col min-h-screen md:ml-[220px]">
        {/* Top bar */}
        <header className="bg-white border-b border-stone-200 px-4 py-3 md:px-8 md:py-4 flex items-center justify-between shadow-sm">
          {/* Hamburger menu - mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 text-xl mr-3"
          >
            ☰
          </button>
          <div className="flex-1">
            <p className="text-stone-400 text-xs">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1 className="text-stone-800 font-bold text-lg leading-tight">{greetingHour()} 👋</h1>
          </div>
          {/* <button className="bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm shadow-orange-200">
            + New
          </button> */}
        </header>

        {/* Page */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
