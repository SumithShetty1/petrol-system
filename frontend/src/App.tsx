import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Transaction from "./pages/Transaction";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/layouts/MainLayout";

function App() {

  return (

    <Routes>

      <Route path="/" element={<Login />} />

      <Route
        path="/transaction"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Transaction />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

    </Routes>

  );

}

export default App;
