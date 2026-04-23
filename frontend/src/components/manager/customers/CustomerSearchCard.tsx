import { Phone } from "lucide-react";

type Props = {
  phone: string;
  loading: boolean;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
};

export default function CustomerSearchCard({ phone, loading, onPhoneChange, onSearch }: Props) {
  return (
    <div className="bg-white rounded-3xl md:rounded-4xl shadow-md pt-6 pb-9 px-6 md:pt-8 md:pb-10 md:px-8 space-y-3 md:space-y-3">
      <div className="space-y-2">
        <label className="text-gray-700 text-sm md:text-base font-medium">
          Customer Mobile Number
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="tel"
              value={phone}
              onChange={onPhoneChange}
              placeholder="Enter phone number"
              className="w-full pl-9 pr-2 py-3 md:py-4 border-b-2 border-gray-200 focus:border-blue-500 outline-none text-gray-800 placeholder:text-gray-400 text-sm md:text-base"
            />
          </div>
          <button
            onClick={onSearch}
            disabled={phone.length !== 10 || loading}
            className="px-6 py-3 md:py-4 rounded-xl bg-blue-500 text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>
      </div>
    </div>
  );
}
