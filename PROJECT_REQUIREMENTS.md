# 포트폴리오 아카이브 페이지 재구현 가이드

이 문서는 세 가지 페이지(홈, 부, 치지직로고)를 처음부터 다시 만들 때 사용할 자연어 요청 예시를 담고 있습니다.

---

## 1. 홈 페이지 (Archive 메인 페이지)

### 기본 요청 예시

```
포트폴리오 아카이브 메인 페이지를 만들어줘. 
검은색 배경에 미니멀한 디자인으로, 프로젝트 목록을 보여주는 페이지야.

주요 기능:
- 상단에 "archive" 타이틀이 고정되어 있고, 각 글자가 아래에서 위로 나타나는 애니메이션이 있어야 해
- 그 아래에 "there is no such thing as small change. everything begins with a single, intentional line." 텍스트가 SVG로 렌더링되어야 해
- 프로젝트 필터 메뉴가 있어야 해 (all, vibe, moment) - 활성화된 버튼은 취소선이 그어져야 해
- 프로젝트 목록은 JSON 파일에서 동적으로 로드되어야 해
- 프로젝트 아이템은 큰-작은-작은-큰 순서로 번갈아가며 배치되어야 해 (12칸 그리드에서 큰 것은 8칸, 작은 것은 4칸)
- 각 프로젝트 아이템에 마우스 호버 시 3D 틸트 효과가 있어야 해
- 커스텀 커서가 있어야 해 (작은 점과 트레일 효과)
- 전체 화면에 grain 노이즈 효과가 있어야 해
- 다크/라이트 모드 토글이 있어야 해
- 로딩 시 상단에 프로그레스 바가 나타나고, 진행도에 따라 파티클이 생성되어야 해
- 스크롤 시 부드러운 스크롤 효과가 있어야 해
- 반응형 디자인이 필요해 (태블릿, 모바일)
```

### 상세 기술 스펙

**레이아웃:**
- Hero 섹션: 화면 상단 고정, "archive" 타이틀 (각 글자 개별 애니메이션)
- Cover 섹션: 서브 텍스트, 필터 메뉴, 프로젝트 리스트, 푸터
- 상단 네비게이션: "back" (초기 숨김, 애니메이션 후 표시), "home" 로고, 테마 토글 버튼

**애니메이션:**
- 타이틀 글자: `translateY(110%)`에서 `translateY(0)`으로, `cubic-bezier(0.16, 1, 0.3, 1)` 이징
- 서브 텍스트: `translateY(30px)`에서 페이드인, 2초 지연
- 프로젝트 아이템: 스태거 애니메이션 (순차적으로 나타남)
- 호버 효과: 3D 틸트 (perspective, transform: rotateX/Y)

**인터랙션:**
- 커스텀 커서: 작은 점 (0.75vw) + Canvas 기반 트레일
- 프로젝트 호버: 썸네일과 정보 영역이 위로 살짝 이동하며 나타남
- 필터 클릭: 선택된 카테고리만 표시, 부드러운 전환 애니메이션

**스타일:**
- 폰트: Inter (Google Fonts), 시스템 폰트 폴백
  - Google Fonts URL: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;900&display=swap`
  - preconnect 설정: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`
