import { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { CertificateData, CertificateTemplate1, CertificateTemplate2, CertificateTemplate3 } from '../components/templates/CertificateTemplates';
import { generatePDF } from '../utils/pdfGenerator';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export function Certificate() {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [showPreview, setShowPreview] = useState(true);
  const [formData, setFormData] = useState<CertificateData>({
    recipientName: 'John Doe',
    certificateTitle: 'Achievement',
    description: 'Has successfully completed the required coursework and demonstrated excellence in their field of study.',
    date: new Date().toISOString().split('T')[0],
    signatureName: 'Jane Smith',
    signatureTitle: 'Director',
    organizationName: 'ABC Institute',
  });

  const handleInputChange = (field: keyof CertificateData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDownload = async () => {
    await generatePDF('certificate-preview', `certificate-${formData.recipientName}.pdf`);
  };

  const templates = [
    { id: 1, name: 'Classic Blue', component: CertificateTemplate1 },
    { id: 2, name: 'Modern Gradient', component: CertificateTemplate2 },
    { id: 3, name: 'Elegant Gold', component: CertificateTemplate3 },
  ];

  const SelectedTemplate = templates.find((t) => t.id === selectedTemplate)?.component || CertificateTemplate1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Certificate</h2>
          <p className="text-gray-600">Design beautiful certificates for any occasion</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg mb-4">Select Template</h3>
          <div className="grid grid-cols-3 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium">{template.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg">Certificate Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
                placeholder="Enter recipient's full name"
              />
            </div>
            <div>
              <Label htmlFor="certificateTitle">Certificate Title</Label>
              <Input
                id="certificateTitle"
                value={formData.certificateTitle}
                onChange={(e) => handleInputChange('certificateTitle', e.target.value)}
                placeholder="e.g., Achievement, Completion, Excellence"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                placeholder="Describe what this certificate is awarded for..."
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg">Signature Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="signatureName">Signatory Name</Label>
              <Input
                id="signatureName"
                value={formData.signatureName}
                onChange={(e) => handleInputChange('signatureName', e.target.value)}
                placeholder="Name of the person signing"
              />
            </div>
            <div>
              <Label htmlFor="signatureTitle">Title</Label>
              <Input
                id="signatureTitle"
                value={formData.signatureTitle}
                onChange={(e) => handleInputChange('signatureTitle', e.target.value)}
                placeholder="e.g., Director, CEO, Principal"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg">Organization</h3>
          <div>
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              value={formData.organizationName}
              onChange={(e) => handleInputChange('organizationName', e.target.value)}
              placeholder="Your organization or company name"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setShowPreview(!showPreview)} variant="outline" className="flex-1">
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          <Button onClick={handleDownload} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {showPreview && (
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-lg mb-4">Preview</h3>
            <div className="border border-gray-200 rounded overflow-hidden" style={{ transform: 'scale(0.4)', transformOrigin: 'top left', width: '250%', height: 'fit-content' }}>
              <div id="certificate-preview">
                <SelectedTemplate data={formData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
