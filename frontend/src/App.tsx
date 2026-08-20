import { Navigate, Route, Routes } from "react-router";
import TodosPage from "./pages/TodosPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TodosPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
