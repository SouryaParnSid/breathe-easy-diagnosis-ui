
import React, { useState, useCallback } from 'react';
import { Upload, Image, X, CheckCircle } from 'lucide-react';

const FileUpload = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    onFileSelect(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!selectedFile ? (
        <div
          className={`glass-card p-12 border-2 border-dashed transition-all duration-300 cursor-pointer ${
            isDragOver 
              ? 'border-primary bg-primary/10 scale-105' 
              : 'border-border hover:border-primary/50 hover:bg-white/5'
          }`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div className="text-center">
            <div className="mb-6">
              <Upload className={`h-16 w-16 mx-auto transition-colors duration-300 ${
                isDragOver ? 'text-primary' : 'text-muted-foreground'
              }`} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload CT Scan Image</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your CT scan image here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports JPEG, PNG, DICOM formats • Max size 10MB
            </p>
          </div>
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/*,.dcm"
            onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="glass-card p-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <span className="font-medium">File uploaded successfully</span>
            </div>
            <button
              onClick={clearFile}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="bg-muted/20 rounded-lg p-3 mb-2">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium truncate">{selectedFile.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {preview && (
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted/20">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
