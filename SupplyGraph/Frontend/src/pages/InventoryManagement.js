import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { getTrendingInventory, getInventoryAnalytics } from '../lib/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Package,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Target
} from 'lucide-react';

const InventoryManagement = () => {
  const [trendingItems, setTrendingItems] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const loadInventoryData = async () => {
    try {
      let companyId = localStorage.getItem('companyId');
      if (!companyId) {
        const user = localStorage.getItem('user');
        if (user) companyId = JSON.parse(user).companyId;
      }
      if (!companyId) throw new Error('Missing companyId');

      const [trendingData, analyticsData] = await Promise.all([
        getTrendingInventory(companyId, timeRange),
        getInventoryAnalytics(companyId)
      ]);

      setTrendingItems(trendingData.trending_items || []);
      setAnalytics(analyticsData.summary || {});
    } catch (error) {
      console.error('Error loading inventory data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load inventory data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInventoryData();
  }, [timeRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInventoryData();
  };

  const getTrendIcon = (direction) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-slate-500" />;
    }
  };

  const getTrendColor = (direction) => {
    switch (direction) {
      case 'up':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'down':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading inventory analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 shadow-lg mb-4">
            <Package className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Inventory Intelligence</span>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-4">
            Inventory Management Dashboard
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AI-powered insights into your trending inventory items and sales forecasts
          </p>
        </div>

        {/* Summary Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Products</p>
                    <p className="text-2xl font-bold text-slate-900">{analytics.total_products}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Trending Up</p>
                    <p className="text-2xl font-bold text-green-600">{analytics.trending_up}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Trending Down</p>
                    <p className="text-2xl font-bold text-red-600">{analytics.trending_down}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <TrendingDown className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Stable Items</p>
                    <p className="text-2xl font-bold text-slate-600">{analytics.stable}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Time Range:</span>
            </div>
            <div className="flex space-x-2">
              {['7d', '30d', '90d'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={timeRange === range ? 
                    "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : 
                    "hover:bg-blue-50"
                  }
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {refreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </>
            )}
          </Button>
        </div>

        {/* Top 10 Trending Items */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-slate-900">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <span>Top 10 Trending Inventory Items</span>
              <Badge className="bg-white/80 text-purple-700 border-purple-200 shadow-sm">
                {timeRange} Analysis
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {trendingItems.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No Trending Data Available</h3>
                <p className="text-slate-500">Upload your data and train the model to see trending inventory insights.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trendingItems.map((item, index) => (
                  <div
                    key={item.product}
                    className="group p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform duration-300">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.product}
                          </h4>
                          <p className="text-sm text-slate-600">{item.recommendation}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        {/* Current vs Predicted */}
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Current Sales</p>
                          <p className="text-sm font-semibold text-slate-700">{item.current_demand}</p>
                        </div>
                        
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                        
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Predicted Sales</p>
                          <p className="text-sm font-semibold text-blue-600">{item.predicted_demand}</p>
                        </div>
                        
                        {/* Growth Rate */}
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Growth</p>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(item.trend_direction)}
                            <span className={`text-sm font-semibold ${
                              item.trend_direction === 'up' ? 'text-green-600' : 
                              item.trend_direction === 'down' ? 'text-red-600' : 'text-slate-600'
                            }`}>
                              {item.growth_rate > 0 ? '+' : ''}{item.growth_rate}%
                            </span>
                          </div>
                        </div>
                        
                        {/* Risk Level */}
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Risk</p>
                          <Badge className={`${getRiskColor(item.risk_level)} text-xs`}>
                            <div className="flex items-center space-x-1">
                              {getRiskIcon(item.risk_level)}
                              <span className="capitalize">{item.risk_level}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        {/* Trend Badge */}
                        <Badge className={`${getTrendColor(item.trend_direction)} font-medium`}>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(item.trend_direction)}
                            <span className="capitalize">{item.trend_direction}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 text-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-200 shadow-lg">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <span>Real-time Insights</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Target className="h-4 w-4 text-purple-500" />
              <span>Smart Recommendations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;