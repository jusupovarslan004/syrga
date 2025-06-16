import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ButterflySVG from './ButterflySVG';

const MoonContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  position: relative;
  overflow: hidden;
  perspective: 1200px;
`;

const MoonWrapper = styled(motion.div)`
  transform-style: preserve-3d;
  position: relative;
  width: 200px;
  height: 200px;
`;

const MoonSphere = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffffff, #f0f0f0);
  box-shadow: 
    0 0 50px #fff,
    0 0 100px #fff,
    0 0 150px #fff,
    inset 0 0 50px rgba(255, 255, 255, 0.5);
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.8), transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.3), transparent 50%),
      url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z' fill='rgba(255,255,255,0.1)'/%3E%3C/svg%3E");
    border-radius: 50%;
    filter: blur(2px);
  }
`;

const MoonCraters = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: 
    radial-gradient(circle at 30% 40%, rgba(0,0,0,0.2) 0%, transparent 20%),
    radial-gradient(circle at 70% 60%, rgba(0,0,0,0.15) 0%, transparent 15%),
    radial-gradient(circle at 40% 70%, rgba(0,0,0,0.1) 0%, transparent 10%),
    radial-gradient(circle at 60% 30%, rgba(0,0,0,0.1) 0%, transparent 10%);
  transform-style: preserve-3d;
`;

const ButterflyWrapper = styled(motion.div)`
  position: absolute;
  width: 48px;
  height: 48px;
  pointer-events: none;
  z-index: 1;
  will-change: transform, opacity;
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

const MagicTransition = styled(motion.div)`
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  width: 100vw; height: 100vh;
  background: radial-gradient(circle at 50% 50%, #fffbe9 0%, #fbc2eb 60%, #1a1a2e 100%);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #a18cd1;
  letter-spacing: 2px;
  font-family: 'Caveat', cursive;
  pointer-events: none;
`;

const MoonAnimation = ({ onMoonClick }) => {
  const [butterflies, setButterflies] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [effectStarted, setEffectStarted] = useState(false);
  const containerRef = useRef(null);
  const lastShakeTime = useRef(0);
  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });
  const shakeCount = useRef(0);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/media/apologize.mp3');
    audioRef.current.volume = 0.7;
  }, []);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);
  }, []);

  const startMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log('Error playing audio:', error);
      });
    }
  }, []);

  const createButterfly = useCallback((x, y) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 3;
    return {
      id: Date.now() + Math.random(),
      x,
      y,
      z: Math.random() * 300 - 150,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      vz: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      scale: Math.random() * 0.5 + 0.5,
      opacity: 1,
    };
  }, []);

  const vibrate = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }, []);

  const handleShake = useCallback(() => {
    if (effectStarted) return;
    setEffectStarted(true);
    const now = Date.now();
    if (now - lastShakeTime.current < 500) return;
    lastShakeTime.current = now;
    setIsShaking(true);
    vibrate();
    startMusic();
    const newButterflies = Array.from({ length: 12 }, () => 
      createButterfly(window.innerWidth / 2, window.innerHeight / 2)
    );
    setButterflies(prev => [...prev, ...newButterflies]);
    setTimeout(() => setIsShaking(false), 500);
  }, [createButterfly, vibrate, effectStarted, startMusic]);

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
            z: butterfly.z + (butterfly.vz || 0),
            rotation: butterfly.rotation + (butterfly.rotationSpeed || 0),
            opacity: butterfly.opacity - 0.003,
            scale: butterfly.scale * 0.999,
          }))
          .filter(butterfly => butterfly.opacity > 0)
      );
    };
    const animationFrame = requestAnimationFrame(updateButterflies);
    return () => cancelAnimationFrame(animationFrame);
  }, [butterflies]);

  useEffect(() => {
    if (effectStarted && butterflies.length === 0 && !isShaking && !showTransition) {
      setShowTransition(true);
      setTimeout(() => {
        setShowTransition(false);
        onMoonClick();
      }, 1000);
    }
  }, [butterflies, isShaking, showTransition, effectStarted, onMoonClick]);

  return (
    <MoonContainer ref={containerRef}>
      <MoonWrapper
        animate={isShaking ? {
          rotateY: [0, 360],
          rotateX: [0, 45, 0],
          scale: [1, 1.2, 1],
        } : { rotateY: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <MoonSphere
          onClick={() => {
            handleShake();
            startMusic();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MoonCraters />
        </MoonSphere>
      </MoonWrapper>
      <AnimatePresence>
        {butterflies.map(butterfly => (
          <ButterflyWrapper
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
          >
            <ButterflySVG style={{ width: 48, height: 48 }} />
          </ButterflyWrapper>
        ))}
      </AnimatePresence>
      {!effectStarted && (
        <PromptText
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          {'Встряхни телефон или нажми на луну...'}
        </PromptText>
      )}
      <AnimatePresence>
        {showTransition && (
          <MagicTransition
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <span>✨ Волшебство... ✨</span>
          </MagicTransition>
        )}
      </AnimatePresence>
    </MoonContainer>
  );
};

export default MoonAnimation;