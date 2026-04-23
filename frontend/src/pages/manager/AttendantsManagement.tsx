import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { getAttendants } from "../../services/employeeService";
import { getAttendantDashboardById } from "../../services/dashboardService";

import PageHeader from "../../components/common/PageHeader";
import AttendantsList from "../../components/manager/attendants/AttendantsList";
import AttendantProfileView from "../../components/manager/attendants/AttendantProfileView";
import AddAttendantModal from "../../components/modals/AddAttendantModal";
import EditAttendantModal from "../../components/modals/EditAttendantModal";
import DeleteAttendantModal from "../../components/modals/DeleteAttendantModal";

export type DateFilter = "today" | "week" | "month" | "year" | "custom";

export default function AttendantsManagement() {
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

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
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
    await fetchStats(selectedAttendant.id, "custom", startDate, endDate);
    setShowCustomDatePicker(false);
  };

  const handleBackToList = () => {
    setSelectedAttendant(null);
    setDateFilter("today");
    setStartDate("");
    setEndDate("");
    setShowCustomDatePicker(false);
  };

  const handleEditClick = (attendant: any) => {
    setEditAttendant(attendant);
    setEditModal(true);
  };

  const handleDeleteClick = (attendant: any) => {
    setDeleteAttendantData(attendant);
    setDeleteModal(true);
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
      <AttendantProfileView
        attendant={selectedAttendant}
        stats={attendantStats}
        dateFilter={dateFilter}
        showCustomDatePicker={showCustomDatePicker}
        startDate={startDate}
        endDate={endDate}
        onBack={handleBackToList}
        onFilterChange={handleFilterChange}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onCustomDateSubmit={handleCustomDateSubmit}
        onCancelCustomDate={() => setShowCustomDatePicker(false)}
      />
    );
  }

  // Attendants List View
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title="Attendants"
        subtitle={`${attendants.length} attendant`}
        rightAction={
          <button
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-md hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      <AttendantsList
        attendants={attendants}
        onSelectAttendant={loadAttendantDetails}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <AddAttendantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
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