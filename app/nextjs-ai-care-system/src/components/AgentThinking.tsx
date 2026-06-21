import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { ThinkingStep } from '../lib/types';

interface AgentThinkingProps {
  steps: ThinkingStep[];
  currentStep?: number;
  isComplete?: boolean;
  finalDecision?: any;
}

export default function AgentThinking({ steps, currentStep = 0, isComplete = false, finalDecision }: AgentThinkingProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isDone = index < currentStep || isComplete;
        
        return (
          <div 
            key={index}
            className={`warm-card p-5 transition-all duration-300 border-l-4 ${
              isActive ? 'border-primary shadow-md scale-[1.02]' : 
              isDone ? 'border-emerald-400 opacity-90' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                isDone ? 'bg-emerald-100 text-emerald-600' : 
                isActive ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-gray-100 text-gray-400'
              }`}>
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-text-deep">{step.title}</div>
                  {isActive && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                </div>
                
                <div className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {step.reasoning}
                </div>
                
                <div className="mt-3 text-xs px-3 py-1.5 bg-white border border-gray-100 rounded-xl inline-block">
                  {step.conclusion}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {finalDecision && isComplete && (
        <div className="mt-8 p-6 border border-rose-200 bg-gradient-to-br from-rose-50 to-white rounded-3xl">
          <div className="flex items-center gap-2 text-rose-600 mb-4">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold uppercase tracking-widest text-sm">最终决策</span>
          </div>
          
          <div className="text-3xl font-bold text-text-deep mb-1">
            Level {finalDecision.response_level} — {finalDecision.level_name}
          </div>
          
          <div className="text-lg text-gray-600 leading-tight mb-6">
            {finalDecision.natural_language_alert}
          </div>
          
          <div className="space-y-2">
            {finalDecision.actions.map((action: string, i: number) => (
              <div key={i} className="flex gap-2 text-sm">
                <div className="text-emerald-500 mt-1">→</div>
                <div>{action}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-right text-xs text-gray-400">
            可信度 {finalDecision.confidence}%
          </div>
        </div>
      )}
    </div>
  );
}