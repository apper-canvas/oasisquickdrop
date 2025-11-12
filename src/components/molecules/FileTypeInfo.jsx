import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { uploadConfig } from "@/services/api/uploadService"
import { formatFileSize } from "@/utils/fileHelpers"

const FileTypeInfo = () => {
  const supportedTypes = [
    { category: "Images", types: ["JPEG", "PNG", "GIF", "WebP"], icon: "Image" },
    { category: "Documents", types: ["PDF", "DOC", "DOCX", "TXT"], icon: "FileText" },
    { category: "Spreadsheets", types: ["XLS", "XLSX", "CSV"], icon: "FileSpreadsheet" },
    { category: "Archives", types: ["ZIP", "RAR", "7Z"], icon: "Archive" },
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-purple-600 rounded-lg flex items-center justify-center">
          <ApperIcon name="Info" className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Upload Info</h2>
      </div>

      {/* File Size Limit */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-indigo-50 rounded-lg border border-primary-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="HardDrive" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">File Size Limit</h3>
            <p className="text-gray-600">Up to {formatFileSize(uploadConfig.maxFileSize)} per file</p>
          </div>
        </div>
      </div>

      {/* Supported File Types */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Supported File Types</h3>
        
        {supportedTypes.map((category) => (
          <div key={category.category} className="space-y-2">
            <div className="flex items-center gap-2">
              <ApperIcon name={category.icon} className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">{category.category}</span>
            </div>
            <div className="flex flex-wrap gap-2 ml-6">
              {category.types.map((type) => (
                <span
                  key={type}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ApperIcon name="Lightbulb" className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">Pro Tips</span>
          </div>
          <ul className="text-sm text-green-700 space-y-1 ml-6">
            <li>• Drag multiple files at once</li>
            <li>• Upload continues in background</li>
            <li>• Cancel anytime if needed</li>
            <li>• Get shareable links instantly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FileTypeInfo