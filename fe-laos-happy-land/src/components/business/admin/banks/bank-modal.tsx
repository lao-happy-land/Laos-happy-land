"use client";

import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Typography,
  Row,
  Col,
  Card,
  InputNumber,
} from "antd";
import { useRequest } from "ahooks";
import bankService from "@/share/service/bank.service";
import type { Bank } from "@/share/service/bank.service";
import type { CreateBankDto, UpdateBankDto } from "@/@types/gentype-axios";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";

const { Title } = Typography;

interface BankModalProps {
  visible: boolean;
  mode: "create" | "edit";
  bank: Bank | null;
  onClose: () => void;
  onSuccess: () => void;
}

const BankModal: React.FC<BankModalProps> = ({
  visible,
  mode,
  bank,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const t = useTranslations();

  // Create bank
  const { run: createBank, loading: createLoading } = useRequest(
    bankService.createBank,
    {
      manual: true,
      onSuccess: () => {
        message.success(t("admin.createBankSuccess"));
        onSuccess();
      },
      onError: (error: unknown) => {
        message.error(t("admin.createBankFailed"));
        console.error("Create error:", error);
      },
    },
  );

  // Update bank
  const { run: updateBank, loading: updateLoading } = useRequest(
    (id: string, data: UpdateBankDto) => bankService.updateBank(id, data),
    {
      manual: true,
      onSuccess: () => {
        message.success(t("admin.updateBankSuccess"));
        onSuccess();
      },
      onError: (error: unknown) => {
        message.error(t("admin.updateBankFailed"));
        console.error("Update error:", error);
      },
    },
  );

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && bank) {
        // Set form values for edit mode
        console.log("Setting form values for edit mode:", bank);
        form.setFieldsValue({
          name: bank.name,
          termRates:
            bank.termRates?.length > 0
              ? bank.termRates
              : [{ term: "", interestRate: 0 }],
        });
      } else {
        // Reset form for create mode
        console.log("Setting form values for create mode");
        form.resetFields();
        form.setFieldsValue({
          name: "",
          termRates: [{ term: "", interestRate: 0 }],
        });
      }
    } else {
      // Reset form when modal is closed
      form.resetFields();
    }
  }, [visible, mode, bank, form]);

  const handleSubmit = async () => {
    try {
      const values = (await form.validateFields()) as CreateBankDto;

      const bankData: CreateBankDto = {
        name: values.name,
        termRates: values.termRates.filter(
          (rate: { term: string; interestRate: number }) =>
            rate.term && rate.interestRate > 0,
        ),
      };

      if (mode === "create") {
        createBank(bankData);
      } else if (mode === "edit" && bank) {
        updateBank(bank.id, bankData);
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  return (
    <Modal
      title={
        <Title level={4} className="!mb-0">
          {mode === "create" ? t("admin.addBank") : t("admin.editBank")}
        </Title>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-6"
      >
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              label={t("admin.bankName")}
              name="name"
              rules={[
                {
                  required: true,
                  message: t("admin.pleaseEnterBankName"),
                },
                {
                  min: 2,
                  message: t("admin.bankNameMinLength"),
                },
                {
                  max: 100,
                  message: t("admin.bankNameMaxLength"),
                },
              ]}
            >
              <Input placeholder={t("admin.enterBankName")} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item label={t("admin.termRates")}>
              <Form.List name="termRates">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        style={{ marginBottom: 10 }}
                        key={key}
                        size="small"
                        extra={
                          fields.length > 1 ? (
                            <Button
                              type="text"
                              danger
                              icon={<Trash2 size={16} />}
                              onClick={() => remove(name)}
                            />
                          ) : null
                        }
                      >
                        <Row gutter={16}>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "term"]}
                              label={t("admin.term")}
                              rules={[
                                {
                                  required: true,
                                  message: t("admin.pleaseEnterTerm"),
                                },
                              ]}
                            >
                              <Input placeholder={t("admin.enterTerm")} />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "interestRate"]}
                              label={t("admin.interestRate")}
                              rules={[
                                {
                                  required: true,
                                  message: t("admin.pleaseEnterInterestRate"),
                                },
                                {
                                  type: "number",
                                  min: 0,
                                  max: 100,
                                  message: t("admin.interestRateRange"),
                                },
                              ]}
                            >
                              <InputNumber
                                placeholder={t("admin.enterInterestRate")}
                                min={0}
                                max={100}
                                step={0.01}
                                addonAfter="%"
                                className="w-full"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add({ term: "", interestRate: 0 })}
                      block
                      icon={<Plus size={16} />}
                    >
                      {t("admin.addTermRate")}
                    </Button>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Button onClick={onClose} size="large">
            {t("admin.cancel")}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={createLoading || updateLoading}
            size="large"
            className="bg-blue-500 hover:bg-blue-600"
          >
            {mode === "create" ? t("admin.create") : t("admin.update")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default BankModal;
