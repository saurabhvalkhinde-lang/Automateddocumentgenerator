import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Crown, Save, User, Building2, Upload, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Profile() {
  const { user, isPro, isAuthenticated, updateBusinessProfile } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [profile, setProfile] = useState(user?.businessProfile || {});

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="mb-4">Login Required</h1>
        <p className="text-gray-600 mb-8">Please login to access your profile</p>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="mb-4">Pro Feature</h1>
        <p className="text-gray-600 mb-8">
          Business Profile is a Pro-only feature. Upgrade to save your business details and auto-fill all PDF types.
        </p>
        <Button onClick={() => navigate('/pricing')}>
          <Crown className="mr-2 h-4 w-4" />
          Upgrade to Pro
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage('');
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save
    
    updateBusinessProfile(profile);
    
    setSuccessMessage('Business profile saved successfully!');
    setSaving(false);
    
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <User className="h-8 w-8 text-blue-600" />
          <h1>Business Profile</h1>
        </div>
        <p className="text-gray-600">
          Your business details are automatically filled in all PDF types (Invoice, Certificate, Quotation, Bill, etc.)
        </p>
        <div className="mt-3 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <Crown className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-900">Pro Feature Active</span>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      <div className="space-y-6">
        {/* Company Logo */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Logo
          </h3>
          <div className="flex items-center gap-4">
            {profile.logo ? (
              <div className="relative">
                <img
                  src={profile.logo}
                  alt="Company Logo"
                  className="w-32 h-32 object-contain border-2 border-gray-200 rounded-lg"
                />
                <button
                  onClick={() => setProfile({ ...profile, logo: undefined })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <Label htmlFor="logo" className="cursor-pointer">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-block">
                  Upload Logo
                </div>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </Label>
              <p className="text-xs text-gray-500 mt-2">
                Recommended: Square image, max 2MB
              </p>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold mb-4">Company Information</h3>
          
          <div>
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={profile.companyName || ''}
              onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              placeholder="Your Company Name"
            />
          </div>

          <div>
            <Label htmlFor="companyAddress">Address *</Label>
            <Textarea
              id="companyAddress"
              value={profile.companyAddress || ''}
              onChange={(e) => setProfile({ ...profile, companyAddress: e.target.value })}
              placeholder="123 Business St, City, State, PIN Code"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyPhone">Phone *</Label>
              <Input
                id="companyPhone"
                value={profile.companyPhone || ''}
                onChange={(e) => setProfile({ ...profile, companyPhone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <Label htmlFor="companyEmail">Email *</Label>
              <Input
                id="companyEmail"
                type="email"
                value={profile.companyEmail || ''}
                onChange={(e) => setProfile({ ...profile, companyEmail: e.target.value })}
                placeholder="contact@company.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyGST">GST Number (Optional)</Label>
              <Input
                id="companyGST"
                value={profile.companyGST || ''}
                onChange={(e) => setProfile({ ...profile, companyGST: e.target.value })}
                placeholder="22AAAAA0000A1Z5"
              />
            </div>
            <div>
              <Label htmlFor="upiId">UPI ID (Optional)</Label>
              <Input
                id="upiId"
                value={profile.upiId || ''}
                onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                placeholder="yourname@upi"
              />
              <p className="text-xs text-gray-500 mt-1">Used for QR codes in invoices</p>
            </div>
          </div>
        </div>

        {/* Default Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold mb-4">Default Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
              <Input
                id="invoicePrefix"
                value={profile.invoicePrefix || ''}
                onChange={(e) => setProfile({ ...profile, invoicePrefix: e.target.value })}
                placeholder="INV-"
              />
            </div>
            <div>
              <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
              <Input
                id="defaultTaxRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={profile.defaultTaxRate || 18}
                onChange={(e) => setProfile({ ...profile, defaultTaxRate: parseFloat(e.target.value) })}
                placeholder="18"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customFooter">Custom Footer Text (Pro)</Label>
            <Textarea
              id="customFooter"
              value={profile.customFooter || ''}
              onChange={(e) => setProfile({ ...profile, customFooter: e.target.value })}
              placeholder="Add your custom footer text here..."
              rows={2}
            />
            <p className="text-xs text-gray-500 mt-1">
              This will replace the default PDFDecor footer in your PDFs
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Business Profile'}
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Auto-Fill Benefits</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ All PDF types automatically use your saved details</li>
            <li>✓ Your logo appears on all documents</li>
            <li>✓ Save time on every invoice, certificate, quotation, and bill</li>
            <li>✓ Maintain consistent branding across all documents</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
