import { Fragment } from 'react';

const ENTITIES = { '&gt;': '>', '&lt;': '<', '&amp;': '&' };
const decode = (s) => s.replace(/&(?:gt|lt|amp);/g, (m) => ENTITIES[m]);

/**
 * Tiny, safe renderer for the inline markup used in dictionaries:
 * <b>, <strong>, <em>, <br>. No dangerouslySetInnerHTML is used.
 */
export function parseRich(input) {
  const tokens = String(input).split(/(<\/?(?:b|strong|em)>|<br\s*\/?>)/g);
  const root = { children: [] };
  const stack = [root];
  let key = 0;
  for (const tok of tokens) {
    if (!tok) continue;
    const open = tok.match(/^<(b|strong|em)>$/);
    const close = tok.match(/^<\/(b|strong|em)>$/);
    if (open) {
      const node = { tag: open[1], children: [], key: key++ };
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    } else if (close) {
      if (stack.length > 1) stack.pop();
    } else if (/^<br/.test(tok)) {
      stack[stack.length - 1].children.push({ br: true, key: key++ });
    } else {
      stack[stack.length - 1].children.push(decode(tok));
    }
  }
  const render = (nodes) =>
    nodes.map((n, i) => {
      if (typeof n === 'string') return <Fragment key={i}>{n}</Fragment>;
      if (n.br) return <br key={n.key} />;
      const Tag = n.tag;
      return <Tag key={n.key}>{render(n.children)}</Tag>;
    });
  return render(root.children);
}

export function Rich({ text }) {
  return <>{parseRich(text)}</>;
}
