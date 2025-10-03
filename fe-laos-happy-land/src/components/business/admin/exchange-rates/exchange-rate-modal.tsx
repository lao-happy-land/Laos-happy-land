"use client";

import { useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  App,
  Typography,
  Button,
  InputNumber,
  Row,
  Col,
} from "antd";
import { useTranslations } from "next-intl";
import { useRequest } from "ahooks";
import exchangeRateService, {
  type ExchangeRate,
} from "@/share/service/exchange-rate.service";
import type {
  CreateExchangeRateDto,
  UpdateExchangeRateDto,
} from "@/@types/gentype-axios";

const { Title, Text } = Typography;

interface ExchangeRateModalProps {
  visible: boolean;
  mode: "create" | "edit";
  exchangeRate?: ExchangeRate | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "LAK", label: "LAK - Lao Kip" },
  { value: "VND", label: "VND - Vietnamese Dong" },
];

export default function ExchangeRateModal({
  visible,
  mode,
  exchangeRate,
  onCancel,
  onSuccess,
}: ExchangeRateModalProps) {
  const t = useTranslations();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  // Create exchange rate
  const { loading: createLoading, run: createExchangeRate } = useRequest(
    async (data: CreateExchangeRateDto) => {
      return await exchangeRateService.createExchangeRate(data);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success(t("admin.exchangeRateCreatedSuccessfully"));
        onSuccess();
        form.resetFields();
      },
      onError: () => {
        message.error(t("admin.cannotCreateExchangeRate"));
      },
    },
  );

  // Update exchange rate
  const { loading: updateLoading, run: updateExchangeRate } = useRequest(
    async (id: string, data: UpdateExchangeRateDto) => {
      return await exchangeRateService.updateExchangeRate(id, data);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success(t("admin.exchangeRateUpdatedSuccessfully"));
        onSuccess();
      },
      onError: () => {
        message.error(t("admin.cannotUpdateExchangeRate"));
      },
    },
  );

  const loading = createLoading || updateLoading;

  // Initialize form when exchange rate changes
  useEffect(() => {
    if (visible) {
      if (mode === "edit" && exchangeRate) {
        form.setFieldsValue({
          currency: exchangeRate.currency,
          rate: exchangeRate.rate,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, mode, exchangeRate, form]);

  const handleSubmit = async (values: CreateExchangeRateDto) => {
    if (mode === "create") {
      createExchangeRate(values);
    } else if (mode === "edit" && exchangeRate) {
      updateExchangeRate(exchangeRate.id, { rate: values.rate });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <Title level={4} className="!mb-0">
          {mode === "create"
            ? t("admin.createExchangeRate")
            : t("admin.editExchangeRate")}
        </Title>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-6"
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="currency"
              label={t("admin.currency")}
              rules={[
                { required: true, message: t("admin.pleaseSelectCurrency") },
              ]}
            >
              <Select
                placeholder={t("admin.selectCurrency")}
                disabled={mode === "edit"} // Currency cannot be changed in edit mode
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={CURRENCY_OPTIONS}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="rate"
              label={t("admin.exchangeRate")}
              rules={[
                { required: true, message: t("admin.pleaseEnterExchangeRate") },
                {
                  type: "number",
                  min: 0.000001,
                  message: t("admin.exchangeRateMustBePositive"),
                },
              ]}
            >
              <InputNumber
                placeholder={t("admin.enterExchangeRate")}
                step={0.000001}
                min={0.000001}
                precision={6}
                addonAfter="/1 USD $"
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        {mode === "edit" && exchangeRate && (
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <div className="mb-4 rounded-lg bg-gray-50 p-4">
                <Text className="text-sm text-gray-600">
                  <strong>{t("admin.createdAt")}:</strong>{" "}
                  {new Date(exchangeRate.createdAt).toLocaleString()}
                </Text>
                <br />
                <Text className="text-sm text-gray-600">
                  <strong>{t("admin.lastUpdated")}:</strong>{" "}
                  {new Date(exchangeRate.updatedAt).toLocaleString()}
                </Text>
              </div>
            </Col>
          </Row>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Button onClick={handleCancel} size="large">
            {t("admin.cancel")}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="bg-blue-500 hover:bg-blue-600"
          >
            {mode === "create" ? t("admin.create") : t("admin.update")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
