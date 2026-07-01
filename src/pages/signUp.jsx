import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { FiBookOpen } from 'react-icons/fi'

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
              <h1 className="text-4xl font-semibold tracking-tight text-white">Create account</h1>
            </div>
            <div className="grid gap-4 mt-10 sm:grid-cols-2">
              {/* <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Platform</p>
                <p className="mt-4 text-3xl font-semibold text-white">Real-time</p>
                <p className="mt-2 text-sm text-slate-400">income overview</p>
              </div> */}
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Built for</p>
                <p className="mt-4 text-3xl font-semibold text-white">Teams</p>
                <p className="mt-2 text-sm text-slate-400">and small businesses</p>
              </div>
            </div>
            {/* <div className="mt-10 rounded-[2rem] bg-white/5 p-6 border border-teal-500/10">
              <p className="text-sm text-teal-200 font-semibold">Dashboard-style interface</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">Your onboarding screen now has the same polished aesthetic as the rest of the Books-Flow app.</p>
            </div> */}
          </div>
        </aside>

        <section className="rounded-[2rem] bg-white/95 border border-slate-200/70 p-8 shadow-xl shadow-slate-900/10 backdrop-blur-xl text-slate-950">
          <div className="mb-8">
            <span className="inline-flex rounded-full bg-teal-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-teal-700">Sign up</span>
            <h2 className="mt-5 text-3xl font-semibold">Create account</h2>
          </div>

          {err && (
            <div className="rounded-3xl border border-red-200/70 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">{err}</div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 mb-2">Full name</label>
              <input
                type="text"
                placeholder="Jimoh Islamiat"
                value={form.name}
                onChange={e => set("name", e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 mb-2">Company name</label>
              <input
                type="text"
                placeholder="company name"
                value={form.company}
                onChange={e => set("company", e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 mb-2">Email address</label>
              <input
                type="email"
                placeholder="email@gmail.com"
                value={form.email}
                onChange={e => set("email", e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 mb-2">Password</label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={form.pass}
                onChange={e => set("pass", e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 mb-2">Confirm password</label>
              <input
                type="password"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={e => set("confirm", e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className={`mt-8 w-full rounded-3xl py-4 text-sm font-semibold text-white transition ${loading ? "bg-teal-700" : "bg-teal-600 hover:bg-teal-700"}`}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <span onClick={goToSignIn} className="font-semibold text-teal-600 hover:text-teal-700 cursor-pointer">Sign in</span>
          </p>
        </section>
      </div>
    </div>
  );
}