'use client'

import { useState } from 'react'
import { Upload, X, Download } from 'lucide-react'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  uploadedFile: File | null
  onFileChange: (file: File | null) => void
}

export default function UploadModal({ isOpen, onClose, uploadedFile, onFileChange }: UploadModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full p-8 rounded-2xl bg-[#0a0a0a] border border-white/[0.12]">
        <button
          onClick={() => {
            onClose()
            onFileChange(null)
          }}
          className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-1">Upload Trades</h2>
          <p className="text-sm text-gray-500">CSV, XLSX, or XLS format • Get insights in 60 seconds</p>
        </div>

        <div className="p-8 rounded-xl border-2 border-dashed border-white/[0.12] bg-white/[0.02] backdrop-blur-sm text-center mb-6 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all">
          <input
            type="file"
            id="file-upload-modal"
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onFileChange(e.target.files[0])
              }
            }}
          />
          
          <label htmlFor="file-upload-modal" className="cursor-pointer">
            {uploadedFile ? (
              <>
                <div className="text-4xl mb-3">📄</div>
                <h3 className="text-base font-bold text-white mb-1">{uploadedFile?.name}</h3>
                <p className="text-sm text-gray-500 mb-4">Ready to analyze • Click to change</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 mx-auto mb-3 text-gray-500" />
                <h3 className="text-base font-bold text-white mb-1">Drop your file here</h3>
                <p className="text-sm text-gray-500 mb-4">or click to browse your files</p>
              </>
            )}
            <button className="px-5 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-white font-medium transition-all text-sm">
              {uploadedFile ? 'Change File' : 'Choose File'}
            </button>
          </label>
        </div>

        {uploadedFile && (
          <button className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-lg hover:shadow-purple-600/30 text-white font-semibold transition-all">
            Analyze Trades →
          </button>
        )}

        <div className="mt-6 text-center">
          <a href="#" className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">
            <Download className="w-4 h-4" />
            Download CSV Template
          </a>
        </div>
      </div>
    </div>
  )
}
