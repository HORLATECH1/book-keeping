import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { FiGrid, FiRepeat, FiFileText, FiSettings, FiUsers, FiBookOpen, FiUser, FiSun, FiMoon, FiMenu, FiLogOut,FiX} from 'react-icons/fi'

// ── NAV ──
const navItems = [
  { to: "",            label: "Overview",     icon: <FiGrid />, end: true },
  { to: "transaction", label: "Transactions", icon: <FiRepeat /> },
  { to: "invoices",     label: "Invoices",     icon: <FiFileText /> },
  { to: "settings",      label: "Settings",      icon: <FiSettings /> },
  { to: "staff",        label: "Staff",        icon: <FiUsers /> },
];

const greetingHour = () => {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Good morning', icon: <FiSun className="text-amber-500" /> }
  if (h < 17) return { text: 'Good afternoon', icon: <FiSun className="text-orange-500" /> }
  return { text: 'Good evening', icon: <FiMoon className="text-indigo-400" /> }
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [companyName, setCompanyName] = useState(() => {
    return user ? localStorage.getItem(`company_${user.uid}`) || 'Books-Flow Partner' : 'Books-Flow Partner';
  });
  const [ sidebarOpen, setSidebarOpen]=useState(false);

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

  const greeting = greetingHour();

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0B0C10] flex flex-col overflow-y-auto
        transform transition-all duration-300 ease-in-out border-r border-white/5
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-5 right-5 text-white/40 hover:text-white transition-colors z-10 cursor-pointer"
        >
          <FiX size={24} />
        </button>

        {/* Logo */}
        <div className="px-6 pt-8 pb-6 mb-2">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <FiBookOpen size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="m-0 font-bold text-white text-lg tracking-wide">Books-Flow</h2>
              <p className="m-0 text-xs text-teal-400/80 font-medium tracking-wider uppercase truncate w-[140px] mt-0.5">{companyName}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group ${isActive
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-900/50 scale-[1.02]'
                  : 'text-stone-400 hover:text-white hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/20'
                }`
              }
            >
              <span className={`text-[1.15rem] transition-colors ${({isActive}) => isActive ? 'text-white' : 'text-stone-400 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Sign Out */}
        {user && (
          <div className="p-4 mt-auto">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 border border-stone-600 shadow-inner">
                  <FiUser size={16} />
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-white text-sm font-semibold truncate m-0">{user.displayName || 'User'}</p>
                  <p className="text-stone-400 text-xs truncate m-0 mt-0.5">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 text-xs font-bold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-red-500/20 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20"
              >
                <FiLogOut size={14} />
                SIGN OUT
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main */}
      <div className="flex flex-col min-h-screen md:ml-[260px]">
        {/* Top bar */}
        <header className="bg-white border-b border-stone-200/60 px-5 py-4 md:px-8 md:py-5 flex items-center justify-between sticky top-0 z-30 shadow-sm/50 backdrop-blur-md bg-white/90">
          <div className="flex items-center gap-4">
            {/* Hamburger menu - mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
            >
              <FiMenu size={20} />
            </button>
            <div className="flex-1">
              <p className="text-stone-500 text-xs font-medium uppercase tracking-wider mb-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              <h1 className="text-stone-800 font-bold text-xl md:text-2xl leading-tight flex items-center gap-2.5">
                {greeting.text} 
                <span className="animate-pulse">{greeting.icon}</span>
              </h1>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-5 md:p-8 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
