import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No items found", 
  description = "Get started by adding your first item", 
  actionLabel = "Add Item",
  onAction,
  icon = "Inbox"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center max-w-sm mb-6">
        {description}
      </p>

      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default Empty