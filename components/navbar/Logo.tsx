"use client";
// filepath: /d:/codes/Nextjs/store_front/components/navbar/Logo.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import lightLogo from "@/public/logo/sfLight.png";
import darkLogo from "@/public/logo/sfDark.png";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
function Logo() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if(!mounted) return <Skeleton className="h-8 w-8"/>

  const logoSrc = theme === "dark" ? lightLogo:darkLogo;

  return (
   
      <Link href="/" className="order-1">
        <Image src={logoSrc} width={100} height={100} alt="logo" priority className="w-12 h-auto"/>
      </Link>
    
  );
}

export default Logo;