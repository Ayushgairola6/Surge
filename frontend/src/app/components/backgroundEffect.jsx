import { motion } from 'framer-motion';
import React, { useMemo } from 'react'

const BackgroundEffect = () => {
  const emojis = [
    '💔', '🤫', '📝', '😈', '🔥', '😢', '👻', '🗣️', '🎭', '❤️',
  ];
  const createParticles = (count) => {
    return Array.from({ length: count }).map((_, i) => {
      const size = 20 + Math.random() * 30;
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const delay = Math.random() * 5;
      const duration = 5 + Math.random() * 5;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      return { id: i, size, x, y, delay, duration, emoji };
    });
  };
  const particles = useMemo(() => {
    if (typeof window !== "undefined") {
      createParticles(20)
    }
  }, []);

  return (<>
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 h-full w-full">
      {particles.map(({ id, size, x, y, delay, duration, emoji }) => (
        <motion.span
          key={id}
          initial={{ x, y, opacity: 0 }}
          animate={{
            y: [y, y - 100, y],
            x: [x, x + 50, x],
            opacity: [0, 1, 0.5],
          }}
          transition={{
            delay,
            duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
          className="absolute"
          style={{ fontSize: size }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  </>)
}
export default BackgroundEffect;