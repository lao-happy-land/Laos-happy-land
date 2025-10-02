"use client";

import { useRef, useState } from "react";
import { Card, Carousel, Button, Tooltip } from "antd";
import { useTranslations } from "next-intl";
import type { CarouselRef } from "antd/es/carousel";
import Image from "next/image";
import { Share2 } from "lucide-react";

type Props = {
  images: string[];
  title: string;
  onShare: () => void;
};

export default function Gallery({ images, title, onShare }: Props) {
  const t = useTranslations();
  const carouselRef = useRef<CarouselRef>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = (idx: number) => {
    setCurrentIndex(idx);
    carouselRef.current?.goTo(idx);
  };

  return (
    <Card
      className="mb-6 overflow-hidden shadow-lg lg:mb-8"
      styles={{ body: { padding: 0 } }}
    >
      <div className="relative">
        <Carousel
          ref={carouselRef}
          autoplay
          dots={{ className: "custom-dots" }}
          effect="fade"
          infinite
          autoplaySpeed={5000}
          slidesToShow={1}
          slidesToScroll={1}
          className="property-gallery"
          beforeChange={(_from, to) => setCurrentIndex(to)}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-[40vh] w-full md:h-[60vh] lg:h-[70vh]"
            >
              <Image
                src={image}
                alt={`${title} - ${t("property.image")} ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 100vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </Carousel>

        {images.length > 0 && (
          <div className="absolute right-3 bottom-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Tooltip title={t("property.share")}>
            <Button
              type="primary"
              shape="circle"
              icon={<Share2 size={16} />}
              onClick={onShare}
              className="bg-white shadow-lg transition-all duration-200 hover:bg-gray-50"
            />
          </Tooltip>
        </div>
      </div>

      {images.length > 1 && (
        <div className="border-t border-gray-100 bg-white p-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative h-16 w-16 cursor-pointer overflow-hidden rounded-lg md:h-20 md:w-20 lg:h-24 lg:w-24 ${
                  index === currentIndex
                    ? "border-2 border-blue-500"
                    : "border-2 border-gray-200 hover:border-blue-500"
                }`}
                onClick={() => goTo(index)}
              >
                <Image
                  src={image}
                  alt={`${t("property.thumbnail")} ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 64px, (max-width: 1280px) 80px, 96px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {images.length === 0 && (
        <div className="border-t border-gray-100 bg-white p-8">
          {t("property.noImages")}
        </div>
      )}
    </Card>
  );
}
