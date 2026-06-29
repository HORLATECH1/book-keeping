import { useState, useEffect } from 'react'
import { auth, db } from '../../firebase'
import { Link } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function Overview() {
  const [transactions, setTransactions] = useState([])
  const [invoices, setInvoices] = useState([])
  const [companyName, setCompanyName] = useState('Books-Flow Partner')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        let txData = [];
        let invData = [];
        let name = 'Books-Flow Partner';

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Transactions
          if (data.transactions) {
            txData = data.transactions;
            localStorage.setItem(`transactions_${user.uid}`, JSON.stringify(txData));
          } else {
            txData = loadTxFallback(user.uid);
          }

          // Invoices
          if (data.invoices) {
            invData = data.invoices;
            localStorage.setItem(`invoices_${user.uid}`, JSON.stringify(invData));
          } else {
            invData = loadInvFallback(user.uid);
          }

          // Company name
          if (data.companyName) {
            name = data.companyName;
            localStorage.setItem(`company_${user.uid}`, name);
          } else {
            name = localStorage.getItem(`company_${user.uid}`) || 'Books-Flow Partner';
          }
        } else {
          // Document does not exist yet. Initialize it with fallback data
          txData = loadTxFallback(user.uid);
          invData = loadInvFallback(user.uid);
          name = localStorage.getItem(`company_${user.uid}`) || 'Books-Flow Partner';
          
          await setDoc(docRef, {
            transactions: txData,
            invoices: invData,
            companyName: name
          }, { merge: true });
        }

        setTransactions(txData);
        setInvoices(invData);
        setCompanyName(name);
      } catch (err) {
        console.error("Error loading overview data from Firestore: ", err);
        // Fallback to local storage
        const savedTx = localStorage.getItem(`transactions_${user.uid}`);
        if (savedTx) {
          try {
            setTransactions(JSON.parse(savedTx));
          } catch (e) {
            console.error(e);
          }
        }
        const savedInv = localStorage.getItem(`invoices_${user.uid}`);
        if (savedInv) {
          try {
            setInvoices(JSON.parse(savedInv));
          } catch (e) {
            console.error(e);
          }
        }
        setCompanyName(localStorage.getItem(`company_${user.uid}`) || 'Books-Flow Partner');
      } finally {
        setLoading(false);
      }
    }

    function loadTxFallback(uid) {
      const savedTx = localStorage.getItem(`transactions_${uid}`);
      if (savedTx) {
        try {
          return JSON.parse(savedTx);
        } catch (e) {
          console.error(e);
        }
      }
      return [
        { id: 1, date: 'Jun 14', description: 'Stripe payout — May', account: 'Revenue', type: 'credit', amount: 8420.00, status: 'cleared' },
        { id: 2, date: 'Jun 13', description: 'AWS infrastructure', account: 'Expenses', type: 'debit', amount: 1203.45, status: 'cleared' },
        { id: 3, date: 'Jun 12', description: 'Office rent — June', account: 'Expenses', type: 'debit', amount: 3500.00, status: 'cleared' },
        { id: 4, date: 'Jun 11', description: 'Client: Nnamdi Ltd', account: 'Revenue', type: 'credit', amount: 5000.00, status: 'pending' },
        { id: 5, date: 'Jun 10', description: 'Payroll — 8 staff', account: 'Expenses', type: 'debit', amount: 12400.00, status: 'cleared' },
        { id: 6, date: 'Jun 09', description: 'Google Ads', account: 'Marketing', type: 'debit', amount: 620.00, status: 'cleared' },
      ];
    }

    function loadInvFallback(uid) {
      const savedInv = localStorage.getItem(`invoices_${uid}`);
      if (savedInv) {
        try {
          return JSON.parse(savedInv);
        } catch (e) {
          console.error(e);
        }
      }
      return [
        { id: 1, date: 'Jun 14', invoiceNo: 'INV-1001', customer: 'Nnamdi Ltd', description: 'Website redesign', due: 'Jul 14', amount: 8420.0, status: 'paid' },
        { id: 2, date: 'Jun 01', invoiceNo: 'INV-0999', customer: 'Olivia Co', description: 'Monthly retainer', due: 'Jul 01', amount: 1203.45, status: 'unpaid' },
        { id: 3, date: 'May 20', invoiceNo: 'INV-0988', customer: 'Acme Corp', description: 'Consulting', due: 'Jun 20', amount: 3500.0, status: 'overdue' },
      ];
    }

    loadData();
  }, []);

  const user = auth.currentUser;

  // Compute metrics
  const totalAmountSold = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  
  const income = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const availableBalance = income - expenses;

  const outstandingInvoices = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Compute chart statistics
  const totalFlow = income + expenses + outstandingInvoices;
  const incomePercent = totalFlow > 0 ? (income / totalFlow) * 100 : 0;
  const expensesPercent = totalFlow > 0 ? (expenses / totalFlow) * 100 : 0;
  const outstandingPercent = totalFlow > 0 ? (outstandingInvoices / totalFlow) * 100 : 0;

  // Donut chart math
  const r = 70;
  const circumference = 2 * Math.PI * r; // ~439.82

  const s1 = (incomePercent / 100) * circumference;
  const s2 = (expensesPercent / 100) * circumference;
  const s3 = (outstandingPercent / 100) * circumference;

  const offset1 = 0;
  const offset2 = -s1;
  const offset3 = -(s1 + s2);

  // Top 10 recent transactions
  const topRecentTransactions = transactions.slice(0, 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Section: Swift Card & Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Swift Design Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-slate-950 via-[#181830] to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-white/5 flex flex-col justify-between h-[230px] group transition-all duration-300 hover:shadow-2xl hover:border-teal-500/30">
            {/* Glowing spots */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-teal-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/20 transition-all duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500"></div>
            
            {/* Top row */}
            <div className="flex justify-between items-start z-10">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-teal-400 font-bold bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-500/20">Swift Card</span>
                <h3 className="text-xs font-bold text-white/80 mt-2 truncate w-[160px]">{companyName}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-[10px] font-mono">****</span>
                <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 17a8 8 0 0 1 0-10M9 19a12 12 0 0 1 0-14M13 21a16 16 0 0 1 0-18" strokeLinecap="round" />
                </svg>
                {/* Chip */}
                <div className="w-8 h-6 rounded bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-500 border border-amber-600/30 relative flex flex-wrap p-1 gap-[2px] overflow-hidden">
                  <div className="w-[45%] h-[40%] border-r border-b border-amber-800/20"></div>
                  <div className="w-[45%] h-[40%] border-b border-amber-800/20"></div>
                  <div className="w-[45%] h-[40%] border-r border-amber-800/20"></div>
                  <div className="w-[45%] h-[40%]"></div>
                </div>
              </div>
            </div>

            {/* Middle row: Balance */}
            <div className="z-10 my-4">
              <span className="text-[10px] text-white/40 tracking-wider font-semibold uppercase">Total Available Balance</span>
              <div className="text-2xl font-black mt-1 tracking-tight flex items-baseline gap-1">
                <span className="text-teal-400 text-lg">₦</span>
                <span className="text-white">{availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex justify-between items-end z-10">
              <div>
                {/* <span className="text-[8px] text-white/30 tracking-wider uppercase font-semibold block">Account Identifier</span>
                <span className="font-mono text-[11px] text-white/70 tracking-widest block">
                  •••• •••• •••• {user ? user.uid.substring(0, 4).toUpperCase() : '2026'}
                </span> */}
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-teal-400/80 z-10 shadow-sm"></div>
                <div className="w-6 h-6 rounded-full bg-emerald-500/50 -ml-2.5 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards Column */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Total Amount Sold */}
          <Link to="/dashboard/invoices" className="group bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex flex-col justify-between hover:shadow-md transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="bg-stone-50 p-3 rounded-2xl group-hover:bg-teal-50 transition-colors">
                <span className="text-xl">🧾</span>
              </div>
              <span className="text-[10px] text-teal-600 bg-teal-50 font-bold px-2.5 py-1 rounded-full border border-teal-100">
                Invoices
              </span>
            </div>
            <div className="mt-6">
              <span className="text-xs text-stone-400 font-semibold tracking-wider block uppercase">Total Amount Sold</span>
              <span className="text-xl font-extrabold text-stone-800 mt-1 block">
                ₦{totalAmountSold.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </Link>

          {/* Card 2: Money In (Income) */}
          <Link to="/dashboard/transaction" className="group bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex flex-col justify-between hover:shadow-md transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="bg-stone-50 p-3 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                <span className="text-xl">📥</span>
              </div>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                Credits
              </span>
            </div>
            <div className="mt-6">
              <span className="text-xs text-stone-400 font-semibold tracking-wider block uppercase">Money In (Income)</span>
              <span className="text-xl font-extrabold text-stone-800 mt-1 block">
                ₦{income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </Link>

          {/* Card 3: Money Out (Expenses) */}
          <Link to="/dashboard/transaction" className="group bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex flex-col justify-between hover:shadow-md transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="bg-stone-50 p-3 rounded-2xl group-hover:bg-rose-50 transition-colors">
                <span className="text-xl">📤</span>
              </div>
              <span className="text-[10px] text-rose-600 bg-rose-50 font-bold px-2.5 py-1 rounded-full border border-rose-100">
                Debits
              </span>
            </div>
            <div className="mt-6">
              <span className="text-xs text-stone-400 font-semibold tracking-wider block uppercase">Money Out (Expenses)</span>
              <span className="text-xl font-extrabold text-stone-800 mt-1 block">
                ₦{expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </Link>

        </div>

      </div>

      {/* Bottom Section: Pie Chart Breakdown & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Donut Pie Chart Card */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-stone-800 text-base">Financial Breakdown</h3>
            <p className="text-stone-400 text-xs mt-0.5">Real-time status of capital flows</p>
          </div>

          <div className="my-6">
            {totalFlow > 0 ? (
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full rotate-[-90deg]">
                  {/* Base grey track */}
                  <circle cx="100" cy="100" r={r} fill="transparent" stroke="#f5f5f4" strokeWidth="16" />
                  
                  {/* Slices */}
                  {incomePercent > 0 && (
                    <circle
                      cx="100"
                      cy="100"
                      r={r}
                      fill="transparent"
                      stroke="#0d9488" // teal-600
                      strokeWidth="16"
                      strokeDasharray={`${s1} ${circumference}`}
                      strokeDashoffset={offset1}
                      className="transition-all duration-300"
                    />
                  )}
                  {expensesPercent > 0 && (
                    <circle
                      cx="100"
                      cy="100"
                      r={r}
                      fill="transparent"
                      stroke="#f43f5e" // rose-500
                      strokeWidth="16"
                      strokeDasharray={`${s2} ${circumference}`}
                      strokeDashoffset={offset2}
                      className="transition-all duration-300"
                    />
                  )}
                  {outstandingPercent > 0 && (
                    <circle
                      cx="100"
                      cy="100"
                      r={r}
                      fill="transparent"
                      stroke="#d97706" // amber-600
                      strokeWidth="16"
                      strokeDasharray={`${s3} ${circumference}`}
                      strokeDashoffset={offset3}
                      className="transition-all duration-300"
                    />
                  )}
                </svg>
                {/* Center content */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Total Flow</span>
                  <span className="text-lg font-black text-stone-800 mt-0.5">
                    ₦{totalFlow.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-48 h-48 mx-auto flex items-center justify-center rounded-full bg-stone-50 border-2 border-dashed border-stone-200 text-stone-400 text-xs font-semibold text-center p-6">
                No financial data recorded yet
              </div>
            )}
          </div>

          {/* Legends */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#0d9488]"></span>
                <span className="text-xs font-semibold text-stone-600">Income</span>
              </div>
              <span className="text-xs text-stone-500 font-bold">
                ₦{income.toLocaleString('en-US')} ({incomePercent.toFixed(1)}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#f43f5e]"></span>
                <span className="text-xs font-semibold text-stone-600">Expenses</span>
              </div>
              <span className="text-xs text-stone-500 font-bold">
                ₦{expenses.toLocaleString('en-US')} ({expensesPercent.toFixed(1)}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#d97706]"></span>
                <span className="text-xs font-semibold text-stone-600">Outstanding Invoices</span>
              </div>
              <span className="text-xs text-stone-500 font-bold">
                ₦{outstandingInvoices.toLocaleString('en-US')} ({outstandingPercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Top 10 Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-800 text-base">Recent Transactions</h3>
              <p className="text-stone-400 text-xs mt-0.5">Top 10 real-time actions</p>
            </div>
            <Link to="/dashboard/transaction" className="text-xs font-bold text-teal-500 hover:text-teal-600 flex items-center gap-1 transition-colors">
              View All <span>⇄</span>
            </Link>
          </div>

          <div className="flex-1 space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {topRecentTransactions.length > 0 ? (
              topRecentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-2 rounded-2xl hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                      tx.type === 'credit' ? 'bg-teal-50 text-teal-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {tx.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-stone-800 leading-snug truncate max-w-[180px] md:max-w-[280px]">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-md font-semibold">
                          {tx.account}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {tx.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-extrabold text-sm ${
                      tx.type === 'credit' ? 'text-teal-600' : 'text-rose-500'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className={`block text-[9px] uppercase tracking-wider font-bold mt-0.5 ${
                      tx.status === 'cleared' ? 'text-green-500' : 'text-amber-500'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-stone-400">
                <span className="text-3xl mb-2">💸</span>
                <p className="text-xs font-semibold">No transactions recorded yet.</p>
                <Link to="/dashboard/transaction" className="mt-2 text-xs font-bold text-teal-400 hover:text-teal-500">
                  + Add your first transaction
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}