"use client";

import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  App,
  Typography,
  Steps,
  InputNumber,
  Select,
} from "antd";
import { useTranslations } from "next-intl";
import {
  Landmark,
  Upload as UploadIcon,
  CheckCircle,
  User,
  FileText,
  Send,
  XCircle,
  Mail,
  Phone,
  Briefcase,
  Building2,
} from "lucide-react";
import type { UploadFile } from "antd";
import { useRequest } from "ahooks";
import { bankRequestService } from "@/share/service/bank-request.service";
import uploadService from "@/share/service/upload.service";
import bankService, { type Bank } from "@/share/service/bank.service";
import { getLangByLocale, getValidLocale } from "@/share/helper/locale.helper";
import { useUrlLocale } from "@/utils/locale";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function BankRequestForm() {
  const t = useTranslations();
  const { message } = App.useApp();
  const locale = useUrlLocale();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [bankRequestImage, setBankRequestImage] = useState<File | null>(null);
  const [bankRequestFileList, setBankRequestFileList] = useState<UploadFile[]>(
    [],
  );
  const [submitted, setSubmitted] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);

  // Fetch banks
  const { loading: loadingBanks } = useRequest(
    async () => {
      const response = await bankService.getBanks({
        page: 1,
        perPage: 100,
        lang: getLangByLocale(getValidLocale(locale)),
      });
      return response;
    },
    {
      onSuccess: (data) => {
        setBanks(data.data ?? []);
      },
      onError: () => {
        message.error(t("loanCalculator.cannotLoadBanks"));
      },
    },
  );

  const { loading: submitting, run: submitRequest } = useRequest(
    async (values: {
      fullName: string;
      email: string;
      phone: string;
      bankId?: string;
      yearsOfExperience?: number;
      note?: string;
    }) => {
      // Upload image (required)
      if (!bankRequestImage) {
        throw new Error("Image is required");
      }

      console.log("Uploading image...");
      const uploadedImage = await uploadService.uploadImage(bankRequestImage);
      const imageUrl = uploadedImage.url;
      console.log("Image uploaded successfully:", imageUrl);

      const requestData: {
        fullName: string;
        email: string;
        phone: string;
        imageUrl: string;
        bankId?: string;
        note?: string;
        yearsOfExperience?: number;
      } = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        imageUrl,
        yearsOfExperience: values.yearsOfExperience ?? 0,
      };

      // Only add optional fields if they have values
      if (values.bankId) {
        requestData.bankId = values.bankId;
      }
      if (values.note?.trim()) {
        requestData.note = values.note.trim();
      }

      console.log("=== Bank Request Submission ===");
      console.log("Form values received:", values);
      console.log("Request data to send:", requestData);

      const result = await bankRequestService.create(requestData);
      console.log("Success response:", result);

      return result;
    },
    {
      manual: true,
      onSuccess: () => {
        message.success(t("profile.bankRequestSent"));
        setSubmitted(true);
        form.resetFields();
        setBankRequestImage(null);
        setBankRequestFileList([]);
      },
      onError: (error: unknown) => {
        console.error("Bank request submission error:", error);
        console.log("Full error object:", JSON.stringify(error, null, 2));

        let errorMessage = t("profile.bankRequestFailed");

        if (error && typeof error === "object") {
          // Try to extract from axios error response
          if ("response" in error) {
            const axiosError = error as {
              response?: {
                data?: {
                  message?: string;
                  error?: string;
                  statusCode?: number;
                };
                status?: number;
              };
            };

            const responseData = axiosError.response?.data;

            // Priority: message > error field
            if (responseData?.message) {
              const backendMessage = responseData.message;

              // Check for known error messages and use translations
              if (backendMessage === "You already have a pending request") {
                errorMessage = t("bankRequest.alreadyHavePendingRequest");
              } else {
                errorMessage = backendMessage;
              }
            } else if (
              responseData?.error &&
              typeof responseData.error === "string"
            ) {
              errorMessage = responseData.error;
            }
          }
          // Try to extract from error.message (but skip generic axios messages)
          else if ("message" in error) {
            const err = error as { message?: string };
            if (err.message && !err.message.includes("status code")) {
              errorMessage = err.message;
            }
          }
        }

        message.error(errorMessage);
      },
    },
  );

  const handleSubmit = async () => {
    try {
      console.log("=== Starting Form Submission ===");

      // Check image first
      if (!bankRequestImage) {
        message.error(t("profile.uploadDocument"));
        return;
      }

      // Explicitly validate all fields
      const values = (await form.validateFields([
        "fullName",
        "email",
        "phone",
        "bankId",
        "yearsOfExperience",
        "note",
      ])) as {
        fullName: string;
        email: string;
        phone: string;
        bankId?: string;
        yearsOfExperience?: number;
        note?: string;
      };

      console.log("Validated form values:", values);

      // Verify required fields
      if (!values.fullName || !values.email || !values.phone) {
        message.error("Missing required fields");
        console.error("Missing fields:", { values });
        return;
      }

      submitRequest(values);
    } catch (error) {
      console.error("Validation failed:", error);
      message.error(t("broker.validationError"));
    }
  };

  const steps = [
    {
      title: t("bankRequest.personalInformation"),
    },
    {
      title: t("bankRequest.additionalInformation"),
    },
    {
      title: t("common.submit"),
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <Card>
              <div className="py-12 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 ring-8 ring-green-50">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <Title level={2} style={{ color: "#16a34a", marginBottom: 16 }}>
                  {t("bankRequest.applicationSubmitted")}
                </Title>
                <Paragraph
                  style={{ fontSize: 16, color: "#4b5563", marginBottom: 24 }}
                >
                  {t("bankRequest.successMessage")}
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    setSubmitted(false);
                    setCurrentStep(0);
                  }}
                  style={{
                    background: "linear-gradient(to right, #3b82f6, #6366f1)",
                    borderColor: "transparent",
                  }}
                >
                  {t("bankRequest.submitAnotherRequest")}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg ring-4 ring-blue-100">
              <Landmark className="h-8 w-8 text-white" />
            </div>
            <Title level={1} style={{ fontSize: 36, marginBottom: 12 }}>
              {t("bankRequest.title")}
            </Title>
            <Paragraph
              style={{
                fontSize: 18,
                color: "#4b5563",
                maxWidth: 640,
                margin: "0 auto",
              }}
            >
              {t("bankRequest.applyDescription")}
            </Paragraph>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <Card>
              <Steps current={currentStep} items={steps} />
            </Card>
          </div>

          {/* Form */}
          <Card>
            <Form
              form={form}
              layout="vertical"
              preserve={true}
              initialValues={{
                yearsOfExperience: 0,
              }}
            >
              {/* Step 0: Basic Information */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="mb-6 flex items-center gap-2 border-b pb-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <Title level={4} style={{ margin: 0 }}>
                      {t("bankRequest.personalInformation")}
                    </Title>
                  </div>

                  <Form.Item
                    name="fullName"
                    label={t("common.fullName")}
                    rules={[
                      {
                        required: true,
                        message: t("auth.pleaseEnterFullName"),
                      },
                      {
                        min: 2,
                        message: t("bankRequest.nameMinLength"),
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("common.enterFullName")}
                      size="large"
                      prefix={<User size={16} />}
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label={t("common.email")}
                    rules={[
                      {
                        required: true,
                        message: t("auth.pleaseEnterEmail"),
                      },
                      {
                        type: "email",
                        message: t("forms.invalidEmail"),
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("common.enterEmail")}
                      size="large"
                      type="email"
                      prefix={<Mail size={16} />}
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label={t("common.phone")}
                    rules={[
                      {
                        required: true,
                        message: t("auth.pleaseEnterPhone"),
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("common.enterPhone")}
                      size="large"
                      maxLength={20}
                      prefix={<Phone size={16} />}
                    />
                  </Form.Item>

                  <Form.Item
                    name="bankId"
                    label={
                      <span>
                        {t("loanCalculator.selectBank")}{" "}
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          ({t("common.optional")})
                        </Text>
                      </span>
                    }
                  >
                    <Select
                      placeholder={t("loanCalculator.chooseBankPlaceholder")}
                      size="large"
                      loading={loadingBanks}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      suffixIcon={<Building2 size={16} />}
                    >
                      {banks.map((bank) => (
                        <Option key={bank.id} value={bank.id}>
                          <div className="flex items-center gap-2">
                            <Building2 size={14} />
                            <span>{bank.name}</span>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="yearsOfExperience"
                    label={t("common.experienceYears")}
                  >
                    <InputNumber
                      placeholder={t("common.enterExperienceYears")}
                      size="large"
                      min={0}
                      max={50}
                      prefix={<Briefcase size={16} />}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => {
                        form
                          .validateFields([
                            "fullName",
                            "email",
                            "phone",
                            "bankId",
                            "yearsOfExperience",
                          ])
                          .then(() => setCurrentStep(1))
                          .catch((error) => {
                            console.error("Validation failed:", error);
                          });
                      }}
                    >
                      {t("bankRequest.next")}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 1: Additional Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="mb-6 flex items-center gap-2 border-b pb-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <Title level={4} style={{ margin: 0 }}>
                      {t("bankRequest.additionalInformation")}
                    </Title>
                  </div>

                  <Form.Item name="note" label={t("profile.bankRequestNote")}>
                    <TextArea
                      placeholder={t("profile.enterBankRequestNote")}
                      rows={6}
                      maxLength={500}
                      showCount
                    />
                  </Form.Item>

                  <div>
                    <div className="mb-3">
                      <Text strong>
                        {t("profile.bankRequestDocument")}{" "}
                        <span style={{ color: "#dc2626" }}>*</span>
                      </Text>
                    </div>
                    <Upload
                      listType="picture-card"
                      fileList={bankRequestFileList}
                      beforeUpload={(file) => {
                        const isImage = file.type.startsWith("image/");
                        if (!isImage) {
                          message.error(t("common.onlyImageAllowed"));
                          return false;
                        }
                        const isLt5M = file.size / 1024 / 1024 < 5;
                        if (!isLt5M) {
                          message.error(t("profile.imageSizeLimit5MB"));
                          return false;
                        }

                        setBankRequestImage(file);
                        setBankRequestFileList([
                          {
                            uid: "-1",
                            name: file.name,
                            status: "done",
                            url: URL.createObjectURL(file),
                          },
                        ]);
                        return false;
                      }}
                      onRemove={() => {
                        setBankRequestImage(null);
                        setBankRequestFileList([]);
                      }}
                      maxCount={1}
                    >
                      {bankRequestFileList.length === 0 && (
                        <div className="text-center">
                          <UploadIcon className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                          <div className="text-sm text-gray-600">
                            {t("profile.uploadDocument")}
                          </div>
                        </div>
                      )}
                    </Upload>
                    <div className="mt-2">
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {t("profile.bankRequestDocumentHelper")}
                      </Text>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button size="large" onClick={() => setCurrentStep(0)}>
                      {t("bankRequest.back")}
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => setCurrentStep(2)}
                    >
                      {t("bankRequest.next")}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Review & Submit */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="mb-6 flex items-center gap-2 border-b pb-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <Title level={4} style={{ margin: 0 }}>
                      {t("bankRequest.reviewApplication")}
                    </Title>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="mb-2 flex items-center gap-2">
                          <User size={16} className="text-blue-600" />
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            {t("common.fullName")}
                          </Text>
                        </div>
                        <Text strong style={{ fontSize: 16 }}>
                          {form.getFieldValue("fullName")}
                        </Text>
                      </div>

                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="mb-2 flex items-center gap-2">
                          <Mail size={16} className="text-blue-600" />
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            {t("common.email")}
                          </Text>
                        </div>
                        <Text strong style={{ fontSize: 16 }}>
                          {form.getFieldValue("email")}
                        </Text>
                      </div>

                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="mb-2 flex items-center gap-2">
                          <Phone size={16} className="text-blue-600" />
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            {t("common.phone")}
                          </Text>
                        </div>
                        <Text strong style={{ fontSize: 16 }}>
                          {form.getFieldValue("phone")}
                        </Text>
                      </div>

                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="mb-2 flex items-center gap-2">
                          <Briefcase size={16} className="text-blue-600" />
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            {t("common.experienceYears")}
                          </Text>
                        </div>
                        <Text strong style={{ fontSize: 16 }}>
                          {form.getFieldValue("yearsOfExperience") ?? 0}{" "}
                          {t("admin.years")}
                        </Text>
                      </div>

                      {form.getFieldValue("bankId") && (
                        <div className="col-span-1 rounded-lg bg-white p-4 shadow-sm md:col-span-2">
                          <div className="mb-2 flex items-center gap-2">
                            <Building2 size={16} className="text-blue-600" />
                            <Text type="secondary" style={{ fontSize: 13 }}>
                              {t("loanCalculator.selectBank")}
                            </Text>
                          </div>
                          <Text strong style={{ fontSize: 16 }}>
                            {banks.find(
                              (b) => b.id === form.getFieldValue("bankId"),
                            )?.name ?? form.getFieldValue("bankId")}
                          </Text>
                        </div>
                      )}
                    </div>

                    {form.getFieldValue("note") && (
                      <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
                        <div className="mb-2 flex items-center gap-2">
                          <FileText size={16} className="text-blue-600" />
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            {t("profile.bankRequestNote")}
                          </Text>
                        </div>
                        <Text style={{ fontSize: 15 }}>
                          {form.getFieldValue("note")}
                        </Text>
                      </div>
                    )}

                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <div className="mb-3 flex items-center gap-2">
                        <UploadIcon size={16} className="text-blue-600" />
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {t("profile.bankRequestDocument")}
                        </Text>
                      </div>
                      {bankRequestFileList.length > 0 ? (
                        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <Text strong style={{ color: "#16a34a" }}>
                            {t("bankRequest.documentUploaded")}
                          </Text>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3">
                          <XCircle className="h-5 w-5 text-red-500" />
                          <Text strong style={{ color: "#dc2626" }}>
                            {t("bankRequest.noDocumentUploaded")}
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button size="large" onClick={() => setCurrentStep(1)}>
                      {t("bankRequest.back")}
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      loading={submitting}
                      onClick={handleSubmit}
                      icon={<Send size={16} />}
                    >
                      {t("bankRequest.submitApplication")}
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </Card>

          {/* Help Text */}
          <div className="mt-6">
            <Card
              style={{
                background: "linear-gradient(to right, #eff6ff, #eef2ff)",
              }}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <Title
                    level={5}
                    style={{ color: "#1e3a8a", marginBottom: 8 }}
                  >
                    {t("bankRequest.whatHappensNext")}
                  </Title>
                  <Paragraph style={{ color: "#374151", marginBottom: 0 }}>
                    {t("bankRequest.whatHappensNextDescription")}
                  </Paragraph>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
