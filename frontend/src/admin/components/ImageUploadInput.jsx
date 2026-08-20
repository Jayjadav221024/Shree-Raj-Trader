import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../lib/axios';
import { resolveImageUrl } from '../lib/imageResolver';

export default function ImageUploadInput({
  value,
  onChange,
  label = 'Image',
  placeholder = 'Select or upload an image...',
  group = 'products',
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const resolved = value ? resolveImageUrl(value, group) : null;

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success && res.data?.data?.url) {
        onChange(res.data.data.url);
      }
    } catch (err) {
      console.error('[ImageUpload] Upload failed:', err);
      setUploadError(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setUploadError('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-adm-muted">{label}</label>
        {value && (
          <span className="text-[11px] text-adm-success flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Image Attached
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {/* Visual Preview Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-28 h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all shrink-0 overflow-hidden group ${
            value
              ? 'border-adm-primary/50 bg-adm-surface-2'
              : 'border-adm-line-strong hover:border-adm-primary bg-adm-surface-2'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-1.5 text-adm-primary">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-[10px] font-semibold">Uploading...</span>
            </div>
          ) : value && resolved?.src ? (
            <>
              <img
                src={resolved.src}
                alt="Preview"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1">
                <UploadCloud className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-bold">Replace</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-adm-faint group-hover:text-adm-primary transition-colors">
              <ImageIcon className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Upload Image</span>
            </div>
          )}
        </div>

        {/* Input & Direct Controls */}
        <div className="flex-1 w-full space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif,image/avif"
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-adm-primary-soft hover:bg-adm-primary hover:text-adm-primary-fg text-adm-primary rounded-lg transition-colors border border-adm-primary/25 cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Browse & Upload from Device</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-adm-danger hover:bg-adm-danger-soft rounded-lg transition-colors cursor-pointer"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-1.5 text-xs font-mono bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:ring-2 focus:ring-adm-primary/25 text-adm-text placeholder:text-adm-faint"
            />
            <p className="text-[11px] text-adm-faint">
              Upload an image file above, or enter an existing asset key / external URL.
            </p>
          </div>

          {uploadError && <p className="text-xs text-adm-danger font-medium">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
}
