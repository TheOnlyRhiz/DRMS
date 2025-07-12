import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Monitor, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle,
  Info
} from "lucide-react";

interface EquipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EquipmentModal = ({ open, onOpenChange }: EquipmentModalProps) => {
  const { user } = useAuth();

  const { data: equipment, isLoading } = useQuery({
    queryKey: ["/api/equipment"],
    enabled: open,
  });

  const getStatusColor = (availableUnits: number, totalUnits: number) => {
    const ratio = availableUnits / totalUnits;
    if (ratio > 0.5) return { bg: "bg-green-100", text: "text-green-800", icon: "text-green-500" };
    if (ratio > 0) return { bg: "bg-yellow-100", text: "text-yellow-800", icon: "text-yellow-500" };
    return { bg: "bg-red-100", text: "text-red-800", icon: "text-red-500" };
  };

  const getStatusIcon = (availableUnits: number, totalUnits: number) => {
    const ratio = availableUnits / totalUnits;
    if (ratio > 0) return <CheckCircle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  const getStatusText = (availableUnits: number, totalUnits: number) => {
    if (availableUnits === 0) return "Unavailable";
    if (availableUnits === totalUnits) return "Available";
    return "Limited";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Equipment & Resources</DialogTitle>
          <DialogDescription>
            View available equipment and their current status
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="loading-skeleton h-64 rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipment?.map((item: any) => {
                const statusColors = getStatusColor(item.availableUnits, item.totalUnits);
                const statusText = getStatusText(item.availableUnits, item.totalUnits);
                
                return (
                  <Card key={item.id} className="hover-lift group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Monitor className="w-6 h-6 text-blue-600" />
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${statusColors.bg} ${statusColors.text}`}
                        >
                          {statusText}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {item.description || "Professional equipment for academic use."}
                      </p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Total Units:</span>
                          <span className="font-medium text-gray-900">{item.totalUnits}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Available:</span>
                          <span className={`font-medium ${statusColors.text}`}>
                            {item.availableUnits}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">In Use:</span>
                          <span className="font-medium text-gray-900">
                            {item.totalUnits - item.availableUnits}
                          </span>
                        </div>
                        {item.location && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Location:</span>
                            <span className="font-medium text-gray-900">{item.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Status indicator */}
                      <div className={`flex items-center space-x-2 p-3 rounded-lg ${statusColors.bg} mb-4`}>
                        <div className={statusColors.icon}>
                          {getStatusIcon(item.availableUnits, item.totalUnits)}
                        </div>
                        <span className={`text-sm font-medium ${statusColors.text}`}>
                          {item.availableUnits > 0 
                            ? `${item.availableUnits} unit${item.availableUnits > 1 ? 's' : ''} available for booking`
                            : "All units currently in use"
                          }
                        </span>
                      </div>

                      {/* Student notice */}
                      {user?.role === "student" && (
                        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                          <Info className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-blue-700">
                            Students can view only - Faculty/Admin can book
                          </span>
                        </div>
                      )}
                      
                      {/* Faculty/Admin booking button */}
                      {(user?.role === "faculty" || user?.role === "admin") && (
                        <Button 
                          className="w-full"
                          disabled={item.availableUnits === 0}
                          variant={item.availableUnits > 0 ? "default" : "secondary"}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          {item.availableUnits > 0 ? "Book Equipment" : "Currently Unavailable"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              }) || (
                <div className="col-span-full text-center py-12">
                  <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment available</h3>
                  <p className="text-gray-500">Equipment will appear here once added by administrators</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Equipment categories summary */}
        {equipment && equipment.length > 0 && (
          <div className="border-t p-4">
            <h4 className="font-medium text-gray-900 mb-3">Equipment Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {equipment.length}
                </div>
                <div className="text-sm text-gray-600">Total Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {equipment.reduce((sum: number, item: any) => sum + item.availableUnits, 0)}
                </div>
                <div className="text-sm text-gray-600">Available Units</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {equipment.reduce((sum: number, item: any) => sum + item.totalUnits, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Units</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {equipment.reduce((sum: number, item: any) => sum + (item.totalUnits - item.availableUnits), 0)}
                </div>
                <div className="text-sm text-gray-600">In Use</div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentModal;
