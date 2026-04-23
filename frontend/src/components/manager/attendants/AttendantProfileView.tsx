import PageHeader from "../../common/PageHeader";
import ProfileCard from "../../attendant/profile/ProfileCard";
import PerformanceDashboard from "../../attendant/profile/PerformanceDashboard";
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
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50 pb-6 md:pb-8">
      <PageHeader title="Attendant Profile" showBack={true} onBack={onBack} />

      <div className="px-4 md:px-8 lg:px-12 -mt-10 md:-mt-12 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-1">
              <ProfileCard profile={attendant} showLogout={false} />
            </div>

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
        </div>
      </div>
    </div>
  );
}
