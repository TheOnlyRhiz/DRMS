import { useState, useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloudUpload, X, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadModal = ({ open, onOpenChange }: UploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    category: "",
    academicYear: new Date().getFullYear().toString(),
  });
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Simulate upload progress
      setUploadProgress(10);
      
      return new Promise<void>((resolve, reject) => {
        // Create XMLHttpRequest for progress tracking
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setUploadProgress(percentComplete);
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(100);
            resolve();
          } else {
            reject(new Error('Upload failed'));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });
        
        // Get the token for authorization
        const token = localStorage.getItem('token');
        xhr.open('POST', '/api/resources');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        xhr.send(data);
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resource uploaded successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      onOpenChange(false);
      resetForm();
      setUploadProgress(0);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload resource. Please try again.",
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  const resetForm = () => {
    setFile(null);
    setFileError("");
    setUploadProgress(0);
    setFormData({
      title: "",
      description: "",
      course: "",
      category: "",
      academicYear: new Date().getFullYear().toString(),
    });
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateFile = useCallback((file: File): string => {
    // File size validation (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return `File size too large. Maximum allowed size is 50MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`;
    }

    // File type validation
    const allowedTypes = [
      // PDF files
      'application/pdf',
      // Word documents
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // PowerPoint presentations
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // Excel spreadsheets
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // Text files
      'text/plain',
      'text/csv',
      'text/rtf',
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      // Archives
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      // Other common formats
      'application/json',
      'text/html',
      'text/xml',
      'application/xml',
    ];

    if (!allowedTypes.includes(file.type)) {
      return `File type not supported. Supported formats: PDF, Word, PowerPoint, Excel, Text, CSV, RTF, Images (JPG, PNG, GIF, etc.), ZIP, RAR, JSON, HTML, XML.`;
    }

    return "";
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const error = validateFile(files[0]);
      if (error) {
        setFileError(error);
        setFile(null);
      } else {
        setFileError("");
        setFile(files[0]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const error = validateFile(files[0]);
      if (error) {
        setFileError(error);
        setFile(null);
      } else {
        setFileError("");
        setFile(files[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    const submitData = new FormData();
    submitData.append("file", file);
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("course", formData.course);
    submitData.append("category", formData.category);
    submitData.append("academicYear", formData.academicYear);

    uploadMutation.mutate(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Resource</DialogTitle>
          <DialogDescription>
            Share academic materials with your department
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              dragActive 
                ? "border-blue-400 bg-blue-50" 
                : file 
                ? "border-green-400 bg-green-50" 
                : "border-gray-300 hover:border-blue-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            {file ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CloudUpload className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setFileError("");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <CloudUpload className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop files here or click to browse
                </h3>
                <p className="text-gray-500 mb-4">
                  Support for PDF, Word, PowerPoint, Excel, Text, Images, Archives, and more - up to 50MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.rtf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.zip,.rar,.7z,.json,.html,.xml"
                  onChange={handleFileChange}
                />
                <Button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer"
                >
                  Select Files
                </Button>
              </>
            )}
          </div>

          {/* File Error Display */}
          {fileError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{fileError}</p>
            </div>
          )}

          {/* Upload Progress */}
          {uploadMutation.isPending && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Uploading...</span>
                <span className="font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Resource Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter resource title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="course">Course *</Label>
              <Select
                value={formData.course}
                onValueChange={(value) => setFormData({ ...formData, course: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSC 101">CSC 101 - Introduction to Computing</SelectItem>
                  <SelectItem value="CSC 201">CSC 201 - Data Structures</SelectItem>
                  <SelectItem value="CSC 301">CSC 301 - Database Systems</SelectItem>
                  <SelectItem value="CSC 302">CSC 302 - Software Engineering</SelectItem>
                  <SelectItem value="CSC 401">CSC 401 - Algorithms</SelectItem>
                  <SelectItem value="CSC 402">CSC 402 - Computer Networks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture_notes">Lecture Notes</SelectItem>
                  <SelectItem value="past_questions">Past Questions</SelectItem>
                  <SelectItem value="project_reports">Project Reports</SelectItem>
                  <SelectItem value="reference_materials">Reference Materials</SelectItem>
                  <SelectItem value="assignments">Assignments</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="academicYear">Academic Year</Label>
              <Select
                value={formData.academicYear}
                onValueChange={(value) => setFormData({ ...formData, academicYear: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a brief description of the resource..."
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-primary"
              disabled={uploadMutation.isPending || !file}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload Resource"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
