import React, { useState } from 'react'

export default function Transaction() {
  const [transactions, setTransactions] = useState([
    { id: 1, date: 'Jun 14', description: 'Stripe payout — May', account: 'Revenue', type: 'credit', amount: 8420.00, status: 'cleared' },
    { id: 2, date: 'Jun 13', description: 'AWS infrastructure', account: 'Expenses', type: 'debit', amount: 1203.45, status: 'cleared' },
    { id: 3, date: 'Jun 12', description: 'Office rent — June', account: 'Expenses', type: 'debit', amount: 3500.00, status: 'cleared' },
    { id: 4, date: 'Jun 11', description: 'Client: Nnamdi Ltd', account: 'Revenue', type: 'credit', amount: 5000.00, status: 'pending' },
    { id: 5, date: 'Jun 10', description: 'Payroll — 8 staff', account: 'Expenses', type: 'debit', amount: 12400.00, status: 'cleared' },
    { id: 6, date: 'Jun 09', description: 'Google Ads', account: 'Marketing', type: 'debit', amount: 620.00, status: 'cleared' },
  ])
  
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ date: '', description: '', account: '', type: 'debit', amount: '', status: 'cleared' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.date || !form.description || !form.account || !form.amount) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    setTimeout(() => {
      const updatedTransaction = {
        id: editId || Date.now(),
        date: form.date,
        description: form.description,
        account: form.account,
        type: form.type,
        amount: parseFloat(form.amount),
        status: form.status
      }
      setTransactions(prev => {
        if (editId) {
          return prev.map(tx => (tx.id === editId ? updatedTransaction : tx))
        }
        return [updatedTransaction, ...prev]
      })
      setForm({ date: '', description: '', account: '', type: 'debit', amount: '', status: 'cleared' })
      setEditId(null)
      setShowForm(false)
      setLoading(false)
    }, 500)
  }

  function handleEdit(tx) {
    setForm({
      date: tx.date,
      description: tx.description,
      account: tx.account,
      type: tx.type,
      amount: tx.amount.toString(),
      status: tx.status,
    })
    setEditId(tx.id)
    setShowForm(true)
  }

  function handleDelete(id) {
    setTransactions(prev => prev.filter(tx => tx.id !== id))
  }

  function handleCancelEdit() {
    setForm({ date: '', description: '', account: '', type: 'debit', amount: '', status: 'cleared' })
    setEditId(null)
    setShowForm(false)
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.account.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'All' || tx.type === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Transactions</h1>
          <p className="text-stone-500 mt-1">June 2026 · {transactions.length} entries</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-teal-400 hover:bg-teal-500 text-white font-semibold rounded-lg transition-colors"
        >
          + New Entry
        </button>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
          <h2 className="text-lg font-bold text-stone-800 mb-4">Add New Transaction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Date</label>
                <input
                  type="text"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="e.g., Jun 14"
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="e.g., Office supplies"
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Account</label>
                <input
                  type="text"
                  name="account"
                  value={form.account}
                  onChange={handleChange}
                  placeholder="e.g., Revenue"
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="cleared">Cleared</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${
                    loading ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500'
                  }`}
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-3 text-stone-400">🔍</span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Credit', 'Debit', 'Pending'].map(btn => (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === btn
                  ? 'bg-teal-400 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, idx) => (
              <tr key={tx.id} className={`border-b border-stone-200 ${idx % 2 === 1 ? 'bg-stone-50' : ''} hover:bg-stone-100 transition-colors`}>
                <td className="px-6 py-4 text-sm text-stone-600">{tx.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-stone-800">{tx.description}</td>
                <td className="px-6 py-4 text-sm text-stone-600">{tx.account}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    tx.type === 'credit' ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm font-semibold ${tx.type === 'credit' ? 'text-teal-600' : 'text-red-600'}`}>
                  {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    tx.status === 'cleared' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(tx)}
                    className="px-3 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(tx.id)}
                    className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-stone-400">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  )
}