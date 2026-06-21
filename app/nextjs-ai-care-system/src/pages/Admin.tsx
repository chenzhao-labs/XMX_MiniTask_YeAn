import { useState } from 'react';
import baseline from '../lib/mock-data/baseline.json';
import todayNormal from '../lib/mock-data/today-normal.json';
import todayAbnormal from '../lib/mock-data/today-abnormal.json';
import { Zap, Activity } from 'lucide-react';

export default function Admin() {
  const [sensorLogs, setSensorLogs] = useState<string[]>([
    "23:12  床垫传感器上报：夜间起床事件",
    "23:41  红外传感器：卧室活动 4分钟",
    "00:03  门磁传感器：无异常",
  ]);
  
  const [currentData, setCurrentData] = useState('normal');

  const simulateSensorData = (type: string) => {
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    let logEntry = '';
    
    if (type === 'normal') {
      logEntry = `${timestamp}  模拟正常夜起 - 传感器数据已记录`;
      setCurrentData('normal');
    } else if (type === 'fall') {
      logEntry = `${timestamp}  ⚠️ 高冲击力事件 (8.7G) - 疑似跌倒`;
      setCurrentData('abnormal');
    } else {
      logEntry = `${timestamp}  🚨 严重事件 - 30秒内无活动信号`;
      setCurrentData('critical');
    }
    
    setSensorLogs(prev => [logEntry, ...prev].slice(0, 7));
  };

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="uppercase text-xs font-mono tracking-[1px] text-purple-500">SIMULATOR v0.8</div>
          <h2 className="text-5xl font-bold">数据采集模拟面板</h2>
        </div>
        <div className="px-4 py-2 bg-purple-100 text-purple-700 text-sm font-medium rounded-3xl flex items-center gap-2">
          <Activity className="w-4 h-4" /> LIVE
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="warm-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-purple-100 text-purple-500 p-3 rounded-2xl">
                <Zap className="w-6 h-6" />
              </div>
              <div className="font-medium">硬件传感器模拟器</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => simulateSensorData('normal')} className="h-28 border border-emerald-200 hover:bg-emerald-50 transition-colors rounded-3xl flex flex-col items-center justify-center gap-2 text-sm">
                <div className="text-3xl">🌙</div>
                <div>正常夜起</div>
              </button>
              
              <button onClick={() => simulateSensorData('fall')} className="h-28 border border-amber-200 hover:bg-amber-50 transition-colors rounded-3xl flex flex-col items-center justify-center gap-2 text-sm">
                <div className="text-3xl">⚠️</div>
                <div>疑似跌倒</div>
              </button>
              
              <button onClick={() => simulateSensorData('critical')} className="h-28 border border-rose-200 hover:bg-rose-50 transition-colors rounded-3xl flex flex-col items-center justify-center gap-2 text-sm">
                <div className="text-3xl">🆘</div>
                <div>确认跌倒</div>
              </button>
            </div>
            
            <div className="mt-10">
              <div className="text-xs uppercase text-gray-400 mb-4 tracking-widest">最近传感器上报日志</div>
              <div className="font-mono text-xs bg-zinc-900 text-emerald-300 p-6 rounded-3xl space-y-3 h-72 overflow-auto">
                {sensorLogs.map((log, i) => (
                  <div key={i} className="opacity-90">{log}</div>
                ))}
                {sensorLogs.length === 0 && <div className="opacity-30">暂无日志</div>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <div className="warm-card p-8">
            <div className="font-medium mb-8">当前基线数据</div>
            <pre className="font-mono text-xs bg-zinc-50 p-6 rounded-2xl overflow-auto text-gray-600 leading-relaxed">
              {JSON.stringify(baseline, null, 2)}
            </pre>
          </div>
          
          <div className="warm-card p-8">
            <div className="font-medium mb-8 flex justify-between">
              <span>今日实时数据</span> 
              <span className={`text-xs px-3 py-0.5 rounded-full ${currentData === 'normal' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {currentData === 'normal' ? '正常' : currentData === 'abnormal' ? '警告' : '紧急'}
              </span>
            </div>
            <pre className="font-mono text-xs bg-zinc-50 p-6 rounded-2xl overflow-auto text-gray-600 leading-relaxed">
              {JSON.stringify(currentData === 'normal' ? todayNormal : currentData === 'abnormal' ? todayAbnormal : todayAbnormal, null, 2)}
            </pre>
          </div>
          
          <div className="text-[10px] text-center text-gray-400 pt-4">
            本面板用于演示传感器数据如何流入4个Agent
          </div>
        </div>
      </div>
    </div>
  );
}