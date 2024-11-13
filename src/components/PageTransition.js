import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

class Particle {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 3 - 0.5;
    this.color = '#D4FF99';
    this.alpha = 1;
  }

  update() {
    this.y += this.speedY;
    if (this.y < this.canvas.height / 2) {
      this.alpha -= 0.02;
    }
  }

  draw(ctx) {
    ctx.fillStyle = `rgba(212, 255, 153, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function PageTransition({ children }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particleCount = 500;
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = canvas.height + Math.random() * 100;
      particlesRef.current.push(new Particle(x, y, canvas));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let allParticlesGone = true;
      
      particlesRef.current.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
        if (particle.alpha > 0) allParticlesGone = false;
      });

      if (allParticlesGone) {
        canvas.style.opacity = '0';
        cancelAnimationFrame(animationRef.current);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    setTimeout(() => {
      canvas.style.opacity = '1';
      animate();
    }, 100);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-300"
        style={{ background: '#000', opacity: 0 }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </>
  );
}

export default PageTransition; 