import { useState } from 'react';
import AgentThinking from '../components/AgentThinking';
import EmergencyAlert from '../components/EmergencyAlert';
import { streamDashScope } from '../lib/dashscope';
import { EMERGENCY_AGENT_PROMPT } from '../lib/prompts/emergency';
import emergencyEvents from '../lib/mock-data/emergency-events.json';
import { Play, Zap } from 'lucide-react';

export default function Emergency() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<any[]>([]);
  const [finalDecision, setFinalDecision] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [log, setLog] = useState('');

  const buildFallback = (eventData: any) => {
    const steps = [
      {
        step: 1,
        title: "事件可信度初评",
        reasoning: `冲击力为${eventData.event.impact_force}G，高于正常翻身。`,
        conclusion: "事件可信度：较高"
      },
      {
        step: 2,
        title: "上下文交叉验证",
        reasoning: `发生在凌晨，过去30天仅有${eventData.context['30d_similar_events']}次类似事件。`,
        conclusion: "非习惯性行为"
      },
      {
        step: 3,
        title: "后续行为追踪",
        reasoning: eventData.event.post_event_activity.includes('no')
          ? "事件后无任何活动，高度可疑。" : "事件后活动恢复，风险降低。",
        conclusion: eventData.event.post_event_activity.includes('no') ? "需要立即响应" : "继续观察"
      },
      {
        step: 4,
        title: "分级响应决策",
        reasoning: "综合判断后，建议立即通知子女。",
        conclusion: `Level ${eventData.expected_level} 响应`
      }
    ];
    const decision = {
      confidence: eventData.expected_level > 2 ? 89 : 64,
      response_level: eventData.expected_level,
      level_name: eventData.expected_level === 4 ? "紧急呼救" : eventData.expected_level === 3 ? "确认警报" : "预警通知",
      actions: [
        "向子女APP推送高优先级通知",
        "拨打预设紧急联系电话",
        "持续监测后续活动"
      ],
      natural_language_alert: eventData.expected_level > 2
        ? "疑似在卧室摔倒，30秒内未检测到活动。请立即致电确认。"
        : "检测到夜间活动异常。正在进一步确认中。"
    };
    return { steps, decision };
  };

  const animateSteps = (steps: any[], decision: any, delay: number = 600) => {
    steps.forEach((step, i) => {
      setTimeout(() => {
        setThinkingSteps(prev => [...prev, step]);
        setCurrentStepIndex(i);
      }, delay * (i + 1));
    });
    setTimeout(() => {
      setFinalDecision(decision);
      setIsProcessing(false);
      if (decision.response_level >= 3) {
        setTimeout(() => setShowAlert(true), 1200);
      }
    }, delay * (steps.length + 1));
  };

  const simulateEmergency = async (eventIndex: number) => {
    const eventData = emergencyEvents[eventIndex];
    setSelectedEvent(eventData);
    setIsProcessing(true);
    setThinkingSteps([]);
    setFinalDecision(null);
    setShowAlert(false);
    setCurrentStepIndex(0);
    setLog('传感器触发...\n事件上报到夜安云端...\nAgent 3 启动Chain-of-Thought推理...\n');

    try {
      const messages: Parameters<typeof streamDashScope>[0] = [
        { role: 'system', content: EMERGENCY_AGENT_PROMPT },
        { role: 'user', content: JSON.stringify(eventData) }
      ];

      let rawResponse = '';

      for await (const chunk of streamDashScope(messages)) {
        rawResponse += chunk;
        setLog(prev => prev + chunk);
      }

      // Try to parse the complete JSON response
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.thinking_steps && parsed.final_decision) {
          animateSteps(parsed.thinking_steps, parsed.final_decision);
          return;
        }
      }

      // Fallback if parsing failed
      setLog(prev => prev + '\n[解析失败，使用本地演示数据]');
      const fallback = buildFallback(eventData);
      animateSteps(fallback.steps, fallback.decision);
    } catch (err) {
      console.error(err);
      setLog(prev => prev + '\n[API调用失败，使用本地演示数据]');
      const fallback = buildFallback(eventData);
      animateSteps(fallback.steps, fallback.decision);
    }
  };

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex px-5 py-1 bg-rose-100 text-rose-600 text-sm rounded-3xl mb-4">LIVE DEMO</div>
        <h1 className="text-5xl font-bold tracking-tight">紧急事件分级决策演示</h1>
        <p className="text-gray-500 mt-3 max-w-xs mx-auto">使用思考链实时决策，模拟真实硬件传感器</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Controls */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="warm-card p-7">
            <div className="font-medium mb-5 text-sm uppercase tracking-widest text-rose-500">选择模拟场景</div>
            
            {emergencyEvents.map((event, index) => (
              <button
                key={event.id}
                onClick={() => simulateEmergency(index)}
                disabled={isProcessing}
                className={`w-full text-left p-5 mb-3 rounded-3xl border transition-all hover:border-rose-300 flex gap-4 items-start group ${selectedEvent?.id === event.id ? 'border-rose-400 bg-rose-50' : 'border-transparent bg-white'}`}
              >
                <div className="text-3xl mt-0.5">{index === 0 ? '🌙' : index === 1 ? '⚠️' : '🆘'}</div>
                <div className="flex-1">
                  <div className="font-semibold group-hover:text-rose-600 transition-colors">{event.name}</div>
                  <div className="text-xs text-gray-500 mt-1.5">{event.event.type}</div>
                </div>
                <Play className="w-4 h-4 text-gray-300 group-hover:text-rose-400 mt-1.5" />
              </button>
            ))}
          </div>
          
          <div className="mt-8 text-[10px] text-gray-400 leading-relaxed px-2">
            基于行为数据推理
          </div>
        </div>

        {/* Agent Output */}
        <div className="flex-1">
          {selectedEvent ? (
            <div>
              <div className="flex justify-between items-center mb-4 px-1">
                <div className="font-semibold text-xl">Agent 3 思考过程</div>
                <div className="text-xs font-mono bg-zinc-100 px-3 py-1 rounded-3xl">EVENT ID: {selectedEvent.id}</div>
              </div>
              
              <AgentThinking 
                steps={thinkingSteps} 
                currentStep={currentStepIndex} 
                isComplete={!isProcessing && !!finalDecision}
                finalDecision={finalDecision}
              />
              
              {log && (
                <div className="mt-8 text-[10px] font-mono bg-black text-emerald-400 p-5 rounded-3xl h-44 overflow-auto leading-tight">
                  {log}
                </div>
              )}
            </div>
          ) : (
            <div className="warm-card h-96 flex items-center justify-center text-center">
              <div>
                <Zap className="mx-auto text-orange-300 w-12 h-12 mb-6" />
                <div className="text-xl text-gray-300">选择左侧场景<br />触发紧急事件模拟</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAlert && finalDecision && (
        <EmergencyAlert 
          level={finalDecision.response_level} 
          message={finalDecision.natural_language_alert} 
          onClose={() => setShowAlert(false)} 
        />
      )}
    </div>
  );
}