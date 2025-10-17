import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <Card className="p-4 mb-6 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grade Level
          </label>
          <select
            value={filters.gradeLevel || ""}
            onChange={(e) => onFilterChange("gradeLevel", e.target.value)}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Grades</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class
          </label>
          <select
            value={filters.class || ""}
            onChange={(e) => onFilterChange("class", e.target.value)}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Classes</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Art">Art</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || ""}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Students</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="At Risk">At Risk</option>
          </select>
        </div>
        
        <Button
          onClick={onClearFilters}
          variant="ghost"
          className="h-10"
        >
          <ApperIcon name="X" className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
    </Card>
  );
};

export default FilterPanel;