// React wrapper for the AUD mock exam engine (framework-agnostic core).
// Usage: <AUDExam scripts={['/aud/data/hard_a.js','/aud/data/hard_b.js','/aud/data/hard_c.js','/aud/aud-exam.js']} />
// Also add <link rel="stylesheet" href="/aud/aud-exam.css"> (or import it in your bundler).
import { useEffect, useRef } from 'react';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-aud="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src; s.async = false; s.dataset.aud = src;
    s.onload = resolve; s.onerror = () => reject(new Error('Failed to load ' + src));
    document.body.appendChild(s);
  });
}

export default function AUDExam({ scripts, height = '100vh', fullscreen = false, defaultMode = 'study', onComplete }) {
  const ref = useRef(null);
  useEffect(() => {
    let inst, cancelled = false;
    (async () => {
      for (const src of scripts) await loadScript(src); // data files first, engine last
      if (!cancelled && window.AUDExam && ref.current) inst = window.AUDExam.mount(ref.current, { fullscreen, defaultMode, onComplete });
    })();
    return () => { cancelled = true; if (inst) inst.destroy(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <div ref={ref} style={{ height }} />;
}
