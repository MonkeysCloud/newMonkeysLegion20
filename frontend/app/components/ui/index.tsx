'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

/* ============================================================================
   Reusable UI Components
   ============================================================================ */

/* --- Animated Section Wrapper --- */
export function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* --- Count-Up Number --- */
export function CountUpNumber({
  end,
  suffix = '',
  prefix = '',
  duration = 2000,
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const startValue = 0;

    function animate(currentTime: number) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(startValue + (end - startValue) * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString()}
      {suffix}
    </span>
  );
}

/* --- Terminal Animation --- */
export function TerminalAnimation() {
  const lines = [
    { prompt: true, text: 'composer create-project monkeyscloud/monkeyslegion-skeleton my-app' },
    { prompt: true, text: 'cd my-app' },
    { prompt: true, text: 'php ml key:generate' },
    { prompt: true, text: 'composer serve' },
    { prompt: false, text: '# → http://127.0.0.1:8000', isComment: true },
  ];

  const [visibleLines, setVisibleLines] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (!inView) return;

    const totalDuration = 2500; // 2.5s cap
    const totalChars = lines.reduce((sum, l) => sum + l.text.length, 0);
    const charDelay = totalDuration / totalChars;

    let lineIdx = 0;
    let charIdx = 0;
    let timer: ReturnType<typeof setTimeout>;

    function typeNext() {
      if (lineIdx >= lines.length) return;

      charIdx++;
      setCurrentCharIndex(charIdx);

      if (charIdx >= lines[lineIdx].text.length) {
        lineIdx++;
        charIdx = 0;
        setVisibleLines(lineIdx);
        setCurrentCharIndex(0);
      }

      if (lineIdx < lines.length) {
        timer = setTimeout(typeNext, charDelay);
      }
    }

    setVisibleLines(0);
    setCurrentCharIndex(0);
    timer = setTimeout(typeNext, 300);

    return () => clearTimeout(timer);
  }, [inView]);

  return (
    <div ref={ref} className="terminal" style={{ maxWidth: 700 }}>
      <div className="terminal-header">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <span style={{ marginLeft: 8, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          Terminal
        </span>
      </div>
      <div className="terminal-body">
        {lines.map((line, idx) => {
          if (idx > visibleLines) return null;

          const isCurrentLine = idx === visibleLines;
          const displayText = isCurrentLine
            ? line.text.slice(0, currentCharIndex)
            : line.text;

          return (
            <div key={idx} className="terminal-line" style={{ marginBottom: 4 }}>
              {line.prompt && <span className="terminal-prompt">$</span>}
              <span className={line.isComment ? 'terminal-comment' : 'terminal-command'}>
                {displayText}
                {isCurrentLine && idx < lines.length - 1 && (
                  <span style={{ animation: 'typing-cursor 0.8s infinite' }}>▊</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --- Feature Tile Card --- */
export function FeatureTile({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <AnimatedSection delay={delay}>
      <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%' }}>
        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{icon}</div>
        <h3 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 700,
          marginBottom: 'var(--space-2)',
          color: 'var(--color-text)',
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: 'var(--line-height-relaxed)',
        }}>
          {description}
        </p>
      </div>
    </AnimatedSection>
  );
}

/* --- Pillar Tile Card --- */
export function PillarCard({
  icon,
  title,
  subtitle,
  description,
  delay = 0,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  description: string;
  delay?: number;
}) {
  return (
    <AnimatedSection delay={delay}>
      <div className="glass-card" style={{ padding: 'var(--space-8)', height: '100%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 120, height: 3, background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)', borderRadius: 'var(--radius-full)' }} />
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>{icon}</div>
        <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-primary-light)', marginBottom: 'var(--space-4)' }}>{subtitle}</p>}
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>{description}</p>
      </div>
    </AnimatedSection>
  );
}

/* --- Benchmark Table Row --- */
export function BenchmarkRow({
  operation,
  mlValue,
  mlSuffix,
  vsLaravel,
  vsSymfony,
}: {
  operation: string;
  mlValue: number;
  mlSuffix?: string;
  vsLaravel: string;
  vsSymfony: string;
}) {
  return (
    <tr>
      <td style={{ fontWeight: 500, color: 'var(--color-text)' }}>{operation}</td>
      <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-code)' }}>
        <span style={{ color: 'var(--color-secondary)' }}>
          <CountUpNumber end={mlValue} suffix={mlSuffix} decimals={mlValue % 1 !== 0 ? 1 : 0} />
        </span>
      </td>
      <td><span style={{ color: vsLaravel === 'N/A' ? 'var(--color-text-muted)' : 'var(--color-success)' }}>{vsLaravel}</span></td>
      <td><span style={{ color: vsSymfony === 'N/A' ? 'var(--color-text-muted)' : 'var(--color-success)' }}>{vsSymfony}</span></td>
    </tr>
  );
}

/* --- Security Table Row --- */
export function StatusIcon({ status }: { status: 'yes' | 'partial' | 'no' }) {
  if (status === 'yes') return <span style={{ color: 'var(--color-success)', fontSize: '1.1rem' }}>✅</span>;
  if (status === 'partial') return <span style={{ color: 'var(--color-warning)', fontSize: '1.1rem' }}>⚠️</span>;
  return <span style={{ color: 'var(--color-danger)', fontSize: '1.1rem' }}>❌</span>;
}

export function SecurityRow({
  feature,
  mlStatus,
  laravelStatus,
  laravelNote,
  symfonyStatus,
  symfonyNote,
}: {
  feature: string;
  mlStatus: 'yes' | 'partial' | 'no';
  laravelStatus: 'yes' | 'partial' | 'no';
  laravelNote?: string;
  symfonyStatus: 'yes' | 'partial' | 'no';
  symfonyNote?: string;
}) {
  return (
    <tr>
      <td style={{ fontWeight: 500, color: 'var(--color-text)' }}>{feature}</td>
      <td style={{ textAlign: 'center' }}><StatusIcon status={mlStatus} /></td>
      <td style={{ textAlign: 'center' }}>
        <StatusIcon status={laravelStatus} />
        {laravelNote && <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>{laravelNote}</span>}
      </td>
      <td style={{ textAlign: 'center' }}>
        <StatusIcon status={symfonyStatus} />
        {symfonyNote && <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>{symfonyNote}</span>}
      </td>
    </tr>
  );
}

/* --- Status Badge Component --- */
export function StatusBadge({ status }: { status: 'yes' | 'partial' | 'no' }) {
  const map = {
    yes: { label: '✅ Built-in', className: 'badge badge-success' },
    partial: { label: '⚠️ Partial', className: 'badge badge-warning' },
    no: { label: '❌ Not included', className: 'badge badge-danger' },
  };
  const { label, className } = map[status];
  return <span className={className}>{label}</span>;
}

/* --- Code Tabs --- */
export function CodeTabs({
  tabs,
}: {
  tabs: { label: string; language: string; code: string; description: string }[];
}) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="code-block">
      <div className="tabs">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={`tab ${idx === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="code-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          <code>{tabs[activeTab].code}</code>
        </pre>
      </div>
      <div style={{
        padding: 'var(--space-4) var(--space-5)',
        borderTop: '1px solid var(--color-border)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
        lineHeight: 'var(--line-height-relaxed)',
      }}>
        {tabs[activeTab].description}
      </div>
    </div>
  );
}
