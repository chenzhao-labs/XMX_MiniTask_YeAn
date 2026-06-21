import { useState } from 'react';
import { Home, MessageCircle, FileText, AlertTriangle, Settings, Heart, Moon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Report from './pages/Report';
import Emergency from './pages/Emergency';
import Admin from './pages/Admin';

type Page = 'home' | 'dashboard' | 'chat' | 'report' | 'emergency' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showNav, setShowNav] = useState(false);

  const navItems = [
    { id: 'dashboard', label: '父母今日状态', icon: Home, color: 'text-orange-500' },
    { id: 'chat', label: '问问AI管家', icon: MessageCircle, color: 'text-amber-500' },
    { id: 'report', label: '本周AI周报', icon: FileText, color: 'text-emerald-500' },
    { id: 'emergency', label: '紧急事件演示', icon: AlertTriangle, color: 'text-rose-500' },
    { id: 'admin', label: '数据模拟后台', icon: Settings, color: 'text-purple-500' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <Chat />;
      case 'report':
        return <Report />;
      case 'emergency':
        return <Emergency />;
      case 'admin':
        return <Admin />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D2A26]">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#E8945A] to-orange-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-3xl tracking-tighter">夜安</div>
                <div className="text-[10px] text-orange-600 -mt-1.5 font-medium">CARE</div>
              </div>
            </div>
            <div className="hidden sm:block text-xs px-4 py-1 bg-orange-50 text-orange-700 rounded-3xl">AI远程陪护 · 让爱跨越距离</div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage('home')}
              className="px-6 py-2 text-sm font-medium hover:bg-orange-50 rounded-3xl transition-colors flex items-center gap-2"
            >
              <Moon className="w-4 h-4" /> 首页
            </button>
            <button
              onClick={() => setShowNav(!showNav)}
              className="lg:hidden px-4 py-2 bg-orange-100 hover:bg-orange-200 rounded-2xl text-sm font-medium transition-all"
            >
              菜单
            </button>
          </div>
        </div>

        {/* Secondary Nav */}
        <div className={`${showNav ? 'flex' : 'hidden'} lg:flex max-w-6xl mx-auto px-6 pb-4 gap-2 overflow-x-auto`}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id as Page);
                setShowNav(false);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-3xl transition-all whitespace-nowrap ${
                currentPage === item.id 
                  ? 'bg-[#E8945A] text-white shadow-md' 
                  : 'hover:bg-white/70 text-gray-600'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20 py-12 text-center text-xs text-gray-400">
        <div className="max-w-6xl mx-auto px-6">
          © 2025 夜安 Care • 演示项目<br />
          温暖陪伴 · 守护家人 · 让异地子女不再担心
        </div>
      </footer>
    </div>
  );
}

function HomePage({ onNavigate }: { onNavigate: (page: any) => void }) {
  return (
    <div className="px-6 pt-16 pb-24">
      <div className="max-w-2xl mx-auto text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-white text-sm font-medium px-5 h-9 rounded-3xl mb-6 shadow">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          AI Agent系统演示
        </div>
        
        <h1 className="text-7xl font-bold tracking-tighter leading-none mb-6 text-text-deep">
          夜安
        </h1>
        <p className="text-2xl text-gray-600 max-w-md mx-auto">
          像家人一样，24小时守护您的父母
        </p>
        
        <div className="flex justify-center gap-4 mt-10">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="bg-[#E8945A] hover:bg-[#d67e4a] text-white px-10 py-4 rounded-3xl font-medium text-lg shadow-xl shadow-orange-200 transition-all active:scale-[0.985]"
          >
            查看父母今日状态 →
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20">
        {[
          {
            emoji: "🏠",
            title: "父母今日状态",
            desc: "实时行为数据 + AI 温暖解读",
            page: "dashboard" as const,
          },
          {
            emoji: "💬",
            title: "自然语言对话",
            desc: "随时问AI管家关于父母的一切",
            page: "chat" as const,
          },
          {
            emoji: "📆",
            title: "AI周报",
            desc: "有温度的数据故事与建议",
            page: "report" as const,
          },
          {
            emoji: "🛟",
            title: "紧急事件演示",
            desc: "4级决策 + Chain-of-Thought",
            page: "emergency" as const,
          },
        ].map((card, index) => (
          <div
            key={index}
            onClick={() => onNavigate(card.page)}
            className="warm-card p-8 cursor-pointer hover:-translate-y-1 transition-all group"
          >
            <div className="text-6xl mb-6 opacity-90 group-hover:scale-110 transition-transform">{card.emoji}</div>
            <div className="text-3xl font-semibold mb-3 text-text-deep">{card.title}</div>
            <p className="text-gray-600 text-[15.2px] leading-tight">{card.desc}</p>
            <div className="text-primary text-sm mt-8 inline-flex items-center gap-2 group-hover:gap-3 transition-all">
              立即体验 <span className="text-xl">→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10">
        <div className="text-center mb-8">
          <div className="font-mono uppercase text-xs tracking-widest text-orange-400 mb-3">SYSTEM ARCHITECTURE</div>
          <h2 className="text-4xl font-semibold">4个专业AI Agent 协同工作</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { agent: "异常检测", desc: "行为基线对比", emoji: "📉" },
            { agent: "周报生成", desc: "自然语言总结", emoji: "📝" },
            { agent: "紧急决策", desc: "CoT流式推理", emoji: "🚨" },
            { agent: "陪护对话", desc: "温暖上下文对话", emoji: "🗣️" },
          ].map((a, i) => (
            <div key={i} className="bg-[#FAF8F5] rounded-2xl p-6">
              <div className="text-5xl mb-4">{a.emoji}</div>
              <div className="font-semibold mb-1">{a.agent}</div>
              <div className="text-xs text-gray-500">{a.desc}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center text-xs text-gray-400 font-mono">
          SSE流式 · RECHARTS · AI Agent
        </div>
      </div>
    </div>
  );
}

export default App;