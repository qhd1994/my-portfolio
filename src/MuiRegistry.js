// my-portfolio/src/MuiRegistry.js
'use client'; // 이 컴포넌트는 클라이언트에서 렌더링됩니다.

import * as React from 'react';
import { useServerInsertedHTML } from 'next/navigation'; // Next.js App Router 훅
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';

import theme from './theme'; // 같은 src 폴더 안에 있는 theme.js
import createEmotionCache from './createEmotionCache'; // 같은 src 폴더 안에 있는 createEmotionCache.js

// 클라이언트 사이드 캐시 생성 (이 부분은 필요에 따라 조정될 수 있으나, 일단 이렇게 둡니다.)
const clientSideEmotionCache = createEmotionCache();

export default function ThemeRegistry(props) {
  const { options, children } = props;

  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache(options);
    cache.compat = true; // Emotion 10 호환성 모드
    const prevInsert = cache.insert;
    let inserted = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        {/* MUI의 CSS 리셋 (기본 브라우저 스타일 초기화) */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}