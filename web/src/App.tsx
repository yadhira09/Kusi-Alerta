import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/shared/HomePage";
import { OperatorDashboard } from "./pages/operator/OperatorDashboard";
import { AlertDetailPage } from "./pages/operator/AlertDetailPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/operator" element={<OperatorDashboard />} />
        <Route path="/operator/alerts/:id" element={<AlertDetailPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
