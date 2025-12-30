import {
  AlertTriangle,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Mail,
  Phone,
  Scale,
  Shield,
  Users,
} from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-teal-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 shadow-2xl ring-2 ring-white/20 backdrop-blur-sm">
                <Scale className="h-10 w-10 text-white" />
              </div>
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-5xl font-bold text-transparent">
              Terms of Service
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-blue-100">
              Please read these terms carefully before using our services. By accessing or using our platform, you agree to be bound by these terms and conditions.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Clock className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium">
                  Last Updated
                </span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium">
                  Legally Binding
                </span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Shield className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium">
                  Protects Rights
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-blue-50/30 p-8 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="mb-3 text-2xl font-bold text-gray-900">
                    Quick Overview
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-600">
                    These terms govern your use of our real estate platform and services. They outline your rights and responsibilities as a user.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-12">
              {/* Acceptance of Terms */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Acceptance of Terms
                  </h2>
                </div>

                <div className="space-y-6">
                  <p className="text-lg leading-relaxed text-gray-600">
                    By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                  </p>

                  <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-blue-500" />
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-blue-800">
                          Important Notice
                        </h3>
                        <p className="text-blue-700">
                          If you do not agree to these terms, please do not use our services. Your continued use of the platform constitutes acceptance of these terms.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Accounts */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    User Accounts
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-800">
                      Account Creation
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>You must be at least 18 years old to create an account</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Provide accurate and complete information during registration</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Maintain the security of your account credentials</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Notify us immediately of any unauthorized access</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-800">
                      Account Responsibilities
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>You are responsible for all activities under your account</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Keep your contact information up to date</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Use the platform in compliance with applicable laws</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Respect other users and their property rights</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Service Usage */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Service Usage
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    {
                      title: "Permitted Uses",
                      description: "Browse properties, create listings, contact brokers, and use legitimate platform features.",
                      icon: "✅",
                    },
                    {
                      title: "Prohibited Uses",
                      description: "No illegal activities, spam, harassment, or violation of others' rights.",
                      icon: "❌",
                    },
                    {
                      title: "Property Listings",
                      description: "Listings must be accurate, lawful, and comply with our content guidelines.",
                      icon: "🏠",
                    },
                    {
                      title: "Content Ownership",
                      description: "You retain ownership of your content while granting us usage rights.",
                      icon: "📝",
                    },
                  ].map((usage, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30 p-6"
                    >
                      <div className="mb-3 flex items-center space-x-3">
                        <span className="text-2xl">{usage.icon}</span>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {usage.title}
                        </h3>
                      </div>
                      <p className="text-gray-600">{usage.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Terms */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Payment Terms
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: "Payment Methods",
                      description: "We accept various payment methods including credit cards and bank transfers.",
                      icon: "💳",
                    },
                    {
                      title: "Refund Policy",
                      description: "Refunds are processed according to our refund policy and applicable laws.",
                      icon: "💰",
                    },
                    {
                      title: "Pricing",
                      description: "Our pricing is transparent and clearly displayed before any charges.",
                      icon: "💵",
                    },
                    {
                      title: "Billing",
                      description: "Billing occurs according to the service plan you select.",
                      icon: "📄",
                    },
                  ].map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30 p-4"
                    >
                      <span className="text-2xl">{payment.icon}</span>
                      <div>
                        <h3 className="mb-1 text-lg font-semibold text-gray-800">
                          {payment.title}
                        </h3>
                        <p className="text-gray-600">{payment.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Liability and Disclaimers */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Liability & Disclaimers
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-red-500" />
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-red-800">
                          Service Provided As-Is
                        </h3>
                        <p className="text-red-700">
                          Our services are provided on an &apos;as-is&apos; basis without warranties of any kind.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Limitation of Liability
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>We are not liable for indirect or consequential damages</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Our total liability is limited to the amount you paid for services</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>We disclaim warranties regarding service availability</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Property information is provided by third parties</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Termination */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-500 to-slate-600 text-white shadow-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Termination
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-800">
                      Termination Rights
                    </h3>
                    <p className="text-lg leading-relaxed text-gray-600">
                      Either party may terminate the agreement at any time with appropriate notice.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
                      <h4 className="mb-3 text-lg font-semibold text-gray-800">
                        User Termination
                      </h4>
                      <p className="text-gray-600">
                        Users may delete their account and stop using our services at any time.
                      </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
                      <h4 className="mb-3 text-lg font-semibold text-gray-800">
                        Company Termination
                      </h4>
                      <p className="text-gray-600">
                        We may suspend or terminate accounts that violate these terms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-2xl bg-gradient-to-br from-green-600 to-teal-700 p-8 text-white">
                <div className="mb-8 text-center">
                  <h2 className="mb-4 text-3xl font-bold">
                    Contact Us
                  </h2>
                  <p className="text-xl text-green-100">
                    If you have any questions about these Terms of Service, please contact our legal team.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Email Us
                    </h3>
                    <p className="text-green-100">legal@laohappyland.com</p>
                    <p className="mt-1 text-sm text-green-200">
                      We respond within 48 hours
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                      <Phone className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Call Us
                    </h3>
                    <p className="text-green-100">+856 205 872 1100</p>
                    <p className="mt-1 text-sm text-green-200">
                      Mon-Fri, 8AM-6PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="rounded-2xl border border-gray-200 bg-gray-100 p-6">
                <div className="text-center">
                  <p className="mb-2 text-gray-600">
                    <strong>Last Updated:</strong>{" "}
                    January 2024
                  </p>
                  <p className="text-sm text-gray-500">
                    We may update these terms from time to time. We will notify you of any significant changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}