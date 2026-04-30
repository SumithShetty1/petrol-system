import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ChevronRight,
  MapPin,
  Fuel,
  User,
} from "lucide-react";

import { getPumps } from "../../services/pumpService";

import PageHeader from "../../components/common/header/PageHeader";
import SearchBar from "../../components/common/search/SearchBar";

export default function OwnerPumps() {
  const navigate = useNavigate();

  const [pumps, setPumps] =
    useState<any[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState<string | null>(null);

  // -----------------------------------
  // LOAD PUMPS
  // -----------------------------------
  const loadPumps = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPumps();
      setPumps(data);
    } catch (err: any) {
      console.error("Error loading pumps:", err);
      setError(
        err?.response?.data?.detail ||
        "Failed to load pumps"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPumps();
  }, []);

  const filteredPumps = pumps.filter((pump) => {
    const q = search.toLowerCase();

    return (
      pump.pump_name?.toLowerCase().includes(q) ||
      pump.pump_code?.toLowerCase().includes(q) ||
      pump.location?.toLowerCase().includes(q) ||
      pump.manager_name?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">
          Loading pumps...
        </div>
      </div>
    );
  }

  // -----------------------------------
  // ERROR STATE
  // -----------------------------------
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-red-500 text-md text-center">
          {error}
        </div>

        <button
          onClick={loadPumps}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title="All Petrol Pumps"
        subtitle={`${pumps.length} Station${pumps.length !== 1 ? "s" : ""}`}
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search pumps..."
        resultCount={filteredPumps.length}
      />

      {/* LIST */}
      <div className="px-4 sm:px-6 mt-5 space-y-4 sm:space-y-5 max-w-5xl mx-auto">
        {filteredPumps.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md text-center">
            <p className="text-gray-500 text-sm sm:text-base">
              {search
                ? "No matching pumps found"
                : "No pumps available"}
            </p>
          </div>
        ) : (
          filteredPumps.map((pump) => {
            const petrolRate = pump.petrol_price || 0;
            const dieselRate = pump.diesel_price || 0;

            return (
              <div
                key={pump.pump_code}
                onClick={() =>
                  navigate(`/owner/pumps/${pump.pump_code}`)
                }
                className={`
                  bg-white
                  rounded-2xl sm:rounded-3xl
                  p-4 sm:p-5 md:p-6
                  shadow-md hover:shadow-xl
                  transition-all
                  cursor-pointer
                  border border-gray-100
                  ${!pump.is_active ? "opacity-80" : ""}
                `}
              >
                {/* HEADER */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-gray-900 text-base sm:text-lg md:text-xl font-semibold truncate">
                        {pump.pump_name}
                      </h3>

                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${pump.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {pump.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="text-xs text-blue-600 font-medium mt-1">
                      {pump.pump_code}
                    </p>

                    <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="truncate">
                        {pump.location}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                </div>

                {/* FUEL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 sm:mt-5">
                  <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Fuel className="w-4 h-4 text-blue-600" />
                      <p className="text-xs text-gray-600">
                        Petrol
                      </p>
                    </div>

                    <p className="text-blue-700 text-base sm:text-lg font-semibold">
                      ₹{petrolRate}
                      <span className="text-xs sm:text-sm font-medium">
                        /L
                      </span>
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Fuel className="w-4 h-4 text-orange-600" />
                      <p className="text-xs text-gray-600">
                        Diesel
                      </p>
                    </div>

                    <p className="text-orange-700 text-base sm:text-lg font-semibold">
                      ₹{dieselRate}
                      <span className="text-xs sm:text-sm font-medium">
                        /L
                      </span>
                    </p>
                  </div>
                </div>

                {/* MANAGER */}
                <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-100 flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-50 flex items-center justify-center">
                    <User className="w-4 h-4 text-green-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      Manager
                    </p>

                    <p className="text-sm sm:text-base text-gray-800 font-medium truncate">
                      {pump.manager_name || "Not Assigned"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
