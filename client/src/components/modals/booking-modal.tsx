import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Monitor, AlertCircle, CheckCircle } from "lucide-react";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingModal = ({ open, onOpenChange }: BookingModalProps) => {
  const { user } = useAuth();
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    purpose: "",
    notes: "",
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: equipment, isLoading: equipmentLoading } = useQuery({
    queryKey: ["/api/equipment"],
    enabled: open,
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return await apiRequest("POST", "/api/bookings", bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Equipment booking request submitted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedEquipment("");
    setFormData({
      startTime: "",
      endTime: "",
      purpose: "",
      notes: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEquipment) {
      toast({
        title: "Error",
        description: "Please select equipment to book.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      toast({
        title: "Error",
        description: "Please select start and end times.",
        variant: "destructive",
      });
      return;
    }

    const startDate = new Date(formData.startTime);
    const endDate = new Date(formData.endTime);

    if (startDate >= endDate) {
      toast({
        title: "Error",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    if (startDate < new Date()) {
      toast({
        title: "Error",
        description: "Booking time cannot be in the past.",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      equipmentId: parseInt(selectedEquipment),
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      purpose: formData.purpose,
      notes: formData.notes,
    };

    bookingMutation.mutate(bookingData);
  };

  // Get current date and time for minimum values
  const now = new Date();
  const minDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  // Check if user has permission to book
  const canBook = user?.role === "student" || user?.role === "admin";

  if (!canBook) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span>Access Restricted</span>
            </DialogTitle>
            <DialogDescription>
              Equipment booking is available for students and administrators.
              Please contact an administrator if you need assistance with bookings.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const selectedEquipmentItem = equipment?.find((item: any) => 
    item.id === parseInt(selectedEquipment)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Book Equipment</DialogTitle>
          <DialogDescription>
            Reserve equipment for your academic activities and events
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <form onSubmit={handleSubmit} className="space-y-6 p-4">
            {/* Equipment Selection */}
            <div>
              <Label htmlFor="equipment">Select Equipment *</Label>
              <Select
                value={selectedEquipment}
                onValueChange={setSelectedEquipment}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose equipment to book" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentLoading ? (
                    <SelectItem value="loading" disabled>Loading equipment...</SelectItem>
                  ) : (
                    equipment?.map((item: any) => (
                      <SelectItem 
                        key={item.id} 
                        value={item.id.toString()}
                        disabled={item.availableUnits === 0}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{item.name}</span>
                          <Badge 
                            variant={item.availableUnits > 0 ? "default" : "destructive"}
                            className="ml-2"
                          >
                            {item.availableUnits} available
                          </Badge>
                        </div>
                      </SelectItem>
                    )) || (
                      <SelectItem value="none" disabled>No equipment available</SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Equipment Details */}
            {selectedEquipmentItem && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Monitor className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {selectedEquipmentItem.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedEquipmentItem.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Available: {selectedEquipmentItem.availableUnits}</span>
                        <span>Total: {selectedEquipmentItem.totalUnits}</span>
                        {selectedEquipmentItem.location && (
                          <span>Location: {selectedEquipmentItem.location}</span>
                        )}
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="startTime">Start Date & Time *</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  min={minDateTime}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="endTime">End Date & Time *</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  min={formData.startTime || minDateTime}
                  required
                />
              </div>
            </div>

            {/* Booking Duration Display */}
            {formData.startTime && formData.endTime && (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      Duration: {Math.round(
                        (new Date(formData.endTime).getTime() - new Date(formData.startTime).getTime()) 
                        / (1000 * 60 * 60)
                      )} hours
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Purpose */}
            <div>
              <Label htmlFor="purpose">Purpose *</Label>
              <Input
                id="purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="e.g., Lecture presentation, Lab session, Department meeting"
                required
              />
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special requirements or additional information..."
                rows={3}
              />
            </div>

            {/* Booking Guidelines */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Booking Guidelines
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Bookings require approval from department administrators</li>
                  <li>• Please book equipment at least 24 hours in advance</li>
                  <li>• Cancel unused bookings to make equipment available for others</li>
                  <li>• Report any equipment issues immediately after use</li>
                </ul>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
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
                disabled={bookingMutation.isPending || !selectedEquipment}
              >
                {bookingMutation.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Submit Booking Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
