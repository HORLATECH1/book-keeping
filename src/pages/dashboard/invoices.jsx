import { useState, useEffect } from 'react'
import { auth, db } from '../../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [loadingDB, setLoadingDB] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ date: '', invoiceNo: '', customer: '', description: '', due: '', amount: '', status: 'unpaid' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(false)

  // 1. Fetch from Firestore on mount
  useEffect(() => {
    async function loadInvoices() {
      const user = auth.currentUser;
      if (!user) {
        setLoadingDB(false);
        return;
      }
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().invoices) {
          setInvoices(docSnap.data().invoices);
          localStorage.setItem(`invoices_${user.uid}`, JSON.stringify(docSnap.data().invoices));
        } else {
          // If Firestore is empty, load from localStorage if it exists, otherwise use defaults
          const saved = localStorage.getItem(`invoices_${user.uid}`);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setInvoices(parsed);
              // Migrate localStorage to Firestore
              await setDoc(docRef, { invoices: parsed }, { merge: true });
            } catch (e) {
              console.error("Error parsing local invoices: ", e);
            }
          } else {
            const defaults = [
              { id: 1, date: 'Jun 14', invoiceNo: 'INV-1001', customer: 'Nnamdi Ltd', description: 'Website redesign', due: 'Jul 14', amount: 8420.0, status: 'paid' },
              { id: 2, date: 'Jun 01', invoiceNo: 'INV-0999', customer: 'Olivia Co', description: 'Monthly retainer', due: 'Jul 01', amount: 1203.45, status: 'unpaid' },
              { id: 3, date: 'May 20', invoiceNo: 'INV-0988', customer: 'Acme Corp', description: 'Consulting', due: 'Jun 20', amount: 3500.0, status: 'overdue' },
            ];
            setInvoices(defaults);
            await setDoc(docRef, { invoices: defaults }, { merge: true });
          }
        }
      } catch (err) {
        console.error("Error loading invoices: ", err);
        // Fallback to localStorage on error
        const saved = localStorage.getItem(`invoices_${user.uid}`);
        if (saved) {
          try {
            setInvoices(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        }
      } finally {
        setLoadingDB(false);
      }
    }
    loadInvoices();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.date || !form.invoiceNo || !form.customer || !form.amount) {
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
      const updated = {
        id: editId || Date.now(),
        date: form.date,
        invoiceNo: form.invoiceNo,
        customer: form.customer,
        description: form.description,
        due: form.due,
        amount: parseFloat(form.amount),
        status: form.status,
      }

      const updatedInvoices = editId
        ? invoices.map(i => (i.id === editId ? updated : i))
        : [updated, ...invoices];

      // Save to Firestore
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { invoices: updatedInvoices }, { merge: true });

      // Save to local storage for backward compatibility
      localStorage.setItem(`invoices_${user.uid}`, JSON.stringify(updatedInvoices));

      setInvoices(updatedInvoices);
      setForm({ date: '', invoiceNo: '', customer: '', description: '', due: '', amount: '', status: 'unpaid' })
      setEditId(null)
      setShowForm(false)
    } catch (err) {
      console.error("Error saving invoice: ", err);
      alert("Failed to save invoice. Please try again.");
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(inv) {
    setForm({ date: inv.date, invoiceNo: inv.invoiceNo, customer: inv.customer, description: inv.description, due: inv.due, amount: inv.amount.toString(), status: inv.status })
    setEditId(inv.id)
    setShowForm(true)
  }

  async function handleDelete(id) {
    const user = auth.currentUser;
    if (!user) return;

    if (!window.confirm("Are you sure you want to delete this invoice?")) return;

    try {
      const updatedInvoices = invoices.filter(i => i.id !== id);

      // Save to Firestore
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { invoices: updatedInvoices }, { merge: true });

      // Save to local storage
      localStorage.setItem(`invoices_${user.uid}`, JSON.stringify(updatedInvoices));

      setInvoices(updatedInvoices);
    } catch (err) {
      console.error("Error deleting invoice: ", err);
      alert("Failed to delete invoice.");
    }
  }

  function handleCancelEdit() {
    setForm({ date: '', invoiceNo: '', customer: '', description: '', due: '', amount: '', status: 'unpaid' })
    setEditId(null)
    setShowForm(false)
  }

  if (loadingDB) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-stone-500 text-sm font-semibold">Loading invoices...</p>
        </div>
      </div>
    )
  }

  const filtered = invoices.filter(inv => {
    const matchesSearch = inv.description.toLowerCase().includes(searchTerm.toLowerCase()) || inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) || inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'All' || (filter === 'Paid' && inv.status === 'paid') || (filter === 'Unpaid' && inv.status === 'unpaid') || (filter === 'Overdue' && inv.status === 'overdue')
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800">Invoices</h1>
          <p className="text-stone-500 mt-1">June 2026 · {invoices.length} entries</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-teal-400 hover:bg-teal-500 text-white font-semibold rounded-lg transition-colors"
        >
          + New Invoice
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
          <h2 className="text-lg font-bold text-stone-800 mb-4">Create / Edit Invoice</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Date</label>
                <input name="date" value={form.date} onChange={handleChange} placeholder="e.g., Jun 14" className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Invoice #</label>
                <input name="invoiceNo" value={form.invoiceNo} onChange={handleChange} placeholder="INV-1001" className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Customer</label>
                <input name="customer" value={form.customer} onChange={handleChange} placeholder="Customer name" className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Description</label>
                <input name="description" value={form.description} onChange={handleChange} placeholder="e.g., Consulting" className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Due Date</label>
                <input name="due" value={form.due} onChange={handleChange} placeholder="e.g., Jul 14" className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Amount</label>
                <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="0.00" step="0.01" className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400">
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button type="button" onClick={handleCancelEdit} className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200">Cancel</button>
              <button type="submit" disabled={loading} className={`px-4 py-2 rounded-lg font-semibold text-white ${loading ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500'}`}>
                {loading ? 'Saving...' : (editId ? 'Save' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-3 text-stone-400">🔍</span>
          <input type="text" placeholder="Search invoices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Paid', 'Unpaid', 'Overdue'].map(btn => (
            <button key={btn} onClick={() => setFilter(btn)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === btn ? 'bg-teal-400 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>
              {btn}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Invoice #</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Due</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv, idx) => (
              <tr key={inv.id} className={`border-b border-stone-200 ${idx % 2 === 1 ? 'bg-stone-50' : ''} hover:bg-stone-100 transition-colors`}>
                <td className="px-6 py-4 text-sm text-stone-600">{inv.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-stone-800">{inv.invoiceNo}</td>
                <td className="px-6 py-4 text-sm text-stone-600">{inv.customer}</td>
                <td className="px-6 py-4 text-sm text-stone-600">{inv.description}</td>
                <td className="px-6 py-4 text-sm text-stone-600">{inv.due}</td>
                <td className="px-6 py-4 text-sm font-semibold">₦{inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : inv.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button type="button" onClick={() => handleEdit(inv)} className="px-3 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors">Edit</button>
                  <button type="button" onClick={() => handleDelete(inv.id)} className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-stone-400">No invoices found</p>
          </div>
        )}
      </div>
    </div>
  )
}
