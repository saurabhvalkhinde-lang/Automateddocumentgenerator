import { useAuth } from '../contexts/AuthContext';

export function AdBanner({ position }: { position: 'top' | 'bottom' }) {
  const { isPro } = useAuth();

  // Pro users don't see ads
  if (isPro) return null;

  return (
    <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg p-6 my-4">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">Advertisement</p>
        <div className="bg-white rounded p-8 border-2 border-dashed border-gray-300">
          <p className="text-gray-400 text-sm">
            [{position === 'top' ? 'Top Banner' : 'Bottom Banner'} Ad Space - 728x90]
          </p>
          <p className="text-xs text-gray-400 mt-2">
            This space shows ads for Free users only
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Want ad-free experience?{' '}
          <a href="/pricing" className="text-blue-600 hover:underline font-semibold">
            Upgrade to Pro
          </a>
        </p>
      </div>
    </div>
  );
}
