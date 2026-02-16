import { X, Check, Zap, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: string;
}

export function UpgradeModal({ isOpen, onClose, trigger }: UpgradeModalProps) {
  const { isPro, isAuthenticated, upgradeToPro } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      // Redirect to login/signup
      navigate('/login');
      onClose();
      return;
    }

    setIsProcessing(true);
    
    // Simulate Razorpay payment flow
    // In production, this would:
    // 1. Create Razorpay order via backend
    // 2. Open Razorpay checkout
    // 3. Handle payment callback
    // 4. Update subscription in backend
    
    const success = await upgradeToPro(selectedPlan);
    
    setIsProcessing(false);
    
    if (success) {
      alert('Successfully upgraded to Pro! 🎉');
      onClose();
      window.location.reload(); // Refresh to apply Pro features
    } else {
      alert('Upgrade failed. Please try again.');
    }
  };

  const triggerMessages: Record<string, string> = {
    template: 'Unlock all premium templates',
    watermark: 'Remove watermark from your PDFs',
    history: 'Save and access your PDF history',
    autofill: 'Save time with auto-fill business details',
    ads: 'Enjoy an ad-free experience',
  };

  const freeLimitations = [
    'Watermark on all PDFs',
    'Only 3 templates per type',
    'Website ads enabled',
    'No PDF history',
    'No auto-fill',
    'PDFDecor branding',
  ];

  const proFeatures = [
    'No watermark on PDFs',
    'All 5 templates + premium',
    'Ad-free experience',
    'Save PDF history',
    'Auto-fill business details',
    'Upload custom logo',
    'Custom footer text',
    'Priority PDF generation',
    'Professional branding',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              Upgrade to Pro
            </h2>
            {trigger && (
              <p className="text-gray-600 mt-2">{triggerMessages[trigger]}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Plan Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Choose Your Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedPlan === 'monthly'
                    ? 'border-blue-600 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl font-bold text-gray-900">₹99</div>
                <div className="text-gray-600">per month</div>
                <div className="mt-2 text-sm text-gray-500">Cancel anytime</div>
              </button>

              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`p-6 rounded-xl border-2 transition-all relative ${
                  selectedPlan === 'yearly'
                    ? 'border-blue-600 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    BEST VALUE
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">₹899</div>
                <div className="text-gray-600">per year</div>
                <div className="mt-2 text-sm text-green-600 font-semibold">
                  Save ₹289 (24%)
                </div>
              </button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Free Plan */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Free Plan
              </h4>
              <ul className="space-y-3">
                {freeLimitations.map((limitation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-300">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Pro Plan
              </h4>
              <ul className="space-y-3">
                {proFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm font-medium">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6" />
              Why Upgrade to Pro?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold mb-1">Professional Branding</div>
                <div className="text-blue-100 text-sm">
                  Remove watermarks and add your logo for a professional look
                </div>
              </div>
              <div>
                <div className="font-semibold mb-1">Save Time</div>
                <div className="text-blue-100 text-sm">
                  Auto-fill business details and reuse saved information
                </div>
              </div>
              <div>
                <div className="font-semibold mb-1">Ad-Free Experience</div>
                <div className="text-blue-100 text-sm">
                  Clean interface without any advertisements
                </div>
              </div>
              <div>
                <div className="font-semibold mb-1">More Templates</div>
                <div className="text-blue-100 text-sm">
                  Access all templates and exclusive premium designs
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="flex-1 py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isProcessing ? (
                'Processing...'
              ) : isAuthenticated ? (
                <>
                  <Crown className="mr-2 h-5 w-5" />
                  Upgrade to Pro - ₹{selectedPlan === 'monthly' ? '99' : '899'}
                </>
              ) : (
                'Login to Upgrade'
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="py-6 text-lg font-semibold"
            >
              Continue with Free
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            💳 Secure payment via Razorpay • Cancel anytime • No hidden fees
          </p>
        </div>
      </div>
    </div>
  );
}
