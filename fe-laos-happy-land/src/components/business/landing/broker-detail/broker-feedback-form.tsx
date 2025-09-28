"use client";

import { useState } from "react";
import { Form, Input, Button, App } from "antd";
import { Star, Send } from "lucide-react";
import { userFeedbackService } from "@/share/service/user-feedback.service";
import type { CreateUserFeedbackDto } from "@/@types/gentype-axios";

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
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { comment?: string }) => {
    if (rating === 0) {
      message.error("Vui lòng chọn điểm đánh giá!");
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
      
      message.success("Đánh giá đã được gửi thành công!");
      form.resetFields();
      setRating(0);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi đánh giá";
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
        <Form.Item label="Điểm đánh giá" required>
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
          label="Nhận xét (tùy chọn)"
          rules={[
            { max: 500, message: "Nhận xét không được vượt quá 500 ký tự!" }
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Chia sẻ trải nghiệm của bạn về môi giới này..."
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
            Gửi đánh giá
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
