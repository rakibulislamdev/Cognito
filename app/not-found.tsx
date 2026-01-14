import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold">Oops! Chat Not Found</h2>
            <p className="text-gray-400 mt-2">The conversation might have been deleted.</p>
            <Link href="/" className="mt-4 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg">
                Go Back Home
            </Link>
        </div>
    )
}