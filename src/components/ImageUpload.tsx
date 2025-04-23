'use client'

import ThemeButton from '@/components/ThemeButton';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function ImageUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      
      // Clean up the preview URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  }
  
  async function handleUpload() {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    
    try {
      setUploading(true);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `ideas/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);
      
      if (error) throw error;
      
      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('images').getPublicUrl(filePath);
      
      // Call the callback with the public URL
      onUploadComplete(publicUrl);
      
      // Reset the component state
      setFile(null);
      setPreview(null);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {preview ? (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-40 mx-auto"
            />
          </div>
        ) : (
          <div className="text-gray-500 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-1">Upload an image for your idea</p>
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <ThemeButton
            type="button"
            className="bg-gray-200 text-gray-800"
            onClick={() => document.getElementById('file-upload').click()}
          >
            {preview ? 'Change Image' : 'Select Image'}
          </ThemeButton>
        </label>
      </div>
      
      {file && (
        <div className="text-center">
          <ThemeButton
            type="button"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload & Use Image'}
          </ThemeButton>
        </div>
      )}
    </div>
  );
}