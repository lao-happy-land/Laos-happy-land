"use client";

import Image from "next/image";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

type Heading = {
  type: "heading";
  text?: string;
  value?: string;
  level?: 1 | 2 | 3;
};
type ParagraphBlock = { type: "paragraph"; text?: string; value?: string };
type ImageBlock = { type: "image"; url: string; caption?: string };
type Content = Heading | ParagraphBlock | ImageBlock;

type Props = {
  content?: Content[] | null;
  fallbackDescription?: string | null;
};

export default function ProjectContent({
  content,
  fallbackDescription,
}: Props) {
  return (
    <div className="mb-8">
      <Title level={3} className="mb-4 text-xl font-semibold">
        {content && content.length > 0 ? "Nội dung dự án" : "Mô tả chi tiết"}
      </Title>
      <div className="space-y-4">
        {content && content.length > 0 ? (
          content.map((block, index) => {
            if (block.type === "heading") {
              const level = block.level ?? 2;
              const Tag = level === 1 ? "h2" : level === 3 ? "h4" : "h3";
              const headingText = block.value ?? block.text ?? "";
              return (
                <Tag key={index} className="font-semibold text-gray-900">
                  {headingText}
                </Tag>
              );
            }
            if (block.type === "paragraph") {
              const paragraphText = block.value ?? block.text ?? "";
              return (
                <Paragraph
                  key={index}
                  className="mb-0 leading-relaxed text-gray-700"
                >
                  {paragraphText}
                </Paragraph>
              );
            }
            if (block.type === "image") {
              return (
                <div key={index} className="space-y-2">
                  <div className="relative h-[240px] w-full md:h-[360px]">
                    <Image
                      src={block.url}
                      alt={block.caption ?? `Hình ảnh ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 100vw"
                      className="object-contain"
                    />
                  </div>
                  {block.caption && (
                    <div className="text-center text-sm text-gray-500">
                      {block.caption}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })
        ) : (
          <div className="rounded-lg bg-gray-50 p-6">
            <Paragraph className="mb-0 leading-relaxed text-gray-700">
              {fallbackDescription ?? "Chưa có mô tả chi tiết."}
            </Paragraph>
          </div>
        )}
      </div>
    </div>
  );
}
