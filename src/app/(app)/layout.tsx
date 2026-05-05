import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="wrapper">
      <Sidebar />
      {children}
      <BottomNav />
    </div>
  );
}
