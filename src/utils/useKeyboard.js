import { useEffect } from 'react';

export const useKeyboard = (shortcuts, deps = []) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        document.activeElement.tagName
      );

      // Alt + N (Yeni)
      if (event.altKey && event.key.toLowerCase() === 'n') {
        if (!isInputFocused && shortcuts.altN) {
          event.preventDefault();
          shortcuts.altN(event);
        }
        return;
      }

      // Esc (Kapat)
      if (event.key === 'Escape') {
        if (shortcuts.escape) {
          event.preventDefault();
          shortcuts.escape(event);
        }
        return;
      }

      // Ctrl + S (Kaydet)
      if (event.ctrlKey && event.key.toLowerCase() === 's') {
        if (shortcuts.ctrlS) {
          event.preventDefault();
          shortcuts.ctrlS(event);
        }
        return;
      }

      // Ctrl + F (Ara)
      if (event.ctrlKey && event.key.toLowerCase() === 'f') {
        if (!isInputFocused && shortcuts.ctrlF) {
          event.preventDefault();
          shortcuts.ctrlF(event);
        }
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, ...deps]);
};

export const useKeyPress = (targetKey, callback, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handler = (event) => {
      if (event.key === targetKey) {
        callback(event);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [targetKey, callback, enabled]);
};