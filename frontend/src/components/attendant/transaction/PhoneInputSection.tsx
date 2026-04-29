import { Phone, Loader2 } from "lucide-react";

type Props = {
  phone: string;
  onPhoneChange: (value: string) => void;
  onFetch: () => void;
  loading?: boolean;
};

export default function PhoneInputSection({
  phone,
  onPhoneChange,
  onFetch,
  loading = false,
}: Props) {

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    onPhoneChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && phone.length === 10 && !loading) {
      onFetch();
    }
  };

  const isDisabled = phone.length !== 10 || loading;

  return (
    <div className="space-y-2">

      {/* Label */}
      <label className="text-gray-700 text-sm md:text-base font-medium">
        Phone Number
      </label>

      <div className="flex flex-col sm:flex-row gap-3">

        {/* Input */}
        <div className="flex-1 relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />

          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter customer phone number"
            className="
              w-full
              pl-10 pr-3
              py-3 md:py-4

              border-b-2 border-gray-200
              focus:border-blue-500

              outline-none
              transition-all

              text-gray-800
              placeholder:text-gray-400

              text-sm md:text-base

              disabled:bg-gray-50
            "
          />
        </div>

        {/* Button */}
        <button
          onClick={onFetch}
          disabled={isDisabled}
          className="
            flex items-center justify-center gap-2

            px-5 md:px-6
            py-3 md:py-4

            rounded-xl

            bg-blue-500
            text-white
            font-medium

            transition-all duration-200

            hover:bg-blue-600
            active:scale-[0.97]

            disabled:bg-gray-300
            disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Fetching...</span>
            </>
          ) : (
            "Fetch Customer"
          )}
        </button>

      </div>
    </div>
  );
}