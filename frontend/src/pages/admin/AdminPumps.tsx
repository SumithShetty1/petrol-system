import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, MapPin, Fuel, User, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getPumps,
  createPump,
  updatePump,
  deletePump,
} from "../../services/pumpService";

import { getOwners } from "../../services/authService";

import PageHeader from "../../components/common/header/PageHeader";

import AddPumpModal from "../../components/modals/pump/AddPumpModal";
import EditPumpModal from "../../components/modals/pump/EditPumpModal";
import DeletePumpModal from "../../components/modals/pump/DeletePumpModal";
import SearchBar from "../../components/common/search/SearchBar";

export default function AdminPumps() {
  const navigate = useNavigate();

  const [pumps, setPumps] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [listError, setListError] = useState<string | null>(null);
  const [ownersError, setOwnersError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [selectedPump, setSelectedPump] = useState<any>(null);

  const [search, setSearch] = useState("");

  // -----------------------------------
  // LOAD PUMPS
  // -----------------------------------
  const loadPumps = async () => {
    try {
      setLoading(true);
      setListError(null);

      const data = await getPumps();
      setPumps(data);
    } catch (err: any) {
      console.error(err);

      setListError(
        err?.response?.data?.detail ||
        "Failed to load pumps"
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // LOAD OWNERS
  // -----------------------------------
  const loadOwners = async () => {
    try {
      setOwnersError(null);

      const data = await getOwners();
      setOwners(data);
    } catch (err: any) {
      console.error(err);

      setOwnersError(
        err?.response?.data?.detail ||
        "Failed to load owners"
      );
    }
  };

  useEffect(() => {
    loadPumps();
    loadOwners();
  }, []);

  const filteredPumps = pumps.filter((pump) => {
    const q = search.toLowerCase();

    return (
      pump.pump_name?.toLowerCase().includes(q) ||
      pump.pump_code?.toLowerCase().includes(q) ||
      pump.location?.toLowerCase().includes(q) ||
      pump.owner_name?.toLowerCase().includes(q) ||
      pump.manager_name?.toLowerCase().includes(q)
    );
  });

  // -----------------------------------
  // ACTIONS
  // -----------------------------------
  const handleEditClick = (pump: any) => {
    setSelectedPump(pump);
    setEditModal(true);
  };

  const handleDeleteClick = (pump: any) => {
    setSelectedPump(pump);
    setDeleteModal(true);
  };

  // -----------------------------------
  // LOADING
  // -----------------------------------
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
  // ERROR
  // -----------------------------------
  if (listError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-md">{listError}</p>

        <button
          onClick={loadPumps}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  // -----------------------------------
  // UI
  // -----------------------------------
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title="All Petrol Pumps"
        subtitle={`${pumps.length} Stations`}
        rightAction={
          <button
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-md hover:bg-gray-100 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      {/* OWNERS ERROR */}
      {ownersError && (
        <div className="px-6 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 flex justify-between items-center">
            <span>{ownersError}</span>

            <button
              onClick={loadOwners}
              className="text-blue-600 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search pumps..."
        resultCount={filteredPumps.length}
      />

      {/* LIST */}
      <div className="px-4 sm:px-6 mt-5 space-y-4 sm:space-y-5 max-w-6xl mx-auto">
        {filteredPumps.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md text-center">
            <p className="text-gray-500 text-sm sm:text-base">
              No pumps available
            </p>
          </div>
        ) : (
          filteredPumps.map((pump) => (
            <div
              key={pump.pump_code}
              onClick={() =>
                navigate(`/admin/pumps/${pump.pump_code}`)
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
              <div className="flex justify-between items-start gap-3">
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

                  <p className="text-xs text-indigo-600 font-medium mt-1">
                    {pump.pump_code}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    {pump.location}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(pump);
                    }}
                    className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(pump);
                    }}
                    className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* FUEL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 sm:mt-5">
                <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Fuel className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-gray-600">Petrol</p>
                  </div>
                  <p className="text-blue-700 text-base sm:text-lg font-semibold">
                    ₹{pump.petrol_price || 0}
                    <span className="text-xs sm:text-sm font-medium">/L</span>
                  </p>
                </div>

                <div className="bg-orange-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Fuel className="w-4 h-4 text-orange-600" />
                    <p className="text-xs text-gray-600">Diesel</p>
                  </div>
                  <p className="text-orange-700 text-base sm:text-lg font-semibold">
                    ₹{pump.diesel_price || 0}
                    <span className="text-xs sm:text-sm font-medium">/L</span>
                  </p>
                </div>
              </div>

              {/* OWNER + MANAGER */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Owner</p>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {pump.owner_name || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Manager</p>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {pump.manager_name || "Not Assigned"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>


      {/* ADD */}
      <AddPumpModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadPumps}
        onSubmit={createPump}
        owners={owners}
      />

      {/* EDIT */}
      <EditPumpModal
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          setSelectedPump(null);
        }}
        onSuccess={loadPumps}
        pump={selectedPump}
        onSubmit={updatePump}
        owners={owners}
      />

      {/* DELETE */}
      <DeletePumpModal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setSelectedPump(null);
        }}
        onSuccess={loadPumps}
        pump={selectedPump}
        onSubmit={deletePump}
      />
    </div>
  );
}
