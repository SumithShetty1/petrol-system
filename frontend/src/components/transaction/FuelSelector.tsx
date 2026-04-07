import { Droplet } from "lucide-react";

type Props = {
  fuelType: string;
  setFuelType: (value: string) => void;
};

export default function FuelSelector({ fuelType, setFuelType }: Props) {

  return (
    <div className="space-y-3">

      <label className="text-gray-700 text-sm flex items-center gap-2">
        <Droplet className="w-4 h-4" />
        Fuel Type
      </label>

      <div className="grid grid-cols-2 gap-3">

        <button
          onClick={() => setFuelType("petrol")}
          className={`p-4 rounded-xl border ${
            fuelType === "petrol"
              ? "bg-blue-500 text-white"
              : "border-gray-200"
          }`}
        >
          Petrol
        </button>

        <button
          onClick={() => setFuelType("diesel")}
          className={`p-4 rounded-xl border ${
            fuelType === "diesel"
              ? "bg-blue-500 text-white"
              : "border-gray-200"
          }`}
        >
          Diesel
        </button>

      </div>

    </div>
  );
}
