"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Upload,
  Typography,
  Row,
  Col,
  Card,
} from "antd";
import { useRequest } from "ahooks";
import { settingService } from "@/share/service/setting.service";
import type {
  Setting,
  CreateSettingDto,
} from "@/share/service/setting.service";
import { useTranslations } from "next-intl";
import { Plus, Delete } from "lucide-react";
import type { UploadFile, UploadProps } from "antd";
import uploadService from "@/share/service/upload.service";

const { TextArea } = Input;
const { Title } = Typography;

interface SettingModalProps {
  visible: boolean;
  mode: "create" | "edit";
  setting: Setting | null;
  onClose: () => void;
  onSuccess: () => void;
}

const SettingModal: React.FC<SettingModalProps> = ({
  visible,
  mode,
  setting,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const t = useTranslations();
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [imagesFileList, setImagesFileList] = useState<UploadFile[]>([]);

  // Create setting
  const { run: createSetting, loading: createLoading } = useRequest(
    (data: CreateSettingDto) => settingService.createSetting(data),
    {
      manual: true,
      onSuccess: () => {
        message.success(t("admin.createSettingSuccess"));
        onSuccess();
      },
      onError: (error: unknown) => {
        message.error(t("admin.createSettingFailed"));
        console.error("Create error:", error);
      },
    },
  );

  // Update setting
  const { run: updateSetting, loading: updateLoading } = useRequest(
    (id: string, data: CreateSettingDto) =>
      settingService.updateSetting(id, data),
    {
      manual: true,
      onSuccess: () => {
        message.success(t("admin.updateSettingSuccess"));
        onSuccess();
      },
      onError: (error: unknown) => {
        message.error(t("admin.updateSettingFailed"));
        console.error("Update error:", error);
      },
    },
  );

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && setting) {
        form.setFieldsValue({
          description: setting.description,
          hotline: setting.hotline,
          facebook: setting.facebook,
        });

        // Set banner file list
        if (setting.banner) {
          setBannerFileList([
            {
              uid: "banner-1",
              name: "banner.jpg",
              status: "done",
              url: setting.banner,
            },
          ]);
        } else {
          setBannerFileList([]);
        }

        // Set images file list
        if (setting.images && setting.images.length > 0) {
          const imageFiles = setting.images.map((url, index) => ({
            uid: `image-${index}`,
            name: `image-${index + 1}.jpg`,
            status: "done" as const,
            url,
          }));
          setImagesFileList(imageFiles);
        } else {
          setImagesFileList([]);
        }
      } else {
        form.resetFields();
        setBannerFileList([]);
        setImagesFileList([]);
      }
    }
  }, [visible, mode, setting, form]);

  const handleSubmit = async () => {
    try {
      const values = (await form.validateFields()) as CreateSettingDto;

      const settingData: CreateSettingDto = {
        description: values.description,
        hotline: values.hotline,
        facebook: values.facebook,
        banner:
          bannerFileList.length > 0
            ? (bannerFileList?.[0]?.url ??
              (bannerFileList?.[0]?.response as { url?: string } | undefined)
                ?.url)
            : undefined,
        images: imagesFileList
          .map(
            (file) =>
              file.url ?? (file.response as { url?: string } | undefined)?.url,
          )
          .filter((url): url is string => Boolean(url)),
      };

      if (mode === "create") {
        createSetting(settingData);
      } else if (mode === "edit" && setting) {
        updateSetting(setting.id, settingData);
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleBannerChange: UploadProps["onChange"] = ({ fileList }) => {
    setBannerFileList(fileList.slice(-1)); // Only keep one banner
  };

  const handleImagesChange: UploadProps["onChange"] = ({ fileList }) => {
    setImagesFileList(fileList);
  };

  const customRequest = async ({
    file,
    onSuccess,
    onError,
  }: {
    file: File;
    onSuccess: (response: { url: string }) => void;
    onError: (error: Error) => void;
  }) => {
    try {
      const response = await uploadService.uploadImage(file);
      if (response?.url) {
        onSuccess({ url: response.url });
      } else {
        onError(new Error("Upload failed: No URL returned"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      onError(error as Error);
    }
  };

  const uploadButton = (
    <div>
      <Plus size={20} />
      <div style={{ marginTop: 8 }}>{t("common.upload")}</div>
    </div>
  );

  return (
    <Modal
      title={
        <Title level={4} className="!mb-0">
          {mode === "create" ? t("admin.addSetting") : t("admin.editSetting")}
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
              label={t("admin.description")}
              name="description"
              rules={[
                {
                  min: 10,
                  message: t("admin.settingDescriptionMinLength"),
                },
                {
                  max: 1000,
                  message: t("admin.settingDescriptionMaxLength"),
                },
              ]}
            >
              <TextArea
                placeholder={t("admin.enterSettingDescription")}
                rows={4}
                showCount
                maxLength={1000}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={t("admin.hotline")}
              name="hotline"
              rules={[
                {
                  pattern: /^[+]?[0-9\s\-()]{8,20}$/,
                  message: t("admin.invalidHotlineFormat"),
                },
              ]}
            >
              <Input placeholder={t("admin.enterHotline")} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label={t("admin.facebook")}
              name="facebook"
              rules={[
                {
                  type: "url",
                  message: t("admin.invalidFacebookUrl"),
                },
              ]}
            >
              <Input placeholder={t("admin.enterFacebookUrl")} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item label={t("admin.banner")}>
              <Card size="small" className="bg-gray-50">
                <Upload
                  listType="picture-card"
                  fileList={bannerFileList}
                  onChange={handleBannerChange}
                  accept="image/*"
                  maxCount={1}
                >
                  {bannerFileList.length >= 1 ? null : uploadButton}
                </Upload>
                <p className="mt-2 mb-0 text-xs text-gray-500">
                  {t("admin.bannerUploadHint")}
                </p>
              </Card>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item label={t("admin.images")}>
              <Card size="small" className="bg-gray-50">
                <Upload
                  listType="picture-card"
                  fileList={imagesFileList}
                  onChange={handleImagesChange}
                  accept="image/*"
                  multiple
                >
                  {imagesFileList.length >= 9 ? null : uploadButton}
                </Upload>
                <p className="mt-2 mb-0 text-xs text-gray-500">
                  {t("admin.imagesUploadHint")}
                </p>
              </Card>
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

export default SettingModal;
