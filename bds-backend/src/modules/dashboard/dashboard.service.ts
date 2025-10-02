import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from 'src/entities/property.entity';
import { User } from 'src/entities/user.entity';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import {
  DashboardResponseDto,
  RecentActivity,
} from './dto/dashboard-response.dto';
import { PropertyStatusEnum } from 'src/common/enum/enum';
import { News } from 'src/entities/news.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(News)
    private newsRepo: Repository<News>,
  ) {}

  async getDashboard(): Promise<DashboardResponseDto> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const totalProperties = await this.propertyRepo.count({
      where: { status: PropertyStatusEnum.APPROVED },
    });

    const pendingProperties = await this.propertyRepo.count({
      where: { status: PropertyStatusEnum.PENDING },
    });

    const approvedPropertiesThisMonth = await this.propertyRepo.count({
      where: {
        status: PropertyStatusEnum.APPROVED,
        createdAt: MoreThanOrEqual(startOfMonth),
      },
    });

    const approvedPropertiesLastMonth = await this.propertyRepo.count({
      where: {
        status: PropertyStatusEnum.APPROVED,
        createdAt: Between(lastMonthStart, lastMonthEnd),
      },
    });

    const totalUsers = await this.userRepo.count();
    const usersThisMonth = await this.userRepo.count({
      where: { createdAt: MoreThanOrEqual(startOfMonth) },
    });
    const usersLastMonth = await this.userRepo.count({
      where: { createdAt: Between(lastMonthStart, lastMonthEnd) },
    });

    const recentProperties = await this.propertyRepo.find({
      take: 1,
      order: { updatedAt: 'DESC' },
      relations: ['owner'],
    });

    const recentUsers = await this.userRepo.find({
      take: 1,
      order: { updatedAt: 'DESC' },
    });

    const recentNews = await this.newsRepo.find({
      take: 1,
      order: { updatedAt: 'DESC' },
    });

    const activities: RecentActivity[] = [
      ...recentProperties.map((p) => {
        const isUpdated = p.updatedAt.getTime() > p.createdAt.getTime();
        return {
          type: 'property' as const,
          action: isUpdated ? ('update' as const) : ('create' as const),
          description: `${isUpdated ? 'Updated' : 'New'} Property: ${p.title}`,
          createdAt: isUpdated ? p.updatedAt : p.createdAt,
          createdBy: p.owner?.fullName || 'User',
        };
      }),
      ...recentUsers.map((u) => {
        const isUpdated = u.updatedAt.getTime() > u.createdAt.getTime();
        return {
          type: 'user' as const,
          action: isUpdated ? ('update' as const) : ('create' as const),
          description: `${isUpdated ? 'Updated' : 'New'} User: ${u.email}`,
          createdAt: isUpdated ? u.updatedAt : u.createdAt,
          createdBy: 'System',
        };
      }),
      ...recentNews.map((n) => {
        const isUpdated = n.updatedAt.getTime() > n.createdAt.getTime();
        return {
          type: 'news' as const,
          action: isUpdated ? ('update' as const) : ('create' as const),
          description: `${isUpdated ? 'Updated' : 'New'} News: ${n.title}`,
          createdAt: isUpdated ? n.updatedAt : n.createdAt,
          createdBy: 'User',
        };
      }),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    return {
      totalProperties,
      pendingProperties,
      totalUsers,
      approvedPropertiesThisMonth,
      propertyGrowthRate: this.calcGrowth(
        approvedPropertiesThisMonth,
        approvedPropertiesLastMonth,
      ),
      userGrowthRate: this.calcGrowth(usersThisMonth, usersLastMonth),
      recentActivities: activities,
    };
  }

  private calcGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }
}
