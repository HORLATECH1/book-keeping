<<<<<<< HEAD
import React from "react";

const Invoices = () => {
  const invoices = [
    {
      id: "INV-0041",
      client: "Nnamdi & Co.",
      amount: "$5,000",
      dueDate: "Jun 20",
      status: "Pending",
    },
    {
      id: "INV-0040",
      client: "TechBridge NG",
      amount: "$12,500",
      dueDate: "Jun 18",
      status: "Overdue",
    },
    {
      id: "INV-0039",
      client: "Kelani Farms",
      amount: "$3,200",
      dueDate: "Jun 10",
      status: "Paid",
    },
    {
      id: "INV-0038",
      client: "Lagos Retail Hub",
      amount: "$8,800",
      dueDate: "Jun 05",
      status: "Paid",
    },
    {
      id: "INV-0037",
      client: "Pinnacle Group",
      amount: "$21,000",
      dueDate: "May 30",
      status: "Paid",
    },
  ];

  const statusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-teal-500/20 text-teal-300";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-300";
      case "Overdue":
        return "bg-red-500/20 text-red-300";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#081B33] to-slate-900 text-white p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

        <div className="w-full md:w-96">
          <input
            type="text"
            placeholder="🔍 Quick Search..."
            className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 outline-none focus:border-teal-400 transition"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/10">
            Jun 2026
          </div>

          <button className="bg-white/10 p-3 rounded-xl border border-white/10">
            🔔
          </button>

          <button className="text-gray-300 hover:text-teal-400 transition">
            Sign Out
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Invoices</h1>
          <p className="text-gray-400 mt-2">
            5 invoices • $50,500 total
          </p>
        </div>

        <button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:scale-105 transition px-6 py-3 rounded-xl font-semibold shadow-lg shadow-teal-500/30">
          + New Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="h-1 w-20 bg-orange-400 rounded-full mb-4"></div>
          <p className="text-gray-400 uppercase text-sm">Outstanding</p>
          <h2 className="text-4xl font-bold mt-2">$17,500</h2>
          <p className="text-gray-400 mt-2">2 invoices</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="h-1 w-20 bg-red-500 rounded-full mb-4"></div>
          <p className="text-gray-400 uppercase text-sm">Overdue</p>
          <h2 className="text-4xl font-bold mt-2">$12,500</h2>
          <p className="text-gray-400 mt-2">1 invoice</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="h-1 w-20 bg-teal-500 rounded-full mb-4"></div>
          <p className="text-gray-400 uppercase text-sm">Paid (June)</p>
          <h2 className="text-4xl font-bold mt-2">$33,000</h2>
          <p className="text-gray-400 mt-2">3 invoices</p>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

        <table className="w-full">
          <thead>
            <tr className="bg-white/5 text-gray-300">
              <th className="text-left px-6 py-5">Invoice #</th>
              <th className="text-left px-6 py-5">Client</th>
              <th className="text-left px-6 py-5">Amount</th>
              <th className="text-left px-6 py-5">Due Date</th>
              <th className="text-left px-6 py-5">Status</th>
              <th className="text-left px-6 py-5">Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-6 py-5 font-medium">{invoice.id}</td>

                <td className="px-6 py-5">{invoice.client}</td>

                <td className="px-6 py-5 font-semibold">
                  {invoice.amount}
                </td>

                <td className="px-6 py-5 text-gray-300">
                  {invoice.dueDate}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${statusColor(
                      invoice.status
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <button className="border border-teal-400 text-teal-300 hover:bg-teal-500 hover:text-white transition px-4 py-2 rounded-xl">
                    View
                  </button>
=======
import React, { useState } from 'react'

export default function Invoices() {
  const [invoices, setInvoices] = useState([
    { id: 1, date: 'Jun 14', invoiceNo: 'INV-1001', customer: 'Nnamdi Ltd', description: 'Website redesign', due: 'Jul 14', amount: 8420.0, status: 'paid' },
    { id: 2, date: 'Jun 01', invoiceNo: 'INV-0999', customer: 'Olivia Co', description: 'Monthly retainer', due: 'Jul 01', amount: 1203.45, status: 'unpaid' },
    { id: 3, date: 'May 20', invoiceNo: 'INV-0988', customer: 'Acme Corp', description: 'Consulting', due: 'Jun 20', amount: 3500.0, status: 'overdue' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ date: '', invoiceNo: '', customer: '', description: '', due: '', amount: '', status: 'unpaid' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.date || !form.invoiceNo || !form.customer || !form.amount) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    setTimeout(() => {
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
      setInvoices(prev => (editId ? prev.map(i => (i.id === editId ? updated : i)) : [updated, ...prev]))
      setForm({ date: '', invoiceNo: '', customer: '', description: '', due: '', amount: '', status: 'unpaid' })
      setEditId(null)
      setShowForm(false)
      setLoading(false)
    }, 500)
  }

  function handleEdit(inv) {
    setForm({ date: inv.date, invoiceNo: inv.invoiceNo, customer: inv.customer, description: inv.description, due: inv.due, amount: inv.amount.toString(), status: inv.status })
    setEditId(inv.id)
    setShowForm(true)
  }

  function handleDelete(id) {
    setInvoices(prev => prev.filter(i => i.id !== id))
  }

  function handleCancelEdit() {
    setForm({ date: '', invoiceNo: '', customer: '', description: '', due: '', amount: '', status: 'unpaid' })
    setEditId(null)
    setShowForm(false)
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
          <h1 className="text-3xl font-bold text-stone-800">Invoices</h1>
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
            <div className="grid grid-cols-3 gap-4">
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

            <div className="grid grid-cols-4 gap-4">
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
              {editId && (
                <button type="button" onClick={handleCancelEdit} className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200">Cancel</button>
              )}
              <button type="submit" disabled={loading} className={`px-4 py-2 rounded-lg font-semibold text-white ${loading ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500'}`}>
                {loading ? 'Saving...' : (editId ? 'Save' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-3 text-stone-400">🔍</span>
          <input type="text" placeholder="Search invoices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div className="flex gap-2">
          {['All', 'Paid', 'Unpaid', 'Overdue'].map(btn => (
            <button key={btn} onClick={() => setFilter(btn)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === btn ? 'bg-teal-400 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>
              {btn}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full">
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
>>>>>>> c184e7b8e4c7a987e9bc7de7f5671eaf1063c58d
                </td>
              </tr>
            ))}
          </tbody>
        </table>
<<<<<<< HEAD

      </div>
    </div>
  );
};

export default Invoices;
=======
        {filtered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-stone-400">No invoices found</p>
          </div>
        )}
      </div>
    </div>
  )
}
>>>>>>> c184e7b8e4c7a987e9bc7de7f5671eaf1063c58d
