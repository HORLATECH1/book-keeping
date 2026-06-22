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
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Invoices;