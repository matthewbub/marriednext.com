import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full mb-4 mt-20">
        <div className="p-8 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg text-gray-900">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-2">Welcome!</h1>
            <p className="text-stone-700 font-handwritten-font text-2xl">
              Yulissa &apos;s Wedding
            </p>
            <p className="text-stone-600 text-lg mt-2">
              April 23rd, 2026 • Temecula Wine Country
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/guest-list"
              className="block p-4 bg-white/30 hover:bg-white/50 rounded-lg transition-colors text-center"
            >
              <h2 className="text-xl font-semibold mb-1">Guest List</h2>
              <p className="text-sm text-stone-600">
                View and manage wedding guests
              </p>
            </Link>

            <Link
              href="/registry"
              className="block p-4 bg-white/30 hover:bg-white/50 rounded-lg transition-colors text-center"
            >
              <h2 className="text-xl font-semibold mb-1">Registry</h2>
              <p className="text-sm text-stone-600">
                Wedding registry and gift fund
              </p>
            </Link>

            <Link
              href="/documentation"
              className="block p-4 bg-white/30 hover:bg-white/50 rounded-lg transition-colors text-center"
            >
              <h2 className="text-xl font-semibold mb-1">Documentation</h2>
              <p className="text-sm text-stone-600">
                Learn more about this application
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
