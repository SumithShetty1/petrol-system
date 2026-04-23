import { User, Star } from "lucide-react";

type Props = {
  customerName: string;
  customerPoints: number;
  isExisting: boolean;
};

export default function CustomerInfoCard({ customerName, customerPoints, isExisting }: Props) {
  return (
    <div className="bg-blue-50 rounded-2xl p-4 md:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
          </div>
          <span className="text-gray-700 text-sm md:text-base">
            {isExisting ? customerName : "New customer – please enter name"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <Star className="w-4 h-4 md:w-5 md:h-5 text-orange-500 fill-orange-500" />
        </div>
        <span className="text-gray-700 text-sm md:text-base">
          Credit Points: <span className="font-semibold">{customerPoints}</span> points
        </span>
      </div>
    </div>
  );
}
