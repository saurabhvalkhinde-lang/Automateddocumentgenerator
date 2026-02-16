import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Check, X, Crown, Zap, Star } from 'lucide-react';

export function Pricing() {
  const { isAuthenticated, isPro, upgradeToPro } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isPro) {
      alert('You are already a Pro member!');
      return;
    }

    setIsProcessing(true);
    const success = await upgradeToPro(selectedPlan);
    setIsProcessing(false);

    if (success) {
      alert('Successfully upgraded to Pro! 🎉');
      navigate('/');
    }
  };

  const freeFeatures = [
    { text: 'All PDF types (Invoice, Certificate, Quotation, Bill)', included: true },
    { text: 'Unlimited PDF generation', included: true },
    { text: '3 templates per PDF type', included: true },
    { text: 'UPI QR code generation', included: true },
    { text: 'Basic GST calculation', included: true },
    { text: 'WhatsApp & Email sharing', included: true },
    { text: 'Watermark on PDFs', included: false },
    { text: 'Website ads enabled', included: false },
    { text: 'PDFDecor branding', included: false },
  ];

  const proFeatures = [
    { text: 'Everything in Free', included: true },
    { text: 'No watermark on PDFs', included: true },
    { text: 'No PDFDecor footer branding', included: true },
    { text: 'All 5 templates + premium designs', included: true },
    { text: 'Upload and save custom logo', included: true },
    { text: 'Custom footer text', included: true },
    { text: 'Save PDF history', included: true },
    { text: 'Auto-fill business details', included: true },
    { text: 'Custom invoice numbering', included: true },
    { text: 'Ad-free website experience', included: true },
    { text: 'Priority PDF generation', included: true },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start with our free plan or upgrade to Pro for professional business features
        </p>
      </div>

      {/* Plan Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 rounded-full p-1 inline-flex">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedPlan === 'monthly'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedPlan === 'yearly'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600'
            }`}
          >
            Yearly (Save 24%)
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-gray-900">₹0</span>
              <span className="text-gray-600">forever</span>
            </div>
            <p className="text-gray-600 mt-2">Perfect for trying out PDFDecor</p>
          </div>

          <ul className="space-y-4 mb-8">
            {freeFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                {feature.included ? (
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <span className={feature.included ? 'text-gray-700' : 'text-gray-500'}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>

          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full py-6 text-lg font-semibold"
          >
            Start Free
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-8 shadow-2xl relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
              <Star className="h-4 w-4" />
              MOST POPULAR
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Crown className="h-7 w-7 text-yellow-300" />
              Pro Plan
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold">
                ₹{selectedPlan === 'monthly' ? '99' : '899'}
              </span>
              <span className="text-blue-100">
                /{selectedPlan === 'monthly' ? 'month' : 'year'}
              </span>
            </div>
            {selectedPlan === 'yearly' && (
              <p className="text-green-300 font-semibold mt-2">
                Save ₹289 per year!
              </p>
            )}
            <p className="text-blue-100 mt-2">For professional businesses</p>
          </div>

          <ul className="space-y-4 mb-8">
            {proFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="text-white font-medium">{feature.text}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={handleUpgrade}
            disabled={isProcessing || isPro}
            className="w-full py-6 text-lg font-bold bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
          >
            {isProcessing ? (
              'Processing...'
            ) : isPro ? (
              'Current Plan'
            ) : isAuthenticated ? (
              <>
                <Crown className="mr-2 h-5 w-5" />
                Upgrade to Pro
              </>
            ) : (
              'Login to Upgrade'
            )}
          </Button>

          {!isAuthenticated && (
            <p className="text-center text-blue-100 text-sm mt-4">
              Need an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-white font-semibold underline"
              >
                Sign up here
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Why Upgrade Section */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-10 mb-16 border border-blue-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
          <Zap className="h-8 w-8 text-blue-600" />
          Why Businesses Choose Pro
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Professional Branding
            </h3>
            <p className="text-gray-600">
              Remove watermarks and add your logo. Present your business professionally.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Save Time
            </h3>
            <p className="text-gray-600">
              Auto-fill business details and access PDF history. Work smarter, not harder.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Premium Experience
            </h3>
            <p className="text-gray-600">
              No ads, more templates, and priority support. Business-ready features.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">
              Can I try Pro before paying?
            </h3>
            <p className="text-gray-600">
              Start with our Free plan to try PDFDecor. Upgrade to Pro anytime when you're ready for professional features.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">
              Can I cancel my subscription?
            </h3>
            <p className="text-gray-600">
              Yes! Cancel anytime. Your Pro features will remain active until the end of your billing period.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">
              Is my payment information secure?
            </h3>
            <p className="text-gray-600">
              Absolutely. We use Razorpay for secure payment processing. We never store your card details.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">
              What happens if my subscription expires?
            </h3>
            <p className="text-gray-600">
              Your account automatically downgrades to Free plan. Your saved data is preserved for 90 days.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-10 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Make Professional PDFs?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of businesses using PDFDecor
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-bold"
          >
            Start Free
          </Button>
          <Button
            onClick={handleUpgrade}
            className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-8 py-6 text-lg font-bold"
          >
            <Crown className="mr-2 h-5 w-5" />
            Upgrade to Pro
          </Button>
        </div>
      </div>
    </div>
  );
}
