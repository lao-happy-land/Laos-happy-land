"use client";

import { useAuthStore } from "@/share/store/auth.store";
import Header from "./header";
import Footer from "./footer";
import { useEffect, useState } from "react";
import LoadingScreen from "../common/loading-screen";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, initialize } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations();
  const pathname = usePathname();

  const isLoginPage = pathname.includes("/login");
  const isRegisterPage = pathname.includes("/register");

  useEffect(() => {
    const timer = setTimeout(() => {
      initialize();
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [initialize]);

  if (isLoading) {
    return (
      <LoadingScreen
        variant="primary"
        message={t("common.loading")}
        size="lg"
        showProgress
        duration={3}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {!isLoginPage && !isRegisterPage && (
        <Header isAuthenticated={isAuthenticated} />
      )}
      <main className="flex-1">{children}</main>
      {!isLoginPage && !isRegisterPage && <Footer />}
    </div>
  );
};

export default MainLayout;
