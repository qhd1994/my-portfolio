// my-portfolio/src/theme.js
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6', // 기본 색상 (원하는 색상으로 변경 가능)
    },
    secondary: {
      main: '#19857b', // 보조 색상 (원하는 색상으로 변경 가능)
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: 'Noto Sans KR, sans-serif', // 한글 폰트 설정 (원하는 폰트로 변경 가능)
  },
});

export default theme;