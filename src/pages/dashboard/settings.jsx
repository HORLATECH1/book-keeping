import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { updateProfile, updatePassword, deleteUser, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none shadow-md ${
      value ? "bg-linear-to-r from-slate-900 to-teal-500" : "bg-slate-300"
    }`}
  >
    <span
      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-300 ${
        value ? "left-7" : "left-1"
      }`}
    />
  </button>
);

export default function Settings() {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [notifications, setNotifications] = useState(true);
  const [emails, setEmails] = useState(false);
  const [digest, setDigest] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.companyName) {
            setCompany(data.companyName);
            localStorage.setItem(`company_${user.uid}`, data.companyName);
          }
        } else {
          setCompany(localStorage.getItem(`company_${user.uid}`) || "");
        }
      } catch (e) {
        console.error("Error loading user profile:", e);
        setCompany(localStorage.getItem(`company_${user.uid}`) || "");
      }
    }

    loadProfile();
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) return;
    setLoading(true);
    setMsg("");
    setErr("");
    try {
      await updateProfile(user, { displayName });
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        { companyName: company, displayName },
        { merge: true }
      );
      localStorage.setItem(`company_${user.uid}`, company);
      setMsg("Profile updated successfully!");
    } catch (e) {
      console.error("Save settings failed:", e);
      setErr(e.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) {
      setErr("You must be signed in to change your password.");
      return;
    }

    if (!newPassword) {
      setErr("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setErr("Your new password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setMsg("");
    setErr("");

    try {
      await updatePassword(user, newPassword);
      setMsg("Password updated successfully.");
      setNewPassword("");
    } catch (e) {
      console.error("Error updating password:", e);
      if (e.code === "auth/requires-recent-login") {
        setErr("Please sign out and sign in again before changing your password.");
      } else {
        setErr(e.message || "Failed to update password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      setErr("You must be signed in to delete your account.");
      return;
    }

    if (!window.confirm("This will permanently delete your account and all data. Continue?")) return;

    setDeleting(true);
    setErr("");
    setMsg("");

    try {
      const userDocRef = doc(db, "users", user.uid);
      try {
        await deleteDoc(userDocRef);
      } catch (fireErr) {
        console.error("Failed to delete user document:", fireErr);
      }

      try {
        await deleteUser(user);
      } catch (authErr) {
        console.error("Failed to delete auth user:", authErr);
        if (authErr.code === "auth/requires-recent-login") {
          setErr("Please sign out and sign in again before deleting your account (recent login required).");
        } else {
          setErr(authErr.message || "Failed to delete account.");
        }
        return;
      }

      localStorage.removeItem(`company_${user.uid}`);
      try {
        await signOut(auth);
      } catch (sErr) {
        console.error("Sign out failed after deletion:", sErr);
      }
      setMsg("Account deleted. Redirecting...");
      setTimeout(() => (window.location.href = "/"), 800);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto p-4 bg-slate-50 min-h-screen font-sans">
      <div>
        <h2 className="text-slate-900 font-bold text-2xl">Settings ⚙️</h2>
        <p className="text-slate-500 text-sm mt-1">Customize your experience.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all space-y-5">
        <h3 className="text-slate-800 font-semibold text-sm uppercase tracking-wide">Your Profile</h3>

        {msg && (
          <div className="bg-teal-50 border border-teal-200 text-teal-700 rounded-xl px-4 py-2.5 text-xs font-semibold">✓ {msg}</div>
        )}
        {err && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-xs font-semibold">⚠ {err}</div>
        )}

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-slate-900 via-blue-700 to-teal-500 flex items-center justify-center text-3xl shadow-lg text-white font-bold">
            {displayName ? displayName.charAt(0).toUpperCase() : "👤"}
          </div>

          <div>
            <p className="text-slate-800 font-semibold">{displayName || "User"}</p>
            <p className="text-slate-500 text-xs mt-0.5">{user?.email || "No email available"}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-slate-600 text-xs font-medium block mb-1.5">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="What should we call you?"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-200 transition-all placeholder-slate-400"
            />
          </div>

          <div>
            <label className="text-slate-600 text-xs font-medium block mb-1.5">Company Name</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your company name"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-200 transition-all placeholder-slate-400"
            />
          </div>
        </div>

        <button
          onClick={handleSaveChanges}
          disabled={loading}
          className="bg-linear-to-r from-slate-900 to-teal-500 hover:from-slate-800 hover:to-teal-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all space-y-5">
        <h3 className="text-slate-800 font-semibold text-sm uppercase tracking-wide">Preferences</h3>
        {[
          { label: "Push Notifications", desc: "Get alerted when something important happens", value: notifications, onChange: setNotifications, emoji: "🔔" },
          { label: "Email Digest", desc: "A weekly summary straight to your inbox", value: emails, onChange: setEmails, emoji: "📬" },
          { label: "Activity Updates", desc: "Know when teammates do things", value: digest, onChange: setDigest, emoji: "👀" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-none">
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.emoji}</span>
              <div>
                <p className="text-slate-800 text-sm font-medium">{item.label}</p>
                <p className="text-slate-500 text-xs">{item.desc}</p>
              </div>
            </div>
            <Toggle value={item.value} onChange={item.onChange} />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all space-y-5">
        <h3 className="text-slate-800 font-semibold text-sm uppercase tracking-wide">Security</h3>
        <button
          onClick={() => setShowPasswordReset((prev) => !prev)}
          className="w-full text-left rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-teal-400 hover:bg-teal-50"
        >
          {showPasswordReset ? "Hide Password Reset" : "Reset Password"}
        </button>
        {showPasswordReset && (
          <div className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-slate-700 text-sm font-semibold">Enter a new password below and save it securely.</p>
            <input
              va lue={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            />
            <button
              onClick={handleChangePassword}
              className="w-full rounded-2xl bg-teal-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              Save New Password
            </button>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
        <p className="text-red-400 text-sm font-semibold mb-1">Danger Zone</p>
        <p className="text-slate-400 text-xs mb-4">These actions cannot be undone. Proceed carefully.</p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="border border-red-500 text-red-400 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          {deleting ? "Deleting..." : "Delete My Account"}
        </button>
      </div>
    </div>
  );
}
