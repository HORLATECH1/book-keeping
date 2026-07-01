import { useEffect, useMemo, useState } from 'react'
import { auth, db } from '../../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const emptyForm = { date: '', invoiceNo: '', customer: '', description: '', due: '', amount: '', status: 'unpaid' }

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (!u) { setLoading(false); setInvoices([]); return }

      const key = `invoices_${u.uid}`
      const ref = doc(db, 'users', u.uid)

      try {
        const snap = await getDoc(ref)
        if (snap.exists() && Array.isArray(snap.data().invoices)) {
          const data = snap.data().invoices
          setInvoices(data)
          localStorage.setItem(key, JSON.stringify(data))
        } else {
          const local = JSON.parse(localStorage.getItem(key) || '[]')
          setInvoices(local)
          await setDoc(ref, { invoices: local }, { merge: true })
        }
      } catch (e) {
        const local = JSON.parse(localStorage.getItem(key) || '[]')
        setInvoices(local)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  useEffect(() => {
    if (user && !loading)
      localStorage.setItem(`invoices_${user.uid}`, JSON.stringify(invoices))
  }, [invoices])

  const filtered = useMemo(() => invoices.filter(inv => {
    const text = [inv.date, inv.invoiceNo, inv.customer, inv.description, inv.due].join(' ').toLowerCase()
    const matchFilter = filter === 'All' || inv.status === filter.toLowerCase()
    return text.includes(search.toLowerCase()) && matchFilter
  }), [invoices, search, filter])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function addTransactionForPaidInvoice(inv) {
    try {
      const ref = doc(db, 'users', user.uid)
      const snap = await getDoc(ref)
      const existingTx = snap.exists() && Array.isArray(snap.data().transactions)
        ? snap.data().transactions
        : JSON.parse(localStorage.getItem(`transactions_${user.uid}`) || '[]')

      // Avoid duplicate: don't add if a transaction with the same invoice id already exists
      const alreadyAdded = existingTx.some(tx => tx.invoiceId === inv.id)
      if (alreadyAdded) return

      const newTx = {
        id: Date.now(),
        invoiceId: inv.id,
        date: inv.date,
        description: `Invoice ${inv.invoiceNo} — ${inv.customer}`,
        account: 'Revenue',
        type: 'credit',
        amount: parseFloat(inv.amount),
        status: 'cleared',
        source: 'invoice'
      }
      const updatedTx = [newTx, ...existingTx]
      await setDoc(ref, { transactions: updatedTx }, { merge: true })
      localStorage.setItem(`transactions_${user.uid}`, JSON.stringify(updatedTx))
    } catch (err) {
      console.error('Failed to add transaction for paid invoice:', err)
    }
  }

  async function save(e) {
    e.preventDefault()
    if (!form.date || !form.invoiceNo || !form.customer || !form.amount) return alert('Fill in required fields.')
    if (!user) return alert('Sign in to save.')

    setSaving(true)
    const entry = { ...form, id: editId || Date.now(), amount: parseFloat(form.amount) }
    const updated = editId
      ? invoices.map(i => i.id === editId ? entry : i)
      : [entry, ...invoices]

    // Check if status is becoming 'paid'
    const wasPaid = editId ? invoices.find(i => i.id === editId)?.status === 'paid' : false
    const isNowPaid = entry.status === 'paid'

    try {
      await setDoc(doc(db, 'users', user.uid), { invoices: updated }, { merge: true })
      setInvoices(updated)

      // If invoice is paid (and wasn't already paid before), add to transactions
      if (isNowPaid && !wasPaid) {
        await addTransactionForPaidInvoice(entry)
      }

      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
    } catch (e) {
      alert('Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  async function markAsPaid(inv) {
    if (!user) return
    if (inv.status === 'paid') return
    const updated = invoices.map(i => i.id === inv.id ? { ...i, status: 'paid' } : i)
    try {
      await setDoc(doc(db, 'users', user.uid), { invoices: updated }, { merge: true })
      setInvoices(updated)
      await addTransactionForPaidInvoice({ ...inv, status: 'paid' })
    } catch {
      alert('Failed to mark as paid.')
    }
  }

  function edit(inv) {
    setForm({ ...inv, amount: inv.amount?.toString() || '' })
    setEditId(inv.id)
    setShowForm(true)
  }

  async function remove(id) {
    if (!user || !confirm('Delete this invoice?')) return
    const updated = invoices.filter(i => i.id !== id)
    try {
      await setDoc(doc(db, 'users', user.uid), { invoices: updated }, { merge: true })
      setInvoices(updated)
    } catch {
      alert('Failed to delete.')
    }
  }

  function cancel() { setForm(emptyForm); setEditId(null); setShowForm(false) }

  function printReceipt(inv) {
    const w = window.open('', '_blank');
    w.document.write(`
      <html>
        <head>
          <title>Receipt - ${inv.invoiceNo}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1c1917; line-height: 1.6; }
            h1 { color: #2dd4bf; margin-bottom: 5px; }
            .header { border-bottom: 2px solid #e7e5e4; padding-bottom: 20px; margin-bottom: 20px; }
            .row { margin-bottom: 12px; font-size: 16px; }
            .label { font-weight: bold; display: inline-block; width: 120px; color: #57534e; }
            .total { font-size: 20px; font-weight: bold; margin-top: 20px; border-top: 2px solid #e7e5e4; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Receipt</h1>
            <div>Invoice No: <strong>${inv.invoiceNo}</strong></div>
            <div>Date: ${inv.date}</div>
          </div>
          <div class="row"><span class="label">Customer:</span> ${inv.customer}</div>
          <div class="row"><span class="label">Description:</span> ${inv.description}</div>
          <div class="row"><span class="label">Status:</span> ${inv.status.toUpperCase()}</div>
          <div class="total">
            <span class="label">Amount:</span> ₦${Number(inv.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p style="margin-top: 40px; color: #78716c;">Thank you for your business!</p>
        </body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  }

  const pill = s => s === 'paid' ? 'bg-green-100 text-green-700' : s === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
  const inp  = 'w-full px-4 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400'

  if (loading) return (
    <div className="min-h-75 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-stone-500 text-sm font-semibold">Loading invoices...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800">Invoices</h1>
          {/* <p className="text-stone-500 mt-1">· {invoices.length} entries</p> */}
        </div>
        <button onClick={() => setShowForm(p => !p)} className="px-4 py-2.5 bg-teal-400 hover:bg-teal-500 text-white font-semibold rounded-lg transition-colors">
          + New Invoice
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
          <h2 className="text-lg font-bold text-stone-800 mb-4">{editId ? 'Edit' : 'New'} Invoice</h2>
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[['date','Date','Jun 14'],['invoiceNo','Invoice #','INV-1001'],['customer','Customer','Customer name']].map(([name,label,ph]) => (
                <div key={name}>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">{label}</label>
                  <input name={name} value={form[name]} onChange={e => set(name, e.target.value)} placeholder={ph} className={inp} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[['description','Description','e.g. Consulting'],['due','Due Date','Jul 14']].map(([name,label,ph]) => (
                <div key={name}>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">{label}</label>
                  <input name={name} value={form[name]} onChange={e => set(name, e.target.value)} placeholder={ph} className={inp} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Amount</label>
                <input type="number" name="amount" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0.00" step="0.01" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Status</label>
                <select name="status" value={form.status} onChange={e => set('status', e.target.value)} className={inp}>
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={cancel} className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200">Cancel</button>
              <button type="submit" disabled={saving} className={`px-4 py-2 rounded-lg font-semibold text-white ${saving ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500'}`}>
                {saving ? 'Saving...' : editId ? 'Save' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-3 text-stone-400">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div className="flex gap-2">
          {['All','Paid','Unpaid','Overdue'].map(opt => (
            <button key={opt} onClick={() => setFilter(opt)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === opt ? 'bg-teal-400 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>{opt}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-x-auto">
        <table className="w-full min-w-200">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              {['Date','Invoice #','Customer','Description','Due','Amount','Status','Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv, i) => (
              <tr key={inv.id} className={`border-b border-stone-200 hover:bg-stone-100 transition-colors ${i % 2 ? 'bg-stone-50' : ''}`}>
                <td className="px-6 py-4 text-sm text-stone-600">{inv.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-stone-800">{inv.invoiceNo}</td>
                <td className="px-6 py-4 text-sm text-stone-600">{inv.customer}</td>
                <td className="px-6 py-4 text-sm text-stone-600">{inv.description}</td>
                <td className="px-6 py-4 text-sm text-stone-600">{inv.due}</td>
                <td className="px-6 py-4 text-sm font-semibold">₦{Number(inv.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pill(inv.status)}`}>{inv.status}</span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => printReceipt(inv)} className="px-3 py-1 rounded-lg bg-teal-100 text-teal-700 hover:bg-teal-200">Print</button>
                  {inv.status !== 'paid' && (
                    <button onClick={() => markAsPaid(inv)} className="px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-semibold">✓ Mark Paid</button>
                  )}
                  <button onClick={() => edit(inv)} className="px-3 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200">Edit</button>
                  <button onClick={() => remove(inv.id)} className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center py-8 text-stone-400">No invoices found</p>}
      </div>
    </div>
  )
}