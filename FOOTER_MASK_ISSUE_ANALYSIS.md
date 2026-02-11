# 푸터 검은 영역 가림 문제 분석

## 현재 구현 상태

### 적용된 값
- **모든 화면 크기**: 43% 공통 적용
- JavaScript로 실제 렌더링된 높이를 측정하여 43% 계산
- CSS 변수(`--mask-height`)로 동적 설정

### 코드 구조
1. `adjustFooterTitleSize()`: 폰트 크기 조정 후 `adjustFooterMaskHeight()` 호출
2. `adjustFooterMaskHeight()`: 실제 렌더링 높이 측정 후 43% 계산
3. CSS: `var(--mask-height)` 사용하여 동적 높이 적용

---

## 실제 디바이스에서 더 많이 가리는 원인 분석

### 1. 폰트 렌더링 타이밍 문제 ⚠️

**문제:**
- JavaScript가 폰트 크기를 조정한 직후 높이를 측정하면, 실제 디바이스에서는 폰트 렌더링이 완료되지 않았을 수 있음
- 특히 모바일 디바이스에서는 폰트 로딩과 렌더링이 더 오래 걸림

**현재 코드:**
```javascript
adjustFooterTitleSize() {
    // 폰트 크기 설정
    chars.forEach(char => {
        char.style.fontSize = newFontSize + 'px';
    });
    // 즉시 adjustFooterMaskHeight() 호출
    adjustFooterMaskHeight();
}
```

**영향:**
- 폰트 렌더링이 완료되기 전에 높이를 측정하면 실제보다 작은 높이가 측정됨
- 작은 높이의 43%는 더 작은 값이 되어, 상대적으로 더 많이 가려 보일 수 있음

---

### 2. 폰트 메트릭 차이 ⚠️

**문제:**
- PC 브라우저와 실제 디바이스에서 폰트 메트릭(폰트의 실제 렌더링 크기)이 다를 수 있음
- 특히 `line-height: 0.85`와 같은 값은 브라우저마다 다르게 해석될 수 있음

**현재 CSS:**
```css
.footer-char-container {
    line-height: 0.85;
    overflow: hidden;
}
.footer-title-wrapper {
    transform: translateY(-0.22em);
}
```

**영향:**
- 실제 디바이스에서 `line-height: 0.85`가 다르게 렌더링되면 전체 높이가 달라짐
- `transform: translateY(-0.22em)`도 폰트 크기에 따라 실제 픽셀 값이 달라짐
- 높이가 달라지면 같은 43%라도 실제 픽셀 값이 달라져 보임

---

### 3. 뷰포트 크기 차이 ⚠️

**문제:**
- PC 브라우저 개발자 도구: 고정된 뷰포트 크기
- 실제 디바이스: 브라우저 주소창/툴바로 인한 동적 뷰포트 크기 변화

**현재 코드:**
```javascript
const targetWidth = window.innerWidth * 0.975;
```

**영향:**
- 모바일 Safari 등에서 주소창이 스크롤 시 숨겨지면서 `window.innerWidth`가 변함
- 폰트 크기 계산이 달라지고, 결과적으로 높이가 달라짐
- 높이가 달라지면 같은 43%라도 실제 가림 영역이 달라 보임

---

### 4. 픽셀 밀도(devicePixelRatio) 차이 ⚠️

**문제:**
- 고해상도 디스플레이(Retina, 고해상도 Android)에서는 `devicePixelRatio`가 2 이상
- `getBoundingClientRect()`는 CSS 픽셀을 반환하지만, 실제 렌더링은 물리 픽셀로 이루어짐

**영향:**
- 같은 CSS 픽셀 값이라도 실제 디바이스에서 렌더링된 높이가 다를 수 있음
- 특히 폰트 렌더링에서 서브픽셀 렌더링 차이로 인해 높이가 달라질 수 있음

---

### 5. 애니메이션 타이밍 문제 ⚠️

**문제:**
- `charRevealUp` 애니메이션이 1.2초 동안 실행됨
- 애니메이션 중에는 `transform: translateY()`가 적용되어 실제 높이 측정이 부정확할 수 있음

**현재 코드:**
```javascript
animateFooterTitle() {
    setTimeout(() => {
        adjustFooterMaskHeight();
    }, 1500); // 애니메이션 완료 후 호출
}
```

**영향:**
- 애니메이션이 완료되기 전에 높이를 측정하면 잘못된 값이 나올 수 있음
- 하지만 현재는 1500ms 지연으로 해결되어 있음

