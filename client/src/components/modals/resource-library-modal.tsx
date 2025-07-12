import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, Download, Eye, File, Filter, SortAsc, SortDesc, Calendar, User } from "lucide-react";

interface ResourceLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResourceLibraryModal = ({ open, onOpenChange }: ResourceLibraryModalProps) => {
  const [filters, setFilters] = useState({
    category: "",
    course: "",
    search: "",
    sortBy: "title",
    sortOrder: "asc" as "asc" | "desc",
    academicYear: "",
    fileType: "",
    sizeRange: [0, 50] as [number, number],
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: allResources, isLoading } = useQuery({
    queryKey: ["/api/resources"],
    enabled: open,
  });

  // Client-side filtering and sorting for advanced search capabilities
  const filteredAndSortedResources = useMemo(() => {
    if (!allResources || !Array.isArray(allResources)) return [];

    let filtered = allResources.filter((resource: any) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          resource.title.toLowerCase().includes(searchTerm) ||
          resource.description?.toLowerCase().includes(searchTerm) ||
          resource.course.toLowerCase().includes(searchTerm) ||
          resource.category.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && filters.category !== "all") {
        if (resource.category !== filters.category) return false;
      }

      // Course filter
      if (filters.course && filters.course !== "all") {
        if (resource.course !== filters.course) return false;
      }

      // Academic year filter
      if (filters.academicYear && filters.academicYear !== "all") {
        if (resource.academicYear !== filters.academicYear) return false;
      }

      // File type filter
      if (filters.fileType && filters.fileType !== "all") {
        const resourceType = resource.fileType.split('/')[1]?.toLowerCase();
        if (resourceType !== filters.fileType) return false;
      }

      // Size range filter (in MB)
      const fileSizeMB = resource.fileSize / (1024 * 1024);
      if (fileSizeMB < filters.sizeRange[0] || fileSizeMB > filters.sizeRange[1]) {
        return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a: any, b: any) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "fileSize":
          aValue = a.fileSize;
          bValue = b.fileSize;
          break;
        case "course":
          aValue = a.course.toLowerCase();
          bValue = b.course.toLowerCase();
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (filters.sortOrder === "desc") {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [allResources, filters]);

  const downloadMutation = useMutation({
    mutationFn: async (resourceId: number) => {
      await apiRequest("POST", `/api/resources/${resourceId}/download`);
      return resourceId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/user"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to download resource. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDownload = async (resource: any) => {
    try {
      await downloadMutation.mutateAsync(resource.id);
      
      // Create download link
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = resource.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Resource downloaded successfully!",
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType.includes('pdf')) return 'bg-red-100 text-red-800';
    if (fileType.includes('word') || fileType.includes('document')) return 'bg-blue-100 text-blue-800';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Resource Library</DialogTitle>
          <DialogDescription>
            Browse and access academic materials
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="p-4 border-b space-y-4">
          {/* Basic Search Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                placeholder="Search by title, description, course, or category..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-3">
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="lecture_notes">Lecture Notes</SelectItem>
                  <SelectItem value="past_questions">Past Questions</SelectItem>
                  <SelectItem value="project_reports">Project Reports</SelectItem>
                  <SelectItem value="reference_materials">Reference Materials</SelectItem>
                  <SelectItem value="assignments">Assignments</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.course}
                onValueChange={(value) => setFilters({ ...filters, course: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="CSC 101">CSC 101</SelectItem>
                  <SelectItem value="CSC 201">CSC 201</SelectItem>
                  <SelectItem value="CSC 301">CSC 301</SelectItem>
                  <SelectItem value="CSC 302">CSC 302</SelectItem>
                  <SelectItem value="CSC 401">CSC 401</SelectItem>
                  <SelectItem value="CSC 402">CSC 402</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showAdvancedFilters ? "Hide Filters" : "More Filters"}
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              {/* Sort Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort By</label>
                <div className="flex gap-2">
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="createdAt">Date Added</SelectItem>
                      <SelectItem value="fileSize">File Size</SelectItem>
                      <SelectItem value="course">Course</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ 
                      ...filters, 
                      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" 
                    })}
                  >
                    {filters.sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Academic Year */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Academic Year</label>
                <Select
                  value={filters.academicYear}
                  onValueChange={(value) => setFilters({ ...filters, academicYear: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">File Type</label>
                <Select
                  value={filters.fileType}
                  onValueChange={(value) => setFilters({ ...filters, fileType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="msword">Word</SelectItem>
                    <SelectItem value="mspowerpoint">PowerPoint</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="plain">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Size Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  File Size: {filters.sizeRange[0]}MB - {filters.sizeRange[1]}MB
                </label>
                <Slider
                  value={filters.sizeRange}
                  onValueChange={(value) => setFilters({ ...filters, sizeRange: value as [number, number] })}
                  max={50}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {filteredAndSortedResources.length} of {Array.isArray(allResources) ? allResources.length : 0} resources found
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({
                category: "",
                course: "",
                search: "",
                sortBy: "title",
                sortOrder: "asc",
                academicYear: "",
                fileType: "",
                sizeRange: [0, 50],
              })}
            >
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Resource Grid */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="loading-skeleton h-48 rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedResources.length > 0 ? (
                filteredAndSortedResources.map((resource: any) => (
                  <Card key={resource.id} className="hover-lift cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <File className="w-6 h-6 text-blue-600" />
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={getFileTypeColor(resource.fileType)}
                        >
                          {resource.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {resource.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {resource.description || "No description available"}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>{resource.course}</span>
                        <span>{formatFileSize(resource.fileSize)}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDownload(resource)}
                          disabled={downloadMutation.isPending}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {downloadMutation.isPending ? "..." : "Download"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(resource.fileUrl, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <File className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                  <p className="text-gray-500">Try adjusting your search filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceLibraryModal;
