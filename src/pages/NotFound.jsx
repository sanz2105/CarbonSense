import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found — CarbonSense'
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-8">
      <div className="text-6xl">🌿</div>
      <h1 className="text-xl font-semibold text-gray-900 m-0">
        Page Not Found
      </h1>
      <p className="text-gray-500 text-sm m-0">
        This page doesn't exist or was moved.
      </p>
      <Link
        to="/"
        className="mt-2 px-5 py-2 bg-[#1D9E75] text-white rounded-lg text-sm font-medium no-underline hover:bg-[#0F6E56] transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
