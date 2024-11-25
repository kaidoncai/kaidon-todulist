'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/src/store/userStore';
import UserSetup from './components/UserSetup';
import { motion, AnimatePresence } from 'framer-motion';

const LIFE_SCENES = [
  {
    id: 'morning',
    title: '晨曦初现',
    text: "当朝阳初升，新的一天开始。今天的你，将创造怎样的传奇？",
    longText: "用生命的温度，握紧生活的残酷！用拼搏的脉搏，跳跃现实的荒芜！",
    theme: "morning",
    gradient: "bg-gradient-to-b from-orange-400/90 via-amber-300/50 to-blue-300/70",
    overlay: "bg-gradient-to-b from-black/20 via-transparent to-black/20",
    textGradient: "from-amber-100 to-orange-200",
    icon: "🌅"
  },
  {
    id: 'noon',
    title: '奋斗正当时',
    text: "生命如海浪，勇敢者乘风破浪，追逐梦想！",
    longText: "用积极的心态，迎接无限的大惊喜！当年岁渐长，你会发现曾经以为的困难，不过是生命中的一个跳板。",
    theme: "noon",
    gradient: "bg-gradient-to-b from-sky-400/90 via-blue-300/50 to-indigo-300/70",
    overlay: "bg-gradient-to-b from-black/20 via-transparent to-black/20",
    textGradient: "from-blue-100 to-sky-200",
    icon: "⛅"
  },
  {
    id: 'dusk',
    title: '余晖映照',
    text: "当日落余晖时，生活渐行渐远，回首往昔，你会发现生命中的每一步都如此珍贵。",
    longText: "回想起所有的哀伤、痛楚、难以想象、未曾完成的事时，都是生命里的一个过客，你仍如当初般勇敢。",
    theme: "dusk",
    gradient: "bg-gradient-to-b from-purple-500/90 via-pink-400/50 to-orange-300/70",
    overlay: "bg-gradient-to-b from-black/20 via-transparent to-black/20",
    textGradient: "from-pink-100 to-purple-200",
    icon: "🌅"
  }
];

// 扩展激励语数据库
const MOTIVATIONAL_QUOTES = [
  {
    period: 'morning',
    quotes: [
      "每一个清晨都是新的起点，让我们以饱满的热情开启今天！",
      "黎明前的黑暗最为深邃，但朝阳终将升起，照亮我们的征程。",
      "生命的意义不在于活了多久，而在于如何让每一天都熠熠生辉。",
      "今天的付出，是为了让明天的自己更加出彩。",
      "用阳光的心态，迎接每一个挑战，让生命绽放异彩。"
    ]
  },
  {
    period: 'noon',
    quotes: [
      "困难来临时，请记住：你比想象中更加坚强！",
      "生命如同马拉松，重要的不是速度，而是坚持的信念。",
      "每一个平凡的日子，都是通向非凡人生的基石。",
      "把握当下，成就非凡，让每一刻都充满意义。",
      "生命的长度无法改变，但宽度和深度可以由我们来谱写。"
    ]
  },
  {
    period: 'evening',
    quotes: [
      "夕阳西下，带走的是时光，留下的是成长与感悟。",
      "回首今日，感恩所得；展望明天，继续前行。",
      "生命的旅程中，每一个脚印都是成长的见证。",
      "让今天的努力，成为明天的骄傲。",
      "静谧的夜晚，让我们沉淀收获，蓄力明天。"
    ]
  }
];

// 根据日期和时间获取激励语
const getTimeBasedQuote = (date: Date) => {
  const hour = date.getHours();
  let period;
  if (hour < 11) {
    period = 'morning';
  } else if (hour < 17) {
    period = 'noon';
  } else {
    period = 'evening';
  }
  
  const periodQuotes = MOTIVATIONAL_QUOTES.find(q => q.period === period)?.quotes || [];
  
  // 使用日期作为种子生成索引
  const dateString = date.toISOString().split('T')[0]; // 获取年月日
  const seed = dateString.split('-').reduce((acc, val) => acc + parseInt(val), 0);
  const index = seed % periodQuotes.length;
  
  return periodQuotes[index];
};

