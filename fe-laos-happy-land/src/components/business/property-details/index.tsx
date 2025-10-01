"use client";

import { Row, Col, Card, Divider, Spin } from "antd";
import type { Content, PropertyPrice } from "@/@types/types";
import HeaderBar from "@/components/business/property-details/header-bar";
import Gallery from "@/components/business/property-details/gallery";
import PriceInfo from "@/components/business/property-details/price-info";
import Features from "@/components/business/property-details/features";
import Amenities from "@/components/business/property-details/amenities";
import ProjectContent from "@/components/business/property-details/project-content";
import DetailsSection from "@/components/business/property-details/details-section";
import ContactCard from "@/components/business/property-details/contact-card";
import LoanCalculator from "@/components/business/loan-calculator/loan-calculator";
import SimilarProperties from "@/components/business/property-details/similar-properties";
import BankUsers from "@/components/business/property-details/bank-users";
import { useRequest } from "ahooks";
import propertyService from "@/share/service/property.service";

type Props = {
  propertyId: string;
};

type Details = {
  area: number;
  bedrooms: number;
  bathrooms: number;
  // amenities
  wifi?: boolean;
  tv?: boolean;
  airConditioner?: boolean;
  parking?: boolean;
  kitchen?: boolean;
  security?: boolean;
  content?: Content[];
};
type TransactionEnum = "sale" | "rent" | "project";

export default function PropertyDetails({ propertyId }: Props) {
  const { data: property, loading } = useRequest(() =>
    propertyService.getPropertyById(propertyId),
  );

  const allImages = [property?.mainImage, ...(property?.images ?? [])].filter(
    (img): img is string => {
      if (!img || typeof img !== "string") return false;
      try {
        new URL(img);
        return true;
      } catch {
        return img.startsWith("/");
      }
    },
  );

  const handleShare = () => {
    if (navigator.share) {
      void navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      });
    } else {
      void navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleContactOwner = () => {
    if (property?.owner?.phone) {
      window.open(`tel:${property.owner.phone}`, "_self");
    }
  };
  const handleEmailOwner = () => {
    if (property?.owner?.email) {
      window.open(`mailto:${property.owner.email}`, "_self");
    }
  };

  if (loading || !property) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className="container mx-auto my-4 px-4">
      <HeaderBar
        title={property.title ?? ""}
        location={property.location?.address ?? ""}
        status={property.status ?? "pending"}
        transactionType={property.transactionType as TransactionEnum}
        coordinates={
          property.location
            ? {
                latitude: property.location.latitude,
                longitude: property.location.longitude,
              }
            : null
        }
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {property.transactionType !== "project" && (
            <Gallery
              images={
                allImages.length > 0
                  ? allImages
                  : ["/images/landingpage/apartment/apart-1.jpg"]
              }
              title={property.title}
              onShare={handleShare}
            />
          )}

          <Card
            style={{
              marginTop: property.transactionType === "project" ? 0 : 10,
            }}
          >
            <div className="mb-6">
              <PriceInfo
                price={property.price as PropertyPrice | null}
                transactionType={property.transactionType as TransactionEnum}
                createdAt={property.createdAt}
              />

              <Features
                details={property.details as Details | null | undefined}
                typeName={property.type?.name}
              />

              <Amenities
                {...((property.details as Details | null | undefined) ?? {})}
              />
            </div>

            <Divider />

            <ProjectContent
              content={
                Array.isArray(property.details?.content)
                  ? (property.details?.content as Content[] | null | undefined)
                  : ([] as Content[] | null | undefined)
              }
              fallbackDescription={property.description as string | undefined}
              transactionType={property.transactionType as TransactionEnum}
            />

            <Divider />

            <DetailsSection
              typeName={property.type?.name}
              legalStatus={property.legalStatus as string | undefined}
              createdAt={property?.createdAt}
              updatedAt={property.updatedAt}
            />

            <Divider />

            <LoanCalculator />
          </Card>
        </Col>

        <Col xs={24} lg={8} style={{ padding: 0 }}>
          <ContactCard
            owner={property.owner}
            onShare={handleShare}
            onCall={handleContactOwner}
            onEmail={handleEmailOwner}
          />
        </Col>
      </Row>

      {/* Similar Properties Section */}
      <SimilarProperties propertyId={propertyId} />
    </div>
  );
}
