import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Upload, 
  BarChart3, 
  Table2, 
  Settings,
  Download,
  RefreshCw,
  TrendingUp,
  Database,
} from 'lucide-react';

import { FileUpload } from '@/components/dashboard/FileUpload';
import { KPICards } from '@/components/dashboard/KPICards';
import { InteractiveCharts } from '@/components/dashboard/InteractiveCharts';
import { FilterSidebar } from '@/components/dashboard/FilterSidebar';
import { DataTable } from '@/components/dashboard/DataTable';

import { processUploadedData, exportData } from '@/utils/dataProcessing';
import { DashboardData, UploadedFile } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    kpis: [],
    charts: [],
    rawData: [],
    filters: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const { toast } = useToast();

  // Load demo data on mount
  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = () => {
    const demoData = [
      { month: 'Jan', sales: 4000, customers: 240, revenue: 48000, category: 'Electronics', date: '2024-01-15' },
      { month: 'Feb', sales: 3000, customers: 139, revenue: 35000, category: 'Clothing', date: '2024-02-15' },
      { month: 'Mar', sales: 2000, customers: 980, revenue: 78000, category: 'Electronics', date: '2024-03-15' },
      { month: 'Apr', sales: 2780, customers: 390, revenue: 45000, category: 'Home', date: '2024-04-15' },
      { month: 'May', sales: 1890, customers: 480, revenue: 55000, category: 'Sports', date: '2024-05-15' },
      { month: 'Jun', sales: 2390, customers: 380, revenue: 62000, category: 'Electronics', date: '2024-06-15' },
    ];

    const processed = processUploadedData(demoData);
    setDashboardData(processed);
    setActiveTab('overview');
  };

  const handleFilesUpload = (files: UploadedFile[]) => {
    setIsLoading(true);
    
    try {
      // Combine all uploaded data
      const allData = files.flatMap(file => file.data);
      
      // Process the combined data
      const processed = processUploadedData(allData);
      setDashboardData(processed);
      
      toast({
        title: "Files processed successfully!",
        description: `Processed ${files.length} files with ${allData.length} total records.`,
      });
      
      setActiveTab('overview');
    } catch (error) {
      toast({
        title: "Error processing files",
        description: "Please check your file format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterId: string, value: any) => {
    // In a real app, this would filter the dashboard data
    console.log('Filter changed:', filterId, value);
  };

  const handleResetFilters = () => {
    toast({
      title: "Filters reset",
      description: "All filters have been reset to default values.",
    });
  };

  const handleDownloadChart = (chartId: string, format: 'png' | 'jpg' | 'svg') => {
    toast({
      title: "Chart download",
      description: `Downloading chart as ${format.toUpperCase()}...`,
    });
  };

  const handleExportDashboard = (format: 'pdf' | 'html') => {
    toast({
      title: "Dashboard export",
      description: `Exporting dashboard as ${format.toUpperCase()}...`,
    });
  };

  const handleDataExport = (format: 'csv' | 'xlsx' | 'json') => {
    if (dashboardData.rawData.length > 0) {
      exportData(dashboardData.rawData, format, 'dashboard-data');
      toast({
        title: "Data exported",
        description: `Data exported as ${format.toUpperCase()}.`,
      });
    }
  };

  const hasData = dashboardData.rawData.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold flex items-center">
                <LayoutDashboard className="mr-3 h-8 w-8 text-primary" />
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground">
                Professional data visualization and business intelligence platform
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                <Database className="mr-1 h-3 w-3" />
                {dashboardData.rawData.length} Records
              </Badge>
              
              {hasData && (
                <Button 
                  variant="outline" 
                  onClick={() => handleExportDashboard('pdf')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Dashboard
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={loadDemoData}
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Load Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload Data</span>
            </TabsTrigger>
            <TabsTrigger value="overview" disabled={!hasData} className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="charts" disabled={!hasData} className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Charts</span>
            </TabsTrigger>
            <TabsTrigger value="data" disabled={!hasData} className="flex items-center space-x-2">
              <Table2 className="h-4 w-4" />
              <span className="hidden sm:inline">Data Table</span>
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center">
                  <Upload className="mr-3 h-6 w-6" />
                  Upload Your Data Files
                </CardTitle>
                <p className="text-muted-foreground">
                  Upload CSV, Excel, PDF, or DOCX files to automatically generate interactive dashboards
                </p>
              </CardHeader>
              <CardContent>
                <FileUpload onFilesUpload={handleFilesUpload} />
              </CardContent>
            </Card>

            {/* Instructions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Upload Files</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop or select your data files. Supports multiple formats and files.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">2. Auto Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Data is automatically analyzed, cleaned, and prepared for visualization.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Explore Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Interactive charts, KPIs, and filters are automatically generated.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Key Performance Indicators</h2>
              <KPICards data={dashboardData.kpis} />
            </div>

            {/* Quick Charts Overview */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InteractiveCharts 
                  data={dashboardData.charts.slice(0, 2)} 
                  onDownloadChart={handleDownloadChart}
                />
              </div>
              <div>
                <FilterSidebar
                  filters={dashboardData.filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                />
              </div>
            </div>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Interactive Charts</h2>
              <Button variant="outline" onClick={() => handleExportDashboard('html')}>
                <Download className="mr-2 h-4 w-4" />
                Export All Charts
              </Button>
            </div>
            
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <InteractiveCharts 
                  data={dashboardData.charts} 
                  onDownloadChart={handleDownloadChart}
                />
              </div>
              <div>
                <FilterSidebar
                  filters={dashboardData.filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                />
              </div>
            </div>
          </TabsContent>

          {/* Data Table Tab */}
          <TabsContent value="data" className="space-y-6">
            <DataTable
              data={dashboardData.rawData}
              title="Raw Data Explorer"
              onExport={handleDataExport}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}