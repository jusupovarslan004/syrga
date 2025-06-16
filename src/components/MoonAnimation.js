import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const MoonContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  position: relative;
  overflow: hidden;
`;

const Moon = styled(motion.div)`
  width: 200px;
  height: 200px;
  background: radial-gradient(circle at 30% 30%, #ffffff, #f0f0f0);
  border-radius: 50%;
  box-shadow: 
    0 0 50px #fff,
    0 0 100px #fff,
    0 0 150px #fff;
  cursor: pointer;
  position: relative;
  z-index: 2;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle at center, #ffffff, transparent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
`;

const PromptText = styled(motion.div)`
  position: absolute;
  bottom: 20%;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  font-family: 'Arial', sans-serif;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const MoonAnimation = () => {
  const [particles, setParticles] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const containerRef = useRef(null);
  const lastShakeTime = useRef(0);
  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });

  const createParticle = useCallback((x, y) => ({
    id: Date.now() + Math.random(),
    x,
    y,
    vx: (Math.random() - 0.5) * 10,
    vy: Math.random() * 5 + 5,
    size: Math.random() * 4 + 4,
    opacity: 1,
  }), []);

  const handleShake = useCallback(() => {
    const now = Date.now();
    if (now - lastShakeTime.current < 1000) return;
    lastShakeTime.current = now;

    setIsShaking(true);
    const newParticles = Array.from({ length: 50 }, () => 
      createParticle(window.innerWidth / 2, window.innerHeight / 2)
    );
    setParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => setIsShaking(false), 1000);
  }, [createParticle]);

  useEffect(() => {
    const handleDeviceMotion = (event) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      // Получаем текущие значения ускорения
      const currentAcceleration = {
        x: acceleration.x || 0,
        y: acceleration.y || 0,
        z: acceleration.z || 0
      };

      // Вычисляем изменение ускорения
      const deltaX = Math.abs(currentAcceleration.x - lastAcceleration.current.x);
      const deltaY = Math.abs(currentAcceleration.y - lastAcceleration.current.y);
      const deltaZ = Math.abs(currentAcceleration.z - lastAcceleration.current.z);

      // Обновляем последние значения
      lastAcceleration.current = currentAcceleration;

      // Проверяем, превышает ли изменение ускорения пороговое значение
      const threshold = 10; // Уменьшили порог для более легкого срабатывания
      if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
        handleShake();
      }
    };

    // Проверяем поддержку DeviceMotion
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleDeviceMotion);
    } else {
      console.log('DeviceMotion не поддерживается');
      // Добавляем обработчик клика как запасной вариант
      const moon = document.querySelector('moon');
      if (moon) {
        moon.addEventListener('click', handleShake);
      }
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [handleShake]);

  useEffect(() => {
    const updateParticles = () => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.2,
            opacity: particle.opacity - 0.01,
          }))
          .filter(particle => particle.opacity > 0)
      );
    };

    const animationFrame = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);

  return (
    <MoonContainer ref={containerRef}>
      <Moon
        onClick={handleShake} // Добавляем обработчик клика
        animate={isShaking ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      />
      <AnimatePresence>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
            }}
          />
        ))}
      </AnimatePresence>
      <PromptText
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Встряхни телефон или нажми на луну...
      </PromptText>
    </MoonContainer>
  );
};

export default MoonAnimation; 