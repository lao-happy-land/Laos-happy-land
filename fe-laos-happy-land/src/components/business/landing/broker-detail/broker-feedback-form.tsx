"use client";

import { useState } from "react";
import { Form, Input, Button, App } from "antd";
import { Star, Send } from "lucide-react";
import { userFeedbackService } from "@/share/service/user-feedback.service";
import type { CreateUserFeedbackDto } from "@/@types/gentype-axios";
import { useTranslations } from "next-intl";

const { TextArea } = Input;

interface FeedbackInputProps {
  brokerId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function FeedbackInput({
  brokerId,
  onSuccess,
  onError,
}: FeedbackInputProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const t = useTranslations();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { comment?: string }) => {
    if (rating === 0) {
      message.error(t("errors.pleaseSelectRating"));
      return;
    }

    try {
      setLoading(true);

      const feedbackData: CreateUserFeedbackDto = {
        userId: brokerId,
        rating,
        comment: values.comment ?? undefined,
      };

      await userFeedbackService.createFeedback(feedbackData);

      message.success(t("errors.reviewSentSuccessfully"));
      form.resetFields();
      setRating(0);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("errors.errorSubmittingFeedback");
      message.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const getStarClassName = (star: number) => {
    const isActive = star <= (hoveredRating || rating);
    return `h-6 w-6 cursor-pointer transition-colors duration-200 ${
      isActive
        ? "fill-yellow-400 text-yellow-400"
        : "text-gray-300 hover:text-yellow-300"
    }`;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Đánh giá môi giới
      </h3>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Star Rating */}
        <Form.Item label={t("broker.rating")} required>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={getStarClassName(star)}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
              />
            ))}
          </div>
        </Form.Item>

        {/* Comment */}
        <Form.Item
          name="comment"
          label={t("broker.comments")}
          rules={[{ max: 500, message: t("broker.commentTooLong") }]}
        >
          <TextArea
            rows={4}
            placeholder={t("broker.commentsPlaceholder")}
            showCount
            maxLength={500}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<Send className="h-4 w-4" />}
            className="w-full"
            size="large"
          >
            {t("broker.submitRating")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
