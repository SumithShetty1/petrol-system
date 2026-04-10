import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Transaction from "./pages/Transaction";
import Profile from "./pages/Profile";

// Manager Pages
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerAttendants from "./pages/ManagerAttendants";
import ManagerTransactions from "./pages/ManagerTransactions";
import ManagerCustomers from "./pages/ManagerCustomers";
import ManagerProfile from "./pages/ManagerProfile";

import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import AttendantLayout from "./components/layouts/AttendantLayout";
import ManagerLayout from "./components/layouts/ManagerLayout";

function App() {

  return (

    <Routes>

      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* ATTENDANT APP */}

      <Route
        path="/transaction"
        element={
          <ProtectedRoute>
            <AttendantLayout>
              <Transaction />
            </AttendantLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AttendantLayout>
              <Profile />
            </AttendantLayout>
          </ProtectedRoute>
        }
      />

      {/* MANAGER APP */}

      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute>
            <ManagerLayout>
              <ManagerDashboard />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/attendants"
        element={
          <ProtectedRoute>
            <ManagerLayout>
              <ManagerAttendants />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/transactions"
        element={
          <ProtectedRoute>
            <ManagerLayout>
              <ManagerTransactions />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/customers"
        element={
          <ProtectedRoute>
            <ManagerLayout>
              <ManagerCustomers />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/profile"
        element={
          <ProtectedRoute>
            <ManagerLayout>
              <ManagerProfile />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />

    </Routes>

  );

}

export default App;
