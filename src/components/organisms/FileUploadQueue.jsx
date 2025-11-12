import React from "react"
import FileCard from "@/components/molecules/FileCard"
import ApperIcon from "@/components/ApperIcon"

const FileUploadQueue = ({ 
  files, 
  onCancelUpload, 
  onRetryUpload, 
  onRemoveFile, 
  onClearCompleted 
}) => {
  const completedFiles = files.filter(f => f.status === "completed")
  const activeFiles = files.filter(f => f.status !== "completed")

  return (
    <div className="space-y-6">
      {/* Queue Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Upload Queue</h2>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {files.length} {files.length === 1 ? "file" : "files"}
            </div>
            {activeFiles.filter(f => f.status === "uploading").length > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 bg-info-100 text-info-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-info-500 rounded-full animate-pulse"></div>
                Uploading
              </div>
            )}
          </div>
        </div>

        {completedFiles.length > 0 && (
          <button
            onClick={onClearCompleted}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
            Clear Completed
          </button>
        )}
      </div>

      {/* File List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onCancel={onCancelUpload}
            onRetry={onRetryUpload}
            onRemove={onRemoveFile}
          />
        ))}
      </div>
    </div>
  )
}

export default FileUploadQueue