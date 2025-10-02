export class DashboardResponseDto {
  totalProperties: number;

  pendingProperties: number;

  totalUsers: number;

  approvedPropertiesThisMonth: number;

  propertyGrowthRate: number;
  userGrowthRate: number;
  recentActivities: RecentActivity[];
}

export class RecentActivity {
  type: 'property' | 'user' | 'news';
  action: 'create' | 'update';
  description: string;
  createdAt: Date;
  createdBy: string;
}
