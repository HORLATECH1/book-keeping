import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'
import { FiBookOpen } from 'react-icons/fi'

export default function SignIn({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  

  const goToSignUp = () => navigate('/signUp');

  function handleResetPassword() {
    if (!email) {
      setErr("Please enter your email address to reset password.");
      return;
    }
    setLoading(true); setErr("");
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        alert("Password reset email sent. Please check your inbox.");
      })
      .catch((error) => {
        setLoading(false);
        setErr(error.message);
      });
  }

  function handleSubmit() {
    if (!email || !pass) { setErr("Please fill in all fields."); 
      return; 
    }
    setLoading(true); setErr("");
    signInWithEmailAndPassword(auth, email, pass)
      .then(() => {
        setLoading(false);
        if (typeof onSignIn === 'function') onSignIn();
        navigate('/dashboard');
      })
      .catch((error) => {
        setLoading(false);
        let message = error.message;
        if (
          error.code === 'auth/invalid-credential' ||
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/user-not-found'
        ) {
          message = "Invalid email or password.";
        } else if (error.code === 'auth/invalid-email') {
          message = "Invalid email address format.";
        } 
        setErr(message);
      });
  }


  return (
    <div className="min-h-screen bg-[#070A12] text-white flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <aside className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0B0C10] p-10 shadow-2xl shadow-cyan-500/10">
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-teal-500/15 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                <FiBookOpen size={24} className="stroke-[2.5]" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-teal-300/90">Books-Flow</p>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Business Bookkeeping</p>
              </div>
            </div>
            <div className="mt-10 max-w-xl">
              <h1 className="text-4xl font-semibold tracking-tight text-white">Your books. Balanced.</h1>
              <p className="mt-4 text-sm leading-7 text-slate-400">Sign in to continue managing your finances.</p>
            </div>
            <div className="grid gap-4 mt-10 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Insight</p>
                <p className="mt-4 text-3xl font-semibold text-white">82%</p>
                <p className="mt-2 text-sm text-slate-400">weekly cash flow</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Trusted</p>
                <p className="mt-4 text-3xl font-semibold text-white">500</p>
                <p className="mt-2 text-sm text-slate-400">active team users</p>
              </div>
            </div>
            <div className="mt-10 rounded-[2rem] bg-white/5 p-6 border border-teal-500/10">
              <p className="text-sm text-teal-200 font-semibold">Quote Of The Day</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">"In the 21st century, illiteracy isn't about being unable to read or write — it's about being unable to learn, unlearn, and relearn." --Alvin Toffler.</p>
            </div>
          </div>
        </aside>

        <section className="rounded-[2rem] bg-white/95 border border-slate-200/70 p-8 shadow-xl shadow-slate-900/10 backdrop-blur-xl text-slate-950">
          <div className="mb-8">
            <span className="inline-flex rounded-full bg-teal-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-teal-700">Sign in</span>
            <h2 className="mt-5 text-3xl font-semibold">Welcome back</h2>
            <p className="mt-3 text-sm text-slate-500">Enter your credentials to access the Books-Flow dashboard.</p>
          </div>

          {err && (
            <div className="rounded-3xl border border-red-200/70 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">{err}</div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 mb-2">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={pass}
                onChange={e => setPass(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-24 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-11 text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              Forgot password?
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className={`mt-8 w-full rounded-3xl py-4 text-sm font-semibold text-white transition ${loading ? "bg-teal-700" : "bg-teal-600 hover:bg-teal-700"}`}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don’t have an account?{' '}
            <span onClick={goToSignUp} className="font-semibold text-teal-600 hover:text-teal-700 cursor-pointer">Create account</span>
          </p>
        </section>
      </div>
    </div>
  );
}