import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export default function SignIn({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  const goToSignUp = () => navigate('/signUp');

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
        // else if (error.code === 'auth/too-many-requests') {
        //   message = "Too many attempts. Access temporarily disabled.";
        // }
        setErr(message);
      });
  }


  return (
    <div className="min-h-screen bg-linear-to-br from-[#1A1A2E] via-[#2D3561] to-[#1A1A2E] flex items-center justify-center font-sans">
      {/* Blobs */}
      <div className="fixed -top-20 -right-20 w-80 h-80 rounded-full bg-teal-400 opacity-10 pointer-events-none" />
      <div className="fixed -bottom-16 -left-16 w-64 h-64 rounded-full bg-teal-400 opacity-10 pointer-events-none" />

      <div className="w-full max-w-[420px] mx-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-8 sm:px-10 sm:py-11 shadow-2xl">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-teal-400 flex items-center justify-center font-extrabold text-lg text-[#1A1A2E]">₦</div>
          <div>
            <p className="m-0 font-extrabold text-white text-lg">Books-Flow</p>
            <p className="m-0 text-xs text-white/60">Business Bookkeeping</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
        <p className="text-sm text-white/60 mb-7">Sign in to your account to continue</p>

        {err && (
          <div className="bg-red-100 border border-red-300 rounded-lg px-4 py-2.5 mb-4 text-sm text-red-500">{err}</div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-semibold text-white/80 mb-1.5">Email address</label>
          <input
            type="email"
            placeholder="input your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-white/40 text-sm outline-none font-sans"
          />
        </div>
        <div className="mb-2.5">
          <label className="block text-xs font-semibold text-white/80 mb-1.5">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={e => setPass(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-white/40 text-sm outline-none font-sans"
          />
        </div>
        <div className="text-right mb-6">
          <span className="text-xs text-teal-400 font-semibold cursor-pointer">Forgot password?</span>
        </div>

        <button
          onClick={handleSubmit}
          className={`w-full py-3.5 rounded-xl font-bold text-base text-[#1A1A2E] border-none cursor-pointer transition-colors ${loading ? "bg-teal-600" : "bg-teal-400"}`}
        >
          {loading ? "Signing in…" : "Sign In →"}
        </button>

        <p className="text-center text-sm text-white/60 mt-6 mb-0">
          Don't have an account?{" "}
          <span onClick={goToSignUp} className="text-teal-400 font-bold cursor-pointer">Create account</span>
        </p>
      </div>
    </div>
  );
}