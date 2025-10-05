"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Input,
  Radio,
  Typography,
  Row,
  Col,
  Divider,
  Table,
  Space,
  Pagination,
  Select,
  Spin,
  message,
} from "antd";
import {
  DollarSign,
  Calendar,
  TrendingUp,
  FileText,
  Building,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRequest } from "ahooks";
import bankService from "@/share/service/bank.service";
import type { TermRate } from "@/share/service/bank.service";
import { getLangByLocale, getValidLocale } from "@/share/helper/locale.helper";
import { useUrlLocale } from "@/utils/locale";
import { numberToString } from "@/share/helper/number-to-string";
import { useCurrencyStore } from "@/share/store/currency.store";

const { Title, Text } = Typography;

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
  const t = useTranslations();
  const locale = useUrlLocale();
  const { currency } = useCurrencyStore();
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [selectedTermRate, setSelectedTermRate] = useState<TermRate | null>(
    null,
  );
  const [loanTerm, setLoanTerm] = useState<number>(12); // 12 months (1 year)
  const [calculationMethod, setCalculationMethod] = useState<
    "annuity" | "reducing"
  >("annuity");
  const [interestRateType] = useState<"yearly" | "monthly">("yearly");
  const [result, setResult] = useState<LoanResult | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  // Fetch banks data
  const { data: banksData, loading: banksLoading } = useRequest(
    async () => {
      const response = await bankService.getBanks({
        page: 1,
        perPage: 100,
        lang: getLangByLocale(getValidLocale(locale)),
      });
      return response.data ?? [];
    },
    {
      onError: (error) => {
        console.error("Error loading banks:", error);
        message.error(t("loanCalculator.cannotLoadBanks"));
      },
    },
  );

  const banks = banksData ?? [];

  // Get selected bank's term rates
  const selectedBankData = banks.find((bank) => bank.id === selectedBank);
  const availableTermRates = selectedBankData?.termRates ?? [];

  // Handle bank and term rate selection
  const handleBankChange = (bankId: string) => {
    setSelectedBank(bankId);
    setSelectedTermRate(null);
    const bank = banks.find((b) => b.id === bankId);
    if (bank && bank.termRates.length > 0) {
      setSelectedTermRate(bank.termRates[0] ?? null);
    }
  };

  const handleTermRateChange = (termRateIndex: number) => {
    if (availableTermRates[termRateIndex]) {
      setSelectedTermRate(availableTermRates[termRateIndex]);
    }
  };

  const calculateLoan = (): LoanResult => {
    if (!selectedTermRate) {
      return {
        monthlyPayment: 0,
        totalInterest: 0,
        totalPayment: 0,
        schedule: [],
      };
    }

    const monthlyRate =
      interestRateType === "yearly"
        ? selectedTermRate.interestRate / 100 / 12
        : selectedTermRate.interestRate / 100;
    const totalMonths = loanTerm;

    if (calculationMethod === "annuity") {
      // Equal Installment Payment (Gốc + lãi chia đều hàng tháng)
      const monthlyPayment =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
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
        monthlyPayment: schedule[0]?.totalPayment ?? 0,
        totalInterest,
        totalPayment: loanAmount + totalInterest,
        schedule,
      };
    }
  };

  useEffect(() => {
    if (loanAmount > 0 && selectedTermRate && loanTerm > 0) {
      const calculation = calculateLoan();
      setResult(calculation);
      return;
    }

    setResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loanAmount,
    selectedTermRate,
    loanTerm,
    calculationMethod,
    interestRateType,
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  // const handleExportSchedule = () => {
  //   if (!result) return;
  //
  //   const csvContent = [
  //     ['Tháng', 'Gốc trả', 'Lãi trả', 'Tổng trả', 'Dư nợ còn lại'],
  //     ...result.schedule.map(item => [
  //       item.month,
  //       formatCurrency(item.principalPayment),
  //       formatCurrency(item.interestPayment),
  //       formatCurrency(item.totalPayment),
  //       formatCurrency(item.remainingBalance),
  //     ])
  //   ].map(row => row.join(',')).join('\n');
  //
  //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  //   const link = document.createElement('a');
  //   const url = URL.createObjectURL(blob);
  //   link.setAttribute('href', url);
  //   link.setAttribute('download', 'loan_schedule.csv');
  //   link.style.visibility = 'hidden';
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const columns = [
    {
      title: t("loanCalculator.month"),
      dataIndex: "month",
      key: "month",
      width: 80,
    },
    {
      title: t("loanCalculator.principalPayment"),
      dataIndex: "principalPayment",
      key: "principalPayment",
      render: (value: number) => formatCurrency(value),
    },
    {
      title: t("loanCalculator.interestPayment"),
      dataIndex: "interestPayment",
      key: "interestPayment",
      render: (value: number) => formatCurrency(value),
    },
    {
      title: t("loanCalculator.totalPaymentColumn"),
      dataIndex: "totalPayment",
      key: "totalPayment",
      render: (value: number) => (
        <Text strong className="text-green-600">
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: t("loanCalculator.remainingBalance"),
      dataIndex: "remainingBalance",
      key: "remainingBalance",
      render: (value: number) => formatCurrency(value),
    },
  ];

  if (banksLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spin size="large" />
        <Text className="ml-3">{t("loanCalculator.loadingBanks")}</Text>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="shadow-lg">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div>
              <Title level={3} className="mb-0">
                {t("loanCalculator.title")}
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
                  {t("loanCalculator.loanAmount")}
                </Text>
                <Input
                  size="large"
                  value={loanAmount.toLocaleString("vi-VN")}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setLoanAmount(Number(value));
                  }}
                  suffix={currency}
                  placeholder={t("loanCalculator.enterLoanAmount")}
                  className="w-full"
                />

                <Text type="secondary" className="text-sm">
                  {numberToString(loanAmount, locale, currency)}
                </Text>
              </div>

              {/* Bank Selection */}
              <div>
                <Text strong className="mb-2 block">
                  <Building className="mr-1 inline h-4 w-4" />
                  {t("loanCalculator.selectBank")}
                </Text>
                <Select
                  size="large"
                  value={selectedBank}
                  onChange={handleBankChange}
                  placeholder={t("loanCalculator.chooseBankPlaceholder")}
                  className="w-full"
                  loading={banksLoading}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={banks.map((bank) => ({
                    value: bank.id,
                    label: bank.name,
                  }))}
                />
              </div>

              {/* Term Rate Selection */}
              {availableTermRates.length > 0 && (
                <div>
                  <Text strong className="mb-2 block">
                    <TrendingUp className="mr-1 inline h-4 w-4" />
                    {t("loanCalculator.selectTermRate")}
                  </Text>
                  <Select
                    size="large"
                    value={
                      selectedTermRate
                        ? availableTermRates.findIndex(
                            (rate) =>
                              rate.term === selectedTermRate.term &&
                              rate.interestRate ===
                                selectedTermRate.interestRate,
                          )
                        : undefined
                    }
                    onChange={handleTermRateChange}
                    placeholder={t("loanCalculator.chooseTermRatePlaceholder")}
                    className="w-full"
                    options={availableTermRates.map((rate, index) => ({
                      value: index,
                      label: `${rate.term}: ${rate.interestRate}%`,
                    }))}
                  />
                  {selectedTermRate && (
                    <div className="mt-2">
                      <Text type="secondary" className="text-sm">
                        {t("loanCalculator.selectedRate")}:{" "}
                        {selectedTermRate.interestRate}% (
                        {selectedTermRate.term})
                      </Text>
                    </div>
                  )}
                </div>
              )}

              {/* Loan Term */}
              <div>
                <Text strong className="mb-2 block">
                  <Calendar className="mr-1 inline h-4 w-4" />
                  {t("loanCalculator.loanTerm")}
                </Text>
                <Input
                  size="large"
                  value={loanTerm}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setLoanTerm(Math.min(Math.max(value, 1), 300));
                  }}
                  suffix={t("loanCalculator.months")}
                  placeholder={t("loanCalculator.enterLoanTerm")}
                  className="w-full"
                />
              </div>

              {/* Calculation Method */}
              <div>
                <Text strong className="mb-2 block">
                  <FileText className="mr-1 inline h-4 w-4" />
                  {t("loanCalculator.calculationMethod")}
                </Text>
                <Radio.Group
                  value={calculationMethod}
                  onChange={(e) =>
                    setCalculationMethod(
                      e.target.value as "annuity" | "reducing",
                    )
                  }
                  className="w-full"
                >
                  <Space direction="vertical" className="w-full">
                    <Radio value="annuity" className="w-full">
                      <div>
                        <Text strong>
                          {t("loanCalculator.equalInstallment")}
                        </Text>
                      </div>
                    </Radio>
                    <Radio value="reducing" className="w-full">
                      <div>
                        <Text strong>
                          {t("loanCalculator.reducingBalance")}
                        </Text>
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
                  {t("loanCalculator.calculationResults")}
                </Title>

                <Space direction="vertical" size="large" className="w-full">
                  {/* Số tiền trả tháng đầu */}
                  <div>
                    <Text className="mb-1 block text-sm">
                      {t("loanCalculator.firstMonthPayment")}
                    </Text>
                    <Text className="block text-3xl font-bold text-green-600">
                      {formatCurrency(result.monthlyPayment)}
                    </Text>
                  </div>

                  {/* Tổng lãi phải trả */}
                  <div>
                    <Text className="mb-1 block text-sm">
                      {t("loanCalculator.totalInterest")}
                    </Text>
                    <Text className="block text-2xl font-bold text-orange-600">
                      {formatCurrency(result.totalInterest)}
                    </Text>
                  </div>

                  {/* Tổng số tiền gốc và lãi phải trả */}
                  <div>
                    <Text className="mb-1 block text-sm">
                      {t("loanCalculator.totalPayment")}
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
              <Title level={4}>{t("loanCalculator.paymentSchedule")}</Title>
            </div>

            <div className="overflow-x-auto">
              <Table
                columns={columns}
                dataSource={result.schedule.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize,
                )}
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
                  `${range[0]}-${range[1]} ${t("loanCalculator.of")} ${total} ${t("loanCalculator.paymentSchedule")}`
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
