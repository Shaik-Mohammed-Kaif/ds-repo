import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, FileSpreadsheet, File, X, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UploadedFile } from '@/types/dashboard';

interface FileUploadProps {
  onFilesUpload: (files: UploadedFile[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesUpload }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const processFile = async (file: File): Promise<UploadedFile> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        let data: any[] = [];
        
        // Simulate data processing based on file type
        if (file.type.includes('csv') || file.name.endsWith('.csv')) {
          // Mock CSV data
          data = [
            { month: 'Jan', sales: 4000, customers: 240, revenue: 48000 },
            { month: 'Feb', sales: 3000, customers: 139, revenue: 35000 },
            { month: 'Mar', sales: 2000, customers: 980, revenue: 78000 },
            { month: 'Apr', sales: 2780, customers: 390, revenue: 45000 },
            { month: 'May', sales: 1890, customers: 480, revenue: 55000 },
            { month: 'Jun', sales: 2390, customers: 380, revenue: 62000 },
          ];
        } else {
          // Mock data for other file types
          data = Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
            value: Math.floor(Math.random() * 1000) + 100,
            date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
          }));
        }

        resolve({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          data,
          processed: true,
        });
      };
      reader.readAsText(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setProgress(0);

    const processedFiles: UploadedFile[] = [];
    
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      setProgress((i / acceptedFiles.length) * 100);
      
      const processedFile = await processFile(file);
      processedFiles.push(processedFile);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setProgress(100);
    setUploadedFiles(prev => [...prev, ...processedFiles]);
    onFilesUpload(processedFiles);
    
    setTimeout(() => {
      setUploading(false);
      setProgress(0);
    }, 500);
  }, [onFilesUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('csv') || type.includes('excel') || type.includes('spreadsheet')) {
      return <FileSpreadsheet className="h-6 w-6 text-primary" />;
    }
    if (type.includes('pdf')) {
      return <FileText className="h-6 w-6 text-destructive" />;
    }
    return <File className="h-6 w-6 text-muted-foreground" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-primary font-medium">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-lg font-medium mb-2">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-muted-foreground">
                Supports CSV, Excel, PDF, and DOCX files (Max 20MB each)
              </p>
            </div>
          )}
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Processing files...</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Uploaded Files</h4>
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.data.length} records
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Processed
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};