import { ChatMessage as ChatMessageType } from '../lib/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`max-w-[80%] flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-inner">
            <span className="text-white text-xl">👵</span>
          </div>
        )}
        
        <div className={`px-5 py-3.5 rounded-3xl text-[15px] leading-relaxed shadow-sm ${
          isUser 
            ? 'bg-primary text-white rounded-br-none' 
            : 'bg-white border border-orange-100 text-text-deep rounded-bl-none'
        }`}>
          {message.content}
        </div>
      </div>
    </div>
  );
}