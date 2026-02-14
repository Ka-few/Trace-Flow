import { Routes, Route, Navigate } from 'react-router-dom'
import BaseLayout from './components/layout/BaseLayout.tsx'
import Dashboard from './features/dashboard/Dashboard.tsx'
import BatchList from './features/batches/BatchList.tsx'
import BatchDetail from './features/batches/BatchDetail.tsx'
import LineageExplorer from './features/lineage/LineageExplorer.tsx'
import LoginPage from './features/auth/LoginPage.tsx'
import ProtectedRoute from './features/auth/ProtectedRoute.tsx'
import TransferList from './features/transfers/TransferList.tsx'
import ProcessingModule from './features/processing/ProcessingModule.tsx'
import SettingsModule from './features/settings/SettingsModule.tsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected ERP Shell */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="batches">
            <Route index element={<BatchList />} />
            <Route path=":id" element={<BatchDetail />} />
          </Route>

          <Route path="lineage" element={<LineageExplorer />} />
          <Route path="transfers" element={<TransferList />} />
          <Route path="processing" element={<ProcessingModule />} />

          {/* Admin & Specific Role Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="compliance" element={<div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest bg-white border border-dashed rounded-2xl mx-6">Compliance Registry Under Development</div>} />
            <Route path="master-data" element={<div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest bg-white border border-dashed rounded-2xl mx-6">Global Master Data Engine</div>} />
          </Route>

          <Route path="settings" element={<SettingsModule />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
