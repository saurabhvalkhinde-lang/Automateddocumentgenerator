import { useState } from 'react';
import { Download, Eye, Share2, MessageCircle, Mail, Lock, Crown } from 'lucide-react';
import {
  InvoiceData,
  InvoiceTemplate1,
  InvoiceTemplate2,
  InvoiceTemplate3,
  InvoiceTemplate4,
  InvoiceTemplate5,
} from '../components/templates/InvoiceTemplates';
import { generatePDF, shareViaWhatsApp, shareViaEmail } from '../utils/pdfGenerator';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import { UpgradeModal } from '../components/UpgradeModal';
import { AdBanner } from '../components/AdBanner';

export function Invoice() {
  const { isPro, user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [showPreview, setShowPreview] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState<string>('');
  
  // Auto-fill from Business Profile for Pro users
  const businessProfile = user?.businessProfile || {};
  
  const [formData, setFormData] = useState<InvoiceData>({
    invoiceNumber: businessProfile.invoicePrefix ? `${businessProfile.invoicePrefix}001` : 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyName: businessProfile.companyName || 'Your Company Name',
    companyAddress: businessProfile.companyAddress || '123 Business St, City, State 12345',
    companyPhone: businessProfile.companyPhone || '+91 98765 43210',
    companyEmail: businessProfile.companyEmail || 'contact@yourcompany.com',
    companyGST: businessProfile.companyGST || '',
    clientName: 'Client Name',
    clientAddress: '456 Client Ave, City, State 67890',
    clientPhone: '+91 98765 12345',
    clientEmail: 'client@email.com',
    clientGST: '',
    items: [
      { description: 'Service or Product 1', quantity: 1, rate: 1000, amount: 1000 },
      { description: 'Service or Product 2', quantity: 2, rate: 500, amount: 1000 },
    ],
    subtotal: 2000,
    tax: 360,
    total: 2360,
    notes: 'Thank you for your business! Payment is due within 30 days.',
    upiId: businessProfile.upiId || '',
  });

  const handleInputChange = (field: keyof InvoiceData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    const numValue = field === 'description' ? value : Number(value);
    newItems[index] = { ...newItems[index], [field]: numValue };

    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }

    const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      tax,
      total,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: 'New Item', quantity: 1, rate: 0, amount: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length === 1) {
      alert('At least one item is required');
      return;
    }
    const newItems = formData.items.filter((_, i) => i !== index);
    const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      tax,
      total,
    }));
  };

  const handleDownload = async () => {
    await generatePDF('invoice-preview', `invoice-${formData.invoiceNumber}.pdf`, {
      isPro,
    });
  };

  const handleShare = () => {
    const message = `Invoice ${formData.invoiceNumber} from ${formData.companyName}. Total: ₹${formData.total.toFixed(2)}. Created with PDFDecor.`;
    shareViaWhatsApp(message);
  };

  const handleEmailShare = () => {
    const subject = `Invoice ${formData.invoiceNumber} from ${formData.companyName}`;
    const body = `Dear ${formData.clientName},\n\nPlease find your invoice details:\n\nInvoice Number: ${formData.invoiceNumber}\nDate: ${formData.date}\nTotal Amount: ₹${formData.total.toFixed(2)}\n\nThank you for your business!\n\nBest regards,\n${formData.companyName}\n\nCreated with PDFDecor - https://pdfdecor.in`;
    shareViaEmail(subject, body);
  };

  const handleTemplateClick = (templateId: number) => {
    // Free users can only access first 3 templates
    if (!isPro && templateId > 3) {
      setUpgradeTrigger('template');
      setShowUpgradeModal(true);
      return;
    }
    setSelectedTemplate(templateId);
  };

  const templates = [
    { id: 1, name: 'Modern Blue', component: InvoiceTemplate1, locked: false },
    { id: 2, name: 'Professional Green', component: InvoiceTemplate2, locked: false },
    { id: 3, name: 'Elegant Purple', component: InvoiceTemplate3, locked: false },
    { id: 4, name: 'Minimalist Black', component: InvoiceTemplate4, locked: !isPro },
    { id: 5, name: 'Orange Accent', component: InvoiceTemplate5, locked: !isPro },
  ];

  const SelectedTemplate = templates.find((t) => t.id === selectedTemplate)?.component || InvoiceTemplate1;

  return (
    <div className="max-w-[1800px] mx-auto">
      {/* Top Ad for Free Users */}
      <AdBanner position="top" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h1 className="mb-2">Create Professional Invoice</h1>
            <p className="text-gray-600">Fill in the details and choose from {isPro ? '5' : '3'} professional templates</p>
            {!isPro && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                <Crown className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-semibold text-blue-900">Free Version:</span>{' '}
                  <span className="text-blue-700">PDFs include watermark. </span>
                  <button
                    onClick={() => {
                      setUpgradeTrigger('watermark');
                      setShowUpgradeModal(true);
                    }}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Upgrade to Pro
                  </button>
                  <span className="text-blue-700"> to remove it.</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold mb-4">Select Template</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template.id)}
                  disabled={template.locked}
                  className={`relative p-3 rounded-lg border-2 transition-all text-sm ${
                    selectedTemplate === template.id && !template.locked
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : template.locked
                      ? 'border-gray-200 bg-gray-50 cursor-pointer hover:border-yellow-400'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {template.locked && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Lock className="h-3 w-3" />
                      PRO
                    </div>
                  )}
                  <div className={`font-medium ${template.locked ? 'text-gray-400' : ''}`}>
                    {template.name}
                  </div>
                  {template.locked && (
                    <div className="mt-1 text-xs text-yellow-600 font-semibold">
                      Unlock
                    </div>
                  )}
                </button>
              ))}
            </div>
            {!isPro && (
              <div className="text-xs text-gray-500 mt-3">
                💡 Unlock 2 more templates with Pro
              </div>
            )}
          </div>

          {/* Pro Auto-fill Banner */}
          {!isPro && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 p-4">
              <div className="flex items-start gap-3">
                <Crown className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    Save time with Pro
                  </div>
                  <div className="text-sm text-gray-700 mb-3">
                    Auto-fill your business details, save custom logo, and reuse information instantly.
                  </div>
                  <button
                    onClick={() => {
                      setUpgradeTrigger('autofill');
                      setShowUpgradeModal(true);
                    }}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Learn more →
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold">Invoice Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                  placeholder="INV-001"
                />
              </div>
              <div>
                <Label htmlFor="date">Invoice Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Your Company Details</h3>
              {isPro && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold">
                  AUTO-FILLED
                </span>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <Label htmlFor="companyAddress">Address *</Label>
                <Input
                  id="companyAddress"
                  value={formData.companyAddress}
                  onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                  placeholder="123 Business St, City, State, PIN"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="companyPhone">Phone *</Label>
                  <Input
                    id="companyPhone"
                    value={formData.companyPhone}
                    onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <Label htmlFor="companyEmail">Email *</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={formData.companyEmail}
                    onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                    placeholder="contact@company.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="companyGST">GST Number (Optional)</Label>
                <Input
                  id="companyGST"
                  value={formData.companyGST}
                  onChange={(e) => handleInputChange('companyGST', e.target.value)}
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
              <div>
                <Label htmlFor="upiId">UPI ID (Optional - for QR Code)</Label>
                <Input
                  id="upiId"
                  value={formData.upiId}
                  onChange={(e) => handleInputChange('upiId', e.target.value)}
                  placeholder="yourname@upi"
                />
                <p className="text-xs text-gray-500 mt-1">Add your UPI ID to generate a payment QR code</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold">Client Details</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="Client Name"
                />
              </div>
              <div>
                <Label htmlFor="clientAddress">Address *</Label>
                <Input
                  id="clientAddress"
                  value={formData.clientAddress}
                  onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                  placeholder="456 Client Ave, City, State, PIN"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="clientPhone">Phone *</Label>
                  <Input
                    id="clientPhone"
                    value={formData.clientPhone}
                    onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                    placeholder="+91 98765 12345"
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    placeholder="client@email.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="clientGST">GST Number (Optional)</Label>
                <Input
                  id="clientGST"
                  value={formData.clientGST}
                  onChange={(e) => handleInputChange('clientGST', e.target.value)}
                  placeholder="29BBBBB0000B1Z6"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Line Items</h3>
              <Button onClick={addItem} size="sm">
                + Add Item
              </Button>
            </div>
            {formData.items.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3 border border-gray-200">
                <div className="flex justify-between items-start">
                  <span className="font-medium">Item {index + 1}</span>
                  <Button
                    onClick={() => removeItem(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
                <div>
                  <Label>Description *</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Product or service description"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Rate (₹) *</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input type="number" value={item.amount.toFixed(2)} disabled className="bg-gray-100" />
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">₹{formData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (GST 18%):</span>
                <span className="font-semibold">₹{formData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-lg text-blue-600">₹{formData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold">Additional Notes</h3>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              placeholder="Add payment terms, thank you message, or other notes..."
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button onClick={() => setShowPreview(!showPreview)} variant="outline" className="col-span-2 sm:col-span-1">
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? 'Hide' : 'Show'}
            </Button>
            <Button onClick={handleDownload} className="col-span-2 sm:col-span-1">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={handleShare} variant="outline" className="col-span-1">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
            <Button onClick={handleEmailShare} variant="outline" className="col-span-1">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          </div>
        </div>

        {showPreview && (
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg">
              <h3 className="font-semibold mb-4">Preview</h3>
              <div
                className="border border-gray-200 rounded overflow-auto bg-gray-50"
                style={{
                  maxHeight: 'calc(100vh - 200px)',
                }}
              >
                <div
                  style={{
                    transform: 'scale(0.6)',
                    transformOrigin: 'top left',
                    width: '166.67%',
                  }}
                >
                  <div id="invoice-preview">
                    <SelectedTemplate data={formData} isPro={isPro} />
                  </div>
                </div>
              </div>
              {!isPro && (
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-500 mb-2">
                    ⚠️ Free version includes watermark
                  </p>
                  <button
                    onClick={() => {
                      setUpgradeTrigger('watermark');
                      setShowUpgradeModal(true);
                    }}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    Upgrade to Pro to remove watermark
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Ad for Free Users */}
      <AdBanner position="bottom" />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger={upgradeTrigger}
      />
    </div>
  );
}