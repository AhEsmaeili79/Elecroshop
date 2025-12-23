import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Page for NextCommerce Template",
  // other metadata
};

const ShopWithSidebarPage = async ({
  params,
}: {
  params?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // Unwrap params if provided (for Next.js 15+ compatibility)
  // This prevents the "params are being enumerated" error
  if (params) {
    await params;
  }

  return (
    <main>
      <ShopWithSidebar />
    </main>
  );
};

export default ShopWithSidebarPage;
