import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import SignIn from './pages/signIn'
import SignUp from './pages/signUp'
import DashboardLayout from './pages/dashboardLayout'
import Overview from './pages/dashboard/overview'
import Settings from './pages/dashboard/settings'
import Staff from './pages/dashboard/staff'
import Transaction from './pages/dashboard/transaction'
import Invoices from './pages/dashboard/invoices'

// Protected Route Component (Redirects to Sign In if not logged in)
const ProtectedRoute = ({ children, user, loading }) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-500 font-semibold">Loading Books-Flow...</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Public Only Route Component (Redirects to Dashboard if already logged in)
const PublicRoute = ({ children, user, loading }) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-teal-400 font-semibold">Loading Books-Flow...</p>
        </div>
      </div>
    );
  }
  if (user) {
    return <Navigate to="/da
    \\\\\\\\\\\\shboard" replace />;
  }
  return children;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
            // <PublicRoute user={user} loading={loading}>
              <SignIn />
            // </PublicRoute>
          }
        />
        <Route 
          path='/signUp' 
          element={
            <PublicRoute user={user} loading={loading}>
              <SignUp />
            </PublicRoute>
          } 
        />
        <Route 
          path='/dashboard' 
          element={
            <ProtectedRoute user={user} loading={loading}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview/>}/>
          <Route path='settings' element={<Settings/>} />
          <Route path='staff' element={<Staff/>} />
          <Route path='transaction' element={<Transaction/>} />
          <Route path='invoices' element={<Invoices/>} />
        </Route>
        {/* Fallback route */}
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App