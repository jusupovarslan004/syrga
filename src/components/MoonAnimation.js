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
  perspective: 1000px;
`;

const Moon = styled(motion.div)`
  width: 200px;
  height: 200px;
  background: radial-gradient(circle at 30% 30%, #ffffff, #f0f0f0);
  border-radius: 50%;
  box-shadow: 
    0 0 50px #fff,
    0 0 100px #fff,
    0 0 150px #fff,
    inset 0 0 50px rgba(255, 255, 255, 0.5);
  cursor: pointer;
  position: relative;
  z-index: 2;
  transform-style: preserve-3d;
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8), transparent);
    border-radius: 50%;
    filter: blur(10px);
  }
`;

const Butterfly = styled(motion.div)`
  position: absolute;
  width: 20px;
  height: 20px;
  background: transparent;
  pointer-events: none;
  z-index: 1;
  transform-style: preserve-3d;
  &::before, &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, 
      ${props => props.color || '#ffffff'}, 
      transparent 70%
    );
    border-radius: 50% 50% 0 50%;
    transform-origin: center;
  }
  &::before {
    transform: rotate(45deg) scale(0.8);
    filter: blur(1px);
  }
  &::after {
    transform: rotate(-45deg) scale(0.8);
    filter: blur(1px);
  }
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
  const [butterflies, setButterflies] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const containerRef = useRef(null);
  const lastShakeTime = useRef(0);
  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });
  const shakeCount = useRef(0);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);
  }, []);

  const createButterfly = useCallback((x, y) => {
    const colors = ['#ff69b4', '#87ceeb', '#ffd700', '#98fb98', '#dda0dd'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      id: Date.now() + Math.random(),
      x,
      y,
      z: Math.random() * 200 - 100,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      vz: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      scale: Math.random() * 0.5 + 0.5,
      color,
      opacity: 1,
    };
  }, []);

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
    const newButterflies = Array.from({ length: 30 }, () => 
      createButterfly(window.innerWidth / 2, window.innerHeight / 2)
    );
    setButterflies(prev => [...prev, ...newButterflies]);

    setTimeout(() => setIsShaking(false), 500);
  }, [createButterfly, vibrate]);

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
        DeviceMotionEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('devicemotion', handleDeviceMotion);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('devicemotion', handleDeviceMotion);
      }
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [handleShake]);

  useEffect(() => {
    const updateButterflies = () => {
      setButterflies(prev => 
        prev
          .map(butterfly => ({
            ...butterfly,
            x: butterfly.x + butterfly.vx,
            y: butterfly.y + butterfly.vy,
            z: butterfly.z + butterfly.vz,
            rotation: butterfly.rotation + butterfly.rotationSpeed,
            opacity: butterfly.opacity - 0.005,
            scale: butterfly.scale * 0.999,
          }))
          .filter(butterfly => butterfly.opacity > 0)
      );
    };

    const animationFrame = requestAnimationFrame(updateButterflies);
    return () => cancelAnimationFrame(animationFrame);
  }, [butterflies]);

  return (
    <MoonContainer ref={containerRef}>
      <Moon
        onClick={handleShake}
        animate={isShaking ? { 
          scale: [1, 1.2, 1],
          rotateY: [0, 180, 360],
          rotateX: [0, 45, 0]
        } : { scale: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      />
      <AnimatePresence>
        {butterflies.map(butterfly => (
          <Butterfly
            key={butterfly.id}
            style={{
              left: butterfly.x,
              top: butterfly.y,
              transform: `
                translateZ(${butterfly.z}px)
                rotate(${butterfly.rotation}deg)
                scale(${butterfly.scale})
              `,
              opacity: butterfly.opacity,
            }}
            color={butterfly.color}
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