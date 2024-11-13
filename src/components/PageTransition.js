import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

class Particle {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.size = Math.random() * 5 + 1;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = '#D4FF99';
  }

  update() {
    this.y += this.speedY;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function PageTransition({ children }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const isExitingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = 200;
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = canvas.height + Math.random() * 100; // Start below screen
      particlesRef.current.push(new Particle(x, y, canvas));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      if (!isExitingRef.current && particlesRef.current[0].y < -10) {
        // All particles have moved off screen, hide canvas
        canvas.style.opacity = '0';
        cancelAnimationFrame(animationRef.current);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-500"
        style={{ background: '#000' }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
}

export default PageTransition; 