import { AlertTriangle, Phone, Heart } from 'lucide-react';

interface EmergencyAlertProps {
  level: number;
  message: string;
  onClose: () => void;
}

export default function EmergencyAlert({ level, message, onClose }: EmergencyAlertProps) {
  const colors = {
    2: 'amber',
    3: 'orange',
    4: 'rose',
  };
  
  const color = colors[level as keyof typeof colors] || 'rose';
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
      <div className={`warm-card max-w-md w-full overflow-hidden border-4 border-${color}-400`}>
        <div className={`bg-${color}-500 text-white p-8 text-center relative`}>
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <AlertTriangle className={`w-9 h-9 text-${color}-500`} />
          </div>
          
          <div className="pt-8">
            <div className="uppercase text-xs tracking-[3px] font-medium opacity-75">紧急警报</div>
            <div className="text-5xl font-bold mt-2">LEVEL {level}</div>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <div className="text-2xl font-semibold text-text-deep leading-tight mb-6">
            {message}
          </div>
          
          <div className="flex justify-center gap-8 text-sm">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-2xl font-medium transition-colors"
            >
              <Phone className="w-4 h-4" />
              我来电话确认
            </button>
            
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-medium transition-colors"
            >
              <Heart className="w-4 h-4" />
              立即呼叫120
            </button>
          </div>
          
          <div className="text-[10px] text-gray-400 mt-8">
            夜安Care 已通知您的紧急联系人
          </div>
        </div>
      </div>
    </div>
  );
}