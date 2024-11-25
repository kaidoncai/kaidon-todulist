'use client';

import { useState } from 'react';
import { useUserStore } from '@/src/store/userStore';
import { NewUser, validateUser, ValidationError } from '@/src/types/user';

export default function UserSetup() {
  const setUser = useUserStore((state) => state.setUser);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newUser: NewUser = {
      name: formData.get('name') as string,
      birthDate: new Date(formData.get('birthDate') as string),
      expectedLifespan: Number(formData.get('expectedLifespan'))
    };

    const validationErrors = validateUser(newUser);
    if (validationErrors.length > 0) {
      setErrors(validationErrors.map((err: ValidationError) => err.message));
      return;
    }

    setUser(newUser);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">生命计算器</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="text-lg font-medium">
              你的名字
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入你的名字"
              required
            />
          </div>

          <div>
            <label htmlFor="birthDate" className="text-lg font-medium">
              出生日期
            </label>
            <input
              type="date"
              name="birthDate"
              id="birthDate"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="expectedLifespan" className="text-lg font-medium">
              预期寿命
            </label>
            <input
              type="number"
              name="expectedLifespan"
              id="expectedLifespan"
              min="1"
              max="150"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入预期寿命（年）"
              required
            />
          </div>

          {errors.length > 0 && (
            <div className="p-4 bg-red-50 rounded-lg">
              {errors.map((error, index) => (
                <p key={index} className="text-red-500">{error}</p>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            开始计算
          </button>
        </form>
      </div>
    </div>
  );
} 