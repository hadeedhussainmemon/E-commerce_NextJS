import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-6xl font-playfair font-bold text-gray-200 mb-4">404</h2>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h3>
            <p className="text-gray-600 mb-8 max-w-md">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors shadow-lg hover:shadow-xl active:scale-95"
            >
                Back to Home
            </Link>
        </div>
    );
}
