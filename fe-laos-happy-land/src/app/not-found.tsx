"use client";

import Link from "next/link";
import { Button } from "antd";
import { Home, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useUrlLocale } from "@/utils/locale";

export default function GlobalNotFound() {
  const locale = useUrlLocale();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative mx-auto mb-6 h-64 w-64">
            <Image
              src="/images/404-illustration.svg"
              alt="404 Not Found"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-8xl font-bold text-transparent">
            404
          </h1>
          <h2 className="mb-4 text-3xl font-semibold text-gray-800">
            Page Not Found
          </h2>
          <p className="mx-auto mb-8 max-w-md text-lg text-gray-600">
            Sorry, the page you are looking for does not exist or has been
            moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href={`/${locale}`}>
            <Button
              type="primary"
              size="large"
              icon={<Home className="h-4 w-4" />}
              className="flex h-12 items-center gap-2 px-6 py-3 text-base font-medium"
            >
              Go to Homepage
            </Button>
          </Link>

          <Button
            size="large"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => window.history.back()}
            className="flex h-12 items-center gap-2 px-6 py-3 text-base font-medium"
          >
            Go Back
          </Button>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you believe this is an error, please{" "}
            <Link
              href={`/${locale}/contact`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
