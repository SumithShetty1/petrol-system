type Props = {
  icon: React.ReactNode;
  iconBgColor: string;
  label: string;
  value: string;
  noBorder?: boolean;
};

export default function ProfileInfoRow({ icon, iconBgColor, label, value, noBorder = false }: Props) {
  return (
    <div className={`flex items-center gap-3 ${!noBorder ? "pb-3 border-b border-gray-100" : ""}`}>
      <div className={`w-8 h-8 rounded-full ${iconBgColor} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-gray-900 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
