export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-red-600">403</h1>
        <h2 className="mt-2 text-2xl font-semibold text-gray-800">
          Access Denied
        </h2>
        <p className="mt-3 text-gray-600">
          You do not have permission to access this page.
        </p>

        <a
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
        >
          Go Back
        </a>
      </div>
    </div>
  );
}