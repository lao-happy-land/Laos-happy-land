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
          // Color palette - Enhanced Contrast
          colorPrimary: "#dc2626", // High contrast red
          colorPrimaryHover: "#b91c1c", // Darker red hover
          colorPrimaryActive: "#7f1d1d", // Even darker active
          colorSuccess: "#16a34a", // High contrast green
          colorWarning: "#d97706", // High contrast amber
          colorError: "#dc2626", // High contrast red
          colorInfo: "#2563eb", // High contrast blue

          // Text colors for better contrast
          colorText: "#0f172a", // Very dark text
          colorTextSecondary: "#475569", // Medium contrast secondary
          colorTextTertiary: "#94a3b8", // Lower contrast tertiary
          colorTextQuaternary: "#cbd5e1", // Lowest contrast

          // Background colors
          colorBgContainer: "#ffffff", // Pure white containers
          colorBgElevated: "#ffffff", // Elevated surfaces
          colorBgLayout: "#f8fafc", // Layout background
          colorBgSpotlight: "#f1f5f9", // Spotlight background

          // Border colors
          colorBorder: "#e2e8f0", // Subtle borders
          colorBorderSecondary: "#cbd5e1", // Secondary borders

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
            fontWeight: 600,
            // Primary button colors
            colorPrimary: "#dc2626",
            colorPrimaryHover: "#b91c1c",
            colorPrimaryActive: "#7f1d1d",
            // Default button colors
            colorText: "#0f172a",
            colorTextSecondary: "#475569",
            colorTextTertiary: "#94a3b8",
            colorBorder: "#e2e8f0",
            colorBorderSecondary: "#cbd5e1",
            // Background colors
            colorBgContainer: "#ffffff",
            colorBgTextHover: "#f8fafc",
            colorBgTextActive: "#f1f5f9",
            // Ghost button colors
            colorTextQuaternary: "#64748b",
            colorTextDisabled: "#cbd5e1",
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
            colorText: "#0f172a",
            colorTextPlaceholder: "#94a3b8",
            colorBorder: "#e2e8f0",
            colorPrimaryHover: "#dc2626",
          },
          Select: {
            borderRadius: 8,
            borderRadiusLG: 12,
            borderRadiusSM: 6,
            controlHeight: 40,
            controlHeightLG: 48,
            controlHeightSM: 32,
            colorText: "#0f172a",
            colorTextPlaceholder: "#94a3b8",
            colorBorder: "#e2e8f0",
            colorPrimaryHover: "#dc2626",
          },
          Card: {
            borderRadius: 12,
            borderRadiusLG: 16,
            borderRadiusSM: 8,
            padding: 24,
            paddingLG: 32,
            paddingSM: 16,
            colorBgContainer: "#ffffff",
            colorBorder: "#e2e8f0",
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
            colorText: "#0f172a",
            colorTextSecondary: "#475569",
            colorTextTertiary: "#94a3b8",
            fontWeightStrong: 600,
          },
          Tabs: {
            borderRadius: 8,
            borderRadiusLG: 12,
            borderRadiusSM: 6,
            padding: 8,
            paddingLG: 12,
            paddingSM: 4,
            colorText: "#0f172a",
            colorTextSecondary: "#475569",
            colorPrimary: "#dc2626",
            colorPrimaryHover: "#b91c1c",
          },
          Tag: {
            borderRadius: 6,
            borderRadiusSM: 4,
            fontSize: 12,
            // Default tag colors
            colorText: "#0f172a",
            colorBorder: "#e2e8f0",
            colorBgContainer: "#f8fafc",
            // Success tag colors
            colorSuccess: "#16a34a",
            colorSuccessBorder: "#bbf7d0",
            colorSuccessBg: "#f0fdf4",
            // Warning tag colors
            colorWarning: "#d97706",
            colorWarningBorder: "#fed7aa",
            colorWarningBg: "#fffbeb",
            // Error tag colors
            colorError: "#dc2626",
            colorErrorBorder: "#fecaca",
            colorErrorBg: "#fef2f2",
            // Info tag colors
            colorInfo: "#2563eb",
            colorInfoBorder: "#bfdbfe",
            colorInfoBg: "#eff6ff",
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
            colorText: "#0f172a",
            colorTextSecondary: "#475569",
            colorBorder: "#e2e8f0",
            colorBgContainer: "#ffffff",
            headerBg: "#f8fafc",
            headerColor: "#0f172a",
            headerSortActiveBg: "#f1f5f9",
          },
          Form: {
            labelFontSize: 14,
            labelColor: "#0f172a",
            labelRequiredMarkColor: "#dc2626",
            itemMarginBottom: 24,
          },
          Tooltip: {
            borderRadius: 8,
            fontSize: 12,
            padding: 8,
            paddingLG: 12,
            paddingSM: 6,
            // Tooltip colors
            colorText: "#ffffff",
            colorBgSpotlight: "#1e293b",
            colorBorder: "#334155",
            // Arrow colors
            colorPrimary: "#1e293b",
            colorPrimaryHover: "#0f172a",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdConfigProvider;
