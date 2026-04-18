type Props = {
  title: string;
};

export default function FormTitle({ title }: Props) {
  return (
    <div className="mb-8">
      <h1 className="text-[#424242] text-[38px] leading-[1.1] font-semibold">
        {title}
      </h1>
      <div className="h-[3px] w-[74px] bg-blue-500 rounded-full mt-3"></div>
    </div>
  );
}