- 색상: 다크 모드 (#000000 배경, #ffffff 텍스트), 라이트 모드 (#ffffff 배경, #000000 텍스트)
- Grain 효과: SVG filter 기반, `feTurbulence` 사용, 0.18 opacity
- 그리드: 12칸 그리드, gap 1.25vw

**데이터:**
- JSON 파일: `data/projects.json`에서 프로젝트 정보 로드
- 각 프로젝트: id, title, category, size, thumbnail (또는 thumbnailColor), link

**로딩:**
- 프로그레스 바: 상단 4px 높이, 흰색 배경
- 파티클 시스템: 진행도에 따라 다양한 모양(원, 사각형, 삼각형, 별, 다이아몬드)의 파티클 생성
- 로딩 완료 시 파티클 버스트 효과

---

## 2. 부 페이지 (Boo 3D Character)

### 기본 요청 예시

```
3D 캐릭터 인터랙션 페이지를 만들어줘.
Three.js를 사용해서 3D 모델을 로드하고, 마우스로 회전시키거나 클릭할 수 있어야 해.

주요 기능:
- Three.js와 WebGL을 사용한 3D 렌더링
- GLTFLoader로 3D 모델(Boo.glb) 로드
- 마우스 드래그로 캐릭터 회전 제어
- 마우스 클릭 시 캐릭터가 점프하는 애니메이션
- 마우스 호버 시 커스텀 커서 효과 (원형 인디케이터와 "hold and drag" 텍스트)
- RoomEnvironment를 사용한 환경 조명
- 로딩 프로그레스 바와 파티클 효과
- 상단에 "boo 3d character" 타이틀과 설명 텍스트
- "back"과 "home" 네비게이션 링크
- 다크/라이트 모드 지원
- 반응형 디자인
```

### 상세 기술 스펙

**3D 설정:**
- 카메라: PerspectiveCamera (45도 FOV)
- 렌더러: WebGLRenderer, antialias 활성화, alpha: true
- 환경: RoomEnvironment 사용 (환경 맵 기반 조명)
- 모델: GLTFLoader로 Boo.glb 로드

**외부 라이브러리:**
- Three.js CDN: `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js`
- Three.js 예제 경로: `https://cdn.jsdelivr.net/npm/three@0.160.0/`
- importmap 설정:
  ```javascript
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
      "three/": "https://cdn.jsdelivr.net/npm/three@0.160.0/"
    }
  }
  ```
- 필요한 Three.js 모듈:
  - `GLTFLoader`: `three/examples/jsm/loaders/GLTFLoader.js`
  - `RoomEnvironment`: `three/examples/jsm/environments/RoomEnvironment.js`

**인터랙션:**
- 마우스 드래그: `mousedown`, `mousemove`, `mouseup` 이벤트로 회전 제어
- 터치 지원: `touchstart`, `touchmove`, `touchend` 이벤트
- 클릭 애니메이션: 클릭 시 Y축으로 점프 후 원위치 (GSAP 또는 수동 애니메이션)
- 호버 효과: Raycaster로 마우스와 모델 교차 감지, 커스텀 커서 표시

**커서 효과:**
- 드래그 인디케이터: 12vw 크기의 원형 테두리 + "hold and drag" 텍스트
- 마우스 위치 추적: `mousemove` 이벤트로 실시간 업데이트
- 드래그 중: 원이 축소되고 투명도 감소

**애니메이션:**
- 자동 회전: 드래그 중이 아닐 때 자동으로 회전 (선택적)
- 점프 애니메이션: 클릭 시 Y축 이동 + 스케일 변화
- 로딩 애니메이션: 프로그레스 바 + 파티클 효과

**레이아웃:**
- 상단 네비게이션: 고정 위치, "← back"과 "home" 링크
- 타이틀 컨테이너: 좌측 상단 (5vw, 1.25vw), "boo 3d character" 타이틀과 설명
- 3D 캔버스: 전체 화면, iframe으로 로드

**로딩:**
- 프로그레스 바: 상단 4px, 흰색 배경
- 파티클: 진행도에 따라 다양한 모양 생성
- 로딩 완료 메시지: iframe에서 `postMessage`로 전송

**스타일:**
- 배경: 검은색 (#000000)
- 폰트: 시스템 폰트 (-apple-system, SF Pro Display 등)
- 반응형: 태블릿/모바일에서 폰트 크기와 패딩 조정

---

## 3. 치지직로고 페이지 (Chzzk Logo Glass Effect)

### 기본 요청 예시

```
3D 유리 굴절 효과 페이지를 만들어줘.
Three.js와 커스텀 Transmission Material을 사용해서 투명하고 굴절되는 3D 로고를 구현해야 해.

주요 기능:
- Three.js WebGL 렌더링
- MeshTransmissionMaterial을 사용한 유리/굴절 효과
- GLTFLoader로 로고 모델(Logo.glb) 로드
- 고해상도 텍스트 텍스처 렌더링 (Canvas2D 사용)
- FBO(Framebuffer Object)를 사용한 배경과 텍스트 굴절 효과
- 마우스 드래그로 로고 회전 제어
- 자동 회전 애니메이션 (X, Y, Z 축)
- 마우스 호버 시 커스텀 커서 효과 (boo 페이지와 동일)
- 블랙 배경
- "스트리밍은 계속됩니다" 텍스트 (2줄, nemony2 폰트)
- 반응형 디자인 (브라우저 크기에 따라 요소 크기 조정)
- 로고 모델링 크기와 텍스트 크기 동적 조정
```

### 상세 기술 스펙

**3D 설정:**
- 카메라: PerspectiveCamera (45도 FOV)
- 렌더러: WebGLRenderer, antialias 활성화, alpha: false (블랙 배경)
- 배경: 검은색 (#000000) 고정

**외부 라이브러리:**
- Three.js CDN: `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js`
- Three.js 예제 경로: `https://cdn.jsdelivr.net/npm/three@0.160.0/`
- importmap 설정:
  ```javascript
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
      "three/": "https://cdn.jsdelivr.net/npm/three@0.160.0/"
    }
  }
  ```
- 필요한 Three.js 모듈:
  - `GLTFLoader`: `three/examples/jsm/loaders/GLTFLoader.js`
  - `MeshTransmissionMaterial`: 로컬 파일 (`./MeshTransmissionMaterial.js`) - drei-vanilla 스타일 커스텀 Material

**텍스트 렌더링:**
- Canvas2D로 고해상도 텍스트 텍스처 생성
- 해상도: 8192x4096 (WebGL 최대 텍스처 크기 고려)
- 폰트: nemony2 (SDNemony2dBasicBdTTF.ttf), @font-face로 로드
- 텍스트: "스트리밍은\n계속됩니다" (2줄)
- 폰트 크기: 캔버스 너비의 1/11.4 비율
- 자간: 0em
- 텍스처 필터링: LinearMipmapLinearFilter, anisotropy 적용

**Transmission Material:**
- MeshTransmissionMaterial.js 사용 (drei-vanilla 스타일)
- 주요 파라미터:
  - thickness: 모델 크기에 비례하여 동적 계산
  - ior: 1.6 (유리 굴절률)
  - distortion: 0.6
  - distortionScale: 0.8
  - temporalDistortion: 0.2
  - samples: 10

**FBO 패스:**
- 배경과 텍스트를 먼저 FBO에 렌더링
- FBO 텍스처를 Transmission Material에 전달
- 로고 모델에 Material 적용하여 굴절 효과 구현

**인터랙션:**
- 마우스 드래그: 회전 제어 (isDragging 플래그 사용)
- 자동 회전: 드래그 중이 아닐 때 X, Y, Z 축으로 자동 회전
- 회전 속도: 느린 속도 (0.003, 0.004, 0.002)
- 호버 효과: Raycaster로 로고와 마우스 교차 감지, 커스텀 커서 표시

**커서 효과:**
- 드래그 인디케이터: 12vw 원형 테두리 + "hold and drag" 텍스트
- 로고 호버 시: 인디케이터 표시
- 드래그 중: 원 축소 및 투명도 감소

**반응형:**
- 뷰포트 크기 계산: 카메라 거리와 FOV 기반
- 텍스트 플레인 크기: 화면 크기에 비례하여 조정
- 모델 크기: 화면 크기에 비례하여 조정
- 모바일/태블릿: 마진 추가 (40px, 30px, 20px) 및 스케일 조정 (75%, 85%, 100%)

**레이아웃:**
- 상단 네비게이션: 고정 위치, "← back"과 "home" 링크
- 타이틀 컨테이너: 좌측 상단, "chzzk logo glass effect" 타이틀과 설명
- 3D 캔버스: 전체 화면

**애니메이션:**
- 자동 회전: requestAnimationFrame 기반
- 드래그 회전: 마우스 이동 거리에 비례하여 회전
- 부드러운 전환: lerp를 사용한 회전 보간

**성능 최적화:**
- powerPreference: 'high-performance'
- pixelRatio 제한: Math.min(window.devicePixelRatio, 1.5)
- 텍스처 mipmap 생성
- anisotropy 최대값 사용

**로딩:**
- 프로그레스 바: 상단 4px
- 파티클 효과: 진행도에 따라 생성
- 로딩 완료 메시지: iframe에서 postMessage로 전송

**스타일:**
- 배경: 검은색 고정
- 폰트: nemony2 (커스텀 폰트)
- 반응형: 브라우저 크기에 따라 동적 조정

---

## 공통 사항

### 네비게이션 구조
- 모든 서브 페이지는 상단에 "← back"과 "home" 링크를 포함
- 링크 클릭 시 부드러운 전환 애니메이션 후 메인 페이지로 이동
- sessionStorage를 사용하여 홈에서 온 경우와 직접 접근을 구분

### 로딩 시스템
- 프로그레스 바: 상단 4px 높이
- 파티클 시스템: 진행도에 따라 다양한 모양의 파티클 생성
- 로딩 완료: iframe에서 `postMessage({ type: 'loadingComplete' })` 전송

### 테마 시스템
- 다크/라이트 모드 지원
- localStorage에 테마 저장
- iframe과 부모 페이지 간 테마 동기화

### 반응형 디자인
- 데스크톱: vw 단위 사용
- 태블릿: max-width 1024px
- 모바일: max-width 768px, 480px
- 터치 디바이스: 호버 효과 비활성화

---

## 파일 구조

```
archive/
├── index.html (홈 페이지)
├── styles.css
├── script.js
├── data/
│   └── projects.json
├── images/
│   └── thumbnails/
│       ├── p1_boo.png
│       └── p2_logo.png
└── projects/
    └── vibe/
        ├── boo3d/
        │   ├── page.html (래퍼 페이지)
        │   ├── index.html (3D 씬)
        │   └── Boo.glb
        └── chzzkcup/
            ├── page.html (래퍼 페이지)
            ├── index.html (3D 씬)
            ├── MeshTransmissionMaterial.js
            ├── Logo.glb
            └── font/
                └── SDNemony2dBasicBdTTF.ttf
```

---

## 참고사항

- 모든 페이지는 iframe 구조를 사용 (page.html이 래퍼, index.html이 실제 콘텐츠)
- Three.js는 CDN에서 로드 (importmap 사용)
- 커스텀 폰트는 @font-face로 로드
- 애니메이션은 CSS와 JavaScript 모두 사용
- 성능 최적화를 위해 requestAnimationFrame 사용
- 모바일에서는 터치 이벤트 지원 필수

---

## 외부 리소스 URL 목록

### Google Fonts
- **Inter 폰트**: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;900&display=swap`
- **Preconnect 설정**:
  - `https://fonts.googleapis.com`
  - `https://fonts.gstatic.com` (crossorigin)

### Three.js CDN
- **메인 라이브러리**: `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js`
- **예제 모듈 경로**: `https://cdn.jsdelivr.net/npm/three@0.160.0/`
- **버전**: 0.160.0 (2024년 기준)

### Three.js 예제 모듈 (CDN 경로)
- **GLTFLoader**: `three/examples/jsm/loaders/GLTFLoader.js`
  - 전체 URL: `https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js`
- **RoomEnvironment**: `three/examples/jsm/environments/RoomEnvironment.js`
  - 전체 URL: `https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js`

### 로컬 파일 (외부 URL 아님)
- **MeshTransmissionMaterial**: `./MeshTransmissionMaterial.js` (로컬 파일)
- **커스텀 폰트**: `./font/SDNemony2dBasicBdTTF.ttf` (로컬 파일)
- **3D 모델**: `./Boo.glb`, `./Logo.glb` (로컬 파일)

### HTML에서 사용 예시

**홈 페이지 (index.html):**
```html
<head>
    <!-- Google Fonts Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Google Fonts Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;900&display=swap" rel="stylesheet">
</head>
```

**3D 페이지 (boo3d/index.html, chzzkcup/index.html):**
```html
<script type="importmap">
{
    "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
        "three/": "https://cdn.jsdelivr.net/npm/three@0.160.0/"
    }
}
</script>
<script type="module">
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
    import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
    // 또는 chzzkcup의 경우:
    import { MeshTransmissionMaterial } from './MeshTransmissionMaterial.js';
</script>
```

### 네트워크 요구사항
- 인터넷 연결 필요 (CDN 리소스 로드)
- Google Fonts와 jsDelivr CDN 접근 가능해야 함
- 오프라인 환경에서는 CDN 리소스를 로컬로 다운로드하여 사용해야 함
