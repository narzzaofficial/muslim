"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import darkLogo from "@/public/dark-logo.png";
import logo from "@/public/logo.png";

type BrandLogoProps = {
  sizeClassName?: string;
};

export function BrandLogo({ sizeClassName = "h-12 w-auto" }: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const activeLogo = resolvedTheme === "dark" ? darkLogo : logo;

  return <Image src={activeLogo} alt="Muslim by Narzza" priority className={sizeClassName} />;
}
