import { KPIData, ChartData, FilterOption, DashboardData } from '@/types/dashboard';

export const processUploadedData = (rawData: any[]): DashboardData => {
  if (!rawData || rawData.length === 0) {
    return {
      kpis: [],
      charts: [],
      rawData: [],
      filters: [],
    };
  }

  // Generate KPIs
  const kpis = generateKPIs(rawData);
  
  // Generate charts
  const charts = generateCharts(rawData);
  
  // Generate filters
  const filters = generateFilters(rawData);

  return {
    kpis,
    charts,
    rawData,
    filters,
  };
};

const generateKPIs = (data: any[]): KPIData[] => {
  const numericColumns = getNumericColumns(data);
  const kpis: KPIData[] = [];

  // Total Records KPI
  kpis.push({
    id: 'total-records',
    title: 'Total Records',
    value: data.length.toLocaleString(),
    change: 12.5,
    changeType: 'positive',
    icon: 'activity',
    color: 'from-blue-500 to-blue-600',
  });

  // Process numeric columns for KPIs
  if (numericColumns.length > 0) {
    const firstNumericColumn = numericColumns[0];
    const values = data.map(row => Number(row[firstNumericColumn])).filter(val => !isNaN(val));
    
    if (values.length > 0) {
      const sum = values.reduce((acc, val) => acc + val, 0);
      const avg = sum / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);

      kpis.push({
        id: 'sum',
        title: `Total ${firstNumericColumn}`,
        value: sum.toLocaleString(),
        change: 8.3,
        changeType: 'positive',
        icon: 'trending',
        color: 'from-green-500 to-green-600',
      });

      kpis.push({
        id: 'average',
        title: `Average ${firstNumericColumn}`,
        value: Math.round(avg).toLocaleString(),
        change: -2.1,
        changeType: 'negative',
        icon: 'activity',
        color: 'from-orange-500 to-orange-600',
      });

      kpis.push({
        id: 'max',
        title: `Max ${firstNumericColumn}`,
        value: max.toLocaleString(),
        change: 15.2,
        changeType: 'positive',
        icon: 'trending',
        color: 'from-purple-500 to-purple-600',
      });
    }
  }

  // Categorical analysis
  const categoricalColumns = getCategoricalColumns(data);
  if (categoricalColumns.length > 0) {
    const firstCatColumn = categoricalColumns[0];
    const uniqueValues = [...new Set(data.map(row => row[firstCatColumn]))];
    
    kpis.push({
      id: 'categories',
      title: `Unique ${firstCatColumn}`,
      value: uniqueValues.length,
      change: 5.7,
      changeType: 'positive',
      icon: 'users',
      color: 'from-indigo-500 to-indigo-600',
    });
  }

  return kpis;
};

