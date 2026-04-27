import { Fuel } from "lucide-react";

import SectionCard from "./SectionCard";

type Props = {
  pump: any;
};

export default function FuelRatesCard({
  pump,
}: Props) {
  return (
    <SectionCard
      title="Fuel Rates"
      icon={
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-50 flex items-center justify-center">
          <Fuel className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-2xl p-4">
          <p className="text-xs text-gray-600 mb-1">
            Petrol
          </p>

          <p className="text-blue-700 text-xl md:text-2xl font-semibold">
            ₹
            {pump.petrol_price}
            <span className="text-sm font-medium">
              /L
            </span>
          </p>
        </div>

        <div className="bg-orange-50 rounded-2xl p-4">
          <p className="text-xs text-gray-600 mb-1">
            Diesel
          </p>

          <p className="text-orange-700 text-xl md:text-2xl font-semibold">
            ₹
            {pump.diesel_price}
            <span className="text-sm font-medium">
              /L
            </span>
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
