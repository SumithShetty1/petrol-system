import PageHeader from "../header/PageHeader";
import ProfileCard from "./ProfileCard";
import PerformanceDashboard from "../performance/PerformanceDashboard";
import type { DateFilter } from "../../../pages/manager/AttendantsManagement";

type Props = {
  attendant: any;
  stats: any;
  dateFilter: DateFilter;
  showCustomDatePicker: boolean;
  startDate: string;
  endDate: string;
  onBack: () => void;
  onFilterChange: (filter: DateFilter) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onCustomDateSubmit: () => void;
  onCancelCustomDate: () => void;
  showPerformance?: boolean;
};

export default function AttendantProfileView({
  attendant,
  stats,
  dateFilter,
  showCustomDatePicker,
  startDate,
  endDate,
  onBack,
  onFilterChange,
  onStartDateChange,
  onEndDateChange,
  onCustomDateSubmit,
  onCancelCustomDate,
  showPerformance = true,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50 pb-6 md:pb-8">
      <PageHeader
        title="Attendant Profile"
        showBack={true}
        onBack={onBack}
      />

      <div className="px-4 md:px-8 lg:px-12 -mt-10 md:-mt-12 relative z-20">
        <div className="max-w-7xl mx-auto">

          {/* MANAGER VIEW (Profile + Dashboard) */}
          {showPerformance ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* LEFT */}
              <div className="lg:col-span-1">
                <ProfileCard
                  profile={attendant}
                  showLogout={false}
                  showManagerInfo={true}
                />
              </div>

              {/* RIGHT */}
              <div className="lg:col-span-2">
                <PerformanceDashboard
                  stats={stats}
                  range={dateFilter}
                  showCustomDatePicker={showCustomDatePicker}
                  startDate={startDate}
                  endDate={endDate}
                  onChangeFilter={onFilterChange}
                  onStartDateChange={onStartDateChange}
                  onEndDateChange={onEndDateChange}
                  onCustomDateSubmit={onCustomDateSubmit}
                  onCancelCustomDate={onCancelCustomDate}
                />
              </div>
            </div>
          ) : (
            /* OWNER VIEW (Profile) */
            <div className="max-w-xl mx-auto">
              <ProfileCard
                profile={attendant}
                showLogout={false}
                showManagerInfo={true}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}