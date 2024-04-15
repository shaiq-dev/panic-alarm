import { Sidebar } from "@/components/Sidebar";
import { signout } from "../_actions/signout";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className="d-flex h-full">
        <Sidebar onSignout={signout} />
        <main className="d-flex flex-1">{children}</main>
      </div>
    </>
  );
};

export default DashboardLayout;
