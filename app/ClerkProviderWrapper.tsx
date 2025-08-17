"use client";
// filepath: /d:/codes/Nextjs/store_front/app/ClerkProviderWrapper.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}