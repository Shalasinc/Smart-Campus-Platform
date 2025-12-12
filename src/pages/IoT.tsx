import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateSensorData } from '@/data/mockData';
import { SensorData } from '@/types';
import { Thermometer, Droplets, Users, Wind, Activity, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const sensorConfig: Record<string, { icon: React.ElementType; color: string; gradient: string }> = {
  temperature: { icon: Thermometer, color: 'text-orange-500', gradient: 'from-orange-500/20 to-orange-500/5' },
  humidity: { icon: Droplets, color: 'text-blue-500', gradient: 'from-blue-500/20 to-blue-500/5' },
  occupancy: { icon: Users, color: 'text-emerald-500', gradient: 'from-emerald-500/20 to-emerald-500/5' },
  'air-quality': { icon: Wind, color: 'text-purple-500', gradient: 'from-purple-500/20 to-purple-500/5' },
};

const IoT: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [historicalData, setHistoricalData] = useState<Record<string, number[]>>({
    temperature: [],
    humidity: [],
    occupancy: [],
    'air-quality': [],
  });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Initial data
    const initialData = generateSensorData();
    setSensorData(initialData);

    // Update sensor data every 3 seconds
    const interval = setInterval(() => {
      if (isLive) {
        const newData = generateSensorData();
        setSensorData(newData);
        setLastUpdated(new Date());

        // Update historical data
        setHistoricalData(prev => {
          const updated = { ...prev };
          newData.forEach(sensor => {
            updated[sensor.type] = [...(updated[sensor.type] || []).slice(-19), sensor.value];
          });
          return updated;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getChartData = (type: string) => {
    return historicalData[type].map((value, index) => ({
      time: `${index * 3}s`,
      value: Math.round(value * 10) / 10,
    }));
  };

  const getTrend = (type: string) => {
    const data = historicalData[type];
    if (data.length < 2) return 'stable';
    const lastTwo = data.slice(-2);
    const diff = lastTwo[1] - lastTwo[0];
    if (diff > 0.5) return 'up';
    if (diff < -0.5) return 'down';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">IoT Dashboard</h2>
          <p className="text-muted-foreground">Real-time monitoring of campus sensors and devices</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge
            variant={isLive ? 'default' : 'secondary'}
            className={`cursor-pointer ${isLive ? 'animate-pulse-soft' : ''}`}
            onClick={() => setIsLive(!isLive)}
          >
            <Activity className="h-3 w-3 mr-1" />
            {isLive ? 'Live' : 'Paused'}
          </Badge>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensorData.map((sensor, index) => {
          const config = sensorConfig[sensor.type];
          const trend = getTrend(sensor.type);
          const Icon = config.icon;
          
          return (
            <Card
              key={sensor.id}
              className={`glass-card hover-lift overflow-hidden animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none`} />
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="capitalize">{sensor.type.replace('-', ' ')}</CardDescription>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {Math.round(sensor.value * 10) / 10}
                    </p>
                    <p className="text-sm text-muted-foreground">{sensor.unit}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(trend)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{sensor.location}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <Tabs defaultValue="temperature" className="space-y-4">
        <TabsList>
          <TabsTrigger value="temperature" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Temperature
          </TabsTrigger>
          <TabsTrigger value="humidity" className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            Humidity
          </TabsTrigger>
          <TabsTrigger value="occupancy" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Occupancy
          </TabsTrigger>
          <TabsTrigger value="air-quality" className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            Air Quality
          </TabsTrigger>
        </TabsList>

        {Object.entries(sensorConfig).map(([type, config]) => (
          <TabsContent key={type} value={type}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <config.icon className={`h-5 w-5 ${config.color}`} />
                  {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Readings
                </CardTitle>
                <CardDescription>Real-time sensor data over the last minute</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getChartData(type)}>
                      <defs>
                        <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={config.color.includes('orange') ? '#f97316' : config.color.includes('blue') ? '#3b82f6' : config.color.includes('emerald') ? '#10b981' : '#a855f7'} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={config.color.includes('orange') ? '#f97316' : config.color.includes('blue') ? '#3b82f6' : config.color.includes('emerald') ? '#10b981' : '#a855f7'} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={config.color.includes('orange') ? '#f97316' : config.color.includes('blue') ? '#3b82f6' : config.color.includes('emerald') ? '#10b981' : '#a855f7'}
                        fillOpacity={1}
                        fill={`url(#gradient-${type})`}
                        strokeWidth={2}
                        dot={false}
                        animationDuration={300}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* System Status */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">System Status</CardTitle>
          <CardDescription>Overview of all connected IoT devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-success">4</p>
              <p className="text-sm text-muted-foreground">Active Sensors</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground">Offline</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-info">3s</p>
              <p className="text-sm text-muted-foreground">Update Interval</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-warning">0</p>
              <p className="text-sm text-muted-foreground">Alerts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IoT;
