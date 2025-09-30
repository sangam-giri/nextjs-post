import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to My Next.js App 🚀</h1>
      <p className="text-gray-700 mb-4">
        This app follows a <strong>feature-first clean architecture</strong>.
      </p>
      <div className="space-x-4">
        <Link
          href="/posts"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          View Posts
        </Link>
      </div>
    </main>
  );
}
