import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatsCard = ({ title, value, icon, trend, trendValue, gradient = "primary" }) => {
  const gradients = {
    primary: "from-primary/10 to-info/10 border-primary/20",
    success: "from-success/10 to-primary/10 border-success/20",
    warning: "from-warning/10 to-error/10 border-warning/20",
    info: "from-info/10 to-primary/10 border-info/20"
  };

  return (
    <Card className={`bg-gradient-to-r ${gradients[gradient]} p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-white/50 backdrop-blur-sm">
          <ApperIcon name={icon} className="h-5 w-5 text-primary" />
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-medium ${
            trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-gray-600'
          }`}>
            {trend === 'up' && <ApperIcon name="TrendingUp" className="h-3 w-3 mr-1" />}
            {trend === 'down' && <ApperIcon name="TrendingDown" className="h-3 w-3 mr-1" />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
          {value}
        </p>
        <p className="text-sm text-gray-600 font-medium">
          {title}
        </p>
      </div>
    </Card>
  );
};

export default StatsCard;