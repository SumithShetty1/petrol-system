import { Droplet } from "lucide-react";

type Props = {
  fuelType: string;
  onFuelTypeChange: (value: string) => void;
  fuelRates: Record<string, string>;
};

export default function FuelTypeSelector({ fuelType, onFuelTypeChange, fuelRates }: Props) {
  return (
    <div className="space-y-3">
      <label className="text-gray-700 text-sm md:text-base font-medium flex items-center gap-2">
        <Droplet className="w-4 h-4 md:w-5 md:h-5" />
        Fuel Type
      </label>
      <div className="grid grid-cols-2 gap-3">
        <FuelButton
          type="petrol"
          selected={fuelType === "petrol"}
          price={fuelRates["petrol"]}
          onClick={() => onFuelTypeChange("petrol")}
        />
        <FuelButton
          type="diesel"
          selected={fuelType === "diesel"}
          price={fuelRates["diesel"]}
          onClick={() => onFuelTypeChange("diesel")}
        />
      </div>
    </div>
  );
}

type FuelButtonProps = {
  type: string;
  selected: boolean;
  price: string;
  onClick: () => void;
};

function FuelButton({ type, selected, price, onClick }: FuelButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 md:p-5 rounded-2xl border-2 transition-all ${
        selected
          ? "bg-blue-500 border-blue-500 text-white shadow-lg"
          : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
      }`}
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        <Droplet className="w-4 h-4 md:w-5 md:h-5" />
        <span className="text-sm md:text-base font-medium capitalize">{type}</span>
      </div>
      <div className="text-xs md:text-sm opacity-90">₹{price || "—"}/L</div>
    </button>
  );
}