---

### 6. 폰트 로딩 타이밍 문제 ⚠️

**문제:**
- `document.fonts.ready`는 시스템 폰트를 기다리지 않을 수 있음
- 실제 디바이스에서는 폰트가 완전히 로드되기 전에 높이를 측정할 수 있음

**현재 코드:**
```javascript
document.fonts.ready.then(() => {
    // 폰트 크기 조정
    adjustFooterMaskHeight();
});
```

**영향:**
- 시스템 폰트의 경우 `fonts.ready`가 즉시 resolve될 수 있지만, 실제 렌더링은 아직 완료되지 않았을 수 있음
- 폰트가 완전히 렌더링되기 전에 높이를 측정하면 부정확함

---

### 7. CSS 변수와 !important 충돌 가능성 ⚠️

**문제:**
- 태블릿/모바일 미디어 쿼리에서 `!important`가 사용됨
- CSS 변수가 제대로 적용되지 않을 수 있음

**현재 CSS:**
```css
/* 태블릿 */
.footer-create-block::after {
    height: var(--mask-height, 35%) !important;
}

/* 모바일 */
.footer-create-block::after {
    height: var(--mask-height, 35%) !important;
}
```

**영향:**
- CSS 변수가 설정되지 않으면 fallback 값(35%)이 적용됨
- 하지만 JavaScript로 설정되면 변수가 우선 적용되어야 함

---

## 문제 해결 방안

### 1. 렌더링 완료 보장 강화
- 현재: `requestAnimationFrame` 2번 + `setTimeout(50ms)`
- 개선: 더 긴 지연 시간 또는 `ResizeObserver` 사용

### 2. 폰트 렌더링 완료 확인
- `document.fonts.check()`로 실제 폰트 로딩 확인
- 또는 실제 렌더링된 텍스트 크기와 설정된 크기 비교

### 3. 높이 측정 정확도 향상
- 여러 번 측정하여 안정적인 값 사용
- 또는 `offsetHeight`와 `getBoundingClientRect().height` 비교

### 4. 디버깅 정보 수집
- 실제 디바이스에서 콘솔 로그로 정확한 값 확인
- 높이, 폰트 크기, 퍼센트 등 모든 관련 값 로깅

---

## 권장 해결 방법

### 방법 1: 높이 측정 안정화
```javascript
function adjustFooterMaskHeight() {
    const footerCreateBlock = document.querySelector('.footer-create-block');
    if (!footerCreateBlock) return;
    
    // 여러 번 측정하여 안정적인 값 얻기
    let measurements = [];
    let measureCount = 0;
    
    function measure() {
        const height = footerCreateBlock.getBoundingClientRect().height;
        if (height > 0) {
            measurements.push(height);
            measureCount++;
            
            // 3번 측정하여 안정적인 값 확인
            if (measureCount < 3) {
                requestAnimationFrame(measure);
            } else {
                // 평균값 또는 최신값 사용
                const stableHeight = measurements[measurements.length - 1];
                const maskHeight = stableHeight * 0.43;
                footerCreateBlock.style.setProperty('--mask-height', maskHeight + 'px');
            }
        } else {
            // 높이가 0이면 다시 시도
            setTimeout(measure, 100);
        }
    }
    
    // 초기 측정 시작
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(measure, 100);
        });
    });
}
```

### 방법 2: ResizeObserver 사용
```javascript
function adjustFooterMaskHeight() {
    const footerCreateBlock = document.querySelector('.footer-create-block');
    if (!footerCreateBlock) return;
    
    // ResizeObserver로 높이 변화 감지
    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            const height = entry.contentRect.height;
            if (height > 0) {
                const maskHeight = height * 0.43;
                footerCreateBlock.style.setProperty('--mask-height', maskHeight + 'px');
            }
        }
    });
    
    observer.observe(footerCreateBlock);
}
```

---

## 현재 상태 요약

✅ **적용 완료:**
- 모든 화면 크기에서 43% 공통 적용
- JavaScript로 실제 렌더링 높이 측정
- 디버깅 로그 추가

⚠️ **잠재적 문제:**
- 폰트 렌더링 타이밍
- 폰트 메트릭 차이
- 뷰포트 크기 차이
- 픽셀 밀도 차이

📊 **다음 단계:**
- 실제 디바이스에서 콘솔 로그 확인
- 측정된 값 비교 분석
- 필요시 추가 개선 사항 적용
