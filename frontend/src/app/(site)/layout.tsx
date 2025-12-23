"use client";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ThemeProvider } from "../context/ThemeContext";
import { LanguageProvider } from "../context/LanguageContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="transition-colors duration-200">
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <LanguageProvider>
              <ThemeProvider>
                <ReduxProvider>
                  <QueryClientProvider client={queryClient}>
                    <CartModalProvider>
                      <ModalProvider>
                        <PreviewSliderProvider>
                          <Header />
                          {children}

                          <QuickViewModal />
                          <CartSidebarModal />
                          <PreviewSliderModal />
                          <Footer />
                        </PreviewSliderProvider>
                      </ModalProvider>
                    </CartModalProvider>
                  </QueryClientProvider>
                </ReduxProvider>
              </ThemeProvider>
            </LanguageProvider>
            <ScrollToTop />
          </>
        )}
      </body>
    </html>
  );
}
