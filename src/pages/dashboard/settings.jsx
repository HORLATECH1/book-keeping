import { useState } from "react";

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none shadow-md ${
      value
        ? "bg-gradient-to-r from-slate-900 to-teal-500"
        : "bg-slate-300"
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
  const [notifications, setNotifications] = useState(true);
  const [emails, setEmails] = useState(false);
  const [digest, setDigest] = useState(true);

  return (
    <div className="space-y-6 max-w-lg mx-auto p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-slate-900 font-bold text-2xl">
          Settings ⚙️
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Customize your experience.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all space-y-5">
        <h3 className="text-slate-800 font-semibold text-sm uppercase tracking-wide">
          Your Profile
        </h3>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-700 to-teal-500 flex items-center justify-center text-3xl shadow-lg">
            👤
          </div>

          <div>
            <p className="text-slate-800 font-semibold">You</p>
            <p className="text-slate-500 text-xs mt-0.5">
              dev1@liquidlift.app
            </p>

            <button className="text-teal-500 text-xs hover:text-teal-600 transition-colors mt-1.5 font-medium">
              Change photo →
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              label: "Display Name",
              value: "You",
              placeholder: "What should we call you?",
            },
            {
              label: "Email",
              value: "dev1@liquidlift.app",
              placeholder: "your@email.com",
            },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-slate-600 text-xs font-medium block mb-1.5">
                {field.label}
              </label>

              <input
                defaultValue={field.value}
                placeholder={field.placeholder}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-200 transition-all placeholder-slate-400"
              />
            </div>
          ))}
        </div>

        <button className="bg-gradient-to-r from-slate-900 to-teal-500 hover:from-slate-800 hover:to-teal-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all duration-300">
          Save Changes
        </button>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all space-y-5">
        <h3 className="text-slate-800 font-semibold text-sm uppercase tracking-wide">
          Preferences
        </h3>

        {[
          {
            label: "Push Notifications",
            desc: "Get alerted when something important happens",
            value: notifications,
            onChange: setNotifications,
            emoji: "🔔",
          },
          {
            label: "Email Digest",
            desc: "A weekly summary straight to your inbox",
            value: emails,
            onChange: setEmails,
            emoji: "📬",
          },
          {
            label: "Activity Updates",
            desc: "Know when teammates do things",
            value: digest,
            onChange: setDigest,
            emoji: "👀",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-2 border-b border-slate-100 last:border-none"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.emoji}</span>

              <div>
                <p className="text-slate-800 text-sm font-medium">
                  {item.label}
                </p>
                <p className="text-slate-500 text-xs">
                  {item.desc}
                </p>
              </div>
            </div>

            <Toggle
              value={item.value}
              onChange={item.onChange}
            />
          </div>
        ))}
      </div>

      {/* Security Card */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
        <h3 className="text-slate-800 font-semibold text-sm uppercase tracking-wide mb-4">
          Security
        </h3>

        <div className="space-y-3">
          <button className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 transition-all">
            🔒 Change Password
          </button>

          <button className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 transition-all">
            📱 Enable Two-Factor Authentication
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
        <p className="text-red-400 text-sm font-semibold mb-1">
          Danger Zone
        </p>

        <p className="text-slate-400 text-xs mb-4">
          These actions cannot be undone. Proceed carefully.
        </p>

        <button className="border border-red-500 text-red-400 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300">
          Delete My Account
        </button>
      </div>
    </div>
  );
}