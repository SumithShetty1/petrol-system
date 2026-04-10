import { Phone } from "lucide-react";

type Props = {
  phone: string;
  onPhoneChange: (value: string) => void;
  onFetch: () => void;
};

export default function PhoneInputSection({ phone, onPhoneChange, onFetch }: Props) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    onPhoneChange(value);
  };

  return (
    <div className="space-y-2">
      <label className="text-gray-700 text-sm md:text-base font-medium">Phone Number</label>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Enter customer phone number"
            className="w-full pl-6 md:pl-7 pr-2 py-3 md:py-4 border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors text-gray-800 placeholder:text-gray-400 text-sm md:text-base"
          />
        </div>
        <button
          onClick={onFetch}
          disabled={phone.length !== 10}
          className="px-6 py-3 md:py-4 rounded-xl border-2 border-blue-500 text-blue-500 font-medium disabled:border-gray-300 disabled:text-gray-400 transition-colors text-sm md:text-base whitespace-nowrap"
        >
          Fetch Customer
        </button>
      </div>
    </div>
  );
}
