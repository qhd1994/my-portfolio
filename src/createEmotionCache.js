// my-portfolio/src/createEmotionCache.js
import createCache from '@emotion/cache';

const createEmotionCache = () => {
  let cache = createCache({ key: 'css', prepend: true }); // prepend: true는 스타일을 HTML `<head>` 태그의 시작 부분에 주입하여 MUI 컴포넌트 스타일이 다른 스타일(예: Tailwind)보다 먼저 로드되도록 합니다.
  cache.compat = true; // Emotion 10 호환성 모드
  return cache;
};

export default createEmotionCache;