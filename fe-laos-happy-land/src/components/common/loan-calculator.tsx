"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Input,
  Select,
  Slider,
  Radio,
  Typography,
  Row,
  Col,
  Divider,
  Table,
  Space,
  Button,
  message,
  Pagination,
} from "antd";
import {
  Calculator,
  DollarSign,
  Calendar,
  TrendingUp,
  FileText,
  Download,
} from "lucide-react";

const { Title, Text } = Typography;
const { Option } = Select;

interface LoanCalculation {
  month: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingBalance: number;
}

interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  schedule: LoanCalculation[];
}

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [loanTerm, setLoanTerm] = useState<number>(120); // 120 months (10 years)
  const [calculationMethod, setCalculationMethod] = useState<"annuity" | "reducing">("annuity");
  const [interestRateType, setInterestRateType] = useState<"yearly" | "monthly">("yearly");
  const [result, setResult] = useState<LoanResult | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(1);


  const calculateLoan = (): LoanResult => {
    const monthlyRate = interestRateType === "yearly" ? interestRate / 100 / 12 : interestRate / 100;
    const totalMonths = loanTerm;
    
    if (calculationMethod === "annuity") {
      // Equal Installment Payment (Gốc + lãi chia đều hàng tháng)
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                            (Math.pow(1 + monthlyRate, totalMonths) - 1);
      
      const schedule: LoanCalculation[] = [];
      let remainingBalance = loanAmount;
      
      for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        
        schedule.push({
          month,
          principalPayment,
          interestPayment,
          totalPayment: monthlyPayment,
          remainingBalance: Math.max(0, remainingBalance),
        });
      }
      
      return {
        monthlyPayment,
        totalInterest: monthlyPayment * totalMonths - loanAmount,
        totalPayment: monthlyPayment * totalMonths,
        schedule,
      };
    } else {
      // Equal Principal Payment (Gốc cố định, lãi giảm dần)
      const principalPayment = loanAmount / totalMonths;
      const schedule: LoanCalculation[] = [];
      let remainingBalance = loanAmount;
      let totalInterest = 0;
      
      for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const totalPayment = principalPayment + interestPayment;
        remainingBalance -= principalPayment;
        totalInterest += interestPayment;
        
        schedule.push({
          month,
          principalPayment,
          interestPayment,
          totalPayment,
          remainingBalance: Math.max(0, remainingBalance),
        });
      }
      
      return {
        monthlyPayment: schedule[0]?.totalPayment || 0,
        totalInterest,
        totalPayment: loanAmount + totalInterest,
        schedule,
      };
    }
  };

  useEffect(() => {
    if (loanAmount > 0 && interestRate > 0 && loanTerm > 0) {
      const calculation = calculateLoan();
      setResult(calculation);
      return
    }

    setResult(null);
  }, [loanAmount, interestRate, loanTerm, calculationMethod, interestRateType]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const handleExportSchedule = () => {
    if (!result) return;
    
    const csvContent = [
      ['Tháng', 'Gốc trả', 'Lãi trả', 'Tổng trả', 'Dư nợ còn lại'],
      ...result.schedule.map(item => [
        item.month,
        formatCurrency(item.principalPayment),
        formatCurrency(item.interestPayment),
        formatCurrency(item.totalPayment),
        formatCurrency(item.remainingBalance),
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'loan_schedule.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success('Đã xuất lịch trả nợ thành công!');
  };

  const columns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
      width: 80,
    },
    {
      title: 'Gốc trả',
      dataIndex: 'principalPayment',
      key: 'principalPayment',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Lãi trả',
      dataIndex: 'interestPayment',
      key: 'interestPayment',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Tổng trả',
      dataIndex: 'totalPayment',
      key: 'totalPayment',
      render: (value: number) => (
        <Text strong className="text-green-600">
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: 'Dư nợ còn lại',
      dataIndex: 'remainingBalance',
      key: 'remainingBalance',
      render: (value: number) => formatCurrency(value),
    },
  ];

  return (
    <div className="w-full">
      <Card className="shadow-lg">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-center gap-3">
           <div>
              <Title level={3} className="mb-0">
                Công cụ tính khoản vay
              </Title>
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* Input Section */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large" className="w-full">
              {/* Loan Amount */}
              <div>
                <Text strong className="mb-2 block">
                  <DollarSign className="mr-1 inline h-4 w-4" />
                  Số tiền vay
                </Text>
                <Input
                  size="large"
                  value={loanAmount.toLocaleString("vi-VN")}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setLoanAmount(Number(value));
                  }}
                  suffix="VNĐ" //  TODO: consider mutlple currency
                  placeholder="Nhập số tiền vay"
                  className="w-full"
                />

                {/* TODO: numberToString function is not working correctly, ex: 1.235.020.000 => 1 tỷ */}
                {/* <Text type="secondary" className="text-sm">
                  {numberToString(loanAmount)}
                </Text> */}
              </div>

              {/* Interest Rate */}
              <div>
                <Text strong className="mb-2 block">
                  <TrendingUp className="mr-1 inline h-4 w-4" />
                  Lãi suất
                </Text>
                <Row gutter={12}>
                  <Col span={12}>
                    <Input
                      size="large"
                      value={interestRate}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setInterestRate(value);
                      }}
                      suffix="%"
                      placeholder="Nhập lãi suất"
                      className="w-full"
                    />
                  </Col>
                  <Col span={12}>
                    <Radio.Group
                      value={interestRateType}
                      onChange={(e) => setInterestRateType(e.target.value)}
                      className="w-full"
                    >
                      <Radio value="yearly">Năm</Radio>
                      <Radio value="monthly">Tháng</Radio>
                    </Radio.Group>
                  </Col>
                </Row>
              </div>

              {/* Loan Term */}
              <div>
                <Text strong className="mb-2 block">
                  <Calendar className="mr-1 inline h-4 w-4" />
                  Thời gian vay
                </Text>
                <Input
                  size="large"
                  value={loanTerm}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setLoanTerm(Math.min(Math.max(value, 1), 300));
                  }}
                  suffix="tháng"
                  placeholder="Nhập thời gian vay (1-300 tháng)"
                  className="w-full"
                />
              </div>

              {/* Calculation Method */}
              <div>
                <Text strong className="mb-2 block">
                  <FileText className="mr-1 inline h-4 w-4" />
                  Phương pháp tính
                </Text>
                <Radio.Group
                  value={calculationMethod}
                  onChange={(e) => setCalculationMethod(e.target.value)}
                  className="w-full"
                >
                  <Space direction="vertical" className="w-full">
                    <Radio value="annuity" className="w-full">
                      <div>
                        <Text strong>Gốc + lãi chia đều hàng tháng</Text>
                      </div>
                    </Radio>
                    <Radio value="reducing" className="w-full">
                      <div>
                        <Text strong>Gốc cố định, lãi giảm dần</Text>
                      </div>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
            </Space>
          </Col>

          {/* Result Section */}
          <Col xs={24} lg={12}>
            {result && (
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
                <Title level={4} className="mb-4">
                  Kết quả tính toán
                </Title>

                <Space direction="vertical" size="large" className="w-full">
                  {/* Số tiền trả tháng đầu */}
                  <div>
                    <Text className="block text-sm mb-1">
                      Số tiền trả tháng đầu
                    </Text>
                    <Text className="block text-3xl font-bold text-green-600">
                      {formatCurrency(result.monthlyPayment)}
                    </Text>
                  </div>

                  {/* Tổng lãi phải trả */}
                  <div>
                    <Text className="block text-sm mb-1">
                      Tổng lãi phải trả
                    </Text>
                    <Text className="block text-2xl font-bold text-orange-600">
                      {formatCurrency(result.totalInterest)}
                    </Text>
                  </div>

                  {/* Tổng số tiền gốc và lãi phải trả */}
                  <div>
                    <Text className="block text-sm mb-1">
                      Tổng số tiền gốc và lãi phải trả
                    </Text>
                    <Text className="block text-2xl font-bold text-red-600">
                      {formatCurrency(result.totalPayment)}
                    </Text>
                  </div>

                    {/* TODO: Do not need this feature for now */}
                  {/* <div className="text-center">
                    <Button
                      type="primary"
                      icon={<Download className="h-4 w-4" />}
                      onClick={handleExportSchedule}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Xuất lịch trả nợ
                    </Button>
                  </div> */}
                </Space>
              </Card>
            )}
          </Col>
        </Row>

        {/* Payment Schedule Table */}
        {result && (
          <>
            <Divider />
            <div className="mb-4">
              <Title level={4}>Kỳ hạn thanh toán</Title>
            </div>

            <div className="overflow-x-auto">
              <Table
                columns={columns}
                dataSource={result.schedule.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                pagination={false}
                size="small"
                className="mb-4"
                scroll={{ x: 600 }}
              />
            </div>

            <div className="flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={result.schedule.length}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size || 12);
                }}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} của ${total} kỳ hạn`
                }
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default LoanCalculator;
