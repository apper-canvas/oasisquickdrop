import React from "react"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-accent-500 bg-clip-text text-transparent">
            404
          </h1>
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
            <ApperIcon name="FileX" className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-gray-900">
            Page not found
          </h2>
          <p className="text-gray-600 max-w-md mx-auto text-lg">
            The page you're looking for doesn't exist. Let's get you back to uploading files.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Home" className="w-5 h-5" />
          Back to QuickDrop
        </Link>
      </div>
    </div>
  )
}

export default NotFound