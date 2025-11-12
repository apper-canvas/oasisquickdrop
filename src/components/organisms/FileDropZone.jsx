import React from "react"
import ApperIcon from "@/components/ApperIcon"

const FileDropZone = ({ onFileDrop, onBrowseFiles, hasFiles, isDragOver }) => {
  return (
    <div className={`
      relative border-2 border-dashed rounded-2xl transition-all duration-300 ease-out
      ${isDragOver 
        ? "border-primary-500 bg-primary-50 scale-[1.02] shadow-lg" 
        : "border-gray-300 hover:border-primary-400 hover:bg-primary-50/50"
      }
      ${hasFiles ? "p-8" : "p-12 sm:p-16"}
    `}>
      <div className="text-center space-y-6">
        <div className={`
          mx-auto rounded-full flex items-center justify-center transition-all duration-300
          ${isDragOver 
            ? "w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg scale-110" 
            : "w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-primary-100 hover:to-primary-200"
          }
        `}>
          <ApperIcon 
            name={isDragOver ? "Upload" : "CloudUpload"} 
            className={`transition-all duration-300 ${
              isDragOver ? "w-10 h-10 text-white" : "w-8 h-8 text-gray-500"
            }`} 
          />
        </div>

        <div className="space-y-3">
          <h3 className={`font-bold transition-all duration-300 ${
            hasFiles ? "text-xl" : "text-2xl"
          } ${
            isDragOver 
              ? "text-primary-700" 
              : "text-gray-900"
          }`}>
            {isDragOver 
              ? "Drop your files here" 
              : hasFiles 
                ? "Add more files" 
                : "Drop files to upload"
            }
          </h3>
          
          <p className={`text-gray-600 transition-all duration-300 ${
            hasFiles ? "text-sm" : "text-base"
          }`}>
            {isDragOver 
              ? "Release to start uploading instantly"
              : "Drag and drop files here, or click to browse"
            }
          </p>
        </div>

        {!isDragOver && (
          <button
            onClick={onBrowseFiles}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="FolderOpen" className="w-5 h-5" />
            Browse Files
          </button>
        )}
      </div>

      {/* Animated border effect when dragging */}
      {isDragOver && (
        <div className="absolute inset-0 rounded-2xl border-2 border-primary-400 animate-pulse pointer-events-none"></div>
      )}
    </div>
  )
}

export default FileDropZone