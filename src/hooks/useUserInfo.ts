
import { useState } from 'react';

export type UserInfo = {
  name: string;
  email: string;
  phone: string;
};

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [userInput, setUserInput] = useState('');
  const [currentInfoField, setCurrentInfoField] = useState<'name' | 'email' | 'phone'>('name');

  const resetUserInfo = () => {
    setUserInfo({
      name: '',
      email: '',
      phone: ''
    });
    setUserInput('');
    setCurrentInfoField('name');
  };

  const updateUserInfo = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    userInfo,
    userInput,
    setUserInput,
    currentInfoField,
    setCurrentInfoField,
    updateUserInfo,
    resetUserInfo
  };
};
