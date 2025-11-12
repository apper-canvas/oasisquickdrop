import { generateFileId, generateThumbnail } from "@/utils/fileHelpers"

export const uploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "image/jpeg",
    "image/png", 
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed"
  ],
  maxConcurrentUploads: 3,
  endpoint: "/api/upload"
}

class UploadService {
  constructor() {
    this.activeUploads = new Map()
  }

  validateFile(file) {
    if (!file) {
      return { isValid: false, error: "No file provided" }
    }

    if (file.size > uploadConfig.maxFileSize) {
      return { 
        isValid: false, 
        error: `File size exceeds ${Math.round(uploadConfig.maxFileSize / (1024 * 1024))}MB limit` 
      }
    }

    if (!uploadConfig.allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: `File type '${file.type}' is not supported` 
      }
    }

    return { isValid: true }
  }

  async createUploadFile(file) {
    const id = generateFileId()
    const thumbnailUrl = await generateThumbnail(file)

    return {
      id,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "queued",
      progress: 0,
      uploadedBytes: 0,
      error: null,
      thumbnailUrl,
      uploadUrl: null,
      startTime: null,
      completedTime: null
    }
  }

  async uploadFile(uploadFile, onProgress) {
    const fileId = uploadFile.id

    if (this.activeUploads.has(fileId)) {
      return
    }

    // Mark as uploading
    const updatedFile = {
      ...uploadFile,
      status: "uploading",
      startTime: Date.now(),
      error: null
    }
    onProgress(updatedFile)

    // Create abort controller for cancellation
    const abortController = new AbortController()
    this.activeUploads.set(fileId, abortController)

    try {
      // Simulate upload with chunked progress
      const chunkSize = Math.max(1024, Math.floor(uploadFile.size / 20)) // 20 chunks
      let uploadedBytes = 0
      
      while (uploadedBytes < uploadFile.size) {
        // Check if upload was cancelled
        if (abortController.signal.aborted) {
          this.activeUploads.delete(fileId)
          onProgress({
            ...updatedFile,
            status: "cancelled"
          })
          return
        }

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))
        
        uploadedBytes = Math.min(uploadedBytes + chunkSize, uploadFile.size)
        const progress = Math.round((uploadedBytes / uploadFile.size) * 100)

        onProgress({
          ...updatedFile,
          progress,
          uploadedBytes
        })
      }

      // Simulate final processing delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Generate mock upload URL
      const uploadUrl = `https://cdn.quickdrop.app/${fileId}/${encodeURIComponent(uploadFile.name)}`

      // Complete upload
      this.activeUploads.delete(fileId)
      onProgress({
        ...updatedFile,
        status: "completed",
        progress: 100,
        uploadedBytes: uploadFile.size,
        uploadUrl,
        completedTime: Date.now()
      })

    } catch (error) {
      this.activeUploads.delete(fileId)
      onProgress({
        ...updatedFile,
        status: "failed",
        error: error.message || "Upload failed"
      })
    }
  }

  cancelUpload(fileId) {
    const abortController = this.activeUploads.get(fileId)
    if (abortController) {
      abortController.abort()
      this.activeUploads.delete(fileId)
    }
  }

  getActiveUploadCount() {
    return this.activeUploads.size
  }
}

export const uploadService = new UploadService()