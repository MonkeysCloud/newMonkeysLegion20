'use client';

import { useEffect, useState } from 'react';

const funnyMessages = [
  "Houston, we have a problem… this page doesn't exist.",
  "Our monkey astronaut searched the entire galaxy. Nothing here.",
  "Even PHP 8.4 property hooks can't find this route.",
  "This page went on a banana break and never came back.",
  "404: Page lost in space. Send bananas.",
  "Our monkey checked all 28 packages. No page found.",
  "Looks like this route wasn't attribute-discovered.",
];

export default function NotFound() {
  const [message, setMessage] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
    // Stagger animation
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse 80% 60% at 50% 40%, hsla(250, 50%, 15%, 0.6), hsl(230, 25%, 6%) 70%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Floating stars */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { text-shadow: 0 0 20px hsla(250, 90%, 65%, 0.3), 0 0 60px hsla(250, 90%, 65%, 0.1); }
          50% { text-shadow: 0 0 40px hsla(250, 90%, 65%, 0.5), 0 0 80px hsla(250, 90%, 65%, 0.2); }
        }
        .star {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: white;
        }
      `}</style>

      {/* Decorative stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: 0.3,
          }}
        />
      ))}

      <div style={{
        textAlign: 'center',
        maxWidth: 600,
        padding: 'var(--space-8)',
        animation: showContent ? 'fadeInUp 0.6s ease-out forwards' : 'none',
        opacity: showContent ? 1 : 0,
      }}>
        {/* Floating monkey illustration */}
        <div style={{
          animation: 'float 4s ease-in-out infinite',
          marginBottom: 'var(--space-6)',
        }}>
          <img
            src="/monkey-404.png"
            alt="Lost monkey astronaut"
            style={{
              width: '100%',
              maxWidth: 360,
              height: 'auto',
              borderRadius: 'var(--radius-xl)',
              filter: 'drop-shadow(0 20px 60px hsla(250, 80%, 40%, 0.3))',
            }}
          />
        </div>

        {/* 404 number */}
        <h1 style={{
          fontSize: 'clamp(4rem, 12vw, 8rem)',
          fontWeight: 900,
          lineHeight: 1,
          margin: '0 0 var(--space-4)',
          background: 'linear-gradient(135deg, hsl(250, 95%, 75%), hsl(280, 95%, 65%), hsl(250, 95%, 55%))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'pulseGlow 3s ease-in-out infinite',
          letterSpacing: '-0.04em',
        }}>
          404
        </h1>

        {/* Funny message */}
        <p style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--color-text-secondary)',
          lineHeight: 'var(--line-height-relaxed)',
          margin: '0 0 var(--space-8)',
          maxWidth: 480,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {message}
        </p>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-4)',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <a
            href="/"
            className="btn btn-primary btn-lg animate-pulse-glow"
          >
            🏠 Back to Home
          </a>
          <a
            href="/features"
            className="btn btn-secondary btn-lg"
          >
            🚀 Explore Features
          </a>
        </div>

        {/* Terminal joke */}
        <div style={{
          marginTop: 'var(--space-8)',
          background: 'hsla(230, 25%, 10%, 0.6)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          textAlign: 'left',
          maxWidth: 420,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--space-3)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-code)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            <div><span style={{ color: 'hsl(250, 95%, 75%)' }}>$</span> php ml route:find /this-page</div>
            <div style={{ color: 'hsl(0, 70%, 60%)', marginTop: 4 }}>❌ Route not found. Did you mean /features?</div>
            <div style={{ marginTop: 4 }}><span style={{ color: 'hsl(250, 95%, 75%)' }}>$</span> <span style={{ animation: 'twinkle 1s ease-in-out infinite' }}>▊</span></div>
          </div>
        </div>
      </div>
    </main>
  );
}
