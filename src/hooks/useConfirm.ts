import { useState } from 'react';

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

export const useConfirm = () => {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const confirm = (title: string, message: string, onConfirm: () => void) => {
    setState({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const close = () => {
    setState({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: () => {},
    });
  };

  return {
    ...state,
    confirm,
    close,
  };
};
