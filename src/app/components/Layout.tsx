import { Outlet, Link, useLocation } from 'react-router';
import { FileText, Award, Receipt, FileSpreadsheet, Home, Sparkles, Crown, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

export function Layout() {
  const location = useLocation();
  const { isAuthenticated, isPro, user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/invoice', icon: FileText, label: 'Invoice' },
    { path: '/certificate', icon: Award, label: 'Certificate' },
    { path: '/quotation', icon: FileSpreadsheet, label: 'Quotation' },
    { path: '/bill', icon: Receipt, label: 'Bill' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">PDFDecor</h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Auth & Pricing Buttons */}
              <div className="hidden md:flex items-center gap-2">
                {!isPro && (
                  <Link to="/pricing">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade to Pro
                    </Button>
                  </Link>
                )}
                
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    {isPro && (
                      <>
                        <Link to="/history">
                          <Button variant="outline" size="sm">
                            History
                          </Button>
                        </Link>
                        <Link to="/profile">
                          <Button variant="outline" size="sm">
                            Profile
                          </Button>
                        </Link>
                        <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-3 py-1.5 rounded-lg font-bold text-sm">
                          <Crown className="h-4 w-4" />
                          PRO
                        </div>
                      </>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-700 px-3 py-1.5 bg-gray-100 rounded-lg">
                      <User className="h-4 w-4" />
                      {user?.email}
                    </div>
                    <Button onClick={logout} variant="outline" size="sm">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Link to="/login">
                    <Button variant="outline">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <h3 className="font-bold text-lg">PDFDecor</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Free professional PDF generator for invoices, certificates, quotations, and bills.
                Built for Indian businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Document Types</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/invoice" className="text-gray-600 hover:text-blue-600">Invoice Generator</Link></li>
                <li><Link to="/certificate" className="text-gray-600 hover:text-blue-600">Certificate Maker</Link></li>
                <li><Link to="/quotation" className="text-gray-600 hover:text-blue-600">Quotation Creator</Link></li>
                <li><Link to="/bill" className="text-gray-600 hover:text-blue-600">Bill Generator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link></li>
                <li><Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link></li>
              </ul>
              <div className="mt-4">
                <Link to="/pricing">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-600">
              © 2026 PDFDecor. All rights reserved. Made with ❤️ for Indian Businesses.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Free to use • No registration required • Business-ready documents
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-4 py-3 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}