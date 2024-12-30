import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FormBuilder from './components/FormBuilder';
import FormEdit from './components/FormEdit';
import FormView from './components/FormView';
import FormResponses from './components/FormResponses';
import { AuthProvider, useAuth } from './context/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (user === null) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/forms/new"
            element={
              <PrivateRoute>
                <FormBuilder />
              </PrivateRoute>
            }
          />
          <Route
            path="/forms/:id"
            element={
              <PrivateRoute>
                <FormEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/forms/:id/responses"
            element={
              <PrivateRoute>
                <FormResponses />
              </PrivateRoute>
            }
          />
          <Route path="/f/:id" element={<FormView />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;