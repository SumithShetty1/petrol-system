import { Phone } from "lucide-react";

type Props = {
  phone: string;
  onChange: (value: string) => void;
};

export default function PhoneInput({ phone, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
    onChange(clean);
  };

  return (
    <>
      <label className="text-[#616161] text-[16px] block mb-3">
        Phone Number
      </label>
      <div className="flex items-center gap-2 pb-2 border-b-[1.5px] border-blue-500">
        <Phone className="w-[14px] h-[14px] text-[#bdbdbd]" />
        <div className="w-[1px] h-[8px] bg-[#bdbdbd]"></div>
        <input
          type="tel"
          value={phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className="flex-1 outline-none text-[#424242] text-[14px] placeholder:text-[#bdbdbd]"
        />
      </div>
    </>
  );
}
