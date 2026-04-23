type Props = {
  label: string;
  value: string;
  bgColor?: string;
  valueColor?: string;
  bold?: boolean;
};

export default function SuccessDetailRow({
  label,
  value,
  bgColor = "bg-gray-50",
  valueColor = "text-gray-900",
  bold = false,
}: Props) {
  return (
    <div className={`flex justify-between items-center py-3 px-4 ${bgColor} rounded-xl`}>
      <span className="text-gray-600 text-sm md:text-base">{label}</span>
      <span className={`${valueColor} ${bold ? "font-bold text-base md:text-lg" : "font-medium text-sm md:text-base"}`}>
        {value}
      </span>
    </div>
  );
}
