// ========================================
// ✨ 별 생성 및 애니메이션
// ========================================

function createStars() {
    const starContainer = document.querySelector('main');
    const starCount = 150; // 별 개수

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // 랜덤 위치 (화면 전체)
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // 랜덤 크기 (1px ~ 3px)
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // 랜덤 밝기
        star.style.opacity = Math.random() * 0.5 + 0.3; // 0.3 ~ 0.8

        // 랜덤 애니메이션 지속시간 (5초 ~ 10초 - 더 부드럽게)
        const duration = Math.random() * 5 + 5;
        star.style.animationDuration = `${duration}s`;

        // 랜덤 애니메이션 딜레이 (0초 ~ 5초)
        const delay = Math.random() * 5;
        star.style.animationDelay = `${delay}s`;

        starContainer.appendChild(star);
    }
}

// 페이지 로드 시 별 생성
createStars();
