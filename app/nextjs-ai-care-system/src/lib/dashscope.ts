const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

export interface DashScopeMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callDashScope(
  messages: DashScopeMessage[],
  options: {
    model?: string;
    stream?: boolean;
    temperature?: number;
  } = {}
): Promise<Response> {
  const { model = 'qwen-plus', stream = false, temperature = 0.7 } = options;
  
  const apiKey = (import.meta as any).env.VITE_DASHSCOPE_API_KEY || '';
  
  if (!apiKey) {
    throw new Error('DASHSCOPE_API_KEY is not configured. Please set VITE_DASHSCOPE_API_KEY in your .env file.');
  }
  
  return fetch(DASHSCOPE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
      temperature,
    }),
  });
}

// 流式输出辅助函数 (for client use)
export async function* streamDashScope(
  messages: DashScopeMessage[]
): AsyncGenerator<string> {
  const response = await callDashScope(messages, { stream: true });
  
  if (!response.body) throw new Error('No response body');
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        
        const dataStr = trimmed.slice(6);
        if (dataStr === '[DONE]') return;
        
        try {
          const parsed = JSON.parse(dataStr);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) yield content;
        } catch (e) {
          // Invalid JSON, skip
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// Non-stream version for server-like calls in client
export async function callDashScopeNonStream(messages: DashScopeMessage[]): Promise<any> {
  const response = await callDashScope(messages, { stream: false });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}