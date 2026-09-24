import Link from "next/link";

export const metadata = {
  title: "Unauthorized | School CMS",
};

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold text-destructive">403</h1>
      <h2 className="mt-2 text-xl font-semibold">Access Denied</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        You do not have permission to access this resource. Contact your
        administrator if you believe this is an error.
      </p>
      <Link
        href="/admin"
        className="mt-6 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
