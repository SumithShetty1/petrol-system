import { Droplet, Edit2 } from "lucide-react";
import FuelPriceRow from "./FuelPriceRow";

type Props = {
  fuelRates: any;
  isEditing: boolean;
  tempPrices: { petrol: number; diesel: number };
  isSaving: boolean;
  onEdit: () => void;
  onPriceChange: (type: "petrol" | "diesel", value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function FuelPriceSettings({
  fuelRates,
  isEditing,
  tempPrices,
  isSaving,
  onEdit,
  onPriceChange,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="mt-6 bg-white rounded-2xl p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900 font-semibold flex items-center gap-2">
          <Droplet className="w-5 h-5 text-blue-500" />
          Fuel Price Settings
        </h3>
        {!isEditing && (
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <FuelPriceRow
          type="petrol"
          label="Petrol Price"
          iconColor="text-blue-500"
          price={parseFloat(fuelRates.petrol?.price_per_litre || 0)}
          isEditing={isEditing}
          tempValue={tempPrices.petrol}
          onPriceChange={onPriceChange}
        />

        <FuelPriceRow
          type="diesel"
          label="Diesel Price"
          iconColor="text-orange-500"
          price={parseFloat(fuelRates.diesel?.price_per_litre || 0)}
          isEditing={isEditing}
          tempValue={tempPrices.diesel}
          onPriceChange={onPriceChange}
          noBorder
        />
      </div>

      {/* Edit Mode Actions */}
      {isEditing && (
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
