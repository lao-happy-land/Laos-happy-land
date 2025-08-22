export const ADMIN_NAV_ITEMS = (pathname: string) => [
  {
    id: 1,
    label: "Dashboard",
    icon: "/images/admin/sidebar/user.svg",
    href: "/admin",
    active: pathname === "/admin",
  },

  {
    id: 2,
    label: "Quản lý người dùng",
    icon: "/images/admin/sidebar/triangle-li.svg",
    href: "/admin/users",
    active: pathname === "/admin/users",
  },
  {
    id: 3,
    label: "Quản lý loại BĐS",
    icon: "/images/admin/sidebar/triangle-li.svg",
    href: "/admin/property-types",
    active: pathname === "/admin/property-types",
  },

  {
    id: 4,
    label: "Quản lý BĐS",
    icon: "/images/admin/sidebar/triangle-li.svg",
    href: "/admin/properties",
    active: pathname === "/admin/properties",
  },

  {
    id: 5,
    label: "Quản lý dự án",
    icon: "/images/admin/sidebar/triangle-li.svg",
    href: "/admin/projects",
    active: pathname === "/admin/projects",
  },
];
