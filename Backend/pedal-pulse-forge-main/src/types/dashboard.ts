export interface KPIData {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
}

export interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'area' | 'pie' | 'scatter' | 'heatmap';
  data: any[];
  config?: any;
}

export interface FilterOption {
  id: string;
  type: 'slider' | 'select' | 'multiselect' | 'date' | 'toggle' | 'checkbox';
  label: string;
  value: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
}

export interface DashboardData {
  kpis: KPIData[];
  charts: ChartData[];
  rawData: any[];
  filters: FilterOption[];
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  data: any[];
  processed: boolean;
}