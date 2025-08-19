import { useRequest } from "ahooks";
import { message } from "antd";
import { userService } from "@/share/service/user.service";

interface UserRole {
  id: string;
  name: string;
}

export const useUserRoles = () => {
  const { data: userRoles = [], loading: rolesLoading } = useRequest(
    async () => {
      const response = await userService.getAllUserRoles();
      const responseData = response as unknown as { data: UserRole[] };
      const rolesArray = responseData?.data ?? [];

      return Array.isArray(rolesArray)
        ? rolesArray.filter(
            (role) =>
              typeof role === "object" &&
              role !== null &&
              "id" in role &&
              "name" in role,
          )
        : [];
    },
    {
      cacheKey: "userRoles",
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      onError: (error) => {
        console.error("Error loading user roles:", error);
        message.error("Không thể tải danh sách vai trò. Vui lòng thử lại.");
      },
    },
  );

  return {
    userRoles,
    rolesLoading,
  };
};
