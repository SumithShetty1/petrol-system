import { Phone } from "lucide-react";

type Props = {
  phone: string;
  setPhone: (v: string) => void;
  onFetch: () => void;
};

export default function CustomerLookup({
  phone,
  setPhone,
  onFetch,
}: Props) {

  const handleChange = (value: string) => {
    const clean = value.replace(/\D/g, "").slice(0, 10);
    setPhone(clean);
  };

  return (
    <div className="space-y-2">

      <label className="text-gray-700 text-sm">
        Phone Number
      </label>

      <div className="flex gap-3 items-center">

        <div className="flex-1 flex items-center gap-2 border-b-2 pb-2">

          <Phone className="w-4 h-4 text-gray-400" />

          <input
            value={phone}
            onChange={(e)=>handleChange(e.target.value)}
            placeholder="Enter phone number"
            className="flex-1 outline-none text-sm"
          />

        </div>

        <button
          onClick={onFetch}
          className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg"
        >
          Fetch
        </button>

      </div>

    </div>
  );
}
