import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const AlbumContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
`;

const Slide = styled.div`
  width: 90vw;
  max-width: 420px;
  height: 80vh;
  max-height: 600px;
  background: #fffbe9;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s;
  animation: fadeIn 0.7s;

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const Media = styled.div`
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Img = styled.img`
  max-width: 95%;
  max-height: 95%;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
`;

const Vid = styled.video`
  max-width: 95%;
  max-height: 95%;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  background: #000;
`;

const Caption = styled.div`
  margin-top: 18px;
  font-size: 1.1rem;
  color: #3a2c1a;
  text-align: center;
  font-family: 'Caveat', cursive;
  background: rgba(255,255,255,0.7);
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.7);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 2rem;
  color: #a18cd1;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s;
  &:hover { background: #fbc2eb; }
  ${props => props.left && css`left: 10px;`}
  ${props => props.right && css`right: 10px;`}
`;

const slides = [
  { type: 'image', src: '/media/1.jpg', caption: 'Моя любимая подруга! 💖' },
  { type: 'image', src: '/media/2.jpg', caption: 'В этот день мы смеялись до слёз! 🌟' },
  { type: 'video', src: '/media/video1.MP4', caption: 'Наше видео!' },
  { type: 'image', src: '/media/3.jpg', caption: 'Лучшие моменты вместе!' },
  { type: 'video', src: '/media/video2.MP4', caption: 'Ещё одно видео!' },
  { type: 'image', src: '/media/4.jpg', caption: 'Воспоминания о лете!' },
  { type: 'image', src: '/media/5.jpg', caption: 'Наши приключения!' },
  { type: 'image', src: '/media/6.jpg', caption: 'Твоя улыбка бесценна!' },
  { type: 'image', src: '/media/7.jpg', caption: 'С тобой всегда весело!' },
  { type: 'image', src: '/media/8.jpg', caption: 'Наша дружба навсегда!' },
  { type: 'image', src: '/media/9.jpg', caption: 'Моменты, которые мы ценим!' },
  { type: 'image', src: '/media/10.jpg', caption: 'Незабываемые дни!' },
  { type: 'image', src: '/media/11.jpg', caption: 'Ты - лучшая!' },
  { type: 'image', src: '/media/12.jpg', caption: 'Светлые воспоминания!' },
  { type: 'image', src: '/media/13.jpg', caption: 'Наши секреты!' },
  { type: 'image', src: '/media/14.jpg', caption: 'Всегда рядом!' },
  { type: 'image', src: '/media/15.jpg', caption: 'Наши общие мечты!' },
  { type: 'image', src: '/media/16.jpg', caption: 'Счастливые мгновения!' },
  { type: 'image', src: '/media/17.jpg', caption: 'Вместе к звёздам!' },
  { type: 'image', src: '/media/18.jpg', caption: 'Наши безумные идеи!' },
  { type: 'image', src: '/media/19.jpg', caption: 'Дружба, проверенная временем!' },
  { type: 'image', src: '/media/20.jpg', caption: 'Ты моё солнышко!' },
  { type: 'image', src: '/media/21.jpg', caption: 'Навеки в моём сердце!' },
  { type: 'image', src: '/media/22.jpg', caption: 'Каждый день - праздник с тобой!' },
  { type: 'image', src: '/media/23.jpg', caption: 'Незабываемые вечера!' },
  { type: 'image', src: '/media/24.jpg', caption: 'С тобой я счастлива!' },
  { type: 'image', src: '/media/25.jpg', caption: 'Моя родная душа!' },
  // Добавь свои фото и видео сюда
];

const CustomAlbum = () => {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Минимальное расстояние для свайпа
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && current < slides.length - 1) {
      goNext();
    }
    if (isRightSwipe && current > 0) {
      goPrev();
    }
  };

  useEffect(() => {
    if (slides[current].type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [current]);

  const goNext = () => {
    setCurrent(c => (c + 1 < slides.length ? c + 1 : c));
  };

  const goPrev = () => {
    setCurrent(c => (c - 1 >= 0 ? c - 1 : c));
  };

  return (
    <AlbumContainer
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait">
        <Slide
          key={current}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          {current > 0 && <NavButton left onClick={goPrev}>&lt;</NavButton>}
          {current < slides.length - 1 && <NavButton right onClick={goNext}>&gt;</NavButton>}
          <Media>
            {slides[current].type === 'image' ? (
              <Img src={slides[current].src} alt={slides[current].caption} />
            ) : (
              <Vid ref={videoRef} src={slides[current].src} controls autoPlay playsInline loop muted />
            )}
          </Media>
          <Caption>{slides[current].caption}</Caption>
        </Slide>
      </AnimatePresence>
    </AlbumContainer>
  );
};

export default CustomAlbum;