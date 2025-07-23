// my-portfolio/src/MuiRegistry.js
'use client'; // 이 컴포넌트는 클라이언트 컴포넌트여야 합니다.

import * as React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createCache from '@emotion/cache'; // Emotion 캐시 생성 함수 임포트
import theme from './theme'; // 사용자 정의 테마 임포트 (src/theme.js)

// Emotion 캐시 인스턴스를 생성하는 헬퍼 함수
// 이 함수는 서버/클라이언트 환경에 따라 캐시를 다르게 초기화하고,
// SSR 시 스타일을 수집하고 플러시하는 로직을 포함합니다.
function createEmotionCacheClient() {
const cache = createCache({ key: 'mui', prepend: true }); // 'mui' 키 사용, 스타일을 <head> 앞쪽에 삽입
cache.compat = true; // Emotion 호환성 모드 활성화

// SSR 시 삽입된 스타일의 이름을 추적하기 위한 커스텀 'insert' 함수
// 이 부분이 useServerInsertedHTML 훅에서 스타일을 추출하는 핵심입니다.
const prevInsert = cache.insert;
let inserted = []; // 삽입된 스타일 이름들을 저장할 배열
cache.insert = (...args) => {
    const serialized = args[1]; // 직렬화된 스타일 객체
    if (cache.inserted[serialized.name] === undefined) {
    inserted.push(serialized.name);
    }
    return prevInsert(...args);
};

// SSR 렌더링 후 스타일을 플러시(초기화)하기 위한 커스텀 'flush' 함수
// 다음 서버 요청 시 이전 스타일이 중복되지 않도록 합니다.
const flush = () => {
    const prevInserted = inserted;
    inserted = []; // 다음 렌더링을 위해 초기화
    return prevInserted;
};

return { cache, flush };
}

// 클라이언트 사이드에서 재사용될 Emotion 캐시 인스턴스 (한 번만 생성)
// 서버에서는 매 요청마다 새로운 캐시가 생성되므로 이 인스턴스는 클라이언트 전용입니다.
const clientSideEmotionCache = createEmotionCacheClient().cache;

// MUI 테마 및 Emotion 스타일을 제공하는 레지스트리 컴포넌트
export default function MuiRegistry({ children }) {
    // 서버와 클라이언트에서 캐시 인스턴스를 관리하기 위한 상태 (useState의 초기화 함수 활용)
    // 서버에서는 요청마다 새로운 캐시를, 클라이언트에서는 기존 캐시를 재사용합니다.
    const [{ cache, flush }] = React.useState(() => {
        // window 객체가 정의되어 있지 않으면 서버 환경
        if (typeof window === 'undefined') {
        return createEmotionCacheClient(); // 서버에서는 매번 새로운 캐시 생성
        }
        // 클라이언트 환경에서는 미리 생성된 캐시를 사용하고, flush는 동작하지 않음
        return { cache: clientSideEmotionCache, flush: () => [] };
    });

    // Next.js의 SSR 이후 HTML에 스타일을 주입하는 훅
    useServerInsertedHTML(() => {
        const names = flush(); // 현재 렌더링 주기에서 수집된 스타일 이름 가져오기
        if (names.length === 0) {
        return null; // 수집된 스타일이 없으면 아무것도 반환하지 않음
        }
        let styles = '';
        // 캐시에서 실제 CSS 문자열을 수집된 이름들을 기반으로 가져옵니다.
        for (const name of names) {
        styles += cache.inserted[name];
        }
        return (
        <style
            key={cache.key} // 캐시 키를 사용하여 스타일 태그의 고유성 확보
            data-emotion={`${cache.key} ${names.join(' ')}`} // Emotion 메타데이터
            dangerouslySetInnerHTML={{
            __html: styles, // 수집된 CSS를 HTML에 주입
            }}
        />
        );
    });

    return (
        <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* 선택 사항: CSS 재설정(normalize)으로 일관된 스타일 베이스 제공 */}
            {children}
        </ThemeProvider>
        </CacheProvider>
    );
}