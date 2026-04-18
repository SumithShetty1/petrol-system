import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Transaction from "./pages/Transaction";
import Profile from "./pages/Profile";

// Manager Pages
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerAttendants from "./pages/ManagerAttendants";
import ManagerTransactions from "./pages/ManagerTransactions";
import ManagerCustomers from "./pages/ManagerCustomers";
import ManagerSettings from "./pages/ManagerSettings";

import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import AttendantLayout from "./components/layouts/AttendantLayout";
import ManagerLayout from "./components/layouts/ManagerLayout";

function App() {

  return (

    <Routes>

      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* ATTENDANT */}
      <Route
        path="/attendant/transaction"
        element={
          <ProtectedRoute allowedRoles={["attendant"]}>
            <AttendantLayout>
              <Transaction />
            </AttendantLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendant/profile"
        element={
          <ProtectedRoute allowedRoles={["attendant"]}>
            <AttendantLayout>
              <Profile />
            </AttendantLayout>
          </ProtectedRoute>
        }
      />

      {/* MANAGER */}
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerLayout>
              <ManagerDashboard />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/attendants"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerLayout>
              <ManagerAttendants />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/transactions"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerLayout>
              <ManagerTransactions />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/customers"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerLayout>
              <ManagerCustomers />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/settings"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerLayout>
              <ManagerSettings />
            </ManagerLayout>
          </ProtectedRoute>
        }
      />

    </Routes>

  );

}

export default App;
