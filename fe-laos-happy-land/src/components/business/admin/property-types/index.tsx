import { Button } from "antd";

export default function PropertyTypes() {
  return (
    <div className="flex min-h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh mục căn hộ</h1>
        <Button type="primary">Thêm mới</Button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Tên loại bất động sản</label>
          <input type="text" id="name" className="rounded-md border p-2" />
        </div>
      </div>
    </div>
  );
}
