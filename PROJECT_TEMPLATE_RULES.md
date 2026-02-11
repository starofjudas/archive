# 프로젝트 서브페이지 그라운드룰

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
