import { useState } from "react";
import { searchCustomer } from "../services/managerService";

export default function ManagerCustomers() {

  const [phone, setPhone] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {

    if (phone.length !== 10) {
      alert("Enter valid phone number");
      return;
    }

    try {

      setLoading(true);

      const data = await searchCustomer(phone);

      setCustomers(data);

    } catch (error) {

      console.error("Customer search error:", error);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Customer Lookup
      </h1>

      {/* Search Box */}

      <div className="flex gap-2">

        <input
          type="text"
          placeholder="Enter mobile number"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value.replace(/\D/g, "").slice(0, 10)
            )
          }
          className="flex-1 border rounded-lg p-2"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 rounded-lg"
        >
          Search
        </button>

      </div>

      {/* Loading */}

      {loading && (
        <p className="text-gray-500">
          Searching customer...
        </p>
      )}

      {/* Results */}

      {customers.length > 0 && (

        <div className="space-y-4">

          {customers.map((c) => (

            <div
              key={c.id}
              className="bg-white p-4 rounded-xl shadow"
            >

              <p className="font-semibold">
                {c.name}
              </p>

              <p className="text-sm text-gray-500">
                {c.mobile_number}
              </p>

              <p className="text-sm text-orange-500">
                ⭐ {c.total_points} points
              </p>

            </div>

          ))}

        </div>

      )}

      {!loading && customers.length === 0 && (
        <p className="text-gray-500">
          No customer found
        </p>
      )}

    </div>

  );

}
