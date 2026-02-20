# 음악에 맞춰 움직이는 배경/시각 효과 — 웹 라이브러리 추천

각 장르에 어울리는 배경 효과는 **Web Audio API (AnalyserNode)** 로 주파수/볼륨을 읽고, 그 값을 라이브러리에 넘겨서 **음악에 반응하는 움직임**으로 만들 수 있습니다.

---

## 1. 오디오 시각화 전용

| 라이브러리 | 설명 | 음악 연동 |
|------------|------|-----------|
| **[audioMotion-analyzer](https://audiomotion.dev/)** | 고해상도 실시간 스펙트럼, LED 바, 레이디얼 등 여러 프리셋. Web Audio + Canvas, 의존성 없음. | ✅ 내장 (오디오 입력 → 자동 반응) |
| **[wavesurfer.js](https://wavesurfer.xyz/)** | 웨이브폼, 스펙트로그램, 리전, 타임라인. 플러그인으로 확장 가능. | ✅ 오디오 재생/구간과 동기화 |
| **[bars.js](https://github.com/jhancock532/bars.js)** | 경량 뮤직 비주얼라이저. 코드 적게 오디오 처리. | ✅ 오디오 기반 |

---

## 2. 3D / WebGL (장르별 “공간감” 배경에 적합)

| 라이브러리 | 설명 | 음악 연동 |
|------------|------|-----------|
| **[Three.js](https://threejs.org/)** | 3D 씬, 파티클, 포스트프로세싱. [webaudio_visualizer 예제](https://threejs.org/examples/webaudio_visualizer.html) 있음. | AnalyserNode 데이터를 오브젝트/파티클에 연결 |
| **[PixiJS](https://pixijs.com/)** | 2D WebGL. 파티클, 스프라이트, 필터. `@pixi/sound`로 재생 + AnalyserNode 연동. | getByteFrequencyData → 파티클 속도/크기/색 |
| **[regl](https://regl-project.github.io/regl/)** | 함수형 WebGL. GLSL 셰이더 직접 작성. **[regl-audio](https://github.com/regl-project/regl-audio)** 로 오디오 → 유니폼 전달. | 주파수/볼륨을 유니폼으로 셰이더에 전달 |
| **[Babylon.js](https://www.babylonjs.com/)** | 3D 엔진. 파티클 시스템, 포스트프로세싱. | Web Audio Analyser → 파티클/머티리얼 파라미터 |

---

## 3. 파티클 / 2D 효과 (배경 분위기용)

| 라이브러리 | 설명 | 음악 연동 |
|------------|------|-----------|
| **[particles.js](https://marcbruederlin.github.io/particles.js/)** | 캔버스 파티클 배경. 설정만으로 다양한 패턴. | 별도: 볼륨/비트에 따라 `pauseAnimation`/속도/색 변경 |
| **[tsParticles](https://particles.js.org/)** | 파티클·confetti·폭죽. React/Vue 등 지원. | 오디오 레벨로 옵션 업데이트 (예: 속도, 개수) |
| **[PixiJS Particles](https://pixijs.com/)** | PixiJS 내장 파티클. 이미지/스프라이트 기반. | AnalyserNode → emission, scale, speed |

---

## 4. 비트/리듬 감지 (움직임 “타이밍” 맞추기)

| 라이브러리 | 설명 | 음악 연동 |
|------------|------|-----------|
| **[web-audio-beat-detector](https://github.com/chrisguttandin/web-audio-beat-detector)** | 오디오 버퍼 분석 → BPM, 첫 비트 오프셋 반환. | 비트 시점에만 이펙트 트리거 (깜빡임, 펄스) |
| **[Tone.js](https://tonejs.github.io/)** | Transport, Sequence, BPM. 리듬/스케줄링. | BPM에 맞춰 애니메이션/이벤트 스케줄 |
| **[Tone.js Transport](https://tonejs.github.io/docs/r11/Transport)** | BPM, 박자, 루프. | `Tone.Transport.schedule()` 로 “박자에 맞춘” 효과 |

---

## 5. 애니메이션 (이미 사용 중인 GSAP + 오디오 데이터)

| 라이브러리 | 설명 | 음악 연동 |
|------------|------|-----------|
| **[GSAP](https://greensock.com/gsap/)** | 이미 사용 중. | `audioLevel`/주파수로 `gsap.to()` duration, scale, opacity 제어 |
| **[anime.js](https://animejs.com/)** | 경량 타임라인 애니메이션. | 오디오 레벨 → 타겟 값으로 부드럽게 보간 |
| **[Framer Motion](https://www.framer.com/motion/)** (React) | 선언적 애니메이션. | 오디오 state → motion 값에 반영 |

---

## 6. 셰이더/고급 배경 (장르별 “무드” 표현)

| 방식 | 설명 | 음악 연동 |
|------|------|-----------|
| **Canvas 2D + AnalyserNode** | 지금 웨이브폼처럼. 그라디언트, 블러, 도형 추가. | ✅ 이미 사용 중 |
| **WebGL / GLSL** (Three, regl, Raw ShaderMaterial) | 노이즈, 그라디언트, 왜곡. 장르별로 다른 셰이더. | 주파수/볼륨을 uniform으로 전달 |
| **[gl-react](https://gl-react-cookbook.com/)** (React) | React에서 WebGL 셰이더 컴포넌트. | props로 오디오 데이터 전달 |

---

## 7. 실전 조합 제안 (장르별 배경)

- **LOFI / Ambient**  
  - particles.js 또는 tsParticles로 부드러운 파티클 + `audioLevel`로 속도/opacity만 살짝 변화.  
  - 또는 Canvas 2D 그라디언트 + 블러 (지금 웨이브와 동일 오디오 소스).

- **Techno / Drum&Bass / House**  
  - audioMotion-analyzer LED/스펙트럼 또는 Three.js 파티클을 **저주파(베이스)** 에 반응시키기.  
  - web-audio-beat-detector로 비트 시점에만 플래시/펄스.

- **Jazz / R&B**  
  - GSAP + 오디오 레벨로 원/라인 스케일·opacity 부드럽게 변화.  
  - PixiJS 또는 Canvas로 그라디언트 배경 + 미세한 움직임.

- **ROCK / Funk**  
  - 비트 감지 + 파티클 emission 증가, 또는 Three.js/regl 셰이더로 “펄스” 느낌.

---

## 8. 공통 흐름

1. **오디오 소스** → `AnalyserNode` (이미 사용 중).
2. `getByteFrequencyData()` / `getFloatFrequencyData()` 로 매 프레임 데이터 수집.
3. **총 볼륨** 또는 **저/중/고역** 구간 평균 계산.
4. (선택) **web-audio-beat-detector** 로 BPM/비트 시점 계산.
5. 위 값을 **라이브러리 입력**으로 사용:  
   - 파티클 속도/개수, 3D 오브젝트 scale, 셰이더 uniform, GSAP 타겟 등.

이렇게 하면 “각 장르에 어울리는 배경 효과”를 웹 기술만으로 구현할 수 있고, 위 라이브러리들은 모두 **음악에 맞춰 움직임**을 만드는 데 쓸 수 있습니다.
