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
  padding: 0 20px;
`;

const ShakeButton = styled(motion.button)`
  position: absolute;
  bottom: 30%;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 25px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const MoonAnimation = () => {
  const [particles, setParticles] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const containerRef = useRef(null);
  const lastShakeTime = useRef(0);
  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });
  const shakeCount = useRef(0);

  useEffect(() => {
    // Определяем iOS устройство
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);
  }, []);

  const createParticle = useCallback((x, y) => ({
    id: Date.now() + Math.random(),
    x,
    y,
    vx: (Math.random() - 0.5) * 10,
    vy: Math.random() * 5 + 5,
    size: Math.random() * 4 + 4,
    opacity: 1,
  }), []);

  const vibrate = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }, []);

  const handleShake = useCallback(() => {
    const now = Date.now();
    if (now - lastShakeTime.current < 500) return;
    lastShakeTime.current = now;

    setIsShaking(true);
    vibrate();
    const newParticles = Array.from({ length: 50 }, () => 
      createParticle(window.innerWidth / 2, window.innerHeight / 2)
    );
    setParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => setIsShaking(false), 500);
  }, [createParticle, vibrate]);

  useEffect(() => {
    const handleDeviceMotion = (event) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const currentAcceleration = {
        x: acceleration.x || 0,
        y: acceleration.y || 0,
        z: acceleration.z || 0
      };

      const deltaX = Math.abs(currentAcceleration.x - lastAcceleration.current.x);
      const deltaY = Math.abs(currentAcceleration.y - lastAcceleration.current.y);
      const deltaZ = Math.abs(currentAcceleration.z - lastAcceleration.current.z);

      lastAcceleration.current = currentAcceleration;

      const threshold = 5;
      
      if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
        shakeCount.current += 1;
        if (shakeCount.current >= 2) {
          shakeCount.current = 0;
          handleShake();
        }
      } else {
        shakeCount.current = 0;
      }
    };

    if (typeof DeviceMotionEvent !== 'undefined') {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        // iOS 13+ requires permission
        DeviceMotionEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('devicemotion', handleDeviceMotion);
            }
          })
          .catch(console.error);
      } else {
        // Android and older iOS versions
        window.addEventListener('devicemotion', handleDeviceMotion);
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
        onClick={handleShake}
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
        {isIOS ? 'Нажми на луну или кнопку для эффекта' : 'Встряхни телефон или нажми на луну...'}
      </PromptText>
      {isIOS && (
        <ShakeButton
          onClick={handleShake}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Создать эффект ✨
        </ShakeButton>
      )}
    </MoonContainer>
  );
};

export default MoonAnimation; 