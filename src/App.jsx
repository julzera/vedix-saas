import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WorkspaceLayout from './features/workspace/WorkspaceLayout';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import SettingsPage from './pages/SettingsPage';
import { EditorProvider } from './features/editor/context/EditorContext'; // Importe aqui

const ProtectedRoute = ({ children }) => {
  const isAuth = true; 
  return isAuth ? children : <Navigate to="/login" replace />;
};

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
      {/* O Provider fica aqui em cima para persistir os dados entre as telas */}
      <EditorProvider>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<Navigate to="/workspace/dashboard" replace />} />

          <Route 
            path="/workspace" 
            element={
              <ProtectedRoute>
                <WorkspaceLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/workspace/dashboard" replace />} />
        </Routes>
      </EditorProvider>
    </BrowserRouter>
  );
}

export default App;