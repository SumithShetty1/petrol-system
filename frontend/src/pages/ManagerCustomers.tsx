import { useState } from "react";
import { Phone, User, Star, Droplet, MapPin, Calendar, Search } from "lucide-react";
import { searchCustomer } from "../services/managerService";
import api from "../api/api";

export default function ManagerCustomers() {
  const [phone, setPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerTransactions, setCustomerTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(value);
  };

  const handleSearch = async () => {
    if (phone.length !== 10) {
      alert("Enter valid phone number");
      return;
    }

    setLoading(true);
    setSearchPerformed(true);

    try {
      // Fetch customer details
      const customerData = await searchCustomer(phone);
      
      if (customerData.length > 0) {
        const customer = customerData[0];
        setSelectedCustomer(customer);

        // Fetch customer's transactions
        try {
          const transactionsRes = await api.get(`/transactions/?customer_mobile=${phone}`);
          setCustomerTransactions(transactionsRes.data);
        } catch (error) {
          console.error("Error fetching customer transactions:", error);
          setCustomerTransactions([]);
        }
      } else {
        setSelectedCustomer(null);
        setCustomerTransactions([]);
      }
    } catch (error) {
      console.error("Customer search error:", error);
      setSelectedCustomer(null);
      setCustomerTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate customer statistics from transactions
  const calculateStats = () => {
    if (!customerTransactions.length) {
      return {
        totalPetrol: 0,
        totalDiesel: 0,
        totalAmount: 0,
        totalCreditsEarned: 0,
        totalCreditsRedeemed: 0,
      };
    }

    return customerTransactions.reduce(
      (stats, t) => {
        const amount = parseFloat(t.final_amount) || 0;
        const quantity = parseFloat(t.quantity) || 0;
        const pointsEarned = parseFloat(t.points_earned) || 0;
        const pointsUsed = parseFloat(t.points_used) || 0;

        return {
          totalPetrol: stats.totalPetrol + (t.fuel_type === "petrol" ? quantity : 0),
          totalDiesel: stats.totalDiesel + (t.fuel_type === "diesel" ? quantity : 0),
          totalAmount: stats.totalAmount + amount,
          totalCreditsEarned: stats.totalCreditsEarned + pointsEarned,
          totalCreditsRedeemed: stats.totalCreditsRedeemed + pointsUsed,
        };
      },
      {
        totalPetrol: 0,
        totalDiesel: 0,
        totalAmount: 0,
        totalCreditsEarned: 0,
        totalCreditsRedeemed: 0,
      }
    );
  };

  const stats = calculateStats();

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return { date: "—", time: "—" };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  // Helper function to get fuel type display name
  const getFuelTypeDisplay = (fuelType: string) => {
    return fuelType === "petrol" ? "Petrol" : fuelType === "diesel" ? "Diesel" : fuelType;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-8 pb-20 px-6 rounded-b-[2rem]">
        <h1 className="text-white text-center text-lg font-medium">
          Customer Lookup
        </h1>
        <p className="text-white/80 text-center mt-1 text-xs">
          Search customer by mobile number
        </p>
      </div>

      {/* Search Card */}
      <div className="px-6 -mt-16">
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <label className="text-gray-700 text-sm block mb-3">
            Customer Mobile Number
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                className="w-full pl-6 pr-2 py-2 border-b-2 border-gray-200 focus:border-blue-500 outline-none text-gray-800 placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={phone.length !== 10 || loading}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="px-6 mt-6">
          <div className="bg-white rounded-2xl p-8 text-center shadow-md">
            <p className="text-gray-500">Searching customer...</p>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && searchPerformed && !selectedCustomer && (
        <div className="px-6 mt-6">
          <div className="bg-white rounded-2xl p-8 text-center shadow-md">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No customer found with this number</p>
          </div>
        </div>
      )}

      {/* Customer Details */}
      {!loading && selectedCustomer && (
        <div className="px-6 mt-6 space-y-4">
          {/* Customer Overview Card */}
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <h2 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Customer Overview
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Name:</span>
                <span className="text-gray-900 font-medium">
                  {selectedCustomer.name}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Phone:</span>
                <span className="text-gray-900 font-medium">
                  {selectedCustomer.mobile_number}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Member Since:</span>
                <span className="text-gray-900 font-medium">
                  {selectedCustomer.created_at 
                    ? new Date(selectedCustomer.created_at).toLocaleDateString() 
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Petrol:</span>
                <span className="text-blue-600 font-medium">
                  {stats.totalPetrol.toFixed(2)} L
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Diesel:</span>
                <span className="text-orange-600 font-medium">
                  {stats.totalDiesel.toFixed(2)} L
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Spent:</span>
                <span className="text-green-600 font-medium">
                  ₹{stats.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Credits Earned:</span>
                <span className="text-gray-900 font-medium">
                  ⭐ {stats.totalCreditsEarned.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Credits Redeemed:</span>
                <span className="text-gray-900 font-medium">
                  ⭐ {stats.totalCreditsRedeemed.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-900 font-semibold">Current Balance:</span>
                <span className="text-green-600 font-bold text-lg">
                  ⭐ {parseFloat(selectedCustomer.total_points || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <h3 className="text-gray-900 font-semibold px-5 py-4 border-b flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Transaction History
              <span className="text-xs text-gray-500 font-normal ml-2">
                ({customerTransactions.length} transaction{customerTransactions.length !== 1 ? "s" : ""})
              </span>
            </h3>

            {customerTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No transactions found for this customer</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[1200px]">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Date & Time</th>
                      <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Fuel Type</th>
                      <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Amount (₹)</th>
                      <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Qty (L)</th>
                      <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Redeemed</th>
                      <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Earned</th>
                      <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Pump</th>
                      <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Location</th>
                      <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Attendant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerTransactions.map((transaction, index) => {
                      const { date, time } = formatDate(transaction.created_at);
                      return (
                        <tr
                          key={transaction.id}
                          className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          {/* Date & Time */}
                          <td className="px-3 py-3 whitespace-nowrap">
                            <div className="text-xs">
                              <p className="text-gray-700">{date}</p>
                              <p className="text-gray-500">{time}</p>
                            </div>
                          </td>

                          {/* Fuel Type */}
                          <td className="px-3 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Droplet
                                className={`w-3 h-3 ${
                                  transaction.fuel_type === "petrol"
                                    ? "text-blue-500"
                                    : "text-orange-500"
                                }`}
                              />
                              <span
                                className={`text-xs font-medium ${
                                  transaction.fuel_type === "petrol"
                                    ? "text-blue-700"
                                    : "text-orange-700"
                                }`}
                              >
                                {getFuelTypeDisplay(transaction.fuel_type)}
                              </span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-3 py-3 text-right whitespace-nowrap">
                            <span className="text-gray-900 font-medium">
                              ₹{parseFloat(transaction.final_amount || 0).toFixed(2)}
                            </span>
                          </td>

                          {/* Quantity */}
                          <td className="px-3 py-3 text-right whitespace-nowrap">
                            <span className="text-gray-700">
                              {parseFloat(transaction.quantity || 0).toFixed(2)}
                            </span>
                          </td>

                          {/* Credit Redeemed */}
                          <td className="px-3 py-3 text-right whitespace-nowrap">
                            {parseFloat(transaction.points_used || 0) > 0 ? (
                              <span className="text-orange-600 font-medium">
                                ⭐ {parseFloat(transaction.points_used).toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>

                          {/* Credit Earned */}
                          <td className="px-3 py-3 text-right whitespace-nowrap">
                            {parseFloat(transaction.points_earned || 0) > 0 ? (
                              <span className="text-green-600 font-medium">
                                ⭐ {parseFloat(transaction.points_earned).toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>

                          {/* Pump Name */}
                          <td className="px-3 py-3 whitespace-nowrap">
                            <p className="text-gray-700 text-xs">
                              {transaction.pump_name || "—"}
                            </p>
                          </td>

                          {/* Location */}
                          <td className="px-3 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600 text-xs">
                                {transaction.pump_location || "—"}
                              </span>
                            </div>
                          </td>

                          {/* Attendant */}
                          <td className="px-3 py-3 whitespace-nowrap">
                            <p className="text-gray-700 text-xs">
                              {transaction.attendant_name || "—"}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            {customerTransactions.length > 0 && (
              <div className="bg-gray-50 px-4 py-3 border-t-2 border-blue-500">
                <p className="text-xs text-gray-600 text-center">
                  Showing {customerTransactions.length} transaction
                  {customerTransactions.length !== 1 ? "s" : ""}
                  {" • "}Scroll horizontally to view all columns
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
