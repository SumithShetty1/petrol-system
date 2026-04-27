type Props = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export default function SectionCard({
  title,
  icon,
  children,
}: Props) {
  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg">
      <div className="flex items-center gap-2 mb-5">
        {icon}

        <h3 className="text-gray-900 text-lg md:text-xl font-semibold">
          {title}
        </h3>
      </div>

      {children}
    </div>
  );
}
