import { useEffect, useState } from "react";
import { getDashboard } from "../services/managerService";
import { getPumpId } from "../utils/pump";

export default function ManagerDashboard() {

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const pumpId = getPumpId();

        if (!pumpId) {
          console.error("Pump ID not found");
          return;
        }

        const dashboard = await getDashboard(pumpId);

        setData(dashboard);

      } catch (error) {

        console.error("Dashboard error:", error);

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="p-6">No dashboard data available</div>;
  }

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Pump Dashboard
      </h1>

      {/* KPI Cards */}

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Today's Sales</p>
          <p className="text-xl font-bold text-blue-600">
            ₹{data.today.total_sales}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Today's Quantity</p>
          <p className="text-xl font-bold text-green-600">
            {data.today.total_quantity} L
          </p>
        </div>

      </div>

      {/* Fuel Sales */}

      <div className="bg-white p-4 rounded-xl shadow">

        <h2 className="font-semibold mb-4">
          Fuel Sales
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <p className="text-sm text-gray-500">Petrol</p>
            <p className="font-bold">
              ₹{data.fuel_sales.petrol_sales}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Diesel</p>
            <p className="font-bold">
              ₹{data.fuel_sales.diesel_sales}
            </p>
          </div>

        </div>

      </div>

    </div>

  );

}
