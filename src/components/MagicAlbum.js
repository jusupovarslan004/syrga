import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import styled from 'styled-components';

const AlbumContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  overflow: hidden;
`;

const Page = styled.div`
  width: 320px;
  height: 480px;
  background: #fffbe9;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 24px 16px 32px 16px;
  position: relative;
  overflow: hidden;
`;

const Photo = styled.img`
  width: 90%;
  max-height: 320px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
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

const Sparkle = styled.div`
  position: absolute;
  top: 10%;
  left: 80%;
  width: 24px;
  height: 24px;
  pointer-events: none;
  background: radial-gradient(circle, #fff 60%, transparent 100%);
  opacity: 0.7;
  filter: blur(2px);
  animation: sparkle 1.5s infinite alternate;

  @keyframes sparkle {
    0% { opacity: 0.7; transform: scale(1) rotate(0deg); }
    100% { opacity: 1; transform: scale(1.3) rotate(20deg); }
  }
`;

const photos = [
  {
    src: '/media/1.jpg',
    caption: 'Моя любимая подруга! 💖',
  },
  {
    src: '/media/2.jpg',
    caption: 'В этот день мы смеялись до слёз! 🌟',
  },
  {
    src: '/media/3.jpg',
    caption: 'Лучшие моменты вместе!',
  },
  // Добавь свои фото и подписи сюда
];

const MagicAlbum = () => {
  return (
    <AlbumContainer>
      <HTMLFlipBook
        width={340}
        height={500}
        size="stretch"
        minWidth={280}
        minHeight={400}
        maxWidth={400}
        maxHeight={600}
        showCover={true}
        mobileScrollSupport={true}
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)', borderRadius: 20 }}
      >
        {/* Обложка */}
        <Page style={{ background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', color: '#fff', fontSize: '2rem', fontWeight: 'bold', letterSpacing: 2, justifyContent: 'center' }}>
          Волшебный альбом ✨
        </Page>
        {/* Страницы с фото */}
        {photos.map((item, idx) => (
          <Page key={idx}>
            <Sparkle />
            <Photo src={item.src} alt={item.caption} />
            <Caption>{item.caption}</Caption>
          </Page>
        ))}
        {/* Последняя страница */}
        <Page style={{ background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', justifyContent: 'center' }}>
          Спасибо за дружбу! 💫
        </Page>
      </HTMLFlipBook>
    </AlbumContainer>
  );
};

export default MagicAlbum; 