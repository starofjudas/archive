# 프로젝트 서브페이지 그라운드룰

## 브라우저 탭 아이콘(파비콘) 공통 적용 규칙

모든 페이지에서 **동일한 파비콘**을 사용합니다. archive 루트의 `favicon.svg`를 공통 아이콘으로 적용합니다.

### 적용 대상
- 홈 화면 (`archive/index.html`)
- 모든 프로젝트의 `page.html`
- 모든 프로젝트의 `index.html` (직접 열람 시 탭 아이콘 표시)

### 구현 방법

#### archive 루트 (index.html)
```html
<head>
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    ...
</head>
```

#### 서브페이지 (page.html / index.html)
`<head>` 상단에 배치. 경로는 **현재 파일 기준 archive 루트의 favicon.svg**로 설정합니다.

- `projects/moment/tokyo/` → `../../../../favicon.svg`
- `projects/moment/폴더명/` → `../../../favicon.svg`
- `projects/vibe/폴더명/` → `../../../favicon.svg`

```html
<head>
    <link rel="icon" type="image/svg+xml" href="../../../favicon.svg">
    <meta charset="UTF-8">
    ...
</head>
```

### 중요 사항
- 새 프로젝트·새 페이지 추가 시 반드시 파비콘 링크를 포함합니다.
- 파비콘 파일은 archive 루트의 `favicon.svg` 하나만 사용합니다.

---

## 브라우저 탭 이름 통일 규칙

모든 프로젝트 서브페이지의 브라우저 탭 이름은 **"archive"**로 통일합니다.

### 적용 대상
- 모든 `page.html` 파일
- 모든 `index.html` 파일 (프로젝트 본문 페이지)

### 구현 방법

#### page.html 템플릿
```html
<head>
    <script>document.title='archive';</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>archive</title>
    ...
</head>
```

#### index.html 템플릿
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>archive</title>
    ...
</head>
```

### 중요 사항
- 프로젝트별 고유한 제목은 페이지 내부의 `<h1 class="title">` 요소에 표시됩니다.
- 브라우저 탭에는 항상 "archive"만 표시됩니다.
- 새로운 프로젝트를 생성할 때 이 규칙을 반드시 준수해야 합니다.

### 예시
- 프로젝트 제목: "TOKYO 東京タワー"
- 브라우저 탭: "archive"
- 페이지 내부 제목: "TOKYO 東京タワー" (h1 태그)

## 브라우저 스크롤바 숨김 규칙

모든 프로젝트 서브페이지에서 브라우저 스크롤바를 숨깁니다 (스크롤 기능은 유지).

### 구현 방법

#### CSS 템플릿
```css
html {
    font-size: 16px;
    /* 브라우저 스크롤바 숨김 (그라운드룰) */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
}

html::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
}

body {
    /* ... 기타 스타일 ... */
    /* 브라우저 스크롤바 숨김 (그라운드룰) */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
}

