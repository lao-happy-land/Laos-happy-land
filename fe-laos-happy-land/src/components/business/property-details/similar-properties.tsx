"use client";

import { useRequest } from "ahooks";
import { Row, Col, Divider, Spin } from "antd";
import { useTranslations } from "next-intl";
import PropertyCard from "@/components/business/common/property-card";
import propertyService from "@/share/service/property.service";
import { useCurrencyStore } from "@/share/store/currency.store";

interface SimilarPropertiesProps {
  propertyId: string;
}

export default function SimilarProperties({
  propertyId,
}: SimilarPropertiesProps) {
  const t = useTranslations();
  const { currency } = useCurrencyStore();

  const { data: similarProperties, loading } = useRequest(
    () =>
      propertyService.getSimilarProperties(propertyId, {
        page: 1,
        perPage: 6,
      }),
    {
      refreshDeps: [currency], // Refetch when currency changes
    },
  );

  const properties = similarProperties?.data ?? [];

  // Don't render if no similar properties
  if (!loading && properties.length === 0) {
    return null;
  }

  return (
    <>
      <Divider />
      <div className="mt-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          {t("property.similarProperties")}
        </h2>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {properties.map((property) => (
              <Col key={property.id} xs={24} sm={12} lg={8}>
                <PropertyCard property={property} size="small" />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
}
