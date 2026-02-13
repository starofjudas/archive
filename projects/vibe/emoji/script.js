// Canvas 초기화
const c = document.querySelector("canvas");
const ctx = c.getContext("2d");
let cw = (c.width = window.innerWidth);
let ch = (c.height = window.innerHeight);
let radius = Math.max(cw, ch);
// 이모지를 이미지로 캐싱하는 함수 (성능 최적화)
function createEmojiImage(emoji, size = 100) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;

    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2);

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
}

// 외부 이미지 로딩 함수
function loadExternalImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

// 파티클 초기화 - 이모지 또는 커스텀 이미지
const particles = Array(CONFIG.particleCount);
const imageCache = {}; // 이미지 캐시
const sourceList = IMAGE_MODE === 'image' ? IMAGE_LIST : EMOJI_LIST;

for (let i = 0; i < particles.length; i++) {
    const source = sourceList[i % sourceList.length];

    // 소스별로 한 번만 이미지 생성/로딩
    if (!imageCache[source]) {
        if (IMAGE_MODE === 'image') {
            imageCache[source] = loadExternalImage(source);
        } else {
            imageCache[source] = createEmojiImage(source, 100);
        }
    }

    particles[i] = {
        x: 0,
        y: 0,
        scale: 0,
        rotate: 0,
        img: imageCache[source] // 캐싱된 이미지 사용
    };
}

// GSAP 타임라인 애니메이션 설정 (원본 CodePen 로직)
const tl = gsap.timeline({ onUpdate: draw })
    .fromTo(particles, {
        x: (i) => {
            const angle = (i / particles.length * Math.PI * 2) - Math.PI / 2;
            return Math.cos(angle * 10) * radius;
        },
        y: (i) => {
            const angle = (i / particles.length * Math.PI * 2) - Math.PI / 2;
            return Math.sin(angle * 10) * radius;
        },
        scale: CONFIG.initialScale,
        rotate: 0
    }, {
        duration: CONFIG.duration,
        ease: "sine",
        x: 0,
        y: 0,
        scale: CONFIG.finalScale,
        rotate: CONFIG.rotationAmount,
        stagger: { each: CONFIG.staggerDelay, repeat: -1 }
    }, 0)
    .seek(99);

// Canvas 렌더링 함수 (최적화됨 + 중력 효과)
function draw() {
    // Scale 기준으로 정렬하여 z-index 효과
    particles.sort((a, b) => a.scale - b.scale);

    ctx.clearRect(0, 0, cw, ch);

    particles.forEach((p) => {
        ctx.translate(cw / 2, ch / 2);
        ctx.rotate(p.rotate);

        // 마우스 중력 효과 계산
        let offsetX = 0;
        let offsetY = 0;

        if (mouseX !== 0 || mouseY !== 0) {
            // 파티클과 마우스 사이의 거리 계산
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 중력 강도 (거리가 가까울수록 강함, 최대 영향 범위 300px)
            const maxDistance = 300;
            if (distance < maxDistance && distance > 0) {
                const normalizedDistance = 1 - distance / maxDistance;

                // 위치 이동
                const force = normalizedDistance * 50; // 최대 50px 이동
                offsetX = (dx / distance) * force;
                offsetY = (dy / distance) * force;

                // 크기 증폭 (가까울수록 최대 2.5배까지 커짐)
                scaleMultiplier = 1 + normalizedDistance * 1.5;
            }
        }

        // 이미지로 렌더링 (중력 효과 적용)
        // 기본 크기를 100px로 설정하여 적절한 원근감 유지
        const size = 100 * p.scale;
        ctx.drawImage(
            p.img,
            p.x + offsetX - size / 2,  // 중력 효과 + 중앙 정렬
            p.y + offsetY - size / 2,
            size,
            size
        );

        ctx.resetTransform();
    });
}

// 윈도우 리사이즈 처리
window.addEventListener("resize", () => {
    cw = c.width = innerWidth;
    ch = c.height = innerHeight;
    radius = Math.max(cw, ch);
    tl.invalidate();
});

// 마우스 위치 추적
let mouseX = 0;
let mouseY = 0;

c.addEventListener('mousemove', (e) => {
    const rect = c.getBoundingClientRect();
    mouseX = e.clientX - rect.left - cw / 2; // 중앙 기준 좌표로 변환
    mouseY = e.clientY - rect.top - ch / 2;
});

// 마우스가 캔버스를 벗어나면 효과 제거
c.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
});

