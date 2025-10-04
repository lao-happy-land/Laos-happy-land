import { type Metadata } from "next";

export interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  locale?: string;
}

/**
 * Generate SEO metadata for pages
 * @param options - Metadata options
 * @param locale - Current locale (en, vn, la)
 * @returns Metadata object
 */
export async function generateMetadata(
  options: MetadataOptions = {},
  locale = "la",
): Promise<Metadata> {
  const {
    title,
    description,
    keywords,
    image = "/images/landingpage/hero-slider/hero-banner-1.jpg",
    url,
  } = options;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const fullUrl = url ? `${baseUrl}/${locale}${url}` : `${baseUrl}/${locale}`;

  // Get locale-specific metadata
  const localeMetadata = getLocaleMetadata(locale);

  return {
    title: title ?? localeMetadata.title,
    description: description ?? localeMetadata.description,
    keywords: keywords ?? localeMetadata.keywords,
    authors: [{ name: "Laos Happy Land Team" }],
    creator: "Laos Happy Land",
    publisher: "Laos Happy Land",
    robots: "index, follow",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
      languages: {
        en: `${baseUrl}/en${url ?? ""}`,
        vi: `${baseUrl}/vn${url ?? ""}`,
        la: `${baseUrl}/la${url ?? ""}`,
      },
    },
    openGraph: {
      type: "website",
      locale: localeMetadata.openGraphLocale,
      url: fullUrl,
      siteName: localeMetadata.siteName,
      title: title ?? localeMetadata.title,
      description: description ?? localeMetadata.description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: localeMetadata.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? localeMetadata.title,
      description: description ?? localeMetadata.description,
      images: [image],
      creator: "@laoshappyland",
    },
    icons: [{ rel: "icon", url: "/logo.ico" }],
    manifest: "/manifest.json",
  };
}

/**
 * Get locale-specific metadata
 */
function getLocaleMetadata(locale: string) {
  const metadata = {
    en: {
      title: "Laos Happy Land - Real Estate in Laos",
      description:
        "Laos real estate website - Find houses, apartments, and real estate projects in Laos",
      keywords:
        "Laos real estate, houses Laos, apartments Laos, projects Laos, investment Laos, Laohappyland.com, Laohappyland",
      siteName: "Laos Happy Land",
      openGraphLocale: "en_US",
    },
    vn: {
      title: "Laos Happy Land - Bất động sản Lào",
      description:
        "Website bất động sản Lào - Tìm nhà đất, căn hộ, dự án bất động sản tại Lào",
      keywords:
        "bất động sản Lào, nhà đất Lào, căn hộ Lào, dự án Lào, đầu tư Lào, Laos real estate, Laohappyland.com, Laohappyland",
      siteName: "Laos Happy Land",
      openGraphLocale: "vi_VN",
    },
    la: {
      title: "Laohappyland - ອະສັງຫາລິມະສັບລາວ",
      description:
        "ເວັບໄຊທ໌ອະສັງຫາລິມະສັບລາວ - ຊອກຫາບ້ານ, ອາພາດເມັນ, ແລະໂຄງການອະສັງຫາລິມະສັບໃນລາວ",
      keywords:
        "ອະສັງຫາລິມະສັບລາວ, ບ້ານລາວ, ອາພາດເມັນລາວ, ໂຄງການລາວ, ການລົງທຶນລາວ, Laos real estate, Laohappyland.com, Laohappyland",
      siteName: "Laohappyland",
      openGraphLocale: "lo_LA",
    },
  };

  return metadata[locale as keyof typeof metadata] || metadata.la;
}

/**
 * Generate metadata for property details
 */
export async function generatePropertyMetadata(
  property: {
    title: string;
    description?: string;
    location?: string;
    price?: number;
    images?: string[];
  },
  locale = "la",
): Promise<Metadata> {
  const localeMetadata = getLocaleMetadata(locale);

  const title = `${property.title} - ${localeMetadata.siteName}`;
  const description = property.description
    ? `${property.description.substring(0, 150)}...`
    : `${localeMetadata.description} - ${property.title}${property.location ? ` tại ${property.location}` : ""}`;

  const image =
    property.images && property.images.length > 0
      ? property.images[0]
      : "/images/landingpage/hero-slider/hero-banner-1.jpg";

  return generateMetadata(
    {
      title,
      description,
      keywords: `${localeMetadata.keywords}, ${property.title}, ${property.location ?? ""}`,
      image,
    },
    locale,
  );
}

/**
 * Generate metadata for news details
 */
export async function generateNewsMetadata(
  news: {
    title: string;
    description?: string;
    type?: string;
    images?: string[];
  },
  locale = "la",
): Promise<Metadata> {
  const localeMetadata = getLocaleMetadata(locale);

  const title = `${news.title} - ${localeMetadata.siteName}`;
  const description = news.description
    ? `${news.description.substring(0, 150)}...`
    : `${localeMetadata.description} - ${news.title}`;

  const image =
    news.images && news.images.length > 0
      ? news.images[0]
      : "/images/landingpage/hero-slider/hero-banner-1.jpg";

  return generateMetadata(
    {
      title,
      description,
      keywords: `${localeMetadata.keywords}, ${news.title}, ${news.type ?? ""}`,
      image,
    },
    locale,
  );
}

/**
 * Generate metadata for broker profiles
 */
export async function generateBrokerMetadata(
  broker: {
    fullName: string;
    specialties?: string[];
    location?: string;
  },
  locale = "la",
): Promise<Metadata> {
  const localeMetadata = getLocaleMetadata(locale);

  const title = `${broker.fullName} - Môi giới bất động sản - ${localeMetadata.siteName}`;
  const description = `Môi giới bất động sản chuyên nghiệp ${broker.fullName}${broker.specialties ? ` chuyên về ${broker.specialties.join(", ")}` : ""}${broker.location ? ` tại ${broker.location}` : ""}`;

  return generateMetadata(
    {
      title,
      description,
      keywords: `${localeMetadata.keywords}, ${broker.fullName}, môi giới bất động sản, broker`,
      image: "/images/landingpage/hero-slider/hero-banner-1.jpg",
    },
    locale,
  );
}
