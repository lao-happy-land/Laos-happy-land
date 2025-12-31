import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Eye,
  FileText,
  Lock,
  Mail,
  Phone,
  Shield,
  Users,
} from "lucide-react";

export default function PrivacyPolicyPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 text-white">
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
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-5xl font-bold text-transparent">
              Privacy Policy
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-blue-100">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you use our services.
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
                  GDPR Compliant
                </span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Shield className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium">
                  Secure Data
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
                    We are committed to protecting your privacy and ensuring the security of your personal information. This policy outlines our practices regarding data collection, usage, and protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-12">
              {/* Information We Collect */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                    <Database className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Information We Collect
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-800">
                      Personal Information
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Name, email address, and phone number</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Property preferences and search history</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Payment information (processed securely)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Profile information and preferences</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-800">
                      Automatically Collected Information
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>IP address and browser information</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Website usage patterns and analytics</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Device information and operating system</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Cookies and similar tracking technologies</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use Information */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    How We Use Your Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    {
                      title: "Property Matching",
                      description: "To match you with relevant properties based on your preferences and requirements.",
                      icon: "🏠",
                    },
                    {
                      title: "Communication",
                      description: "To respond to your inquiries and provide customer support.",
                      icon: "📞",
                    },
                    {
                      title: "Service Improvement",
                      description: "To analyze usage patterns and improve our platform's functionality.",
                      icon: "📧",
                    },
                    {
                      title: "Legal Compliance",
                      description: "To comply with legal obligations and protect against fraud.",
                      icon: "🔒",
                    },
                  ].map((purpose, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30 p-6"
                    >
                      <div className="mb-3 flex items-center space-x-3">
                        <span className="text-2xl">{purpose.icon}</span>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {purpose.title}
                        </h3>
                      </div>
                      <p className="text-gray-600">{purpose.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Sharing */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Data Sharing & Disclosure
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-red-500" />
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-red-800">
                          We Do Not Sell Your Data
                        </h3>
                        <p className="text-red-700">
                          We never sell, rent, or trade your personal information to third parties for marketing purposes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      When We May Share Information
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>To comply with legal requirements</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>With your explicit consent</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>To protect our rights and prevent fraud</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>With trusted service providers (under strict agreements)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Security */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Data Security
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    {
                      title: "Data Security",
                      description: "All data is encrypted in transit and at rest using industry-standard protocols.",
                      color: "from-blue-500 to-cyan-600",
                    },
                    {
                      title: "Access Controls",
                      description: "Strict access controls and authentication measures protect your data.",
                      color: "from-green-500 to-emerald-600",
                    },
                    {
                      title: "Regular Audits",
                      description: "Regular security audits and vulnerability assessments ensure protection.",
                      color: "from-purple-500 to-pink-600",
                    },
                    {
                      title: "Secure Infrastructure",
                      description: "Our infrastructure is designed with security as a top priority.",
                      color: "from-orange-500 to-red-600",
                    },
                  ].map((measure, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30 p-6"
                    >
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${measure.color} mb-4`}
                      ></div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-800">
                        {measure.title}
                      </h3>
                      <p className="text-gray-600">{measure.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Rights */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Your Rights
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: "Right to Access",
                      description: "You can request access to the personal information we hold about you.",
                      icon: "👁️",
                    },
                    {
                      title: "Right to Rectification",
                      description: "You can request correction of inaccurate or incomplete information.",
                      icon: "✏️",
                    },
                    {
                      title: "Right to Erasure",
                      description: "You can request deletion of your personal information under certain circumstances.",
                      icon: "🗑️",
                    },
                    {
                      title: "Right to Portability",
                      description: "You can request a copy of your data in a portable format.",
                      icon: "📤",
                    },
                    {
                      title: "Right to Object",
                      description: "You can object to certain processing of your personal information.",
                      icon: "🚫",
                    },
                    {
                      title: "Right to Complain",
                      description: "You have the right to lodge a complaint with supervisory authorities.",
                      icon: "📞",
                    },
                  ].map((right, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30 p-4"
                    >
                      <span className="text-2xl">{right.icon}</span>
                      <div>
                        <h3 className="mb-1 text-lg font-semibold text-gray-800">
                          {right.title}
                        </h3>
                        <p className="text-gray-600">{right.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
                <div className="mb-8 text-center">
                  <h2 className="mb-4 text-3xl font-bold">
                    Contact Us
                  </h2>
                  <p className="text-xl text-blue-100">
                  Ready to start your real estate journey? We&apos;d love to hear from you and help you achieve your property goals.
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
                    <p className="text-blue-100">privacy@laohappyland.com</p>
                    <p className="mt-1 text-sm text-blue-200">
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
                    <p className="text-blue-100">+856 20 1234 5678</p>
                    <p className="mt-1 text-sm text-blue-200">
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
                    Last Updated
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
