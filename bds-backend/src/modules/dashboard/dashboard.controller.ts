import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get()
    @ApiOperation({ summary: 'Get Dashboard'})
    @ApiResponse({ status: 200, description: 'Success' })
    async getDashboard() {
        return this.dashboardService.getDashboard();
    }
}
