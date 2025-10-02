"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useUrlLocale } from "@/utils/locale";
import { useRequest } from "ahooks";
import { settingService } from "@/share/service/setting.service";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const t = useTranslations();
  const locale = useUrlLocale();

  // Fetch settings for Facebook link and hotline
  const { data: settings } = useRequest(
    async () => {
      try {
        const response = await settingService.getSetting();
        return response;
      } catch (error) {
        console.error("Error fetching settings:", error);
        return null;
      }
    },
    {
      onError: () => {
        // Silently fail
      },
    },
  );

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-6 md:col-span-1">
            <Link
              href={`/${locale}`}
              className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
            >
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-xl ring-2 ring-blue-400/20 transition-all duration-300 group-hover:ring-blue-400/40">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                <Image
                  src="/images/logo.png"
                  alt="Laohappyland Logo"
                  width={48}
                  height={48}
                  className="relative h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-2xl font-bold text-transparent">
                  {t("footer.companyName")}
                </div>
                <div className="-mt-1 text-sm font-medium text-blue-300">
                  {t("footer.companyTagline")}
                </div>
              </div>
            </Link>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-sm leading-relaxed text-gray-300">
                {t("footer.companyDescription")}
              </p>
            </div>

            {settings?.facebook && (
              <div className="flex space-x-4">
                <button
                  onClick={() => window.open(settings.facebook, "_blank")}
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-white transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 hover:shadow-2xl hover:shadow-blue-500/25"
                  aria-label="Facebook"
                >
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="font-semibold">{t("footer.followUs")}</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-6 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-xl font-bold text-transparent">
                {t("footer.quickLinks")}
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href={`/${locale}/properties-for-sale`}
                    className="group flex items-center text-gray-300 transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.propertiesForSale")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/properties-for-rent`}
                    className="group flex items-center text-gray-300 transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.propertiesForRent")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/project`}
                    className="group flex items-center text-gray-300 transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.realEstateProjects")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/news`}
                    className="group flex items-center text-gray-300 transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.marketNews")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/create-property`}
                    className="group flex items-center text-gray-300 transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.postPropertyFree")}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h4 className="mb-6 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-lg font-bold text-transparent">
                {t("footer.customerSupport")}
              </h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <Link
                    href={`/${locale}/news`}
                    className="group flex items-center transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.newsAndGuides")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/loan-calculator`}
                    className="group flex items-center transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.loanCalculator")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/brokers`}
                    className="group flex items-center transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.findBrokers")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/create-property`}
                    className="group flex items-center transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.postProperty")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-6 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-xl font-bold text-transparent">
                {t("footer.services")}
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href={`/${locale}/brokers`}
                    className="group flex items-center text-gray-300 transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.findBrokers")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/loan-calculator`}
                    className="group flex items-center text-gray-300 transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.loanCalculator")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/properties-for-project`}
                    className="group flex items-center text-gray-300 transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.projectProperties")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/dashboard`}
                    className="group flex items-center text-gray-300 transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.dashboard")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/profile`}
                    className="group flex items-center text-gray-300 transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.profile")}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h4 className="mb-6 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-lg font-bold text-transparent">
                {t("footer.aboutUs")}
              </h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <Link
                    href={`/${locale}`}
                    className="group flex items-center transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.homePage")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/project`}
                    className="group flex items-center transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.realEstateProjects")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/dashboard`}
                    className="group flex items-center transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.userDashboard")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/profile`}
                    className="group flex items-center transition-all duration-300 hover:translate-x-2 hover:text-blue-400"
                  >
                    <div className="mr-3 h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                    {t("footer.userProfile")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-6 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-xl font-bold text-transparent">
                {t("footer.contactInfo")}
              </h3>
              <div className="space-y-6 text-gray-300">
                <div className="group flex items-start space-x-4 rounded-xl bg-white/5 p-4 transition-all duration-300 hover:bg-white/10">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 ring-1 ring-blue-400/30 backdrop-blur-sm transition-all duration-300 group-hover:ring-blue-400/50">
                    <MapPin className="h-6 w-6 text-blue-400 transition-colors duration-300 group-hover:text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-semibold text-blue-300">
                      {t("footer.addressLabel")}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-300">
                      {t("footer.address")}
                    </p>
                  </div>
                </div>

                {settings?.hotline && (
                  <div className="group flex items-start space-x-4 rounded-xl bg-white/5 p-4 transition-all duration-300 hover:bg-white/10">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 ring-1 ring-green-400/30 backdrop-blur-sm transition-all duration-300 group-hover:ring-green-400/50">
                      <Phone className="h-6 w-6 text-green-400 transition-colors duration-300 group-hover:text-green-300" />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 text-sm font-semibold text-green-300">
                        {t("footer.hotlineLabel")}
                      </p>
                      <a
                        href={`tel:${settings.hotline}`}
                        className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-lg font-bold text-transparent transition-all duration-300 hover:from-green-300 hover:to-emerald-300"
                      >
                        {settings.hotline}
                      </a>
                      <p className="mt-1 text-xs text-gray-400">
                        {t("footer.support24_7")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="group flex items-start space-x-4 rounded-xl bg-white/5 p-4 transition-all duration-300 hover:bg-white/10">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 ring-1 ring-purple-400/30 backdrop-blur-sm transition-all duration-300 group-hover:ring-purple-400/50">
                    <Mail className="h-6 w-6 text-purple-400 transition-colors duration-300 group-hover:text-purple-300" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-semibold text-purple-300">
                      {t("footer.emailLabel")}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-300">
                      {t("footer.email")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Links */}
        <div className="mt-12 border-t border-gray-700/30"></div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/30 pt-8">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <div className="text-center md:text-left">
              <p className="mb-2 text-sm text-gray-400">
                {t("footer.copyright")}
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm md:justify-start">
                <Link
                  href={`/${locale}/terms`}
                  className="text-gray-400 transition-all duration-300 hover:scale-105 hover:text-blue-400 hover:underline"
                >
                  {t("footer.termsOfService")}
                </Link>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-gray-400 transition-all duration-300 hover:scale-105 hover:text-blue-400 hover:underline"
                >
                  {t("footer.privacyPolicy")}
                </Link>
                <Link
                  href={`/${locale}/news`}
                  className="text-gray-400 transition-all duration-300 hover:scale-105 hover:text-blue-400 hover:underline"
                >
                  {t("footer.news")}
                </Link>
              </div>
            </div>

            {/* Made with love badge */}
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Made with</span>
              <div className="flex h-4 w-4 items-center justify-center">
                <svg
                  className="h-4 w-4 animate-pulse text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>for Laos</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
