"use client";

import { useState } from "react";
import {
  Dropdown,
  Form,
  Input,
  Select,
  Button,
  message,
  type FormInstance,
} from "antd";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  GripVertical,
  X,
  Upload as UploadIcon,
} from "lucide-react";
import uploadService from "@/share/service/upload.service";

// Internal block type to support both text/value callers
type Block =
  | { type: "heading"; text?: string; value?: string; level?: 1 | 2 | 3 }
  | { type: "paragraph"; text?: string; value?: string }
  | { type: "image"; url: string; caption?: string };

type Props = {
  form: FormInstance;
  name?: string | number | Array<string | number>;
  textFieldName?: "text" | "value";
};

const { TextArea } = Input;
const { Option } = Select;

export default function ProjectContentBuilder({
  form,
  name = "content",
  textFieldName = "value",
}: Props) {
  const listPathArr: Array<string | number> = Array.isArray(name)
    ? name
    : [name];
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const openAndUploadImage = async (fieldIndex: number) => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        if (file.size / 1024 / 1024 > 5) {
          message.error("Hình ảnh phải nhỏ hơn 5MB");
          return;
        }
        setUploadingIndex(fieldIndex);
        try {
          const data = await uploadService.uploadImage(file);
          if (!data?.url) throw new Error("Không nhận được URL ảnh");
          // Set the URL for this block
          if (typeof form.setFieldValue === "function") {
            form.setFieldValue([...listPathArr, fieldIndex, "url"], data.url);
          } else {
            // Fallback for older antd versions
            const current = (form.getFieldValue(listPathArr) as Block[]) ?? [];
            const newList: Block[] = [...current];
            const existing = newList[fieldIndex];
            if (existing && existing.type === "image") {
              newList[fieldIndex] = { ...existing, url: data.url };
            } else {
              newList[fieldIndex] = { type: "image", url: data.url };
            }
            form.setFieldsValue({ [listPathArr[0] as string]: newList });
          }
          message.success("Tải ảnh thành công");
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Lỗi tải ảnh";
          message.error(msg);
        } finally {
          setUploadingIndex(null);
        }
      };
      input.click();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi tải ảnh";
      message.error(msg);
    }
  };

  return (
    <Form.List
      name={listPathArr}
      rules={[
        {
          validator: async (_, value) => {
            if (!Array.isArray(value) || value.length === 0) {
              return Promise.reject(
                new Error("Vui lòng thêm ít nhất 1 nội dung"),
              );
            }
          },
        },
      ]}
    >
      {(fields, { add, remove }) => {
        type BlockType = "heading" | "paragraph" | "image";
        const addAt = (index: number, type: BlockType) => {
          let block: Block;
          if (type === "image") {
            block = { type: "image", url: "" };
          } else if (textFieldName === "text") {
            block = { type, text: "" };
          } else {
            block = { type, value: "" };
          }
          add(block, index);
        };
        const move = (from: number, to: number) => {
          const current = (form.getFieldValue(listPathArr) as Block[]) ?? [];
          if (
            from < 0 ||
            from >= current.length ||
            to < 0 ||
            to >= current.length
          )
            return;
          const newList = [...current];
          const [item] = newList.splice(from, 1);
          newList.splice(to, 0, item!);
          form.setFieldsValue({ [listPathArr[0] as string]: newList });
        };

        const blockMenuItems = [
          { key: "heading", label: "Tiêu đề" },
          { key: "paragraph", label: "Đoạn văn" },
          { key: "image", label: "Hình ảnh" },
        ];

        return (
          <div className="space-y-2">
            {fields.map((field, idx) => (
              <div
                key={field.key}
                className="relative flex items-start gap-3 rounded-lg bg-gray-50 px-2 py-1"
              >
                <div className="flex w-6 flex-col items-center gap-2">
                  <Button
                    type="text"
                    size="small"
                    icon={<GripVertical className="h-4 w-4 text-gray-400" />}
                  />
                </div>

                <div className="flex-1">
                  <div className="mb-2">
                    <Form.Item noStyle shouldUpdate={() => true}>
                      {({ getFieldValue }) => {
                        const type = getFieldValue([
                          ...listPathArr,
                          field.name,
                          "type",
                        ]) as BlockType | undefined;
                        return (
                          <>
                            {type === undefined && (
                              <Form.Item
                                {...field}
                                name={[field.name, "type"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Chọn loại nội dung",
                                  },
                                ]}
                              >
                                <Select placeholder="Chọn loại nội dung">
                                  <Option value="heading">Tiêu đề</Option>
                                  <Option value="paragraph">Đoạn văn</Option>
                                  <Option value="image">Hình ảnh</Option>
                                </Select>
                              </Form.Item>
                            )}
                            {type === "heading" && (
                              <Form.Item
                                name={[field.name, textFieldName]}
                                rules={[
                                  { required: true, message: "Nhập tiêu đề" },
                                ]}
                              >
                                <Input
                                  placeholder="Tiêu đề..."
                                  className="border-0 p-0 text-2xl font-semibold shadow-none focus:shadow-none"
                                />
                              </Form.Item>
                            )}
                            {type === "paragraph" && (
                              <Form.Item
                                name={[field.name, textFieldName]}
                                rules={[
                                  { required: true, message: "Nhập nội dung" },
                                ]}
                              >
                                <TextArea
                                  autoSize={{ minRows: 2, maxRows: 8 }}
                                  placeholder="Nhập nội dung..."
                                  className="border-0 p-0 shadow-none focus:shadow-none"
                                />
                              </Form.Item>
                            )}
                            {type === "image" && (
                              <div className="relative grid grid-cols-1">
                                <Form.Item
                                  name={[field.name, "url"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Nhập URL hình ảnh",
                                    },
                                  ]}
                                >
                                  <Input
                                    readOnly
                                    placeholder="Dán URL hình ảnh..."
                                  />
                                </Form.Item>
                                <Button
                                  type="primary"
                                  onClick={() => openAndUploadImage(idx)}
                                  loading={uploadingIndex === idx}
                                  icon={<UploadIcon className="h-4 w-4" />}
                                  style={{
                                    position: "absolute",
                                    right: 0,
                                    top: 0,
                                  }}
                                >
                                  Tải ảnh
                                </Button>
                              </div>
                            )}
                          </>
                        );
                      }}
                    </Form.Item>
                  </div>

                  <div className="-mt-2 mb-1 flex gap-1">
                    <Button
                      size="small"
                      icon={<ArrowUp className="h-4 w-4" />}
                      onClick={() => move(idx, Math.max(0, idx - 1))}
                    />
                    <Button
                      size="small"
                      icon={<ArrowDown className="h-4 w-4" />}
                      onClick={() =>
                        move(idx, Math.min(fields.length - 1, idx + 1))
                      }
                    />
                    <Button
                      danger
                      size="small"
                      icon={<X className="h-4 w-4" />}
                      onClick={() => remove(field.name)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-1">
              <Dropdown
                menu={{
                  items: blockMenuItems,
                  onClick: ({ key }) => addAt(fields.length, key as BlockType),
                }}
                trigger={["click"]}
              >
                <Button type="primary" icon={<Plus className="h-4 w-4" />}>
                  Thêm nội dung
                </Button>
              </Dropdown>
            </div>
          </div>
        );
      }}
    </Form.List>
  );
}
