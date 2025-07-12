import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "purple" | "emerald" | "cyan" | "yellow" | "orange" | "green";
  loading?: boolean;
}

const StatsCard = ({ title, value, icon: Icon, color, loading }: StatsCardProps) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    emerald: "bg-emerald-100 text-emerald-600",
    cyan: "bg-cyan-100 text-cyan-600",
    yellow: "bg-yellow-100 text-yellow-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
  };

  if (loading) {
    return (
      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="loading-skeleton h-4 w-24 mb-2"></div>
              <div className="loading-skeleton h-8 w-16"></div>
            </div>
            <div className="loading-skeleton w-12 h-12 rounded-xl"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-lift">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
