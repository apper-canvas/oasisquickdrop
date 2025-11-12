import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "queued":
        return {
          icon: "Clock",
          label: "Queued",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          iconColor: "text-gray-500"
        }
      case "uploading":
        return {
          icon: "Upload",
          label: "Uploading",
          bgColor: "bg-info-100",
          textColor: "text-info-700",
          iconColor: "text-info-500",
          animate: true
        }
      case "completed":
        return {
          icon: "CheckCircle",
          label: "Completed",
          bgColor: "bg-success-100",
          textColor: "text-success-700",
          iconColor: "text-success-500"
        }
      case "failed":
        return {
          icon: "AlertCircle",
          label: "Failed",
          bgColor: "bg-error-100",
          textColor: "text-error-700",
          iconColor: "text-error-500"
        }
      case "cancelled":
        return {
          icon: "XCircle",
          label: "Cancelled",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          iconColor: "text-gray-500"
        }
      default:
        return {
          icon: "Circle",
          label: "Unknown",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          iconColor: "text-gray-500"
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <motion.div
        animate={config.animate ? { rotate: 360 } : {}}
        transition={config.animate ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
      >
        <ApperIcon name={config.icon} className={`w-3 h-3 ${config.iconColor}`} />
      </motion.div>
      <span>{config.label}</span>
    </div>
  )
}

export default StatusBadge