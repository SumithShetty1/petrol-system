import { Building2, Users } from "lucide-react";

type Props = {
  totalPumps: number;
  totalOwners?: number;
};

export default function EntityStatsCards({
  totalPumps,
  totalOwners,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">

      {/* TOTAL PUMPS */}
      <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-4 h-4 text-white/90" />
          <p className="text-white/80 text-sm">
            Total Pumps
          </p>
        </div>

        <p className="text-white text-2xl mt-1 font-semibold">
          {totalPumps}
        </p>
      </div>

    {totalOwners !== undefined && (
        <>
      {/* TOTAL OWNERS */}
      <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-white/90" />
          <p className="text-white/80 text-sm">
            Total Owners
          </p>
        </div>

        <p className="text-white text-2xl mt-1 font-semibold">
          {totalOwners}
        </p>
      </div>
      </>
    )}
    </div>
  );
}
