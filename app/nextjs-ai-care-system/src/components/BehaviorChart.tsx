import { TrendingUp } from 'lucide-react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface BehaviorChartProps {
  data: any[];
  title?: string;
  type?: 'sleep' | 'exits';
}

export default function BehaviorChart({ data, title = "7天夜间活动趋势" }: BehaviorChartProps) {
  const chartData = data.map((day, index) => ({
    day: day.date ? day.date.slice(5) : `Day ${index + 1}`,
    nightExits: day.night_exits || day.nightExits || 1,
    maxDuration: day.max_exit_duration_min || day.maxDuration || 5,
    sleepTime: parseInt(day.sleep_time?.split(':')[0] || '22'),
  }));

  return (
    <div className="warm-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-xl">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text-deep">{title}</h3>
            <p className="text-sm text-gray-500">过去7天行为趋势</p>
          </div>
        </div>
        <div className="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">数据稳定</div>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Area 
              type="natural" 
              dataKey="nightExits" 
              stroke="#E8945A" 
              fill="#E8945A" 
              fillOpacity={0.15} 
              strokeWidth={3}
              name="夜间起床次数"
            />
            <Line 
              type="natural" 
              dataKey="maxDuration" 
              stroke="#10b981" 
              strokeWidth={2} 
              strokeDasharray="4 2"
              name="最长离床时长(分钟)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6 text-center text-xs">
        <div className="bg-zinc-50 rounded-2xl p-3">
          <div className="text-emerald-600 font-medium">平均起夜</div>
          <div className="text-2xl font-semibold text-text-deep mt-1">2.1</div>
          <div className="text-[10px] text-gray-400">次/晚</div>
        </div>
        <div className="bg-zinc-50 rounded-2xl p-3">
          <div className="text-amber-600 font-medium">平均离床</div>
          <div className="text-2xl font-semibold text-text-deep mt-1">6.4</div>
          <div className="text-[10px] text-gray-400">分钟</div>
        </div>
        <div className="bg-zinc-50 rounded-2xl p-3">
          <div className="text-rose-600 font-medium">入睡一致性</div>
          <div className="text-2xl font-semibold text-text-deep mt-1">87%</div>
          <div className="text-[10px] text-gray-400">良好</div>
        </div>
      </div>
    </div>
  );
}