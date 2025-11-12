import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import ProgressBar from "@/components/atoms/ProgressBar"
import StatusBadge from "@/components/atoms/StatusBadge"
import { formatFileSize, getFileTypeIcon } from "@/utils/fileHelpers"

const FileCard = ({ file, onCancel, onRetry, onRemove }) => {
  const handleCancel = () => {
if (file.status_c === "uploading") {
      onCancel(file.id_c)
    }
  }

  const handleRetry = () => {
    if (file.status_c === "failed") {
      onRetry(file.id_c)
    }
  }

  const handleRemove = () => {
    if (file.status_c === "completed" || file.status_c === "failed" || file.status_c === "cancelled") {
      onRemove(file.id_c)
    }
  }

const showProgress = file.status_c === "uploading" || (file.status_c === "completed" && file.progress_c === 100)
  const canCancel = file.status_c === "uploading"
  const canRetry = file.status_c === "failed"
  const canRemove = ["completed", "failed", "cancelled"].includes(file.status_c)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-4 border border-gray-100"
    >
      <div className="flex items-center gap-4">
        {/* File Thumbnail/Icon */}
        <div className="flex-shrink-0">
{file.thumbnailUrl_c ? (
            <img
              src={file.thumbnailUrl_c}
              alt={file.name_c}
              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
<ApperIcon name={getFileTypeIcon(file.type_c)} className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>

        {/* File Details */}
        <div className="flex-grow min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-grow">
<h3 className="font-medium text-gray-900 truncate" title={file.name_c}>
                {file.name_c}
              </h3>
<div className="flex items-center gap-3 text-sm text-gray-500">
                <span>{formatFileSize(file.size_c)}</span>
                <span>•</span>
                <span className="capitalize">{file.type_c.split("/")[1] || file.type_c}</span>
                {file.status_c === "uploading" && file.uploadedBytes_c > 0 && (
                  <>
                    <span>•</span>
                    <span>{formatFileSize(file.uploadedBytes_c)} uploaded</span>
                  </>
                )}
              </div>
            </div>
<StatusBadge status={file.status_c} />
          </div>

          {/* Progress Bar */}
{showProgress && (
            <div className="space-y-1">
              <ProgressBar progress={file.progress_c} status={file.status_c} />
              {file.status_c === "uploading" && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{file.progress_c}% complete</span>
                  {file.startTime_c && (
                    <span>
                      {Math.floor((Date.now() - file.startTime_c) / 1000)}s elapsed
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {file.error && (
            <div className="flex items-center gap-2 text-sm text-error-600 bg-error-50 rounded-lg p-2">
              <ApperIcon name="AlertCircle" className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{file.error}</span>
            </div>
          )}

          {/* Upload URL */}
{file.uploadUrl_c && (
            <div className="flex items-center gap-2 text-sm text-success-600 bg-success-50 rounded-lg p-2">
              <ApperIcon name="Link" className="w-4 h-4 flex-shrink-0" />
              <span className="truncate font-mono text-xs">{file.uploadUrl_c}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {canCancel && (
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-all duration-200"
              title="Cancel upload"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </button>
          )}
          
          {canRetry && (
            <button
              onClick={handleRetry}
              className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all duration-200"
              title="Retry upload"
            >
              <ApperIcon name="RefreshCw" className="w-4 h-4" />
            </button>
          )}
          
          {canRemove && (
            <button
              onClick={handleRemove}
              className="p-2 text-gray-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-all duration-200"
              title="Remove file"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default FileCard