"use client";

import { Layout, Space } from "antd";
import LanguageSwitcher from "./language-switcher";

const { Header } = Layout;

interface HeaderWithLanguageProps {
  children?: React.ReactNode;
}

export default function HeaderWithLanguage({
  children,
}: HeaderWithLanguageProps) {
  return (
    <Header className="border-b border-gray-200 bg-white px-6 shadow-sm">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center">{children}</div>
        <div className="flex items-center">
          <Space>
            <LanguageSwitcher />
          </Space>
        </div>
      </div>
    </Header>
  );
}
