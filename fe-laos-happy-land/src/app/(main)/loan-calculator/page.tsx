"use client";

import { Card, Typography, Row, Col } from "antd";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";
import LoanCalculator from "@/components/business/loan-calculator/loan-calculator";

const { Title, Text } = Typography;

export default function LoanCalculatorPage() {
  return (
    <div className="container mx-auto my-8 px-4">
      {/* Header Section */}
      {/* <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <Calculator className="h-8 w-8 text-white" />
          </div>
        </div>
        <Title level={1} className="mb-4">
            Công cụ tính khoản vay
        </Title>
        <Text className="text-lg text-gray-600 max-w-2xl mx-auto block">
          Tính toán chi tiết khoản vay, lãi suất và lịch trả nợ để lập kế hoạch tài chính 
          cho việc mua nhà đất một cách thông minh và hiệu quả.
        </Text>
      </div> */}

      
      {/* Loan Calculator Component */}
      <LoanCalculator />
    </div>
  );
}
