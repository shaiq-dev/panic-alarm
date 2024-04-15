import Image from "next/image";
import Logo from "@/assets/logo-full.svg";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-full bg-white items-center">
      <div className="py-12 flex items-center justify-center w-full">
        <Image src={Logo} alt="PanicAlarm logo" height={32} />
      </div>
      {children}
    </div>
  );
}
