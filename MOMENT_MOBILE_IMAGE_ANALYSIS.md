# Moment 페이지 모바일 이미지 분기 처리 현황

## 개요
moment 카테고리의 프로젝트 페이지들에서 모바일 환경(768px 이하)에서의 이미지 크기 및 레이아웃 분기 처리 현황을 정리합니다.

## 분기 기준
- **모바일**: `window.innerWidth <= 768` 또는 `@media (max-width: 768px)`
- **데스크톱**: `window.innerWidth > 768` 또는 `@media (min-width: 769px)`

---

## 1. tokyo/index.html (포스터 모드)

### CSS 분기 처리

#### 포스터 모드 (1개 이미지)
- **데스크톱**:
  - Portrait: `height: 80vh`, `width: auto`
  - Landscape: `width: 80vw`, `height: auto`
  - Square: `height: 80vh`, `width: auto`

- **모바일** (`@media (max-width: 768px)`):
  - Portrait: `height: 80vh`, `width: auto` (동일)
  - Landscape: `width: 80vw`, `height: auto` (동일)
  - Square: `height: 80vh`, `width: auto` (동일)
  - **결론**: 포스터 모드는 모바일/데스크톱 동일한 크기 규칙 적용

#### 갤러리 모드 (여러 이미지)
- **데스크톱**:
  - `.gallery-item`: `height: 60vh`, `width: auto`
  - 이미지: `height: 100%`, `width: auto`

- **모바일** (`@media (max-width: 768px)`):
  - `.gallery-item`: `height: auto`, `width: 80vw`
  - 이미지: 기본 스타일 유지

### JavaScript 분기 처리

```javascript
const isMobile = window.innerWidth <= 768;

// 기본 크기 설정
const baseHeight = isMobile ? window.innerWidth * 0.8 : window.innerHeight * 0.6;
const baseWidth = isMobile ? window.innerWidth * 0.8 : baseHeight;
```

- **모바일**: 브라우저 너비의 80% (`window.innerWidth * 0.8`)
- **데스크톱**: 브라우저 높이의 60% (`window.innerHeight * 0.6`)

### 갤러리 래퍼 패딩
- **모바일**: `padding: 0 20px` (고정값)
- **데스크톱**: 
  - 769px 이상: `padding: 0 max(20px, 1.25vw)`
  - 1025px 이상: `padding: 0 max(20px, 1.5vw)`
  - 1441px 이상: `padding: 0 max(20px, 2vw)`

---

## 2. gallery setting/index.html (갤러리 모드)

### CSS 분기 처리

#### 포스터 모드
- **데스크톱/모바일 동일**: 
  - Portrait: `height: 80vh`, `width: auto`
  - Landscape: `width: 80vw`, `height: auto`
  - Square: `height: 80vh`, `width: auto`

#### 갤러리 모드
- **데스크톱**:
  - `.gallery-item`: `height: 60vh`, `width: auto`
  - 이미지: `height: 100%`, `width: auto`

- **모바일** (`@media (max-width: 768px)`):
  - `.gallery-item`: `height: auto`, `width: 80vw`
  - 이미지: 기본 스타일 유지

### JavaScript 분기 처리

#### renderGallery() 함수
```javascript
const isMobile = window.innerWidth <= 768;
const baseHeight = isMobile ? window.innerWidth * 0.8 : window.innerHeight * 0.6;
const baseWidth = isMobile ? window.innerWidth * 0.8 : baseHeight;
```

#### 갤러리 모드 이미지 크기 설정
```javascript
if (isMobile) {
    item.style.width = '80vw';
    item.style.height = `${80 / aspect}vw`;
} else {
    item.style.height = '60vh';
    item.style.width = `${60 * aspect}vh`;
}
```

#### updateGalleryItemSizes() 함수
```javascript
const isMobile = window.innerWidth <= 768;

if (isMobile) {
    item.style.width = '80vw';
    item.style.height = `${80 / aspect}vw`;
} else {
    item.style.height = '60vh';
    item.style.width = `${60 * aspect}vh`;
}
```

### 갤러리 래퍼 패딩
- **모바일**: `padding: 0 20px` (고정값)
- **데스크톱**: 
  - 769px 이상: `padding: 0 max(20px, 1.25vw)`
  - 1025px 이상: `padding: 0 max(20px, 1.5vw)`
  - 1441px 이상: `padding: 0 max(20px, 2vw)`

---

## 요약

### 공통 패턴
1. **모바일 기준**: `768px` 이하
2. **포스터 모드**: 모바일/데스크톱 동일한 크기 규칙 (80vh/80vw)
3. **갤러리 모드**: 
   - 모바일: 너비 기준 (`80vw`)
   - 데스크톱: 높이 기준 (`60vh`)
4. **패딩**: 모바일은 고정값 `20px`, 데스크톱은 반응형 `vw` 단위 사용

### 차이점
- **tokyo/index.html**: 포스터 모드 전용 (1개 이미지)
- **gallery setting/index.html**: 갤러리 모드 지원 (여러 이미지)

### 개선 제안
1. 모바일 이미지 크기 기준을 통일 (현재는 일관성 있음)
2. 리사이즈 이벤트 처리 시 모바일/데스크톱 분기 로직 확인 필요
3. 포스터 모드의 모바일 분기가 실제로 필요한지 검토 (현재는 동일 규칙)
