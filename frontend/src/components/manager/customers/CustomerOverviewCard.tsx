import { User } from "lucide-react";

type Props = {
  customer: any;
};

export default function CustomerOverviewCard({ customer }: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md">
      <h2 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-500" />
        Customer Overview
      </h2>

      <div className="space-y-3 text-sm">
        <InfoRow label="Name" value={customer.name} />
        <InfoRow label="Phone" value={customer.mobile_number} />
        <InfoRow
          label="Member Since"
          value={
            customer.created_at
              ? new Date(customer.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—"
          }
        />
        <div className="flex justify-between py-2">
          <span className="text-gray-900 font-semibold">Credit Points:</span>
          <span className="text-green-600 font-bold">
            ⭐ {parseFloat(customer.total_points || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}:</span>
      <span className="text-gray-900 font-medium">{value || "—"}</span>
    </div>
  );
}
