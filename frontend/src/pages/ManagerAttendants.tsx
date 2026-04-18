import { useEffect, useState } from "react";
import { User, Plus, Edit2, Trash2 } from "lucide-react";
import { getAttendants } from "../services/employeeService";
import { getAttendantDashboardById } from "../services/dashboardService";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileCard from "../components/profile/ProfileCard";
import PerformanceDashboard from "../components/profile/PerformanceDashboard";
import AddAttendantModal from "../components/attendant/AddAttendantModal";
import EditAttendantModal from "../components/attendant/EditAttendantModal";
import DeleteAttendantModal from "../components/attendant/DeleteAttendantModal";

type DateFilter = "today" | "week" | "month" | "year" | "custom";

export default function ManagerAttendants() {
  const [attendants, setAttendants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected attendant state
  const [selectedAttendant, setSelectedAttendant] = useState<any>(null);
  const [attendantStats, setAttendantStats] = useState<any>(null);

  // Date filter for attendant profile
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editAttendant, setEditAttendant] = useState<any>(null);
  const [deleteAttendantData, setDeleteAttendantData] = useState<any>(null);

  const loadAttendants = async () => {
    setLoading(true);

    try {
      const data = await getAttendants();
      setAttendants(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendants();
  }, []);

  const fetchStats = async (
    attendantId: number,
    range: DateFilter,
    start?: string,
    end?: string
  ) => {
    try {
      const stats = await getAttendantDashboardById(attendantId, range, start, end);
      setAttendantStats(stats);
    } catch (error) {
      console.error(error);
    }
  };

  // Load attendant details when selected
  const loadAttendantDetails = async (attendant: any) => {
    setSelectedAttendant(attendant);

    setDateFilter("today");
    setStartDate("");
    setEndDate("");
    setShowCustomDatePicker(false);

    await fetchStats(attendant.id, "today");
  };

  const handleFilterChange = async (filter: DateFilter) => {
    if (!selectedAttendant) return;

    setDateFilter(filter);

    if (filter === "custom") {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
      await fetchStats(selectedAttendant.id, filter);
    }
  };

  const handleCustomDateSubmit = async () => {
    if (!selectedAttendant || !startDate || !endDate) return;

    await fetchStats(
      selectedAttendant.id,
      "custom",
      startDate,
      endDate
    );

    setShowCustomDatePicker(false);
  };

  const handleBackToList = () => {
    setSelectedAttendant(null);

    setDateFilter("today");
    setStartDate("");
    setEndDate("");
    setShowCustomDatePicker(false);
  };

  const handleDeleteClick = (attendant: any) => {
    setDeleteAttendantData(attendant);
    setDeleteModal(true);
  };

  const getInitials = (first: string, last: string) => {
    const firstInitial = first?.[0] || "";
    const lastInitial = last?.[0] || "";

    if (!firstInitial && !lastInitial) return "U";

    return (firstInitial + lastInitial).toUpperCase();
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading attendants...</div>
      </div>
    );
  }

  // Attendant Profile View
  if (selectedAttendant) {
    return (
      <div className="min-h-screen bg-gray-50 pb-6 md:pb-8">

        <ProfileHeader
          title="Attendant Profile"
          showBack={true}
          onBack={handleBackToList}
        />

        <div className="px-4 md:px-8 lg:px-12 -mt-10 md:-mt-12 relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

              {/* Profile Card */}
              <div className="lg:col-span-1">
                <ProfileCard profile={selectedAttendant} showLogout={false} />
              </div>

              {/* Dashboard */}
              <div className="lg:col-span-2">
                <PerformanceDashboard
                  stats={attendantStats}
                  range={dateFilter}
                  showCustomDatePicker={showCustomDatePicker}
                  startDate={startDate}
                  endDate={endDate}
                  onChangeFilter={handleFilterChange}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  onCustomDateSubmit={handleCustomDateSubmit}
                  onCancelCustomDate={() => setShowCustomDatePicker(false)}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // Attendants List View
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-8 pb-8 px-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between min-h-[60px]">
          <div>
            <h1 className="text-white text-lg md:text-2xl font-medium">
              Attendant Management
            </h1>
            <p className="text-white/80 text-xs mt-1">
              {attendants.length} attendant{attendants.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-md hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>

        </div>
      </div>

      {/* Attendants List */}
      <div className="px-6 mt-4 space-y-3">
        {attendants.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-md">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No attendants found</p>
          </div>
        ) : (
          attendants.map((attendant) => (
            <div
              key={attendant.id}
              onClick={() => loadAttendantDetails(attendant)}
              className="bg-white rounded-2xl p-4 shadow-md cursor-pointer hover:bg-blue-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <span className="text-sm font-medium">
                    {getInitials(attendant.first_name, attendant.last_name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">
                    {attendant.first_name} {attendant.last_name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {attendant.phone}
                  </p>
                  <p className="text-xs text-blue-600 truncate">
                    {attendant.pump_name || "—"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditAttendant(attendant);
                      setEditModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(attendant);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AddAttendantModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadAttendants}
      />

      <EditAttendantModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        onSuccess={loadAttendants}
        attendant={editAttendant}
      />

      <DeleteAttendantModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onSuccess={loadAttendants}
        attendant={deleteAttendantData}
      />
    </div>
    
  );
}
