import { ConfigProvider, theme } from "antd";
import type { ReactNode } from "react";

interface AntdConfigProviderProps {
  children: ReactNode;
}

const AntdConfigProvider = ({ children }: AntdConfigProviderProps) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          // Color palette
          colorPrimary: "#ef4444", // Red-500
          colorPrimaryHover: "#dc2626", // Red-600
          colorPrimaryActive: "#b91c1c", // Red-700
          colorSuccess: "#10b981", // Green-500
          colorWarning: "#f59e0b", // Amber-500
          colorError: "#ef4444", // Red-500
          colorInfo: "#3b82f6", // Blue-500

          // Typography
          fontFamily:
            'var(--font-be-vietnam-pro), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: 14,
          fontSizeSM: 12,
          fontSizeLG: 16,
          fontSizeXL: 18,
          fontSizeHeading1: 32,
          fontSizeHeading2: 24,
          fontSizeHeading3: 20,
          fontSizeHeading4: 16,
          fontSizeHeading5: 14,

          // Border radius
          borderRadius: 8,
          borderRadiusLG: 12,
          borderRadiusSM: 6,
          borderRadiusXS: 4,

          // Spacing
          padding: 16,
          paddingLG: 24,
          paddingSM: 12,
          paddingXS: 8,
          margin: 16,
          marginLG: 24,
          marginSM: 12,
          marginXS: 8,

          // Control height
          controlHeight: 40,
          controlHeightLG: 48,
          controlHeightSM: 32,

          // Button
          controlPaddingHorizontal: 16,
          controlPaddingHorizontalSM: 8,

          // Shadow
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          boxShadowSecondary:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          boxShadowTertiary:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        components: {
          Button: {
            borderRadius: 8,
            borderRadiusLG: 12,
            borderRadiusSM: 6,
            controlHeight: 40,
            controlHeightLG: 48,
            controlHeightSM: 32,
            paddingInline: 16,
            paddingInlineLG: 24,
            paddingInlineSM: 12,
            fontWeight: 500,
          },
          Input: {
            borderRadius: 8,
            borderRadiusLG: 12,
            borderRadiusSM: 6,
            controlHeight: 40,
            controlHeightLG: 48,
            controlHeightSM: 32,
            paddingInline: 12,
            paddingInlineLG: 16,
            paddingInlineSM: 8,
          },
          Select: {
            borderRadius: 8,
            borderRadiusLG: 12,
            borderRadiusSM: 6,
            controlHeight: 40,
            controlHeightLG: 48,
            controlHeightSM: 32,
          },
          Card: {
            borderRadius: 12,
            borderRadiusLG: 16,
            borderRadiusSM: 8,
            padding: 24,
            paddingLG: 32,
            paddingSM: 16,
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            boxShadowTertiary:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
          Typography: {
            fontFamily:
              'var(--font-be-vietnam-pro), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: 14,
            fontSizeSM: 12,
            fontSizeLG: 16,
            fontSizeXL: 18,
            fontSizeHeading1: 32,
            fontSizeHeading2: 24,
            fontSizeHeading3: 20,
            fontSizeHeading4: 16,
            fontSizeHeading5: 14,
          },
          Tabs: {
            borderRadius: 8,
            borderRadiusLG: 12,
            borderRadiusSM: 6,
            padding: 8,
            paddingLG: 12,
            paddingSM: 4,
          },
          Tag: {
            borderRadius: 6,
            borderRadiusSM: 4,
          },
          Avatar: {
            borderRadius: 8,
            borderRadiusLG: 12,
            borderRadiusSM: 6,
          },
          Modal: {
            borderRadius: 12,
            borderRadiusLG: 16,
            borderRadiusSM: 8,
            padding: 24,
            paddingLG: 32,
            paddingSM: 16,
          },
          Drawer: {
            borderRadius: 12,
            borderRadiusLG: 16,
            borderRadiusSM: 8,
            padding: 24,
            paddingLG: 32,
            paddingSM: 16,
          },
          Table: {
            borderRadius: 8,
            borderRadiusLG: 12,
            borderRadiusSM: 6,
            padding: 16,
            paddingLG: 24,
            paddingSM: 12,
          },
          Form: {
            labelFontSize: 14,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdConfigProvider;
