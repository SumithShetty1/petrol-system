type Props = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

export default function InfoRow({
  icon,
  label,
  value,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-gray-600">
        {icon}
        <span className="text-sm md:text-base">
          {label}
        </span>
      </div>

      <span className="text-gray-900 text-sm md:text-base font-medium text-right">
        {value}
      </span>
    </div>
  );
}
