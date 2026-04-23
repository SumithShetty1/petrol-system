import BottomNav from "../components/navigation/BottomNav";

type Props = {
  children: React.ReactNode;
  navItems: any[];
  paddingBottom?: string;
};

export default function AppLayout({
  children,
  navItems,
  paddingBottom = "pb-20",
}: Props) {
  return (
    <div className={`min-h-screen bg-gray-50 ${paddingBottom}`}>
      {children}
      <BottomNav items={navItems} />
    </div>
  );
}
