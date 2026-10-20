import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [text, setText] = useState('');
  const [shown, setShown] = useState(false);
  const timer = useRef(null);

  const toast = useCallback((t) => {
    setText(t);
    setShown(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShown(false), 2800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {createPortal(
        <div id="toast" className={'toast' + (shown ? ' show' : '')} role="status">
          {text}
        </div>,
        document.getElementById('overlay-root'),
      )}
    </ToastContext.Provider>
  );
}
