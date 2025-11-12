import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { formatFileSize } from "@/utils/fileHelpers"

const UploadStats = ({ stats }) => {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
  const progressRate = stats.totalSize > 0 ? Math.round((stats.uploadedSize / stats.totalSize) * 100) : 0

  const statCards = [
    {
      label: "Total Files",
      value: stats.total,
      icon: "Files",
      color: "primary",
      gradient: "from-primary-500 to-primary-600"
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: "CheckCircle",
      color: "success",
      gradient: "from-success-500 to-success-600"
    },
    {
      label: "Uploading",
      value: stats.uploading,
      icon: "Upload",
      color: "info",
      gradient: "from-info-500 to-info-600"
    },
    {
      label: "Failed",
      value: stats.failed,
      icon: "AlertCircle",
      color: "error",
      gradient: "from-error-500 to-error-600"
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
          <ApperIcon name="BarChart3" className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Upload Statistics</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="text-center space-y-2">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center mx-auto shadow-md`}>
              <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      {stats.total > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-medium text-gray-900">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 bg-gradient-to-r from-success-500 to-success-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {stats.totalSize > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Data Transfer</span>
                <span className="font-medium text-gray-900">
                  {formatFileSize(stats.uploadedSize)} / {formatFileSize(stats.totalSize)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 bg-gradient-to-r from-info-500 to-info-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressRate}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {stats.total === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Upload some files to see statistics</p>
        </div>
      )}
    </div>
  )
}

export default UploadStats