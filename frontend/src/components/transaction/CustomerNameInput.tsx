import { User } from "lucide-react";

type Props = {
  customerName: string;
  onNameChange: (value: string) => void;
};

export default function CustomerNameInput({ customerName, onNameChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-gray-700 text-sm md:text-base font-medium">
        Customer Name <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        <input
          type="text"
          value={customerName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter customer name"
          className="w-full pl-6 md:pl-7 pr-2 py-3 md:py-4 border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors text-gray-800 placeholder:text-gray-400 text-sm md:text-base"
        />
      </div>
    </div>
  );
}
