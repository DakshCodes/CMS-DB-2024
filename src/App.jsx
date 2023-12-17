import React from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './pages/Dashboard/Layout'
import OverView from './pages/Overview/OverView'
import BIllBoard from './pages/BillBoard/BIllBoard'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={
            <DashboardLayout>
              <OverView />
            </DashboardLayout>
          } />
        <Route
          path='/billboards'
          element={
            <DashboardLayout>
              <BIllBoard />
            </DashboardLayout>
          } />

      </Routes>
    </>
  )
}

export default App
