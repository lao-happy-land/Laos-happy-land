import api from "@/share/service/api.service";

export interface RecentActivity {
  type: string;
  action: string;
  description: string;
  createdAt: string;
  createdBy: string;
}

export interface DashboardData {
  totalProperties: number;
  pendingProperties: number;
  totalUsers: number;
  approvedPropertiesThisMonth: number;
  propertyGrowthRate: number;
  userGrowthRate: number;
  recentActivities: RecentActivity[];
}

class DashboardService {
  /**
   * Get dashboard statistics
   */
  async getDashboard(): Promise<DashboardData> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const response = await api.dashboardControllerGetDashboard();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      return (response as any).data as DashboardData;
    } catch (error) {
      console.error("Error fetching dashboard:", error as Error);
      // Return default data on error
      return {
        totalProperties: 0,
        pendingProperties: 0,
        totalUsers: 0,
        approvedPropertiesThisMonth: 0,
        propertyGrowthRate: 0,
        userGrowthRate: 0,
        recentActivities: [],
      };
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
