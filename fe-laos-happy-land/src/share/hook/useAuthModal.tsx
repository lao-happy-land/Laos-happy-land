"use client";

import { useState } from 'react';
import AuthModal from '@/components/auth/AuthModal';

export function useAuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'login' | 'register'>('login');

  const openLogin = () => {
    setType('login');
    setIsOpen(true);
  };

  const openRegister = () => {
    setType('register');
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const switchType = (newType: 'login' | 'register') => {
    setType(newType);
  };

  const AuthModalComponent = () => (
    <AuthModal
      isOpen={isOpen}
      onClose={close}
      type={type}
      onSwitchType={switchType}
    />
  );

  return {
    openLogin,
    openRegister,
    close,
    AuthModalComponent,
    isOpen,
    type,
  };
}

export default useAuthModal;
