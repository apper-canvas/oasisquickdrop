import React, { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import { uploadService } from "@/services/api/uploadService";
import UploadStats from "@/components/molecules/UploadStats";
import FileTypeInfo from "@/components/molecules/FileTypeInfo";
import FileDropZone from "@/components/organisms/FileDropZone";
import FileUploadQueue from "@/components/organisms/FileUploadQueue";

const Home = () => {
const [uploadFiles, setUploadFiles] = useState([])
const [dragCounter, setDragCounter] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileDrop = useCallback(async (files) => {
    const fileArray = Array.from(files)
    const newUploadFiles = []

    for (const file of fileArray) {
      const validation = uploadService.validateFile(file)
      if (!validation.isValid) {
        toast.error(`${file.name}: ${validation.error}`)
        continue
      }
const uploadFile = await uploadService.createUploadFile(file)
      newUploadFiles.push(uploadFile)
    }

    if (newUploadFiles.length === 0) {
      return
    }

    setUploadFiles(prev => [...prev, ...newUploadFiles])

    // Start uploading files automatically
// Start uploading files automatically
    for (const uploadFile of newUploadFiles) {
      uploadService.uploadFile(uploadFile, (updatedFile) => {
        setUploadFiles(prev => prev.map(file => 
          file.id_c === updatedFile.id_c ? updatedFile : file
        ))
      })
    }

    if (newUploadFiles.length === 1) {
      toast.success(`Started uploading ${newUploadFiles[0].name}`)
    } else {
      toast.success(`Started uploading ${newUploadFiles.length} files`)
    }
  }, [])

  const handleFileSelect = useCallback((e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileDrop(files)
    }
    // Reset input value to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [handleFileDrop])

  const handleBrowseFiles = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleCancelUpload = useCallback((fileId) => {
setUploadFiles(prev => prev.map(file => 
      file.id_c === fileId && file.status_c === "uploading" 
        ? { ...file, status_c: "cancelled" }
        : file
    ))
    toast.info("Upload cancelled")
  }, [])

  const handleRetryUpload = useCallback((fileId) => {
const fileToRetry = uploadFiles.find(f => f.id_c === fileId)
    if (!fileToRetry) return

    const resetFile = {
      ...fileToRetry,
      status_c: "queued",
      progress_c: 0,
      uploadedBytes_c: 0,
      error: null,
      startTime_c: null,
      completedTime_c: null
    }

    setUploadFiles(prev => prev.map(file => 
      file.id_c === fileId ? resetFile : file
    ))

    uploadService.uploadFile(resetFile, (updatedFile) => {
      setUploadFiles(prev => prev.map(file => 
        file.id_c === updatedFile.id_c ? updatedFile : file
      ))
    })

toast.info(`Retrying upload for ${fileToRetry.name}`)
  }, [uploadFiles])

  const handleRemoveFile = useCallback((fileId) => {
    setUploadFiles(prev => prev.filter(file => file.id_c !== fileId))
  }, [])

const handleClearCompleted = useCallback(() => {
    const completedCount = uploadFiles.filter(f => f.status_c === "completed").length
    setUploadFiles(prev => prev.filter(file => file.status_c !== "completed"))
    if (completedCount > 0) {
      toast.success(`Cleared ${completedCount} completed uploads`)
    }
  }, [uploadFiles])

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => {
      const newCounter = prev - 1
      if (newCounter === 0) {
        setIsDragOver(false)
      }
      return newCounter
    })
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setDragCounter(0)
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileDrop(files)
    }
}, [handleFileDrop])

  const stats = {
    total: uploadFiles.length,
    completed: uploadFiles.filter(f => f.status_c === "completed").length,
    failed: uploadFiles.filter(f => f.status_c === "failed").length,
    uploading: uploadFiles.filter(f => f.status_c === "uploading").length,
    totalSize: uploadFiles.reduce((sum, file) => sum + file.size_c, 0),
    uploadedSize: uploadFiles.reduce((sum, file) => sum + file.uploadedBytes_c, 0),
  }

  return (
    <div 
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-primary-500/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-primary-200 animate-scale-pulse">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Drop files here</h3>
                <p className="text-gray-600">Release to start uploading</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-accent-500 bg-clip-text text-transparent">
              QuickDrop
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload files instantly with drag & drop. Watch your progress in real-time and manage your uploads with confidence.
          </p>
        </div>

        {/* Stats and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UploadStats stats={stats} />
          </div>
          <div>
            <FileTypeInfo />
          </div>
        </div>

        {/* Upload Zone */}
        <FileDropZone
          onFileDrop={handleFileDrop}
          onBrowseFiles={handleBrowseFiles}
          hasFiles={uploadFiles.length > 0}
          isDragOver={isDragOver}
        />

        {/* File Queue */}
        {uploadFiles.length > 0 && (
          <FileUploadQueue
            files={uploadFiles}
            onCancelUpload={handleCancelUpload}
            onRetryUpload={handleRetryUpload}
            onRemoveFile={handleRemoveFile}
            onClearCompleted={handleClearCompleted}
          />
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  )
}

export default Home