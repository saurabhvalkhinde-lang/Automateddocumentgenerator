import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Invoice } from './pages/Invoice';
import { Certificate } from './pages/Certificate';
import { Quotation } from './pages/Quotation';
import { Bill } from './pages/Bill';
import { Login } from './pages/Login';
import { Pricing } from './pages/Pricing';
import { Profile } from './pages/Profile';
import { History } from './pages/History';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'invoice', Component: Invoice },
      { path: 'certificate', Component: Certificate },
      { path: 'quotation', Component: Quotation },
      { path: 'bill', Component: Bill },
      { path: 'login', Component: Login },
      { path: 'pricing', Component: Pricing },
      { path: 'profile', Component: Profile },
      { path: 'history', Component: History },
    ],
  },
]);