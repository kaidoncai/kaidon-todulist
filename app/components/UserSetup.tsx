'use client';

import { useState } from 'react';
import { useUserStore } from '@/src/store/userStore';
import { motion } from 'framer-motion';

export default function UserSetup() {
  const setUser = useUserStore(state => state.setUser);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    expectedLifespan: 80,
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      ...formData
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="h-full flex flex-col justify-center px-4">
      <motion.div 
        className="glass-effect rounded-3xl p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            生命跃进计时器
          </h2>
          <p className="text-gray-600">开启你的人生新篇章</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              你的名字
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50"
                required
                placeholder="输入你的名字"
              />
              <div className="absolute right-3 top-3 text-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              出生日期
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50"
                required
              />
              <div className="absolute right-3 top-3 text-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              预期寿命
            </label>
            <div className="relative">
              <input
                type="range"
                min="60"
                max="120"
                value={formData.expectedLifespan}
                onChange={(e) => setFormData({...formData, expectedLifespan: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="text-center mt-2 text-purple-600 font-medium">
                {formData.expectedLifespan} 岁
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              电子邮箱
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50"
                required
                placeholder="your@email.com"
              />
              <div className="absolute right-3 top-3 text-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium 
              hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
              shadow-lg shadow-purple-500/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            开启人生新篇章
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
} 