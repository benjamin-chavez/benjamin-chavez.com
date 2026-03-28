'use client';

export default function GlobalError({
                                      error,
                                      reset,
                                    }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
    <body className="flex min-h-screen flex-col items-center justify-center bg-[#ECEDFA] font-sans text-[#141414]">
    <h1 className="text-4xl font-bold tracking-wide">
      Something went wrong
    </h1>
    <p className="mt-4 text-gray-500">{error.message}</p>
    <button
      onClick={reset}
      className="mt-8 rounded border border-[#141414] px-6 py-2 text-sm uppercase tracking-widest hover:bg-[#141414] hover:text-white"
    >
      Try again
    </button>
    </body>
    </html>
  );
}
