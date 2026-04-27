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

export default function OwnerPumps() {
  const navigate = useNavigate();

  const [pumps, setPumps] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadPumps = async () => {
      try {
        const data =
          await getPumps();

        setPumps(data);
      } catch (error) {
        console.error(
          "Error loading pumps:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadPumps();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">
          Loading pumps...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title="All Petrol Pumps"
        subtitle={`${pumps.length} Stations`}
      />

      <div className="px-6 mt-6 space-y-4">
        {pumps.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-md text-center">
            <p className="text-gray-500">
              No pumps available
            </p>
          </div>
        ) : (
          pumps.map((pump) => {
            const petrolRate =
              pump.petrol_price || 0;

            const dieselRate =
              pump.diesel_price || 0;

            return (
              <div
                key={
                  pump.pump_code
                }
                onClick={() =>
                  navigate(
                    `/owner/pumps/${pump.pump_code}`
                  )
                }
                className="bg-white rounded-3xl p-5 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
              >
                {/* Top */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-gray-900 text-lg font-semibold">
                      {
                        pump.pump_name
                      }
                    </h3>

                    <p className="text-xs text-blue-600 font-medium mt-1">
                      {
                        pump.pump_code
                      }
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />

                      <span>
                        {
                          pump.location
                        }
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>

                {/* Fuel */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Fuel className="w-4 h-4 text-blue-600" />

                      <p className="text-xs text-gray-600">
                        Petrol
                      </p>
                    </div>

                    <p className="text-blue-700 text-lg font-semibold">
                      ₹
                      {
                        petrolRate
                      }
                      <span className="text-sm font-medium">
                        /L
                      </span>
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Fuel className="w-4 h-4 text-orange-600" />

                      <p className="text-xs text-gray-600">
                        Diesel
                      </p>
                    </div>

                    <p className="text-orange-700 text-lg font-semibold">
                      ₹
                      {
                        dieselRate
                      }
                      <span className="text-sm font-medium">
                        /L
                      </span>
                    </p>
                  </div>
                </div>

                {/* Manager */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                    <User className="w-4 h-4 text-green-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Manager
                    </p>

                    <p className="text-gray-800 font-medium">
                      {pump.manager_name ||
                        "Not Assigned"}
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
