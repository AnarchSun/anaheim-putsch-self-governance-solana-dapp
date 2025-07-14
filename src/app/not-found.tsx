// src/app/not-found.tsx
export default function NotFound() {
    return (
        <div className="text-center p-10">
            <h1 className="text-4xl font-bold">404 – Page not found</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                The page you’re looking for doesn’t exist, comrade.
            </p>
            <a href="/" className="mt-6 inline-block text-blue-500 hover:underline">
                Return home
            </a>
        </div>
    )
}
