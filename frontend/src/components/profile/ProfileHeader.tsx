type Props = {
  title: string;
};

export default function ProfileHeader({ title }: Props) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-8 pb-24 md:pb-28 px-6 rounded-b-[2rem] md:rounded-b-[3rem] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-6 right-6 w-24 h-24 md:w-32 md:h-32 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-10 left-8 w-16 h-16 md:w-24 md:h-24 border-2 border-white rounded-full"></div>
        <div className="absolute top-20 left-1/4 w-12 h-12 md:w-16 md:h-16 border-2 border-white rounded-full"></div>
      </div>

      <h1 className="text-white text-center text-lg md:text-2xl font-medium relative z-10">
        {title}
      </h1>
    </div>
  );
}
