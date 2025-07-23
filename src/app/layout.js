// my-portfolio/src/app/layout.js
import './globals.css'; // Tailwind CSS를 위한 전역 CSS 임포트
import MuiRegistry from '../MuiRegistry'; // MuiRegistry 컴포넌트 임포트 (src 폴더 바로 아래 MuiRegistry.js가 있으므로 '../MuiRegistry'가 맞습니다.)

export const metadata = {
  title: 'Next.js 포트폴리오', // 포트폴리오 제목을 여기에 넣어주세요
  description: 'Next.js와 MUI, Tailwind CSS로 만든 개인 포트폴리오', // 설명도 넣어주세요
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {/* 모든 페이지 콘텐츠를 MuiRegistry로 감싸서 MUI 테마와 Emotion 스타일 적용 */}
        <MuiRegistry>{children}</MuiRegistry>
      </body>
    </html>
  );
}