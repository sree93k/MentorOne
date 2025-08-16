// components/admin/VideoAnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import {
  Activity,
  Users,
  PlayCircle,
  Clock,
  TrendingUp,
  Globe,
  Shield,
  Settings,
  Download,
  Wifi,
  Eye,
  BarChart3
} from 'lucide-react';

interface VideoAnalytics {
  totalViews: number;
  totalWatchTime: number;
  averageWatchTime: number;
  completionRate: number;
  topQualities: Array<{ name: string; usage: number }>;
  qualityChanges: number;
  bufferingEvents: number;
  cdnPerformance: {
    cacheHitRate: number;
    averageLoadTime: number;
    bandwidthSaved: number;
  };
  securityMetrics: {
    blockedAttempts: number;
    sessionViolations: number;
    downloadPrevention: number;
  };
  globalStats: {
    countries: Array<{ name: string; views: number }>;
    regions: Array<{ name: string; performance: number }>;
  };
}

const VideoAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<VideoAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockAnalytics: VideoAnalytics = {
        totalViews: 15234,
        totalWatchTime: 2891470, // in seconds
        averageWatchTime: 189.8,
        completionRate: 73.5,
        topQualities: [
          { name: '720p', usage: 45.2 },
          { name: '1080p', usage: 32.1 },
          { name: '480p', usage: 15.7 },
          { name: '360p', usage: 7.0 }
        ],
        qualityChanges: 8934,
        bufferingEvents: 1247,
        cdnPerformance: {
          cacheHitRate: 94.7,
          averageLoadTime: 1.2,
          bandwidthSaved: 89.3
        },
        securityMetrics: {
          blockedAttempts: 342,
          sessionViolations: 28,
          downloadPrevention: 95.8
        },
        globalStats: {
          countries: [
            { name: 'India', views: 8945 },
            { name: 'USA', views: 3421 },
            { name: 'UK', views: 1456 },
            { name: 'Canada', views: 892 },
            { name: 'Australia', views: 520 }
          ],
          regions: [
            { name: 'Asia-Pacific', performance: 92.4 },
            { name: 'North America', performance: 88.7 },
            { name: 'Europe', performance: 91.2 },
            { name: 'Other', performance: 85.6 }
          ]
        }
      };
      
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎬 Video Analytics Dashboard</h1>
          <p className="text-gray-600">Professional streaming insights & security metrics</p>
        </div>
        <div className="flex gap-2">
          {(['24h', '7d', '30d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              onClick={() => setTimeRange(range)}
              className="rounded-lg"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Views</p>
                <p className="text-3xl font-bold text-purple-900">{formatNumber(analytics.totalViews)}</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-full">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Watch Time</p>
                <p className="text-3xl font-bold text-blue-900">{formatDuration(analytics.totalWatchTime)}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completion Rate</p>
                <p className="text-3xl font-bold text-green-900">{analytics.completionRate}%</p>
              </div>
              <div className="p-3 bg-green-200 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg. Session</p>
                <p className="text-3xl font-bold text-orange-900">{formatDuration(analytics.averageWatchTime)}</p>
              </div>
              <div className="p-3 bg-orange-200 rounded-full">
                <PlayCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Usage */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Quality Usage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.topQualities}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, usage }) => `${name}: ${usage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="usage"
                >
                  {analytics.topQualities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Global Performance */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Global Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.globalStats.regions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="performance" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CDN Performance */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              CDN Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cache Hit Rate</span>
              <Badge className="bg-green-100 text-green-800">
                {analytics.cdnPerformance.cacheHitRate}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Load Time</span>
              <Badge className="bg-blue-100 text-blue-800">
                {analytics.cdnPerformance.averageLoadTime}s
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bandwidth Saved</span>
              <Badge className="bg-purple-100 text-purple-800">
                {analytics.cdnPerformance.bandwidthSaved}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Security Metrics */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Download Prevention</span>
              <Badge className="bg-green-100 text-green-800">
                {analytics.securityMetrics.downloadPrevention}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Blocked Attempts</span>
              <Badge className="bg-red-100 text-red-800">
                {analytics.securityMetrics.blockedAttempts}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Session Violations</span>
              <Badge className="bg-orange-100 text-orange-800">
                {analytics.securityMetrics.sessionViolations}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quality & Streaming */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Streaming Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Quality Changes</span>
              <Badge className="bg-blue-100 text-blue-800">
                {formatNumber(analytics.qualityChanges)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Buffering Events</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                {formatNumber(analytics.bufferingEvents)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Adaptive Rate</span>
              <Badge className="bg-purple-100 text-purple-800">
                87.2%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Countries */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top Countries by Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.globalStats.countries.map((country, index) => (
              <div key={country.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg text-gray-500">#{index + 1}</span>
                  <span className="font-medium">{country.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{formatNumber(country.views)} views</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${(country.views / analytics.totalViews) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoAnalyticsDashboard;