import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import WorkspaceLayout from './features/workspace/WorkspaceLayout';

// Pages
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import SettingsPage from './pages/SettingsPage';

/**
 * Simulador de Proteção de Rota
 * No futuro, você pode integrar com Firebase, Supabase ou seu Back-end.
 */
const ProtectedRoute = ({ children }) => {
  const isAuth = true; // Forçamos true para você conseguir testar offline agora
  return isAuth ? children : <Navigate to="/login" replace />;
};

// Placeholder para Login (Pode ser uma feature futura)
const LoginScreen = () => (
  <div className="h-screen w-full flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-primary">Vixel.ai</h1>
      <p className="text-gray-500">Página de Login em construção</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<LoginScreen />} />

        {/* Redirecionamento da Raiz para o Dashboard */}
        <Route path="/" element={<Navigate to="/workspace/dashboard" replace />} />

        {/* Estrutura Principal do SaaS */}
        <Route 
          path="/workspace" 
          element={
            <ProtectedRoute>
              <WorkspaceLayout />
            </ProtectedRoute>
          }
        >
          {/* Sub-rotas do Workspace */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Fallback caso acessem apenas /workspace */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Rota 404 - Redireciona para o dashboard se a página não existir */}
        <Route path="*" element={<Navigate to="/workspace/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;