export default function Home() {
  const { user, clearUser } = useUserStore();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [dayNumber, setDayNumber] = useState<number>(0);
  const [showLongText, setShowLongText] = useState(false);
  const [lifeProgress, setLifeProgress] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentQuote, setCurrentQuote] = useState('');

  const calculateLifeMetrics = (date: Date) => {
    if (user) {
      const birthDate = new Date(user.birthDate);
      const daysSinceBirth = Math.floor(
        (date.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      setDayNumber(daysSinceBirth);

      const totalDays = user.expectedLifespan * 365;
      const progress = (daysSinceBirth / totalDays) * 100;
      setLifeProgress(progress);

      const daysLeft = Math.floor(
        (new Date(birthDate.getFullYear() + user.expectedLifespan, birthDate.getMonth(), birthDate.getDate()).getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );
      setTimeLeft(`${daysLeft.toLocaleString()} 天`);

      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      };
      setCurrentDate(date.toLocaleDateString('zh-CN', options));

      // 更新激励语
      const quote = getTimeBasedQuote(date);
      setCurrentQuote(quote);
      
      // 设置场景索引
      const hour = date.getHours();
      if (hour < 11) {
        setCurrentSceneIndex(0); // morning
      } else if (hour < 17) {
        setCurrentSceneIndex(1); // noon
      } else {
        setCurrentSceneIndex(2); // evening
      }
    }
  };

  useEffect(() => {
    if (user) {
      calculateLifeMetrics(selectedDate);
    }
  }, [user, selectedDate]);

  const nextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDate);
  };

  const prevDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(prevDate);
  };

  // 修改返回今天的函数
  const backToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    // 重置场景索引
    const hour = today.getHours();
    if (hour < 11) {
      setCurrentSceneIndex(0); // morning
    } else if (hour < 17) {
      setCurrentSceneIndex(1); // noon
    } else {
      setCurrentSceneIndex(2); // evening
    }
    // 重置长文本显示状态
    setShowLongText(false);
    // 重新计算所有指标
    calculateLifeMetrics(today);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 背景层 - 使用渐变色替代图片 */}
      <motion.div 
        className={`absolute inset-0 ${LIFE_SCENES[currentSceneIndex].gradient} transition-all duration-700`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* 叠加层，增加深度感 */}
        <div className={`absolute inset-0 ${LIFE_SCENES[currentSceneIndex].overlay}`} />
        
        {/* 可选：添加动态图 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse-slow" />
        </div>
      </motion.div>

      {/* 内容层 */}
      <div className="relative h-full max-w-md mx-auto flex flex-col justify-between py-4 px-4">
        {user ? (
          <AnimatePresence mode="wait">
            <motion.div className="h-full flex flex-col justify-between">
              {/* 顶部信息区 - 重新设计 */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="rounded-2xl overflow-hidden backdrop-blur-md">
                  {/* 标题背景层 */}
                  <div className="bg-gradient-to-r from-purple-900/80 via-purple-800/80 to-purple-900/80 p-4">
                    <div className="text-center space-y-1">
                      <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                        生命跃进计时器
                      </h1>
                      <div className="text-white/90 text-sm space-y-1">
                        <p>你好，{user.name}！</p>
                        <p className="text-white/80">{currentDate}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 场景标题 */}
                  <div className="bg-black/20 px-4 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white/90 drop-shadow-md">
                      {LIFE_SCENES[currentSceneIndex].title}
                    </h2>
                    <button
                      onClick={() => clearUser()}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                      title="重置信息"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* 中央内容区 - 调整间距 */}
              <div className="flex-1 flex flex-col justify-center space-y-6 my-4">
                {/* 天数计数器 */}
                <motion.div 
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl transform scale-110" />
                  <div 
                    className="relative backdrop-blur-sm bg-black/30 rounded-full w-44 h-44 mx-auto flex items-center justify-center border border-white/30 cursor-pointer hover:bg-black/40 transition-all duration-300 group"
                    onClick={backToToday}
                    title="点击后返回到今天"
                  >
                    <div className="text-center">
                      <span className="text-4xl font-bold text-white drop-shadow-lg">
                        {dayNumber.toLocaleString()}
                      </span>
                      <p className="text-sm text-white/90 mt-2 font-medium">
                        人生进行时
                      </p>
                      {/* 悬停时显示的提示 */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 whitespace-nowrap">
                        <p className="text-xs text-white/80 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                          点击后返回到今天
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* 激励语区域 - 优化间距 */}
                <motion.div 
                  className="w-full px-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div 
                    onClick={() => setShowLongText(!showLongText)}
                    className="relative overflow-hidden rounded-2xl cursor-pointer group"
                  >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60 group-hover:via-black/40 group-hover:to-black/70 transition-all duration-300" />
                    
                    <div className="relative p-6">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentQuote}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-4"
                        >
                          <p className="text-lg text-center leading-relaxed font-medium text-white drop-shadow-lg">
                            {currentQuote}
                          </p>
                          {showLongText && (
                            <p className="text-base text-center leading-relaxed text-white/90">
                              {LIFE_SCENES[currentSceneIndex].longText}
                            </p>
                          )}
                          <div className="text-center">
                            <span className="text-white/70 text-sm">
                              {showLongText ? '点击收起' : '点击展开查看更多'}
                            </span>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* 底部控制区 - 调整间距 */}
              <div className="space-y-4">
                {/* 进度条 */}
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="flex justify-between text-sm text-white mb-2">
                    <span>已度过时光</span>
                    <span>剩余 {timeLeft}</span>
                  </div>
                  <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="absolute h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full"
                      style={{ width: `${lifeProgress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${lifeProgress}%` }}
                    >
                      <div className="absolute inset-0 shimmer" />
                    </motion.div>
                  </div>
                </div>

                {/* 场景切换按钮 */}
                <div className="flex justify-between px-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevDay}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
                    title="前一天"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextDay}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
                    title="后一天"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <UserSetup />
        )}
      </div>
    </div>
  );
}
