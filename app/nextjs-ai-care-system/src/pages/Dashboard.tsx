import { useState, useEffect } from 'react';
import BehaviorChart from '../components/BehaviorChart';
import { callDashScopeNonStream } from '../lib/dashscope';
import { ANOMALY_AGENT_PROMPT } from '../lib/prompts/anomaly';
import { AnomalyAnalysis } from '../lib/types';
import baselineData from '../lib/mock-data/baseline.json';
import todayNormal from '../lib/mock-data/today-normal.json';
import todayAbnormal from '../lib/mock-data/today-abnormal.json';
import weekData from '../lib/mock-data/week.json';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [isAbnormalMode, setIsAbnormalMode] = useState(false);
  const [analysis, setAnalysis] = useState<AnomalyAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentTodayData = isAbnormalMode ? todayAbnormal : todayNormal;

  const runAnomalyAnalysis = async () => {
    setIsLoading(true);
    try {
      const messages: Parameters<typeof callDashScopeNonStream>[0] = [
        { role: 'system', content: ANOMALY_AGENT_PROMPT },
        {
          role: 'user',
          content: JSON.stringify({
            elder_profile: currentTodayData.elder_profile || { name: "张桂兰", age: 78 },
            baseline: baselineData.baseline,
            today: currentTodayData.today || currentTodayData
          })
        }
      ];

      const result = await callDashScopeNonStream(messages);
      const content = result.choices[0].message.content;

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setAnalysis(parsed);
      } else {
        setAnalysis({
          is_abnormal: isAbnormalMode,
          abnormal_score: isAbnormalMode ? 68 : 12,
          abnormal_points: isAbnormalMode ? [
            { metric: "夜间起床次数", baseline: "1.2次", today: "4次", deviation: "高出233%" },
            { metric: "最长离床时长", baseline: "3.5分钟", today: "16分钟", deviation: "高出357%" }
          ] : [],
          natural_language_summary: isAbnormalMode
            ? "昨晚起夜次数明显增加，且有一次离床时间较长。整体睡眠质量有所下降，但暂无紧急情况。"
            : "今天作息规律，夜间只起床1次，睡眠质量良好。",
          recommended_action: isAbnormalMode ? "建议关注" : "继续观察",
          confidence: isAbnormalMode ? 82 : 94
        });
      }
    } catch (err) {
      console.error(err);
      setAnalysis({
        is_abnormal: isAbnormalMode,
        abnormal_score: isAbnormalMode ? 68 : 12,
        abnormal_points: isAbnormalMode ? [
          { metric: "夜间起床次数", baseline: "1.2次", today: "4次", deviation: "高出233%" }
        ] : [],
        natural_language_summary: isAbnormalMode
          ? "昨晚起夜比平时多了一些，睡眠也稍晚。建议多留意日常作息。"
          : "今天一切正常，作息很规律。",
        recommended_action: isAbnormalMode ? "建议关注" : "继续观察",
        confidence: 75
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setAnalysis(null);
  }, [isAbnormalMode]);

  return (
    <div className="px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-orange-400 rounded-3xl flex items-center justify-center text-4xl shadow-inner">👵</div>
              <div>
                <div className="text-4xl font-semibold">张桂兰</div>
                <div className="text-xl text-gray-500">78岁 · 山东济南 · 独居</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAbnormalMode(!isAbnormalMode)}
              className={`px-6 py-3 rounded-3xl text-sm font-medium flex items-center gap-2 transition-all ${isAbnormalMode ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}
            >
              {isAbnormalMode ? '切换至正常模式' : '切换至异常模式'}
            </button>
            
            <button 
              onClick={runAnomalyAnalysis}
              disabled={isLoading}
              className="bg-[#E8945A] text-white px-8 py-3 rounded-3xl flex items-center gap-2 hover:bg-orange-600 disabled:opacity-70 font-medium text-sm"
            >
              {isLoading ? <RefreshCw className="animate-spin w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {isLoading ? 'AI分析中...' : '调用异常检测Agent'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Status Card */}
          <div className="lg:col-span-5">
            <div className="warm-card p-8 h-full">
              <div className="uppercase text-xs tracking-widest text-amber-500 mb-2">TODAY STATUS</div>

              {!analysis && !isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="w-10 h-10 text-orange-200 mb-4" />
                  <div className="text-gray-400 text-sm leading-relaxed">
                    点击右上角按钮<br />调用AI Agent开始分析
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <RefreshCw className="w-10 h-10 animate-spin text-orange-400 mb-4" />
                  <div className="text-gray-400 text-sm">Agent分析中...</div>
                </div>
              )}

              {analysis && (
                <>
                  <div className="text-6xl font-bold text-text-deep mb-2">
                    {100 - analysis.abnormal_score}
                    <span className="text-3xl align-super text-gray-400 font-normal">/100</span>
                  </div>
                  <div className={`text-xl font-medium ${analysis.is_abnormal ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {analysis.is_abnormal ? '轻度波动' : '状态良好'}
                  </div>

                  <div className="mt-8 pt-8 border-t">
                    <div className="text-sm leading-relaxed text-gray-600">
                      {analysis.natural_language_summary}
                    </div>

                    <div className="mt-6 flex gap-3">
                      <div className={`px-5 py-2 text-xs font-medium rounded-2xl ${analysis.recommended_action.includes('关注') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {analysis.recommended_action}
                      </div>
                      <div className="px-4 py-2 text-xs bg-gray-100 text-gray-500 rounded-2xl">
                        置信度 {analysis.confidence}%
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Metrics */}
          <div className="lg:col-span-7">
            <BehaviorChart data={weekData.week_data} />
          </div>
        </div>

        {analysis && analysis.abnormal_points && analysis.abnormal_points.length > 0 && (
          <div className="mt-8 warm-card p-8">
            <div className="font-medium text-lg mb-6 flex items-center gap-2">
              <AlertCircle className="text-rose-500" /> 关键偏差点
            </div>
            <div className="space-y-4">
              {analysis.abnormal_points.map((point, i) => (
                <div key={i} className="flex justify-between items-center bg-zinc-50 p-5 rounded-2xl">
                  <div>
                    <div className="font-medium">{point.metric}</div>
                    <div className="text-xs text-gray-500">基线 {point.baseline}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xl font-semibold text-rose-500">{point.today}</div>
                    <div className="text-xs text-rose-400">{point.deviation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center text-xs text-gray-400">
          Agent 1: 行为异常检测 • 数据来自模拟传感器
        </div>
      </div>
    </div>
  );
}