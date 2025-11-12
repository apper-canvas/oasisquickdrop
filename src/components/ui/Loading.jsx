import React from "react"

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-48 animate-pulse"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-32 animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

export default Loading