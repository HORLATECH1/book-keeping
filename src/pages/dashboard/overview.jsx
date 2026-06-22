import React from 'react'

export default function Overview() {
  const metrics = {
    netRevenue: 86400,
    totalExpenses: 51340,
    netProfit: 35060,
    receivables: 17500,
  }

  const recent = [
    { id: 1, date: 'Jun 14', desc: 'Stripe payout — May', amount: 8420, type: 'credit' },
    { id: 2, date: 'Jun 13', desc: 'AWS infrastructure', amount: -1203.45, type: 'debit' },
    { id: 3, date: 'Jun 12', desc: 'Office rent — June', amount: -3500, type: 'debit' },
    { id: 4, date: 'Jun 11', desc: 'Client: Nnamdi Ltd', amount: 5000, type: 'credit' },
  ]

  const months = ['Jan','Feb','Mar','Apr','May','Jun']
  const income = [8000,12000,9000,15000,17000,7000]
  const expenses = [6000,8000,7000,9000,10000,4000]

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Overview</h1>
          <p className="text-stone-500 mt-1">June 2026 · Acme Books Ltd</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 bg-stone-100 rounded-lg text-sm">Jun 2026</div>
          <button className="px-4 py-2 bg-teal-400 hover:bg-teal-500 text-white rounded-lg">Sign Out</button>
        </div>
      </div> */}

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
          <div className="text-sm text-stone-500">NET REVENUE</div>
          <div className="mt-3 text-2xl font-bold">${metrics.netRevenue.toLocaleString()}</div>
          <div className="mt-3 text-sm text-emerald-600 bg-emerald-100 inline-block px-2 py-1 rounded-full">+12.4%</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
          <div className="text-sm text-stone-500">TOTAL EXPENSES</div>
          <div className="mt-3 text-2xl font-bold">${metrics.totalExpenses.toLocaleString()}</div>
          <div className="mt-3 text-sm text-rose-600 bg-rose-100 inline-block px-2 py-1 rounded-full">+4.1%</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
          <div className="text-sm text-stone-500">NET PROFIT</div>
          <div className="mt-3 text-2xl font-bold">${metrics.netProfit.toLocaleString()}</div>
          <div className="mt-3 text-sm text-emerald-600 bg-emerald-100 inline-block px-2 py-1 rounded-full">+24%</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
          <div className="text-sm text-stone-500">RECEIVABLES</div>
          <div className="mt-3 text-2xl font-bold">${metrics.receivables.toLocaleString()}</div>
          <div className="mt-3 text-sm text-sky-700 bg-sky-100 inline-block px-2 py-1 rounded-full">2 invoices</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">Income vs Expenses</h3>
            <div className="text-sm text-stone-500">Monthly</div>
          </div>

          <div className="w-full h-48">
            <svg viewBox="0 0 600 200" className="w-full h-full">
              {months.map((m, i) => {
                const x = 40 + i * 90
                const incH = (income[i] / 18000) * 140
                const expH = (expenses[i] / 18000) * 140
                return (
                  <g key={m}>
                    <rect x={x} y={160 - incH} width="24" height={incH} rx="4" fill="#2dd4bf" />
                    <rect x={x + 30} y={160 - expH} width="24" height={expH} rx="4" fill="#e6eef0" />
                    <text x={x + 6} y={178} fontSize="12" fill="#64748b">{m}</text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
          <h3 className="font-semibold text-stone-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recent.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-md flex items-center justify-center ${item.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {item.type === 'credit' ? '↓' : '↑'}
                  </div>
                  <div>
                    <div className="font-medium text-stone-800">{item.desc}</div>
                    <div className="text-sm text-stone-500">{item.date}</div>
                  </div>
                </div>
                <div className={`font-semibold ${item.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.type === 'credit' ? '+' : '-'}${Math.abs(item.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}