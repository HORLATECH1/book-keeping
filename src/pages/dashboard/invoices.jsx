import { useEffect, useMemo, useState } from 'react'
import { auth, db } from '../../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const STORAGE_KEY_PREFIX = 'invoices_'
const DEFAULT_INVOICES = [
  { id: 1, date: 'Jun 14', invoiceNo: 'INV-1001', customer: 'Nnamdi Ltd', description: 'Website redesign', due: 'Jul 14', amount: 8420.0, status: 'paid' },
  { id: 2, date: 'Jun 01', invoiceNo: 'INV-0999', customer: 'Olivia Co', description: 'Monthly retainer', due: 'Jul 01', amount: 1203.45, status: 'unpaid' },
  { id: 3, date: 'May 20', invoiceNo: 'INV-0988', customer: 'Acme Corp', description: 'Consulting', due: 'Jun 20', amount: 3500.0, status: 'overdue' },
]

const initialFormState = {
  date: '',
  invoiceNo: '',
  customer: '',
  description: '',
  due: '',
  amount: '',
  status: 'unpaid',
}

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(initialFormState)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('All')
  const [loadingSaving, setLoadingSaving] = useState(false)
  const [loadingDB, setLoadingDB] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (!user) {
        setLoadingDB(false)
        setInvoices([])
        return
      }

      const storageKey = `${STORAGE_KEY_PREFIX}${user.uid}`
      const userDocRef = doc(db, 'users', user.uid)
      let localSaved = null

      try {
        localSaved = localStorage.getItem(storageKey)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists() && Array.isArray(docSnap.data().invoices)) {
          const remoteInvoices = docSnap.data().invoices
          setInvoices(remoteInvoices)
          localStorage.setItem(storageKey, JSON.stringify(remoteInvoices))
          return
        }

        if (localSaved) {
          try {
            const parsedInvoices = JSON.parse(localSaved)
            const safeInvoices = Array.isArray(parsedInvoices) ? parsedInvoices : DEFAULT_INVOICES
            setInvoices(safeInvoices)
            await setDoc(userDocRef, { invoices: safeInvoices }, { merge: true })
            return
          } catch (parseError) {
            console.error('Failed to parse local invoices:', parseError)
          }
        }

        setInvoices(DEFAULT_INVOICES)
        await setDoc(userDocRef, { invoices: DEFAULT_INVOICES }, { merge: true })
      } catch (loadError) {
        console.error('Error loading invoices:', loadError)
        if (localSaved) {
          try {
            const parsedInvoices = JSON.parse(localSaved)
            setInvoices(Array.isArray(parsedInvoices) ? parsedInvoices : DEFAULT_INVOICES)
          } catch (parseError) {
            console.error('Error parsing local storage invoices:', parseError)
            setInvoices(DEFAULT_INVOICES)
          }
        } else {
          setInvoices(DEFAULT_INVOICES)
        }
      } finally {
        setLoadingDB(false)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!currentUser || loadingDB) return
    const storageKey = `${STORAGE_KEY_PREFIX}${currentUser.uid}`
    localStorage.setItem(storageKey, JSON.stringify(invoices))
  }, [currentUser, invoices, loadingDB])

  const filtered = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    return invoices.filter((invoice) => {
      const searchableText = [invoice.date, invoice.invoiceNo, invoice.customer, invoice.description, invoice.due]
        .map((value) => String(value || '').toLowerCase())
        .join(' ')

      const matchesSearch = searchableText.includes(normalizedSearch)
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Paid' && invoice.status === 'paid') ||
        (filter === 'Unpaid' && invoice.status === 'unpaid') ||
        (filter === 'Overdue' && invoice.status === 'overdue')

      return matchesSearch && matchesFilter
    })
  }, [invoices, searchTerm, filter])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.date || !form.invoiceNo || !form.customer || !form.amount) {
      alert('Please fill in all required fields.')
      return
    }

    const amountValue = parseFloat(form.amount)
    if (Number.isNaN(amountValue)) {
      alert('Amount must be a valid number.')
      return
    }

    if (!currentUser) {
      alert('You must be signed in to save invoices.')
      return
    }

    setLoadingSaving(true)

    const invoicePayload = {
      id: editId || Date.now(),
      date: form.date,
      invoiceNo: form.invoiceNo,
      customer: form.customer,
      description: form.description,
      due: form.due,
      amount: amountValue,
      status: form.status,
    }

    const updatedInvoices = editId
      ? invoices.map((existing) => (existing.id === editId ? invoicePayload : existing))
      : [invoicePayload, ...invoices]

    try {
      const userDocRef = doc(db, 'users', currentUser.uid)
      await setDoc(userDocRef, { invoices: updatedInvoices }, { merge: true })
      setInvoices(updatedInvoices)
      setForm(initialFormState)
      setEditId(null)
      setShowForm(false)
    } catch (saveError) {
      console.error('Error saving invoice:', saveError)
      alert('Failed to save invoice. Please try again.')
    } finally {
      setLoadingSaving(false)
    }
  }

  function handleEdit(invoice) {
    setForm({
      date: invoice.date || '',
      invoiceNo: invoice.invoiceNo || '',
      customer: invoice.customer || '',
      description: invoice.description || '',
      due: invoice.due || '',
      amount: invoice.amount?.toString() || '',
      status: invoice.status || 'unpaid',
    })
    setEditId(invoice.id)
    setShowForm(true)
  }

  async function handleDelete(id) {
    if (!currentUser) return
    if (!window.confirm('Are you sure you want to delete this invoice?')) return

    const updatedInvoices = invoices.filter((invoice) => invoice.id !== id)

    try {
      const userDocRef = doc(db, 'users', currentUser.uid)
      await setDoc(userDocRef, { invoices: updatedInvoices }, { merge: true })
      setInvoices(updatedInvoices)
    } catch (deleteError) {
      console.error('Error deleting invoice:', deleteError)
      alert('Failed to delete invoice. Please try again.')
    }
  }

  function handleCancelEdit() {
    setForm(initialFormState)
    setEditId(null)
    setShowForm(false)
  }

  if (loadingDB) {
    return (
      <div className="min-h-75 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-stone-500 text-sm font-semibold">Loading invoices...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800">Invoices</h1>
          <p className="text-stone-500 mt-1">June 2026 · {invoices.length} entries</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
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
                <input
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="e.g., Jun 14"
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Invoice #</label>
                <input
                  name="invoiceNo"
                  value={form.invoiceNo}
                  onChange={handleChange}
                  placeholder="INV-1001"
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Customer</label>
                <input
                  name="customer"
                  value={form.customer}
                  onChange={handleChange}
                  placeholder="Customer name"
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Description</label>
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="e.g., Consulting"
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Due Date</label>
                <input
                  name="due"
                  value={form.due}
                  onChange={handleChange}
                  placeholder="e.g., Jul 14"
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                />
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
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button type="button" onClick={handleCancelEdit} className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loadingSaving}
                className={`px-4 py-2 rounded-lg font-semibold text-white ${
                  loadingSaving ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500'
                }`}
              >
                {loadingSaving ? 'Saving...' : editId ? 'Save' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-3 text-stone-400">🔍</span>
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Paid', 'Unpaid', 'Overdue'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === option ? 'bg-teal-400 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-200">
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
            {filtered.map((invoice, idx) => (
              <tr
                key={invoice.id}
                className={`border-b border-stone-200 ${idx % 2 === 1 ? 'bg-stone-50' : ''} hover:bg-stone-100 transition-colors`}
              >
                <td className="px-6 py-4 text-sm text-stone-600">{invoice.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-stone-800">{invoice.invoiceNo}</td>
                <td className="px-6 py-4 text-sm text-stone-600">{invoice.customer}</td>
                <td className="px-6 py-4 text-sm text-stone-600">{invoice.description}</td>
                <td className="px-6 py-4 text-sm text-stone-600">{invoice.due}</td>
                <td className="px-6 py-4 text-sm font-semibold">₦{Number(invoice.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : invoice.status === 'overdue'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(invoice)}
                    className="px-3 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(invoice.id)}
                    className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
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
