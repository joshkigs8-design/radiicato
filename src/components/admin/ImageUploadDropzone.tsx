'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Check, Loader2, ImagePlus, AlertCircle } from 'lucide-react';
import { uploadImageToStorage, StorageBucket } from '@/lib/supabase';

interface ImageUploadDropzoneProps {
  bucket?: StorageBucket;
  folderPath?: string;
  onUploadSuccess: (url: string, path: string, file: File) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  label?: string;
  helperText?: string;
}

export function ImageUploadDropzone({
  bucket = 'products',
  folderPath = '',
  onUploadSuccess,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  maxSizeMB = 15,
  label = 'Upload Photography Asset',
  helperText = 'Drop high-res collection or product photography here (JPEG, PNG, WebP up to 15MB)',
}: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate type
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg(`Invalid file type: ${file.type}. Please select a JPEG, PNG, or WebP image.`);
      return;
    }

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Max limit is ${maxSizeMB}MB.`);
      return;
    }

    // Preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploading(true);

    try {
      const sanitizedName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .toLowerCase();
      const ext = file.name.split('.').pop();
      const targetPath = folderPath
        ? `${folderPath.replace(/^\/|\/$/g, '')}/${sanitizedName}_${Date.now()}.${ext}`
        : `${sanitizedName}_${Date.now()}.${ext}`;

      const res = await uploadImageToStorage(bucket, file, targetPath);

      if (res.success) {
        setSuccessMsg(`Uploaded to Supabase Storage (${bucket}/${res.path})`);
        onUploadSuccess(res.url, res.path, file);
      } else {
        setErrorMsg(res.error || 'Upload failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#374151]">
          {label}
        </label>
        <span className="text-[10px] font-mono text-[#6B7280]">
          Bucket: <code className="text-[#4D5936] font-bold">{bucket}</code>
        </span>
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#4D5936] bg-[#F4F6F0]'
            : 'border-[#D1D5DB] bg-[#F9FAFB] hover:border-[#9CA3AF] hover:bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {previewUrl ? (
          <div className="space-y-3">
            <div className="relative w-36 h-36 mx-auto rounded overflow-hidden border border-[#E5E7EB] bg-[#111]">
              <Image src={previewUrl} alt="Upload preview" fill className="object-cover" />
              {uploading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                  <Loader2 size={24} className="text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="text-xs">
              {uploading ? (
                <span className="text-amber-700 font-medium">Uploading to Supabase...</span>
              ) : successMsg ? (
                <span className="text-[#4D5936] font-bold flex items-center justify-center gap-1">
                  <Check size={14} /> Ready for Drop Release
                </span>
              ) : (
                <span className="text-[#6B7280]">Click to choose another photo</span>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2 py-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#4B5563]">
              <ImagePlus size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#111827]">
                Click to upload or drag and drop
              </p>
              <p className="text-[11px] text-[#6B7280] mt-1">{helperText}</p>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium p-2 bg-red-50 border border-red-200 rounded">
          <AlertCircle size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-1.5 text-xs text-[#4D5936] font-medium p-2 bg-[#F4F6F0] border border-[#D1D9C5] rounded">
          <Check size={14} />
          <span className="font-mono text-[11px]">{successMsg}</span>
        </div>
      )}
    </div>
  );
}

