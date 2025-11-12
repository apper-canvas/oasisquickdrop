export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B"
  
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const getFileTypeIcon = (type) => {
  if (type.startsWith("image/")) return "Image"
  if (type.startsWith("video/")) return "Video"
  if (type.startsWith("audio/")) return "Music"
  if (type === "application/pdf") return "FileText"
  if (type.includes("document") || type.includes("word")) return "FileText"
  if (type.includes("spreadsheet") || type.includes("excel")) return "FileSpreadsheet"
  if (type.includes("presentation") || type.includes("powerpoint")) return "FilePresentation"
  if (type.includes("zip") || type.includes("archive") || type.includes("compressed")) return "Archive"
  if (type === "text/plain") return "FileText"
  if (type.includes("json") || type.includes("javascript") || type.includes("code")) return "Code"
  
  return "File"
}

export const generateThumbnail = (file) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve(null)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        
        // Set thumbnail dimensions
        const maxSize = 48
        let { width, height } = img
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL())
      }
      
      img.onerror = () => resolve(null)
      img.src = e.target.result
    }
    
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(file)
  })
}

export const generateFileId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}