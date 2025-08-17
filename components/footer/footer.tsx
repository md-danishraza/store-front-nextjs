"use client";
// filepath: /d:/codes/Nextjs/store_front/components/footer/footer.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import lightLogo from "@/public/logo/sfLight.png";
import darkLogo from "@/public/logo/sfDark.png";
import { Skeleton } from "../ui/skeleton";

function Footer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevents theme flashing during hydration
  if (!mounted) return <Skeleton className="h-8 w-8"/>;

  const logoSrc = resolvedTheme === "dark" ? lightLogo:darkLogo;

  return (
    <footer className="mt-auto w-full px-4 py-8">
      <div className="mx-auto max-w-6xl xl:max-w-7xl flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
        {/* Left Section */}
        <div className="w-full md:w-3/4 text-center md:text-left flex flex-col items-center md:items-start gap-2">
          <Image
            src={logoSrc}
            width={100}
            height={100}
            alt="logo"
            className="w-16 h-auto sm:w-20 transition-all duration-300 ease-in-out"
            priority
          />
          <h3 className="text-sm text-muted-foreground">
            Developed by Danish – &copy;2025
          </h3>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/4 flex flex-col sm:flex-row justify-center md:justify-end items-center gap-2 sm:gap-4">
          <Link
            href="/privacy"
            className="hover:text-primary text-xs text-muted-foreground font-secondary"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="hover:text-primary text-xs text-muted-foreground font-secondary"
          >
            Terms and Condition
          </Link>
          <Link
            href="/about"
            className="hover:text-primary text-xs text-muted-foreground font-secondary"
          >
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;