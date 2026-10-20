import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useA11y } from './A11yContext';

/** A horizontal "reading ruler": dims everything except a strip that follows the pointer. */
export default function ReadingGuide() {
  const { settings } = useA11y();
  const [y, setY] = useState(() => Math.round(window.innerHeight / 2));

  useEffect(() => {
    if (!settings.guide) return undefined;
    const move = (e) => {
      const p = e.touches ? e.touches[0] : e;
      setY(p.clientY);
    };
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('touchstart', move, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchstart', move);
    };
  }, [settings.guide]);

  if (!settings.guide) return null;
  return createPortal(<div className="reading-guide" aria-hidden="true" style={{ top: y - 28 }} />, document.getElementById('overlay-root'));
}
