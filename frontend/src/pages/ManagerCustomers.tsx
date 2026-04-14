import { useState } from "react";
import { Phone, User, Calendar, Droplet, MapPin } from "lucide-react";
import { getCustomerByMobile, getCustomerTransactions } from "../services/customerService";


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
      const customerData = await getCustomerByMobile(phone);

      if (customerData.length > 0) {
        const customer = customerData[0];
        setSelectedCustomer(customer);

        const transactions = await getCustomerTransactions(phone);
        setCustomerTransactions(transactions);
      } else {
        setSelectedCustomer(null);
        setCustomerTransactions([]);
      }
    } catch (error) {
      console.error("Customer lookup failed:", error);
      alert("Something went wrong. Please try again.");

      setSelectedCustomer(null);
      setCustomerTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return { date: "—", time: "—" };

    const date = new Date(dateString);

    return {
      date: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getFuelTypeDisplay = (fuelType: string) => {
    return fuelType === "petrol" ? "Petrol" : "Diesel";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-8 pb-8 px-6 rounded-b-[2rem]">
        <div className="min-h-[60px] flex flex-col justify-center">

          <h1 className="text-white text-center text-lg md:text-2xl font-medium relative z-10">
            Customer Lookup
          </h1>

          {/* Invisible spacer to match dashboard height */}
          <p className="text-white/0 text-sm mt-2 md:mt-5">placeholder</p>

        </div>
      </div>

      {/* Search Card */}
      <div className="px-4 md:px-8 -mt-10 md:-mt-12 relative z-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl md:rounded-4xl shadow-md pt-6 pb-9 px-6 md:pt-8 md:pb-10 md:px-8 space-y-3 md:space-y-3">

            <div className="space-y-2">
              <label className="text-gray-700 text-sm md:text-base font-medium">
                Customer Mobile Number
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 relative">
                  <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter phone number"
                    className="w-full pl-9 pr-2 py-3 md:py-4 border-b-2 border-gray-200 focus:border-blue-500 outline-none text-gray-800 placeholder:text-gray-400 text-sm md:text-base"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={phone.length !== 10 || loading}
                  className="px-6 py-3 md:py-4 rounded-xl bg-blue-500 text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                >
                  {loading ? "..." : "Search"}
                </button>
              </div>
            </div>
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
        <div className="px-4 md:px-8 mt-6">
          <div className="max-w-5xl mx-auto space-y-4">
            {/* Customer Overview */}
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
                      ? new Date(selectedCustomer.created_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                      : "—"}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-900 font-semibold">Credit Points:</span>
                  <span className="text-green-600 font-bold ">
                    ⭐ {parseFloat(selectedCustomer.total_points || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <h3 className="text-gray-900 font-semibold px-5 py-4 border-b border-b border-gray-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Transaction History
              </h3>

              {customerTransactions.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No transactions found for this customer</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[1800px]">
                      <thead className="bg-blue-500 text-white">
                        <tr>
                          <th className="px-3 py-3 text-center text-xs whitespace-nowrap">Sl No</th>
                          <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Customer Name</th>
                          <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Customer Mobile</th>
                          <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Fuel Type</th>
                          <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Quantity (L)</th>
                          <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Credit Redeemed</th>
                          <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Credit Earned</th>
                          <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Remaining Credit</th>
                          <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Original Amt (₹)</th>
                          <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Final Amt (₹)</th>
                          <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Pump Name</th>
                          <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Location</th>
                          <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Attendant Name</th>
                          <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Attendant Phone</th>
                          <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Manager Name</th>
                          <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Manager Number</th>
                          <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Date & Time</th>
                        </tr>
                      </thead>

                      <tbody>
                        {customerTransactions.map((t, index) => {
                          const { date, time } = formatDate(t.created_at);

                          return (
                            <tr
                              key={t.id}
                              className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                            >
                              {/* Serial Number */}
                              <td className="px-3 py-3 text-center whitespace-nowrap">
                                <span className="text-gray-500 text-xs">{index + 1}</span>
                              </td>

                              {/* Customer Name */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <p className="text-gray-900 font-medium text-xs">
                                  {t.customer_name || "—"}
                                </p>
                              </td>

                              {/* Customer Mobile */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <p className="text-gray-500 text-xs">
                                  {t.customer_mobile || "—"}
                                </p>
                              </td>

                              {/* Fuel Type */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <Droplet
                                    className={`w-3 h-3 ${t.fuel_type === "petrol"
                                      ? "text-blue-500"
                                      : "text-orange-500"
                                      }`}
                                  />
                                  <span
                                    className={`text-xs font-medium ${t.fuel_type === "petrol"
                                      ? "text-blue-700"
                                      : "text-orange-700"
                                      }`}
                                  >
                                    {getFuelTypeDisplay(t.fuel_type)}
                                  </span>
                                </div>
                              </td>

                              {/* Quantity */}
                              <td className="px-3 py-3 text-right whitespace-nowrap">
                                <span className="text-gray-700 text-xs">
                                  {parseFloat(t.quantity || 0).toFixed(2)}
                                </span>
                              </td>

                              {/* Credit Redeemed */}
                              <td className="px-3 py-3 text-right whitespace-nowrap">
                                {parseFloat(t.points_used || 0) > 0 ? (
                                  <span className="text-orange-600 font-medium text-xs">
                                    ⭐ {parseFloat(t.points_used).toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-xs">—</span>
                                )}
                              </td>

                              {/* Credit Earned */}
                              <td className="px-3 py-3 text-right whitespace-nowrap">
                                {parseFloat(t.points_earned || 0) > 0 ? (
                                  <span className="text-green-600 font-medium text-xs">
                                    ⭐ {parseFloat(t.points_earned).toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-xs">—</span>
                                )}
                              </td>

                              {/* Remaining Credit Points */}
                              <td className="px-3 py-3 text-right whitespace-nowrap">
                                <span className="text-blue-600 font-medium text-xs">
                                  ⭐ {t.remaining_points || 0}
                                </span>
                              </td>

                              {/* Original Amount */}
                              <td className="px-3 py-3 text-right whitespace-nowrap">
                                <span className="text-gray-500 text-xs">
                                  ₹{parseFloat(t.original_amount || 0).toFixed(2)}
                                </span>
                              </td>

                              {/* Final Amount */}
                              <td className="px-3 py-3 text-right whitespace-nowrap">
                                <span className="text-gray-900 font-medium text-xs">
                                  ₹{parseFloat(t.final_amount || 0).toFixed(2)}
                                </span>
                              </td>

                              {/* Pump Name */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <p className="text-gray-700 text-xs">
                                  {t.pump_name || "—"}
                                </p>
                              </td>

                              {/* Location */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span className="text-gray-600 text-xs">
                                    {t.pump_location || "—"}
                                  </span>
                                </div>
                              </td>

                              {/* Attendant Name */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <p className="text-gray-700 text-xs">
                                  {t.attendant_name || "—"}
                                </p>
                              </td>

                              {/* Attendant Phone */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <p className="text-gray-500 text-xs">
                                  {t.attendant_phone || "—"}
                                </p>
                              </td>

                              {/* Manager Name */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <p className="text-gray-700 text-xs">
                                  {t.manager_name || "—"}
                                </p>
                              </td>

                              {/* Manager Number */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <p className="text-gray-500 text-xs">
                                  {t.manager_phone || "—"}
                                </p>
                              </td>

                              {/* Date & Time */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <div className="text-xs">
                                  <p className="text-gray-700">{date}</p>
                                  <p className="text-gray-500">{time}</p>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 px-4 py-3 border-t-2 border-blue-500">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs text-gray-600">
                        Showing {customerTransactions.length} transaction
                        {customerTransactions.length !== 1 ? "s" : ""}
                        {" • "}Scroll horizontally to view all columns
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
