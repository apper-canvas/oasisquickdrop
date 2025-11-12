import React from "react"
import { motion } from "framer-motion"

const ProgressBar = ({ progress, status }) => {
  const getProgressColor = () => {
    switch (status) {
      case "uploading":
        return "from-info-500 to-info-600"
      case "completed":
        return "from-success-500 to-success-600"
      case "failed":
        return "from-error-500 to-error-600"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  const isAnimated = status === "uploading"

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <motion.div
        className={`h-2 bg-gradient-to-r ${getProgressColor()} rounded-full transition-all duration-500 ease-out relative`}
        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {isAnimated && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        )}
      </motion.div>
    </div>
  )
}

export default ProgressBar