// PATH: src/app/not-found.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix for @next/next/no-html-link-for-pages
// Use <Link /> from next/link instead of <a> for page navigation
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="text-center p-10">
            <h1 className="text-4xl font-bold">404 – Page not found</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                The page you’re looking for doesn’t exist, comrade.
            </p>
            <Link href="/" className="mt-6 inline-block text-blue-500 hover:underline">
                Return home
            </Link>
        </div>
    )
}

// PATCH NOTES:
// - Use <Link /> from next/link instead of <a> for navigation
// - Filename/path toujours!