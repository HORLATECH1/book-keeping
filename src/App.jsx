import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import SignIn from './pages/signIn'
import SignUp from './pages/signUp'
import DashboardLayout from './pages/dashboardLayout'
import Overview from './pages/dashboard/overview'
import Settings from './pages/dashboard/settings'
import Staff from './pages/dashboard/staff'
import Transaction from './pages/dashboard/transaction'
import Invoices from './pages/dashboard/invoices'

const App = () => {
  return (
    <BrowserRouter>
    <Routes >
      <Route path='/' element={<SignIn/>}/>
      <Route path='/signUp' element={<SignUp />} />
      <Route  path='/dashboard' element={<DashboardLayout/>}>
      <Route index element={<Overview/>}/>
      <Route path='settings' element={<Settings/>} />
      <Route path='staff' element={<Staff/>} />
      <Route path='transaction' element={<Transaction/>} />
      <Route path='invoices' element={<Invoices/>} />
      </Route>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App