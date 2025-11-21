import { cn } from "@/lib/utils";
import Image from "next/image";

export const Navbar = () => {
  return (
    <nav className="h-20 w-full flex items-center justify-between px-8 dark:bg-gray-800 bg-accent text-white fixed top-0">
      <Image src="/logo_dark.svg" alt="Logo" className="dark:block hidden" width={140} height={140} />
      <Image src="/logo_white.svg" alt="Logo" className="dark:hidden block" width={140} height={140} />
    </nav>
  );
};