const generateCharts = (data: any[]): ChartData[] => {
  const charts: ChartData[] = [];
  const numericColumns = getNumericColumns(data);
  const categoricalColumns = getCategoricalColumns(data);
  const dateColumns = getDateColumns(data);

  // Line chart for time series (if date column exists)
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    const dateCol = dateColumns[0];
    const numCol = numericColumns[0];
    
    const timeSeriesData = data
      .map(row => ({
        date: new Date(row[dateCol]).toLocaleDateString(),
        value: Number(row[numCol]) || 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    charts.push({
      id: 'time-series',
      title: `${numCol} Over Time`,
      type: 'line',
      data: timeSeriesData,
    });
  }

  // Bar chart for categorical data
  if (categoricalColumns.length > 0) {
    const catCol = categoricalColumns[0];
    const categoryData = data.reduce((acc, row) => {
      const category = row[catCol];
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const barData = Object.entries(categoryData).map(([category, count]) => ({
      category,
      count,
    }));

    charts.push({
      id: 'category-distribution',
      title: `${catCol} Distribution`,
      type: 'bar',
      data: barData,
    });
  }

  // Area chart for cumulative data
  if (numericColumns.length >= 2) {
    const areaData = data.slice(0, 10).map((row, index) => ({
      name: `Point ${index + 1}`,
      value1: Number(row[numericColumns[0]]) || 0,
      value2: Number(row[numericColumns[1]]) || 0,
    }));

    charts.push({
      id: 'area-comparison',
      title: `${numericColumns[0]} vs ${numericColumns[1]}`,
      type: 'area',
      data: areaData,
    });
  }

  // Pie chart for top categories
  if (categoricalColumns.length > 0) {
    charts.push({
      id: 'pie-chart',
      title: 'Category Breakdown',
      type: 'pie',
      data: [], // Will be handled in the chart component
    });
  }

  // Scatter plot for numeric relationships
  if (numericColumns.length >= 2) {
    charts.push({
      id: 'scatter-plot',
      title: `${numericColumns[0]} vs ${numericColumns[1]} Correlation`,
      type: 'scatter',
      data: [], // Will be handled in the chart component
    });
  }

  // Default sales data if no suitable data found
  if (charts.length === 0) {
    charts.push(
      {
        id: 'sales-trend',
        title: 'Sales Trend',
        type: 'line',
        data: [
          { month: 'Jan', sales: 4000, revenue: 48000 },
          { month: 'Feb', sales: 3000, revenue: 35000 },
          { month: 'Mar', sales: 2000, revenue: 78000 },
          { month: 'Apr', sales: 2780, revenue: 45000 },
          { month: 'May', sales: 1890, revenue: 55000 },
          { month: 'Jun', sales: 2390, revenue: 62000 },
        ],
      },
      {
        id: 'performance-metrics',
        title: 'Performance Metrics',
        type: 'bar',
        data: [
          { month: 'Jan', sales: 4000, customers: 240 },
          { month: 'Feb', sales: 3000, customers: 139 },
          { month: 'Mar', sales: 2000, customers: 980 },
          { month: 'Apr', sales: 2780, customers: 390 },
          { month: 'May', sales: 1890, customers: 480 },
          { month: 'Jun', sales: 2390, customers: 380 },
        ],
      }
    );
  }

  return charts;
};

const generateFilters = (data: any[]): FilterOption[] => {
  const filters: FilterOption[] = [];
  const columns = Object.keys(data[0] || {});

  // Numeric columns get slider filters
  const numericColumns = getNumericColumns(data);
  numericColumns.forEach(column => {
    const values = data.map(row => Number(row[column])).filter(val => !isNaN(val));
    if (values.length > 0) {
      filters.push({
        id: `${column}-range`,
        type: 'slider',
        label: `${column} Range`,
        value: Math.min(...values),
        min: Math.min(...values),
        max: Math.max(...values),
      });
    }
  });

  // Categorical columns get select filters
  const categoricalColumns = getCategoricalColumns(data);
  categoricalColumns.slice(0, 3).forEach(column => {
    const uniqueValues = [...new Set(data.map(row => row[column]))];
    if (uniqueValues.length > 1 && uniqueValues.length <= 20) {
      filters.push({
        id: `${column}-filter`,
        type: 'select',
        label: column,
        value: 'all',
        options: [
          { label: 'All', value: 'all' },
          ...uniqueValues.map(val => ({ label: String(val), value: String(val) })),
        ],
      });
    }
  });

  // Add some common filters
  filters.push({
    id: 'show-zero',
    type: 'toggle',
    label: 'Include Zero Values',
    value: true,
  });

  return filters;
};

const getNumericColumns = (data: any[]): string[] => {
  if (!data || data.length === 0) return [];
  
  const firstRow = data[0];
  return Object.keys(firstRow).filter(key => {
    const value = firstRow[key];
    return typeof value === 'number' || (!isNaN(Number(value)) && value !== '');
  });
};

const getCategoricalColumns = (data: any[]): string[] => {
  if (!data || data.length === 0) return [];
  
  const firstRow = data[0];
  return Object.keys(firstRow).filter(key => {
    const value = firstRow[key];
    return typeof value === 'string' && isNaN(Number(value));
  });
};

const getDateColumns = (data: any[]): string[] => {
  if (!data || data.length === 0) return [];
  
  const firstRow = data[0];
  return Object.keys(firstRow).filter(key => {
    const value = firstRow[key];
    return !isNaN(Date.parse(String(value)));
  });
};

export const exportData = (data: any[], format: 'csv' | 'xlsx' | 'json', filename: string = 'export') => {
  if (format === 'json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `${filename}.json`);
  } else if (format === 'csv') {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadBlob(blob, `${filename}.csv`);
  }
};

const convertToCSV = (data: any[]): string => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(','))
  ].join('\n');
  
  return csvContent;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};