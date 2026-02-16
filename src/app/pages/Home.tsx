import { Link } from 'react-router';
import { FileText, Award, Receipt, FileSpreadsheet, Sparkles, Check, Zap, Download, Shield } from 'lucide-react';

export function Home() {
  const features = [
    {
      icon: FileText,
      title: 'Invoices',
      description: 'Create professional GST invoices with UPI QR codes',
      path: '/invoice',
      color: 'bg-blue-500',
    },
    {
      icon: Award,
      title: 'Certificates',
      description: 'Design beautiful certificates for any occasion',
      path: '/certificate',
      color: 'bg-purple-500',
    },
    {
      icon: FileSpreadsheet,
      title: 'Quotations',
      description: 'Generate detailed quotations for your clients',
      path: '/quotation',
      color: 'bg-green-500',
    },
    {
      icon: Receipt,
      title: 'Bills & Receipts',
      description: 'Create itemized bills and receipts instantly',
      path: '/bill',
      color: 'bg-orange-500',
    },
  ];

  const benefits = [
    '5 Professional Templates per Document Type',
    'UPI QR Code Generation for Invoices',
    'GST-Compliant Invoice Format',
    'No Login Required (Free Version)',
    'Instant PDF Download',
    'WhatsApp & Email Sharing',
    'Mobile & Desktop Friendly',
    'Business-Ready Documents',
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Sparkles className="h-12 w-12 text-blue-600" />
          <h1 className="text-6xl font-bold text-gray-900">PDFDecor</h1>
        </div>
        <h2 className="text-2xl md:text-3xl text-gray-800 mb-4 font-semibold">
          Create Professional PDFs Instantly
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-3 max-w-3xl mx-auto">
          Free online PDF generator for invoices, certificates, quotations, and bills.
          Simple, reliable, business-ready.
        </p>
        <p className="text-base text-gray-500 max-w-2xl mx-auto">
          Perfect for small businesses, freelancers, shopkeepers, and MSMEs across India.
          No registration needed to get started!
        </p>
      </div>

      {/* Document Types Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Choose Your Document Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className="group bg-white rounded-xl border-2 border-gray-200 p-8 hover:shadow-xl transition-all hover:border-blue-400 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className={`${feature.color} p-4 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-lg">{feature.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-10 border-2 border-blue-100 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Enter Details</h3>
            <p className="text-gray-600">
              Fill in your business and client information using our intuitive forms
            </p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Template</h3>
            <p className="text-gray-600">
              Select from 5 professionally designed templates for each document type
            </p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Download & Share</h3>
            <p className="text-gray-600">
              Get your PDF instantly and share via WhatsApp or email
            </p>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-10 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose PDFDecor?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-1.5 flex-shrink-0">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-gray-700 text-lg">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-8 text-center">
          <Zap className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
          <p className="text-blue-100">Generate your PDFs in seconds with our optimized system</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-8 text-center">
          <Download className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">Easy Download</h3>
          <p className="text-purple-100">One-click download to your device, no complications</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">100% Free</h3>
          <p className="text-green-100">Start creating professional documents at no cost</p>
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-gray-50 rounded-2xl p-10 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About PDFDecor</h2>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
          <p>
            PDFDecor is India's leading free online PDF generation platform designed specifically for small
            businesses, freelancers, shopkeepers, and MSMEs. Our mission is to simplify document creation
            and help businesses maintain professional standards without complex software or expensive subscriptions.
          </p>
          <p>
            Whether you need to create GST-compliant invoices with UPI payment QR codes, generate professional
            certificates for your employees or students, prepare detailed quotations for potential clients, or
            create quick bills and receipts - PDFDecor has you covered with beautiful, print-ready templates.
          </p>
          <p>
            Our platform is built with Indian businesses in mind, supporting GST numbers, Indian currency (₹),
            UPI payment integration, and mobile-first design that works seamlessly on all devices. No login
            required for basic features, making it incredibly simple to get started within seconds.
          </p>
        </div>
      </div>
    </div>
  );
}