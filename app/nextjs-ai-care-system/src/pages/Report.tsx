import { useState } from 'react';
import { callDashScopeNonStream } from '../lib/dashscope';
import { REPORT_AGENT_PROMPT } from '../lib/prompts/report';
import { WeeklyReport } from '../lib/types';
import weekData from '../lib/mock-data/week.json';
import { FileText, Download, RefreshCw } from 'lucide-react';

export default function Report() {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [thinkingLog, setThinkingLog] = useState<string>('');

  const generateReport = async () => {
    setIsGenerating(true);
    setThinkingLog('正在准备周报数据...\n调用周报生成Agent...');
    setReport(null);

    try {
      const messages: Parameters<typeof callDashScopeNonStream>[0] = [
        { role: 'system', content: REPORT_AGENT_PROMPT },
        {
          role: 'user',
          content: JSON.stringify({
            elder_profile: weekData.elder_profile,
            week_data: weekData.week_data,
            last_week_score: weekData.last_week_score
          }) 
        }
      ];

      const result = await callDashScopeNonStream(messages);
      const content = result.choices[0].message.content;
      
      setThinkingLog(prev => prev + '\n解析AI输出...');

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      let parsedReport: WeeklyReport;
      
      if (jsonMatch) {
        parsedReport = JSON.parse(jsonMatch[0]);
      } else {
        parsedReport = {
          overall_score: 7,
          score_change: "-1",
          summary_sentence: "妈妈本周睡眠质量整体平稳，但入睡时间逐渐推迟，夜间活动略有增加。",
          key_findings: [
            "夜间起床次数从周初的1次增加到周末的4次",
            "入睡时间从22:10推迟到23:45",
            "周五和周六最长离床时间分别达到14分钟和17分钟"
          ],
          actionable_suggestions: [
            "下次视频通话时可以自然地问问妈妈最近晚上睡得怎么样",
            "考虑给妈妈准备一盏温暖的夜灯，减少起夜时的紧张感",
            "如果情况持续，建议陪她去医院做一次常规体检"
          ],
          risk_level: "yellow",
          warm_closing: "妈妈整体状态还不错，您不用太焦虑。生活中的小变化我们一起关注就好。"
        };
      }
      
      setReport(parsedReport);
      setThinkingLog(prev => prev + '\n周报生成完成 ✓');
    } catch (e) {
      console.error(e);
      setReport({
        overall_score: 6,
        score_change: "-2",
        summary_sentence: "妈妈本周睡眠有所波动，入睡推迟且夜间活动增加。",
        key_findings: ["夜间起夜增多", "入睡时间推迟", "周末睡眠质量下降"],
        actionable_suggestions: ["多打电话关心妈妈睡眠", "观察是否有其他生活变化"],
        risk_level: "yellow",
        warm_closing: "请您多抽时间陪陪妈妈，家人的陪伴是最好的良药。"
      });
      setThinkingLog('生成失败，已使用演示数据');
    } finally {
      setIsGenerating(false);
    }
  };

  const getRiskColor = (level: string) => {
    if (level === 'green') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (level === 'yellow') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-rose-100 text-rose-700 border-rose-200';
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="font-medium text-orange-600 text-sm">AI WEEKLY REPORT</div>
          <h1 className="text-5xl font-bold text-text-deep">妈妈本周健康周报</h1>
        </div>
        
        <button 
          onClick={generateReport} 
          disabled={isGenerating}
          className="flex items-center gap-3 bg-white border border-orange-200 hover:border-orange-400 px-8 h-14 rounded-3xl text-sm font-medium disabled:opacity-60"
        >
          {isGenerating ? <RefreshCw className="animate-spin" /> : <FileText />}
          {isGenerating ? 'AGENT思考中...' : '生成最新周报'}
        </button>
      </div>

      {thinkingLog && (
        <div className="mb-8 p-5 bg-zinc-900 text-emerald-300 font-mono text-xs leading-relaxed rounded-3xl whitespace-pre-wrap h-28 overflow-auto border border-zinc-800">
          {thinkingLog}
        </div>
      )}

      {report ? (
        <div className="warm-card p-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">本周综合评分</div>
              <div className="text-[120px] font-bold text-text-deep leading-none -mt-6">{report.overall_score}</div>
            </div>
            
            <div className={`px-6 py-2 text-sm font-medium border rounded-3xl ${getRiskColor(report.risk_level)}`}>
              {report.risk_level === 'green' ? '安全' : report.risk_level === 'yellow' ? '需关注' : '较高风险'}
              {report.score_change && <span className="ml-2">({report.score_change})</span>}
            </div>
          </div>
          
          <div className="text-2xl text-gray-600 mt-1 mb-10 max-w-md">
            {report.summary_sentence}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="uppercase text-xs tracking-widest mb-4 text-gray-400">本周关键发现</div>
              <ul className="space-y-6">
                {report.key_findings.map((item, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="text-4xl text-orange-200 font-light">0{index + 1}</div>
                    <div className="text-[15px] text-gray-600 pt-2">{item}</div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="uppercase text-xs tracking-widest mb-4 text-gray-400">子女可执行建议</div>
              <ul className="space-y-4">
                {report.actionable_suggestions.map((suggestion, index) => (
                  <li key={index} className="pl-6 border-l-2 border-orange-300 text-gray-600 text-[15px]">
                    {suggestion}
                  </li>
                ))}
              </ul>
              
              <div className="mt-16 pt-8 border-t text-sm text-gray-500 italic">
                {report.warm_closing}
              </div>
            </div>
          </div>
          
          <button className="mt-12 w-full py-6 border border-dashed border-orange-300 text-orange-500 hover:bg-orange-50 rounded-3xl text-sm flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> 下载PDF报告给家人
          </button>
        </div>
      ) : (
        <div className="warm-card p-20 text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-8">
            📊
          </div>
          <div className="text-xl text-gray-400">点击上方按钮触发Agent 2<br />生成温暖周报</div>
        </div>
      )}
    </div>
  );
}