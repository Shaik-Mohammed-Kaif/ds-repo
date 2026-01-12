import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarIcon, 
  Filter, 
  RefreshCw, 
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FilterOption } from '@/types/dashboard';

interface FilterSidebarProps {
  filters: FilterOption[];
  onFilterChange: (filterId: string, value: any) => void;
  onResetFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const [openSections, setOpenSections] = useState<string[]>(['basic', 'advanced']);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const renderFilter = (filter: FilterOption) => {
    switch (filter.type) {
      case 'slider':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <div className="px-3">
              <Slider
                value={[filter.value || filter.min || 0]}
                onValueChange={(value) => onFilterChange(filter.id, value[0])}
                max={filter.max || 100}
                min={filter.min || 0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{filter.min || 0}</span>
                <span className="font-medium text-foreground">
                  {filter.value || filter.min || 0}
                </span>
                <span>{filter.max || 100}</span>
              </div>
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <Select 
              value={filter.value} 
              onValueChange={(value) => onFilterChange(filter.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option..." />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filter.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${filter.id}-${option.value}`}
                    checked={filter.value?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const currentValues = filter.value || [];
                      const newValues = checked
                        ? [...currentValues, option.value]
                        : currentValues.filter((v: any) => v !== option.value);
                      onFilterChange(filter.id, newValues);
                    }}
                  />
                  <Label 
                    htmlFor={`${filter.id}-${option.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            {filter.value && filter.value.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {filter.value.map((val: any) => {
                  const option = filter.options?.find(o => o.value === val);
                  return (
                    <Badge key={val} variant="secondary" className="text-xs">
                      {option?.label}
                      <button
                        onClick={() => {
                          const newValues = filter.value.filter((v: any) => v !== val);
                          onFilterChange(filter.id, newValues);
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <Switch
              checked={filter.value}
              onCheckedChange={(checked) => onFilterChange(filter.id, checked)}
            />
          </div>
        );

      case 'date':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, 'PPP') : 'From date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => {
                      setDateRange(prev => ({ ...prev, from: date }));
                      onFilterChange(filter.id, { ...dateRange, from: date });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const basicFilters = filters.filter(f => ['select', 'slider', 'toggle'].includes(f.type));
  const advancedFilters = filters.filter(f => ['multiselect', 'date', 'checkbox'].includes(f.type));

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Filters */}
        <Collapsible open={openSections.includes('basic')}>
          <CollapsibleTrigger 
            onClick={() => toggleSection('basic')}
            className="flex w-full items-center justify-between text-sm font-medium hover:text-primary transition-colors"
          >
            Basic Filters
            {openSections.includes('basic') ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {basicFilters.map(filter => (
              <div key={filter.id}>
                {renderFilter(filter)}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Advanced Filters */}
        <Collapsible open={openSections.includes('advanced')}>
          <CollapsibleTrigger 
            onClick={() => toggleSection('advanced')}
            className="flex w-full items-center justify-between text-sm font-medium hover:text-primary transition-colors"
          >
            Advanced Filters
            {openSections.includes('advanced') ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {advancedFilters.map(filter => (
              <div key={filter.id}>
                {renderFilter(filter)}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Quick Search */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quick Search</Label>
          <Input
            type="text"
            placeholder="Search data..."
            className="w-full"
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};