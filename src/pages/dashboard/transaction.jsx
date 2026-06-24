import { useState, useEffect } from 'react'
import { auth, db } from '../../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function Transaction() {
  const [transactions, setTransactions] = useState([])
  const [loadingDB, setLoadingDB] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ date: '', description: '', account: '', type: 'debit', amount: '', status: 'cleared' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(false)

  // 1. Fetch from Firestore on mount
  useEffect(() => {
    async function loadTransactions() {
      const user = auth.currentUser;
      if (!user) {
        setLoadingDB(false);
        return;
      }
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().transactions) {
          setTransactions(docSnap.data().transactions);
          localStorage.setItem(`transactions_${user.uid}`, JSON.stringify(docSnap.data().transactions));
        } else {
          // If Firestore is empty, load from localStorage if it exists, otherwise use defaults
          const saved = localStorage.getItem(`transactions_${user.uid}`);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setTransactions(parsed);
              // Migrate localStorage to Firestore
              await setDoc(docRef, { transactions: parsed }, { merge: true });
            } catch (e) {
              console.error("Error parsing local transactions: ", e);
            }
          } else {
            const defaults = [
              { id: 1, date: 'Jun 14', description: 'Stripe payout — May', account: 'Revenue', type: 'credit', amount: 8420.00, status: 'cleared' },
              { id: 2, date: 'Jun 13', description: 'AWS infrastructure', account: 'Expenses', type: 'debit', amount: 1203.45, status: 'cleared' },
              { id: 3, date: 'Jun 12', description: 'Office rent — June', account: 'Expenses', type: 'debit', amount: 3500.00, status: 'cleared' },
              { id: 4, date: 'Jun 11', description: 'Client: Nnamdi Ltd', account: 'Revenue', type: 'credit', amount: 5000.00, status: 'pending' },
              { id: 5, date: 'Jun 10', description: 'Payroll — 8 staff', account: 'Expenses', type: 'debit', amount: 12400.00, status: 'cleared' },
              { id: 6, date: 'Jun 09', description: 'Google Ads', account: 'Marketing', type: 'debit', amount: 620.00, status: 'cleared' },
            ];
            setTransactions(defaults);
            await setDoc(docRef, { transactions: defaults }, { merge: true });
          }
        }
      } catch (err) {
        console.error("Error loading transactions: ", err);
        // Fallback to localStorage on error
        const saved = localStorage.getItem(`transactions_${user.uid}`);
        if (saved) {
          try {
            setTransactions(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        }
      } finally {
        setLoadingDB(false);
      }
    }
    loadTransactions();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.date || !form.description || !form.account || !form.amount) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const updatedTransaction = {
        id: editId || Date.now(),
        date: form.date,
        description: form.description,
        account: form.account,
        type: form.type,
        amount: parseFloat(form.amount),
        status: form.status
      }

      const updatedTransactions = editId
        ? transactions.map(tx => (tx.id === editId ? updatedTransaction : tx))
        : [updatedTransaction, ...transactions];

      // Save to Firestore
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { transactions: updatedTransactions }, { merge: true });

      // Save to local storage
      localStorage.setItem(`transactions_${user.uid}`, JSON.stringify(updatedTransactions));

      setTransactions(updatedTransactions);
      setForm({ date: '', description: '', account: '', type: 'debit', amount: '', status: 'cleared' })
      setEditId(null)
      setShowForm(false)
    } catch (err) {
      console.error("Error saving transaction: ", err);
      alert("Failed to save transaction. Please try again.");
    } finally {
      setLoading(false)
    }
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

  async function handleDelete(id) {
    const user = auth.currentUser;
    if (!user) return;

    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const updatedTransactions = transactions.filter(tx => tx.id !== id);

      // Save to Firestore
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { transactions: updatedTransactions }, { merge: true });

      // Save to local storage
      localStorage.setItem(`transactions_${user.uid}`, JSON.stringify(updatedTransactions));

      setTransactions(updatedTransactions);
    } catch (err) {
      console.error("Error deleting transaction: ", err);
      alert("Failed to delete transaction.");
    }
  }

  function handleCancelEdit() {
    setForm({ date: '', description: '', account: '', type: 'debit', amount: '', status: 'cleared' })
    setEditId(null)
    setShowForm(false)
  }

  if (loadingDB) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-stone-500 text-sm font-semibold">Loading transactions...</p>
        </div>
      </div>
    )
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800">Transactions</h1>
          <p className="text-stone-500 text-sm md:text-base mt-1">June 2026 · {transactions.length} entries</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 sm:px-5 py-2.5 bg-teal-400 hover:bg-teal-500 text-white font-semibold rounded-lg transition-colors touch-target w-full sm:w-auto"
        >
          + New Entry
        </button>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-stone-200">
          <h2 className="text-lg font-bold text-stone-800 mb-4">
            {editId ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-2">Date</label>
                <input
                  type="text"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="e.g., Jun 14"
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400 touch-target"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="e.g., Office supplies"
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400 touch-target"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-2">Account</label>
                <input
                  type="text"
                  name="account"
                  value={form.account}
                  onChange={handleChange}
                  placeholder="e.g., Revenue"
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400 touch-target"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-2">Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400 touch-target"
                >
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-2">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400 touch-target"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-2">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 sm:py-3 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400 touch-target"
                >
                  <option value="cleared">Cleared</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 font-medium transition-colors touch-target"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2.5 rounded-lg font-semibold text-white transition-colors touch-target ${
                  loading ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500'
                }`}
              >
                {loading ? (editId ? 'Saving...' : 'Adding...') : (editId ? 'Save' : 'Add')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-2.5 sm:top-3 text-stone-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400 touch-target"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Credit', 'Debit', 'Pending'].map(btn => (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-target ${
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

      {/* Transactions Table (Desktop) */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
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
                      className="px-3 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors touch-target"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tx.id)}
                      className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors touch-target"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-stone-400">No transactions found</p>
          </div>
        )}
      </div>

      {/* Transactions Card View (Mobile) */}
      <div className="md:hidden space-y-4">
        {filteredTransactions.map((tx) => (
          <div key={tx.id} className="bg-white rounded-lg border border-stone-200 p-4 shadow-sm">
            <div className="flex justify-between items-start gap-2 mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-stone-800 text-sm truncate">{tx.description}</h3>
                <p className="text-xs text-stone-500 mt-1">{tx.date}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                tx.type === 'credit' ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700'
              }`}>
                {tx.type}
              </span>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Account</span>
                <span className="font-medium text-stone-800">{tx.account}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Amount</span>
                <span className={`font-semibold ${tx.type === 'credit' ? 'text-teal-600' : 'text-red-600'}`}>
                  {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  tx.status === 'cleared' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleEdit(tx)}
                className="flex-1 px-3 py-2 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-colors touch-target"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(tx.id)}
                className="flex-1 px-3 py-2 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition-colors touch-target"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-stone-400">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  )
}