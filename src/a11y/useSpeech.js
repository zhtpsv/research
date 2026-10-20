import { useCallback, useEffect, useRef, useState } from 'react';

const supported = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

/** Text the user wants to hear: the current selection, or the section in the middle of the screen. */
export function getTextToRead() {
  const sel = window.getSelection && window.getSelection().toString().trim();
  if (sel) return sel;
  const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
  const section = (el && el.closest('section, header, footer')) || document.querySelector('main');
  return (section ? section.innerText : '').replace(/\s+\n/g, '\n').trim().slice(0, 8000);
}

// Chrome cuts long utterances after ~15 s, so the text is read in short sentence-based chunks.
function chunk(text, max = 200) {
  const sentences = text.split(/(?<=[.!?…])\s+|\n+/).filter(Boolean);
  const out = [];
  let cur = '';
  for (const s of sentences) {
    if ((cur + ' ' + s).length > max && cur) {
      out.push(cur);
      cur = s;
    } else cur = cur ? cur + ' ' + s : s;
  }
  if (cur) out.push(cur);
  return out.flatMap((c) => (c.length > max * 1.6 ? c.match(new RegExp(`.{1,${max}}(\\s|$)`, 'g')) || [c] : [c]));
}

export function useSpeech(speechLang) {
  const [speaking, setSpeaking] = useState(false);
  const token = useRef(0);

  const stop = useCallback(() => {
    token.current++;
    if (supported()) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(() => {
    if (!supported()) return;
    const text = getTextToRead();
    if (!text) return;
    window.speechSynthesis.cancel();
    const my = ++token.current;
    const voices = window.speechSynthesis.getVoices();
    const prefix = speechLang.slice(0, 2);
    let voice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(prefix));
    let lang = speechLang;
    if (!voice && prefix === 'kk') {
      // most systems have no Kazakh voice; Russian reads Kazakh Cyrillic far better than an English voice would
      voice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('ru'));
      lang = 'ru-RU';
    }
    const parts = chunk(text);
    setSpeaking(true);
    parts.forEach((part, i) => {
      const u = new SpeechSynthesisUtterance(part);
      u.lang = lang;
      if (voice) u.voice = voice;
      const done = () => {
        if (token.current === my && i === parts.length - 1) setSpeaking(false);
      };
      u.onend = done;
      u.onerror = done;
      window.speechSynthesis.speak(u);
    });
  }, [speechLang]);

  useEffect(() => () => supported() && window.speechSynthesis.cancel(), []);
  return { speaking, speak, stop, available: supported() };
}
