// ========================================
// 🎨 이미지 모드 설정
// ========================================

// 'emoji' 또는 'image' 선택
const IMAGE_MODE = 'image'; // 'emoji' | 'image'

// ========================================
// 🎨 이모지 설정 (IMAGE_MODE가 'emoji'일 때)
// ========================================

// 사용할 이모지 리스트 - 원하는 이모지로 자유롭게 변경하세요
const EMOJI_LIST = [
  '🎉', '🌟', '❤️', '⭐', '🎨',
  '🔥', '💫', '✨', '🌈', '🎭',
  '🎪', '🎬', '🎮', '🎯', '🎲',
  '🎵', '🎶', '🎸', '🎺', '🎻',
  '🚀'
];

// ========================================
// 🖼️ 커스텀 이미지 설정 (IMAGE_MODE가 'image'일 때)
// ========================================

// images 폴더 안의 이미지 파일명들
const IMAGE_LIST = [
  'images/01.gif',
  'images/02.gif',
  'images/03.gif',
  'images/04.gif',
  'images/05.gif',
  'images/06.gif',
  'images/07.gif',
  'images/08.gif',
  'images/09.gif',
  'images/10.gif',
  'images/11.gif',
  'images/12.gif',
  'images/13.gif',
  'images/14.gif',
  'images/15.gif',
  'images/16.gif',
  'images/17.gif',
  'images/18.gif',
  'images/19.gif',
  'images/20.gif',
  'images/01.png',
  'images/02.png',
  'images/03.png',
  'images/04.png',
  'images/05.png',
  'images/06.png',
  'images/07.png',
  'images/08.png',
  'images/09.png',
  'images/10.png',
  'images/11.png',
  'images/12.png',
  'images/13.png',
  'images/14.png',
  'images/15.png',
  'images/16.png',
  'images/17.png',
  'images/18.png',
  'images/19.png',
  'images/20.png',
  'images/21.png',
  'images/22.png',
  'images/23.png',
  'images/24.png',
  'images/25.png',
  'images/26.png',
  'images/27.png',
  'images/28.png',
  'images/29.png',
  'images/30.png',
  'images/31.png',
  'images/32.png',
  'images/33.png',
  'images/34.png',
  'images/35.png',
  'images/36.png',
  'images/37.png',
  'images/38.png',
  'images/39.png',
  'images/40.png',
  'images/41.png',
  'images/42.png',
  'images/43.png',
  'images/44.png',
  'images/45.png',
  'images/46.png',
  'images/47.png',
  'images/48.png',
  'images/49.png',
  'images/50.png',
  'images/51.png',
  'images/52.png',
  'images/53.png',
  'images/54.png',
  'images/57.png',
  'images/59.png',
  'images/60.png',
  'images/63.png',
  'images/64.png',
  'images/66.png',
  'images/67.png',
  'images/68.png',
  'images/69.png',
  'images/70.png',
  'images/71.png',
  'images/72.png',
  'images/73.png',
  'images/74.png',
  'images/76.png',
  'images/chzzk_cheatkey_emoticon_01.gif',
  'images/chzzk_cheatkey_emoticon_02.gif',
  'images/chzzk_cheatkey_emoticon_03.gif',
  'images/chzzk_cheatkey_emoticon_04.gif',
  'images/chzzk_cheatkey_emoticon_05.gif',
  'images/chzzk_cheatkey_emoticon_06.gif',
  'images/chzzk_cheatkey_emoticon_07.gif',
  'images/chzzk_cheatkey_emoticon_08.gif',
  'images/chzzk_cheatkey_emoticon_09.gif',
  'images/chzzk_cheatkey_emoticon_10.gif',
];

// ========================================
// ⚙️ 애니메이션 설정
// ========================================

const CONFIG = {
  // 파티클 개수
  particleCount: 99,

  // 애니메이션 지속 시간 (초)
  duration: 7,

  // Stagger 간격 (음수 = 역방향)
  staggerDelay: -0.0808,

  // 배경색
  backgroundColor: 'rgb(14, 16, 15)',

  // 초기 스케일
  initialScale: 3.0,

  // 최종 스케일
  finalScale: 0,

  // 회전 각도 (라디안)
  rotationAmount: -3
};
