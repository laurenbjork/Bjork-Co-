'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Eye, TrendingUp, Users, Calendar } from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  topPages: Array<{ page_path: string; view_count: number }>;
  dailyViews: Array<{ date: string; view_count: number }>;
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7' | '30' | '90'>('30');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?days=${dateRange}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available yet.</p>
      </div>
    );
  }

  const maxViews = Math.max(...data.dailyViews.map((d) => d.view_count), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black">Analytics Dashboard</h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Website traffic and visitor insights
          </p>
        </div>
        <div className="flex gap-2">
          {(['7', '30', '90'] as const).map((days) => (
            <button
              key={days}
              onClick={() => setDateRange(days)}
              className={`px-4 py-2 text-[13px] font-medium transition-colors ${
                dateRange === days
                  ? 'bg-[#013220] text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Last {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[12px] text-gray-500 uppercase">Total Views</p>
              <p className="text-[24px] font-medium text-black">{data.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[12px] text-gray-500 uppercase">Unique Visitors</p>
              <p className="text-[24px] font-medium text-black">{data.uniqueVisitors.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-[12px] text-gray-500 uppercase">Avg. Daily</p>
              <p className="text-[24px] font-medium text-black">
                {Math.round(data.totalViews / parseInt(dateRange)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-[12px] text-gray-500 uppercase">Top Page</p>
              <p className="text-[16px] font-medium text-black truncate">
                {data.topPages[0]?.page_path || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="font-serif text-[20px] text-black mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#013220]" />
            Daily Views
          </h2>
          <div className="space-y-2">
            {data.dailyViews.slice(-7).map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-20 text-[13px] text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 h-8 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-[#013220] rounded transition-all duration-500"
                    style={{ width: `${(day.view_count / maxViews) * 100}%` }}
                  />
                </div>
                <div className="w-12 text-right text-[13px] font-medium text-black">
                  {day.view_count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="font-serif text-[20px] text-black mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#013220]" />
            Top Pages
          </h2>
          <div className="space-y-3">
            {data.topPages.slice(0, 5).map((page, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#013220] text-white text-[12px] font-medium rounded flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-[14px] text-black truncate max-w-[200px]">
                    {page.page_path || '/'}
                  </span>
                </div>
                <span className="text-[14px] font-medium text-gray-600">
                  {page.view_count.toLocaleString()} views
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="font-serif text-[20px] text-black mb-4">Device Breakdown</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded">
            <div className="text-[32px] font-medium text-black">
              {Math.round((data.deviceBreakdown.desktop / data.totalViews) * 100) || 0}%
            </div>
            <p className="text-[13px] text-gray-600 mt-1">Desktop</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <div className="text-[32px] font-medium text-black">
              {Math.round((data.deviceBreakdown.mobile / data.totalViews) * 100) || 0}%
            </div>
            <p className="text-[13px] text-gray-600 mt-1">Mobile</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <div className="text-[32px] font-medium text-black">
              {Math.round((data.deviceBreakdown.tablet / data.totalViews) * 100) || 0}%
            </div>
            <p className="text-[13px] text-gray-600 mt-1">Tablet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
