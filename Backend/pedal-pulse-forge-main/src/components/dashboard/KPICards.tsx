import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KPIData } from '@/types/dashboard';

interface KPICardsProps {
  data: KPIData[];
}

const iconMap = {
  revenue: DollarSign,
  users: Users,
  orders: ShoppingCart,
  activity: Activity,
  trending: TrendingUp,
};

export const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || Activity;
    return Icon;
  };

  const formatChange = (change: number, type: 'positive' | 'negative' | 'neutral') => {
    const Icon = type === 'positive' ? TrendingUp : type === 'negative' ? TrendingDown : Activity;
    const colorClass = type === 'positive' ? 'text-green-600' : type === 'negative' ? 'text-red-600' : 'text-gray-600';
    
    return (
      <div className={`flex items-center space-x-1 ${colorClass}`}>
        <Icon className="h-3 w-3" />
        <span className="text-xs font-medium">
          {type !== 'neutral' && (change > 0 ? '+' : '')}{change}%
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((kpi) => {
        const Icon = getIcon(kpi.icon);
        
        return (
          <Card 
            key={kpi.id} 
            className="hover-lift cursor-pointer group relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${kpi.color}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${kpi.color}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                </div>
                {formatChange(kpi.change, kpi.changeType)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};