body::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
}
```

### 중요 사항
- 스크롤바는 숨기지만 스크롤 기능은 정상적으로 작동해야 합니다.
- 모든 서브페이지(`page.html`)에 동일하게 적용됩니다.
- 홈 화면(`index.html`)과 동일한 규칙을 따릅니다.

## 스크롤 위치 기억 및 복원 규칙

홈 화면에서 서브페이지로 진입한 후, 백 버튼을 눌러 돌아올 때 이전 스크롤 위치를 자동으로 복원합니다.

### 구현 방법

#### 홈 화면 (script.js)
- 프로젝트 클릭 시 현재 스크롤 위치를 `sessionStorage`에 저장:
```javascript
sessionStorage.setItem('scrollPosition', window.scrollY);
```

- 페이지 로드 시 저장된 스크롤 위치 복원:
```javascript
function restoreScrollPosition() {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition !== null) {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem('scrollPosition');
    }
}
```

#### 서브페이지 (page.html)
- 백 버튼 클릭 시 홈 화면으로 이동 (스크롤 위치는 자동으로 복원됨)
- 추가 작업 불필요 (홈 화면의 `restoreScrollPosition()` 함수가 자동 처리)

### 중요 사항
- `sessionStorage`를 사용하여 탭이 닫히면 스크롤 위치 정보가 삭제됩니다.
- 직접 URL 접근 시에는 스크롤 위치가 복원되지 않습니다.
- 모든 서브페이지에 동일하게 적용됩니다.

## 타이틀/설명 텍스트 등장 모션 규칙

서브페이지의 타이틀과 설명 텍스트에 홈 화면과 어울리는 등장 모션을 추가합니다.

### 구현 방법

#### CSS 템플릿
```css
.title-container .title {
    /* 기존 스타일... */
    /* 등장 모션 초기 상태 */
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.title-container .title.animate {
    opacity: 1;
    transform: translateY(0);
}

.title-container .description {
    /* 기존 스타일... */
    /* 등장 모션 초기 상태 */
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, 
                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
}

.title-container .description.animate {
    opacity: 1;
    transform: translateY(0);
}
```

#### JavaScript 템플릿
```javascript
function finishLoading() {
    // ... 기존 로딩 완료 로직 ...
    
    setTimeout(() => {
        document.body.classList.add('loaded');
        
        // 타이틀/설명 등장 모션 트리거
        const titleElement = document.querySelector('.title-container .title');
        const descriptionElement = document.querySelector('.title-container .description');
        
        if (titleElement) {
            requestAnimationFrame(() => {
                titleElement.classList.add('animate');
            });
        }
        
        if (descriptionElement) {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    descriptionElement.classList.add('animate');
                }, 100);
            });
        }
        
        // ... 기타 로직 ...
    }, 300);
}
```

### 애니메이션 스펙
- **타이틀**: 페이드인 + 위로 이동 (20px → 0px)
- **설명**: 타이틀보다 0.2초 지연 후 동일한 애니메이션
- **이징**: `cubic-bezier(0.16, 1, 0.3, 1)` (홈 화면과 동일)
- **지속 시간**: 0.8초

### 중요 사항
- 로딩이 완료된 후(`finishLoading()` 함수 내)에 애니메이션을 트리거합니다.
- 타이틀과 설명이 있는 모든 서브페이지에 적용됩니다.
- 홈 화면의 프로젝트 아이템 등장 모션과 일관된 스타일을 유지합니다.

## Smart Back Button 규칙

서브페이지의 "BACK" 버튼은 홈 화면에서 진입했을 때만 노출합니다. 직접 URL로 접근하거나 새로고침한 경우에는 숨겨야 합니다.

### 구현 방법

#### CSS 템플릿
```css
/* 기본적으로 숨김 (pointer-events: none) */
.nav-back {
    /* ...기존 스타일... */
    opacity: 0;
    pointer-events: none;
    /* ... */
}

/* loaded 또는 header-ready 상태이면서 can-go-back 클래스가 있어야 표시 */
body.loaded.can-go-back .nav-back,
body.header-ready.can-go-back .nav-back {
    opacity: 1;
    width: auto;
    margin-right: 14px;
}

/* can-go-back 상태일 때만 클릭 허용 */
body.can-go-back .nav-back {
    pointer-events: auto;
}
```

#### JavaScript 템플릿
```javascript
const fromHome = sessionStorage.getItem('fromHome');
const skipHeaderAnimation = !fromHome;

if (fromHome) {
    sessionStorage.removeItem('fromHome');
    document.body.classList.add('can-go-back'); // 플래그 클래스 추가
}

if (skipHeaderAnimation) {
    document.body.classList.add('header-ready');
}
```

### 중요 사항
- `sessionStorage`의 `fromHome` 키를 사용하여 진입 경로를 확인합니다.
- `body`에 `can-go-back` 클래스를 토글하여 CSS로 버튼 노출을 제어합니다.
- 홈 화면(`archive/script.js`)에서는 프로젝트 클릭 시 `sessionStorage.setItem('fromHome', 'true')`를 실행해야 합니다.

## Open Graph (OG) 태그 규칙

모든 페이지에서 사이트 공유 시 노출될 공통 정보(타이틀, 설명, 이미지)를 설정합니다.

### 이미지 사양
- **권장 사이즈:** 1200 x 630 픽셀 (1.91:1 비율)
- **최소 사이즈:** 600 x 315 픽셀
- **파일 위치:** archive 루트의 `og-image.png`

### 구현 방법

#### archive 루트 (index.html)
```html
<title>archive</title>
<meta property="og:type" content="website">
<meta property="og:site_name" content="Portfolio Archive">
<meta property="og:title" content="archive">
<meta property="og:description" content="Portfolio Archive">
<meta property="og:image" content="./og-image.png">
<meta property="og:url" content="./">
```

#### 서브페이지 (page.html / index.html)
`<head>` 태그 내에 다음 메타 태그를 포함합니다. 이미지 경로는 상대 경로를 사용합니다.

```html
<title>archive</title>
<meta property="og:type" content="website">
<meta property="og:site_name" content="Portfolio Archive">
<meta property="og:title" content="archive">
<meta property="og:description" content="Portfolio Archive">
<meta property="og:image" content="../../../og-image.png">
```

### 중요 사항
- 모든 페이지에 동일한 `og:image` 경로(`og-image.png`)를 연결합니다.
- 실제 배포 시에는 `og:image` 및 `og:url`에 절대 경로(도메인 포함)를 사용하는 것이 좋습니다.
