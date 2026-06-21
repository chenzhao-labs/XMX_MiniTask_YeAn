import { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';
import { streamDashScope } from '../lib/dashscope';
import { CHAT_AGENT_PROMPT } from '../lib/prompts/chat';
import { ChatMessage as ChatMessageType } from '../lib/types';
import { Send, Loader2, AlertCircle } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好，我是父母的AI陪护管家。关于父母健康，您有什么想了解的吗？',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState('');
  const messagesRef = useRef(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasInteracted = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
    if (hasInteracted.current) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (text?: string) => {
    const messageText = (text || input).trim();
    if (!messageText || isThinking) return;

    hasInteracted.current = true;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    setError('');

    const allMessages = [...messagesRef.current, userMessage];

    try {
      const systemPrompt = `${CHAT_AGENT_PROMPT}\n\n当前基线数据：过去30天平均夜起1.2次。今天睡眠时间22:40，夜起1次。最长离床4分钟。本周睡眠质量稳定。`;

      const dashMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...allMessages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }))
      ];

      let fullResponse = '';
      const assistantMessageId = (Date.now() + 1).toString();

      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }]);

      for await (const chunk of streamDashScope(dashMessages)) {
        fullResponse += chunk;

        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: fullResponse }
              : msg
          )
        );
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('AI管家暂时无法响应，请稍后重试');

      setMessages(prev => prev.filter(m => m.content !== ''));
    } finally {
      setIsThinking(false);
    }
  };

  const quickQuestions = [
    "今天状态怎么样？",
    "最近睡得好吗？",
    "有什么需要我关注的？",
    "本周睡眠趋势如何？"
  ];

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col border-x border-orange-100/60 bg-white shadow-sm">
      <div className="flex items-center gap-4 px-6 pt-6 pb-4">
        <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 shadow">👵</div>
        <div>
          <div className="font-semibold text-2xl">AI陪护管家</div>
          <div className="text-emerald-600 text-sm flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            正在在线守护
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 mx-2 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-sm text-rose-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto text-rose-400 hover:text-rose-600">✕</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-6 px-6 pb-4 custom-scroll">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isThinking && (
          <div className="flex justify-start">
            <div className="px-5 py-3 bg-white border border-orange-100 rounded-3xl flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              <span className="text-orange-400 text-sm">管家正在思考...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="pt-4 border-t border-orange-100 bg-white px-6 pb-6">
        <div className="flex flex-wrap gap-2 mb-4 px-1">
          {quickQuestions.map((q, index) => (
            <button
              key={index}
              onClick={() => sendMessage(q)}
              className="text-xs border border-orange-200 hover:border-orange-300 bg-white px-4 py-2 rounded-3xl transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="问问家人的睡眠、活动或者本周情况..."
            className="flex-1 bg-zinc-50 border border-transparent focus:border-orange-200 rounded-3xl px-7 py-4 text-base outline-none"
            disabled={isThinking}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isThinking || !input.trim()}
            className="w-14 h-14 bg-[#E8945A] hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-3xl flex items-center justify-center transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center text-[10px] text-gray-400 mt-4">
          夜安AI • 基于行为数据分析 • 非医疗诊断
        </div>
      </div>
    </div>
  );
}