import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'

export default function SignUp({ onSignUp }) {
  const [form, setForm] = useState({ name:"", company:"", email:"", pass:"", confirm:"" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const goToSignIn = () => navigate('/');

  function set(k,v) { setForm(f=>({...f,[k]:v})); }
  function handleSubmit() {
    if (!form.name||!form.company||!form.email||!form.pass) { setErr("All fields are required."); return; }
    if (form.pass !== form.confirm) { setErr("Passwords do not match."); return; }
    if (form.pass.length < 6) { setErr("Password must be at least 6 characters."); return; }
    setLoading(true); setErr("");
    createUserWithEmailAndPassword(auth, form.email, form.pass)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // Save company name and settings to Firestore db
        await setDoc(doc(db, "users", user.uid), {
          companyName: form.company,
          displayName: form.name
        }, { merge: true });
        
        // Save to local storage for backward compatibility and fast access
        localStorage.setItem(`company_${user.uid}`, form.company);

        return updateProfile(user, {
          displayName: form.name
        });
      })
      .then(() => {
        setLoading(false);
        if (typeof onSignUp === 'function') onSignUp();
        navigate('/dashboard');
      })
      .catch((error) => {
        setLoading(false);
        let message = error.message;
        if (error.code === 'auth/email-already-in-use') {
          message = "This email is already registered.";
        } else if (error.code === 'auth/invalid-email') {
          message = "Invalid email address format.";
        } else if (error.code === 'auth/weak-password') {
          message = "Password is too weak.";
        }
        setErr(message);
      });
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] via-[#2D3561] to-[#1A1A2E] flex items-center justify-center font-sans">
      {/* Blobs */}
      <div className="fixed -top-20 -right-20 w-80 h-80 rounded-full bg-teal-400 opacity-10 pointer-events-none" />
      <div className="fixed -bottom-16 -left-16 w-64 h-64 rounded-full bg-teal-400 opacity-10 pointer-events-none" />

      <div className="w-[420px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-10 py-11 shadow-2xl">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-teal-400 flex items-center justify-center font-extrabold text-lg text-[#1A1A2E]">₦</div>
          <div>
            <p className="m-0 font-extrabold text-white text-lg">Books-Flow</p>
            <p className="m-0 text-xs text-white/60">Business Bookkeeping</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
        <p className="text-sm text-white/60 mb-7">Start managing your books in minutes</p>

        {err && (
          <div className="bg-red-100 border border-red-300 rounded-lg px-4 py-2.5 mb-4 text-sm text-red-500">{err}</div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-semibold text-white/80 mb-1.5">Full name</label>
          <input
            type="text"
            placeholder="Adaeze Obi"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-white/40 text-sm outline-none font-sans"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-white/80 mb-1.5">Company name</label>
          <input
            type="text"
            placeholder="Acme Books Ltd"
            value={form.company}
            onChange={e => set("company", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-white/40 text-sm outline-none font-sans"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-white/80 mb-1.5">Email address</label>
          <input
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={e => set("email", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-white/40 text-sm outline-none font-sans"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-white/80 mb-1.5">Password</label>
          <input
            type="password"
            placeholder="Min 6 characters"
            value={form.pass}
            onChange={e => set("pass", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-white/40 text-sm outline-none font-sans"
          />
        </div>

        <div className="mb-2.5">
          <label className="block text-xs font-semibold text-white/80 mb-1.5">Confirm password</label>
          <input
            type="password"
            placeholder="Repeat password"
            value={form.confirm}
            onChange={e => set("confirm", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-white/40 text-sm outline-none font-sans"
          />
        </div>

        <button
          onClick={handleSubmit}
          className={`w-full py-3.5 rounded-xl font-bold text-base text-[#1A1A2E] border-none cursor-pointer transition-colors mt-6 ${loading ? "bg-teal-600" : "bg-teal-400"}`}
        >
          {loading ? "Creating account…" : "Create Account →"}
        </button>

        <p className="text-center text-sm text-white/60 mt-6 mb-0">
          Already have an account?{" "}
          <span onClick={goToSignIn} className="text-teal-400 font-bold cursor-pointer">Sign in</span>
        </p>
      </div>
    </div>
  );
}