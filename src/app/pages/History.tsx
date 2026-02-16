import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Crown, FileText, Award, Receipt, FileSpreadsheet, Trash2, Download, Copy, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

export function History() {
  const { user, isPro, isAuthenticated, deletePDFFromHistory } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="mb-4">Login Required</h1>
        <p className="text-gray-600 mb-8">Please login to access your PDF history</p>
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
          PDF History is a Pro-only feature. Upgrade to save, edit, and reuse your PDFs across all document types.
        </p>
        <Button onClick={() => navigate('/pricing')}>
          <Crown className="mr-2 h-4 w-4" />
          Upgrade to Pro
        </Button>
      </div>
    );
  }

  const history = user?.pdfHistory || [];
  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'invoice': return FileText;
      case 'certificate': return Award;
      case 'quotation': return FileSpreadsheet;
      case 'bill': return Receipt;
      default: return FileText;
    }
  };

  const getTypeName = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this PDF from history?')) {
      deletePDFFromHistory(id);
    }
  };

  const handleEdit = (item: any) => {
    // Navigate to the appropriate generator with the data
    navigate(`/${item.type}?edit=${item.id}`);
  };

  const handleDuplicate = (item: any) => {
    // Navigate to the appropriate generator with the data
    navigate(`/${item.type}?duplicate=${item.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="h-8 w-8 text-blue-600" />
          <h1>PDF History</h1>
        </div>
        <p className="text-gray-600">
          View, edit, and reuse your previously generated PDFs across all document types
        </p>
        <div className="mt-3 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <Crown className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-900">Pro Feature Active</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-2 flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'All Documents' },
          { value: 'invoice', label: 'Invoices' },
          { value: 'certificate', label: 'Certificates' },
          { value: 'quotation', label: 'Quotations' },
          { value: 'bill', label: 'Bills' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === tab.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No PDFs Found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all'
              ? 'Start generating PDFs to see them here'
              : `No ${filter}s in your history yet`}
          </p>
          <Button onClick={() => navigate('/')}>
            Create Your First PDF
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => {
            const Icon = getIcon(item.type);
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {getTypeName(item.type)} - Template {item.templateId}
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {getTypeName(item.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Created: {formatDate(item.createdAt)}
                      </p>
                      {item.updatedAt !== item.createdAt && (
                        <p className="text-xs text-gray-500">
                          Last updated: {formatDate(item.updatedAt)}
                        </p>
                      )}
                      {item.data?.invoiceNumber && (
                        <p className="text-sm text-gray-700 mt-2">
                          #{item.data.invoiceNumber}
                        </p>
                      )}
                      {item.data?.companyName && (
                        <p className="text-sm text-gray-700">
                          {item.data.companyName}
                        </p>
                      )}
                      {item.data?.total && (
                        <p className="text-sm font-semibold text-blue-600 mt-1">
                          Total: ₹{item.data.total.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => handleEdit(item)}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDuplicate(item)}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 whitespace-nowrap"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pro Benefits */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 p-6">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-600" />
          Pro History Benefits
        </h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>✓ Unlimited PDF storage across all document types</li>
          <li>✓ Edit and regenerate any saved PDF</li>
          <li>✓ Duplicate PDFs to create similar documents quickly</li>
          <li>✓ Search and filter your document history</li>
          <li>✓ Download PDFs anytime without regenerating</li>
        </ul>
      </div>
    </div>
  );
}
