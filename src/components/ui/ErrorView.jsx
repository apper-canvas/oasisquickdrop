import React from "react"
import ApperIcon from "@/components/ApperIcon"

const ErrorView = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      <div className="text-center space-y-6 p-8">
        <div className="w-20 h-20 bg-gradient-to-br from-error-500 to-error-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <ApperIcon name="AlertTriangle" className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-error-600 to-error-500 bg-clip-text text-transparent">
            Something went wrong
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {error || "An unexpected error occurred. Please try again."}
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorView