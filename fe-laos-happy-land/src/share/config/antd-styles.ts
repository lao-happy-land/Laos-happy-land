// Common Ant Design component styles and configurations
export const antdStyles = {
  // Button styles
  button: {
    primary: {
      className:
        "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105",
    },
    secondary: {
      className:
        "border border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500 font-medium transition-all duration-200",
    },
    outline: {
      className:
        "border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium transition-all duration-200",
    },
    ghost: {
      className:
        "text-gray-600 hover:text-red-500 hover:bg-red-50 font-medium transition-all duration-200",
    },
  },

  // Input styles
  input: {
    default: {
      className:
        "rounded-xl border-2 border-gray-200 hover:border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200",
    },
    search: {
      className:
        "rounded-xl border-2 border-gray-200 hover:border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 pl-12",
    },
  },

  // Select styles
  select: {
    default: {
      className:
        "rounded-xl border-2 border-gray-200 hover:border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200",
    },
  },

  // Card styles
  card: {
    default: {
      className:
        "rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1",
    },
    glass: {
      className:
        "rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl border border-white/20",
    },
    hover: {
      className:
        "rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer",
    },
  },

  // Typography styles
  typography: {
    title: {
      className: "font-semibold text-gray-900",
    },
    subtitle: {
      className: "text-gray-600",
    },
    body: {
      className: "text-gray-700",
    },
    caption: {
      className: "text-sm text-gray-500",
    },
  },

  // Tag styles
  tag: {
    primary: {
      className: "bg-red-100 text-red-700 border-red-200 font-medium",
    },
    secondary: {
      className: "bg-gray-100 text-gray-700 border-gray-200 font-medium",
    },
    success: {
      className: "bg-green-100 text-green-700 border-green-200 font-medium",
    },
    warning: {
      className: "bg-yellow-100 text-yellow-700 border-yellow-200 font-medium",
    },
    error: {
      className: "bg-red-100 text-red-700 border-red-200 font-medium",
    },
  },

  // Table styles
  table: {
    default: {
      className: "rounded-xl overflow-hidden shadow-lg",
    },
  },

  // Modal styles
  modal: {
    default: {
      className: "rounded-2xl",
      bodyStyle: { padding: "24px" },
      style: { borderRadius: "16px" },
    },
  },

  // Form styles
  form: {
    item: {
      className: "mb-4",
    },
    label: {
      className: "font-medium text-gray-700 mb-2 block",
    },
  },

  // Space styles
  space: {
    default: {
      className: "gap-4",
    },
    small: {
      className: "gap-2",
    },
    large: {
      className: "gap-6",
    },
  },

  // Row/Col styles
  grid: {
    row: {
      className: "gap-4",
    },
    col: {
      className: "flex flex-col",
    },
  },

  // Avatar styles
  avatar: {
    default: {
      className: "bg-red-100 text-red-600",
    },
    large: {
      className: "bg-red-100 text-red-600 w-16 h-16",
    },
  },

  // Badge styles
  badge: {
    primary: {
      className: "bg-red-500",
    },
    secondary: {
      className: "bg-gray-500",
    },
  },

  // Pagination styles
  pagination: {
    default: {
      className: "flex justify-center mt-6",
    },
  },

  // Empty styles
  empty: {
    default: {
      className: "py-12",
    },
  },

  // Spin styles
  spin: {
    default: {
      className: "flex justify-center items-center py-8",
    },
  },

  // Message styles
  message: {
    success: {
      className: "rounded-lg shadow-lg",
    },
    error: {
      className: "rounded-lg shadow-lg",
    },
    warning: {
      className: "rounded-lg shadow-lg",
    },
    info: {
      className: "rounded-lg shadow-lg",
    },
  },
};

// Common component configurations
export const antdConfigs = {
  // Button configurations
  button: {
    size: "middle" as const,
    type: "default" as const,
  },

  // Input configurations
  input: {
    size: "middle" as const,
    allowClear: true,
  },

  // Select configurations
  select: {
    size: "middle" as const,
    allowClear: true,
    showSearch: true,
  },

  // Card configurations
  card: {
    hoverable: true,
  },

  // Table configurations
  table: {
    pagination: {
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number, range: [number, number]) =>
        `${range[0]}-${range[1]} của ${total} mục`,
    },
  },

  // Modal configurations
  modal: {
    centered: true,
    destroyOnClose: true,
  },

  // Form configurations
  form: {
    layout: "vertical" as const,
    requiredMark: true,
  },

  // Message configurations
  message: {
    duration: 3,
    maxCount: 3,
  },
};

// Common responsive breakpoints
export const responsive = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 4,
};

// Common spacing values
export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Common border radius values
export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
};

// Common shadow values
export const shadows = {
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};

// Common color values
export const colors = {
  primary: "#ef4444",
  primaryHover: "#dc2626",
  primaryActive: "#b91c1c",
  secondary: "#f97316",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};

// Common font sizes
export const fontSizes = {
  xs: "12px",
  sm: "14px",
  base: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "30px",
  "4xl": "36px",
  "5xl": "48px",
};

// Common font weights
export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Common transitions
export const transitions = {
  fast: "all 0.15s ease-in-out",
  normal: "all 0.2s ease-in-out",
  slow: "all 0.3s ease-in-out",
};

// Export all configurations
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  styles: antdStyles,
  configs: antdConfigs,
  responsive,
  spacing,
  borderRadius,
  shadows,
  colors,
  fontSizes,
  fontWeights,
  transitions,
};
