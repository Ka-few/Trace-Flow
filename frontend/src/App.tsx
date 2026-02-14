import { Routes, Route, Navigate } from 'react-router-dom'
import BaseLayout from './components/layout/BaseLayout'
import Dashboard from './features/dashboard/Dashboard'
import BatchList from './features/batches/BatchList'
import BatchDetail from './features/batches/BatchDetail'
import LineageExplorer from './features/lineage/LineageExplorer'

function App() {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="batches" element={<BatchList />} />
        <Route path="batches/:id" element={<BatchDetail />} />
        <Route path="lineage" element={<LineageExplorer />} />
        {/* Placeholder for other routes */}
        <Route path="compliance" element={<div className="p-4">Compliance Module (Coming Soon)</div>} />
        <Route path="master-data" element={<div className="p-4">Master Data Module (Coming Soon)</div>} />
      </Route>
    </Routes>
  )
}

export default App
