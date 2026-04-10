type Props = {
  title: string;
};

export default function TransactionHeader({ title }: Props) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-6 md:pt-8 pb-24 md:pb-28 px-6 rounded-b-[3rem] md:rounded-b-[4rem] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-24 h-24 md:w-32 md:h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-8 right-8 w-16 h-16 md:w-24 md:h-24 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-6 left-1/3 w-20 h-20 md:w-28 md:h-28 border-2 border-white rounded-full"></div>
      </div>

      <div className="text-center relative z-10">
        <h1 className="text-white text-lg md:text-2xl font-medium">{title}</h1>
      </div>
    </div>
  );
}
