import { signout } from "@/app/_actions/signout";
import { Sidebar } from "@/components/Sidebar";
import { getUserGuarded } from "@/lib/auth";

const DashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getUserGuarded();

  return (
    <>
      <div className="flex h-full">
        <Sidebar onSignout={signout} userName={user.name} userEmail={user.email} />
        <main className="flex flex-1 max-h-screen">{children}</main>
      </div>
    </>
  );
};

export default DashboardLayout;
