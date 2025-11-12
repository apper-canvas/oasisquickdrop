import { generateFileId, generateThumbnail } from "@/utils/fileHelpers"
import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

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
    this.tableName = 'uploaded_file_c'
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
    const id_c = generateFileId()
    const thumbnailUrl_c = await generateThumbnail(file)

    return {
      id_c,
      file,
      name_c: file.name,
      size_c: file.size,
      type_c: file.type,
      status_c: "queued",
      progress_c: 0,
      uploadedBytes_c: 0,
      error: null,
      thumbnailUrl_c,
      uploadUrl_c: null,
      startTime_c: null,
      completedTime_c: null
    }
  }

  async saveFileRecord(uploadFile) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const params = {
        records: [{
          id_c: uploadFile.id_c,
          name_c: uploadFile.name_c,
          size_c: uploadFile.size_c,
          type_c: uploadFile.type_c,
          status_c: uploadFile.status_c,
          progress_c: uploadFile.progress_c,
          uploadedBytes_c: uploadFile.uploadedBytes_c,
          thumbnailUrl_c: uploadFile.thumbnailUrl_c,
          uploadUrl_c: uploadFile.uploadUrl_c,
          startTime_c: uploadFile.startTime_c ? new Date(uploadFile.startTime_c).toISOString() : null,
          completedTime_c: uploadFile.completedTime_c ? new Date(uploadFile.completedTime_c).toISOString() : null
        }]
      }

      const response = await apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      return true
    } catch (error) {
      console.error("Error saving file record:", error?.response?.data?.message || error)
      return false
    }
  }

  async updateFileRecord(uploadFile) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // First find the record by id_c
      const fetchParams = {
        fields: [{"field": {"Name": "Id"}}, {"field": {"Name": "id_c"}}],
        where: [{
          "FieldName": "id_c",
          "Operator": "EqualTo",
          "Values": [uploadFile.id_c],
          "Include": true
        }]
      }

      const fetchResponse = await apperClient.fetchRecords(this.tableName, fetchParams)
      
      if (!fetchResponse.success || !fetchResponse.data || fetchResponse.data.length === 0) {
        return false
      }

      const recordId = fetchResponse.data[0].Id

      const params = {
        records: [{
          Id: recordId,
          status_c: uploadFile.status_c,
          progress_c: uploadFile.progress_c,
          uploadedBytes_c: uploadFile.uploadedBytes_c,
          uploadUrl_c: uploadFile.uploadUrl_c,
          startTime_c: uploadFile.startTime_c ? new Date(uploadFile.startTime_c).toISOString() : null,
          completedTime_c: uploadFile.completedTime_c ? new Date(uploadFile.completedTime_c).toISOString() : null
        }]
      }

      const response = await apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return false
      }

      return true
    } catch (error) {
      console.error("Error updating file record:", error?.response?.data?.message || error)
      return false
    }
  }

  async fetchUploadedFiles() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        return []
      }

      const params = {
        fields: [
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "uploadedBytes_c"}},
          {"field": {"Name": "thumbnailUrl_c"}},
          {"field": {"Name": "uploadUrl_c"}},
          {"field": {"Name": "startTime_c"}},
          {"field": {"Name": "completedTime_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching uploaded files:", error?.response?.data?.message || error)
      return []
    }
  }

  async uploadFile(uploadFile, onProgress) {
    const fileId = uploadFile.id_c

    if (this.activeUploads.has(fileId)) {
      return
    }

    // Mark as uploading
    const updatedFile = {
      ...uploadFile,
      status_c: "uploading",
      startTime_c: Date.now(),
      error: null
    }
    onProgress(updatedFile)

    // Save initial record to database
    await this.saveFileRecord(updatedFile)

    // Create abort controller for cancellation
    const abortController = new AbortController()
    this.activeUploads.set(fileId, abortController)

    try {
      // Simulate upload with chunked progress
      const chunkSize = Math.max(1024, Math.floor(uploadFile.size_c / 20)) // 20 chunks
      let uploadedBytes = 0
      
      while (uploadedBytes < uploadFile.size_c) {
        // Check if upload was cancelled
        if (abortController.signal.aborted) {
          this.activeUploads.delete(fileId)
          const cancelledFile = {
            ...updatedFile,
            status_c: "cancelled"
          }
          onProgress(cancelledFile)
          await this.updateFileRecord(cancelledFile)
          return
        }

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))
        
        uploadedBytes = Math.min(uploadedBytes + chunkSize, uploadFile.size_c)
        const progress = Math.round((uploadedBytes / uploadFile.size_c) * 100)

        const progressFile = {
          ...updatedFile,
          progress_c: progress,
          uploadedBytes_c: uploadedBytes
        }
        
        onProgress(progressFile)
        await this.updateFileRecord(progressFile)
      }

      // Simulate final processing delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Generate mock upload URL
      const uploadUrl = `https://cdn.quickdrop.app/${fileId}/${encodeURIComponent(uploadFile.name_c)}`

      // Complete upload
      this.activeUploads.delete(fileId)
      const completedFile = {
        ...updatedFile,
        status_c: "completed",
        progress_c: 100,
        uploadedBytes_c: uploadFile.size_c,
        uploadUrl_c: uploadUrl,
        completedTime_c: Date.now()
      }
      
      onProgress(completedFile)
      await this.updateFileRecord(completedFile)

    } catch (error) {
      this.activeUploads.delete(fileId)
      const failedFile = {
        ...updatedFile,
        status_c: "failed",
        error: error.message || "Upload failed"
      }
      onProgress(failedFile)
      await this.updateFileRecord(failedFile)
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