// Portfolio Script

// Loading Progress Bar - Wait for all resources
let loadingFinished = false;

(function() {
    const progressFill = document.querySelector('.progress-fill');
    const particleContainer = document.querySelector('.particle-container');
    let progress = 0;
    let lastParticleTime = 0;
    
    // Create particle
    const shapes = ['circle', 'square', 'triangle', 'star', 'diamond'];
    
    function createParticle(x) {
        if (!particleContainer) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size
        const rand = Math.random();
        if (rand > 0.8) particle.classList.add('large');
        else if (rand < 0.3) particle.classList.add('small');
        
        // Random shape
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        particle.classList.add(shape);
        
        // Full opacity
        const opacity = 1;
        
        // Position at progress bar edge
        particle.style.left = x + 'px';
        particle.style.top = '2px';
        
        // Random velocity
        const vx = (Math.random() - 0.5) * 8;
        const vy = Math.random() * 6 + 2;
        const rotation = Math.random() * 360;
        const scale = 0.5 + Math.random() * 1;
        const lifetime = 800 + Math.random() * 1200;
        
        particle.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        particleContainer.appendChild(particle);
        
        // Animate particle
        let startTime = Date.now();
        let posX = x;
        let posY = 2;
        let velocityX = vx;
        let velocityY = vy;
        
        function animateParticle() {
            const elapsed = Date.now() - startTime;
            const prog = elapsed / lifetime;
            
            if (prog >= 1) {
                particle.remove();
                return;
            }
            
            // Physics
            velocityY += 0.15;
            posX += velocityX;
            posY += velocityY;
            
            // Fade out
            const fadeOpacity = (1 - prog) * opacity;
            const currentScale = scale * (1 - prog * 0.5);
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = fadeOpacity;
            particle.style.transform = `scale(${currentScale}) rotate(${rotation + elapsed * 0.2}deg)`;
            
            requestAnimationFrame(animateParticle);
        }
        
        requestAnimationFrame(animateParticle);
    }
    
    // Create burst of particles
    function createParticleBurst(x, count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => createParticle(x), i * 20);
        }
    }
    
    // Update progress
    function updateProgress(value) {
        progress = Math.min(value, 100);
        if (progressFill) {
            progressFill.style.width = progress + '%';
            
            // Create particles at the edge
            const now = Date.now();
            if (now - lastParticleTime > 15) {
                const x = (window.innerWidth * progress) / 100;
                createParticle(x);
                createParticle(x);
                if (Math.random() > 0.5) createParticle(x);
                lastParticleTime = now;
            }
        }
    }
    
    // Gradual progress while loading
    let progressInterval = setInterval(() => {
        if (progress < 90 && !loadingFinished) {
            updateProgress(progress + 1);
        }
    }, 30);
    
    // When all resources are loaded
    window.addEventListener('load', () => {
        clearInterval(progressInterval);
        
        // Complete to 100%
        const completeInterval = setInterval(() => {
            if (progress < 100) {
                updateProgress(progress + 2);
            } else {
                clearInterval(completeInterval);
                
                // Final burst of particles
                createParticleBurst(window.innerWidth, 20);
                
                // Reveal content
                setTimeout(() => {
                    document.body.classList.remove('is-loading');
                    document.body.classList.add('loaded');
                    loadingFinished = true;
                    
                    if (typeof startEntranceAnimations === 'function') {
                        startEntranceAnimations();
                    }
                    
                    setTimeout(() => {
                        const loading = document.querySelector('.loading');
                        if (loading) loading.style.display = 'none';
                    }, 500);
                }, 300);
            }
        }, 20);
    });
})();

document.addEventListener('DOMContentLoaded', () => {
    // Adjust font size (without animation)
    adjustTitleSize(false);
    adjustFooterTitleSize(false);
    adjustSubTextSize(false);
    adjustMobileSubTextSize();
    window.addEventListener('resize', () => {
        adjustTitleSize(false);
        adjustFooterTitleSize(false);
        adjustSubTextSize(false);
        adjustMobileSubTextSize();
        // 리사이즈 시 가림 영역 높이도 재조정
        setTimeout(() => adjustFooterMaskHeight(), 100);
    });
    
    // Restore scroll position if returning from project
    restoreScrollPosition();
    
    // Load projects
    loadProjects();
    
    // Cover section fade in on scroll
    initCoverFade();
    
    // Theme toggle
    initThemeToggle();
    
    // Smooth scroll implementation
    initSmoothScroll();
});

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeLabel = document.querySelector('.theme-label');
    if (!themeToggle || !themeLabel) return;
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeLabel.textContent = 'light';
    }
    
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        themeLabel.textContent = isLight ? 'light' : 'dark';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

// Smooth scroll with momentum and easing
function initSmoothScroll() {
    // Skip on touch devices to avoid conflicts
    if (isTouchDevice) return;
    
    let currentScroll = 0;
    let targetScroll = 0;
    let ease = 0.08; // Easing factor (lower = smoother, slower)
    let isScrolling = false;
    
    // Update current scroll position
    function updateScroll() {
        currentScroll += (targetScroll - currentScroll) * ease;
        
        // Apply scroll
        window.scrollTo(0, currentScroll);
        
        // Continue animation if not close enough
        if (Math.abs(targetScroll - currentScroll) > 0.5) {
            requestAnimationFrame(updateScroll);
        } else {
            window.scrollTo(0, targetScroll);
            currentScroll = targetScroll;
            isScrolling = false;
        }
    }
    
    // Handle wheel events
    let wheelTimeout;
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        // Calculate scroll delta
        const delta = e.deltaY;
        targetScroll += delta;
        
        // Clamp scroll position
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
        
        // Start animation if not already running
        if (!isScrolling) {
            isScrolling = true;
            currentScroll = window.scrollY;
            updateScroll();
        }
        
        // Clear timeout
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            // Smooth stop after wheel stops
            targetScroll = window.scrollY;
        }, 150);
    }, { passive: false });
    
    // Handle scroll events (for programmatic scrolling)
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            currentScroll = window.scrollY;
            targetScroll = window.scrollY;
        }
    });
    
    // Handle keyboard scrolling
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
            e.preventDefault();
            const scrollAmount = e.key === 'ArrowUp' ? -100 :
                                e.key === 'ArrowDown' ? 100 :
                                e.key === 'PageUp' ? -window.innerHeight * 0.8 :
                                e.key === 'PageDown' ? window.innerHeight * 0.8 :
                                e.key === 'Home' ? -Infinity :
                                e.key === 'End' ? Infinity : 0;
            
            if (scrollAmount === -Infinity) {
                targetScroll = 0;
            } else if (scrollAmount === Infinity) {
                targetScroll = document.documentElement.scrollHeight - window.innerHeight;
            } else {
                targetScroll += scrollAmount;
            }
            
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
            
            if (!isScrolling) {
                isScrolling = true;
                currentScroll = window.scrollY;
                updateScroll();
            }
        }
    });
}

// Cover section fade in on scroll (disabled for PC and tablet)
function initCoverFade() {
    const coverSection = document.querySelector('.cover-section');
    const scrollSpacer = document.querySelector('.scroll-spacer');
    
    if (!coverSection || !scrollSpacer) return;
    
    // PC and tablet: no cover section effect, keep transparent
    // Mobile: keep existing behavior
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        coverSection.classList.add('visible');
    }
    // PC and tablet: do nothing, cover-section stays transparent
}

// Start all entrance animations after loading
function startEntranceAnimations() {
    // Enable top bar transitions
    const topBar = document.querySelector('.top-bar');
    if (topBar) topBar.classList.add('ready');
    
    // Mark sub-text-wrapper as loaded for line animations (first)
    const subTextWrapper = document.querySelector('.sub-text-wrapper');
    if (subTextWrapper) {
        subTextWrapper.classList.add('loaded');
    }
    
    // Animate title
    animateTitle();
    
    // Animate footer title
    animateFooterTitle();
    
    // Animate sub text
    const subLines = document.querySelectorAll('.sub-line');
    subLines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('animate');
        }, 300 + (index * 150));
    });
    
    // Animate mobile sub text (same animation as PC)
    const mobileSubLines = document.querySelectorAll('.sub-text-mobile p');
    mobileSubLines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('animate');
        }, 300 + (index * 150));
    });
    
    // Animate filter menu
    const filterMenu = document.querySelector('.filter-menu');
    if (filterMenu) {
        setTimeout(() => {
            filterMenu.classList.add('animate');
        }, 800);
    }
    
    // Animate project list
    const projectList = document.querySelector('.project-list');
    if (projectList) {
        setTimeout(() => {
            projectList.classList.add('animate');
            
            // Animate each project item with stagger (after filter menu appears)
            const projectItems = projectList.querySelectorAll('.project-item');
            projectItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate');
                }, 2000 + (index * 100));
            });
        }, 1000);
    }
    
    // Mark SVG as loaded
    const svg = document.querySelector('.sub-text-svg');
    if (svg) svg.classList.add('loaded');
}

// Adjust title font size to fit screen width - 2.5vw (1.25vw padding each side)
function adjustTitleSize(shouldAnimate = false) {
    const titleWrapper = document.querySelector('.title-wrapper');
    const chars = document.querySelectorAll('.char');
    
    if (!titleWrapper || chars.length === 0) return;
    
    document.fonts.ready.then(() => {
        const targetWidth = window.innerWidth * 0.975; // 100vw - 2.5vw (1.25vw each side)
        
        // Set a base font size for measurement
        const baseFontSize = 100;
        chars.forEach(char => {
            char.style.fontSize = baseFontSize + 'px';
        });
        
        // Force reflow
        titleWrapper.offsetWidth;
        
        // Calculate total width of all characters
        let totalWidth = 0;
        const charContainers = document.querySelectorAll('.char-container');
        charContainers.forEach(container => {
            totalWidth += container.getBoundingClientRect().width;
        });
        
        // Calculate the ratio and adjust font size
        const ratio = targetWidth / totalWidth;
        const newFontSize = Math.floor(baseFontSize * ratio);
        
        // Apply calculated font size
        chars.forEach(char => {
            char.style.fontSize = newFontSize + 'px';
        });
        
        // Set scroll spacer height to match title height
        const scrollSpacer = document.querySelector('.scroll-spacer');
        if (scrollSpacer) {
            const titleHeight = titleWrapper.getBoundingClientRect().height;
            scrollSpacer.style.height = titleHeight + 'px';
        }
    });
}

// Adjust sub text SVG viewBox
function adjustSubTextSize(shouldAnimate = false) {
    const svg = document.querySelector('.sub-text-svg');
    const line1 = document.querySelector('.sub-line-1');
    const line2 = document.querySelector('.sub-line-2');
    if (!svg || !line1 || !line2) return;
    
    document.fonts.ready.then(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Set font size based on screen size (mobile: 117px, others: 107px)
                const isMobile = window.innerWidth <= 768;
                const fontSize = isMobile ? 117 : 107;
                line1.setAttribute('font-size', fontSize);
                line2.setAttribute('font-size', fontSize);
                
                // Get bounding boxes
                const bbox1 = line1.getBBox();
                const bbox2 = line2.getBBox();
                
                // Second line is the reference for width (longer line)
                const totalWidth = bbox2.width;
                
                // Position first line at 35% indent
                const indent = totalWidth * 0.35;
                line1.setAttribute('x', indent);
                
                // Recalculate bbox after repositioning first line
                const newBbox1 = line1.getBBox();
                
                // Adjust second line y position based on first line y coordinate
                // Mobile: 120px spacing, PC/Tablet: 4px spacing
                const spacing = isMobile ? 120 : 4;
                const line1Y = parseFloat(line1.getAttribute('y')) || newBbox1.y;
                const line2NewY = line1Y + newBbox1.height + spacing; // First line y + height + spacing
                line2.setAttribute('y', line2NewY);
                line2.removeAttribute('dy'); // Remove dy if exists, use y instead
                
                // Recalculate bbox after repositioning second line
                const newBbox2 = line2.getBBox();
                
                // Calculate viewBox dimensions
                const padding = 5;
                const minX = 0 - padding;
                const minY = Math.min(newBbox1.y, newBbox2.y) - padding;
                const maxX = Math.max(newBbox1.x + newBbox1.width, newBbox2.x + newBbox2.width) + padding;
                const maxY = Math.max(newBbox1.y + newBbox1.height, newBbox2.y + newBbox2.height) + padding;
                
                const width = maxX - minX;
                const height = maxY - minY;
                
                // Set viewBox
                svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
            });
        });
    });
}

// Adjust mobile sub-text font size to fit screen width
function adjustMobileSubTextSize() {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;
    
    const line1 = document.querySelector('.sub-text-line-1');
    const line2 = document.querySelector('.sub-text-line-2');
    const wrapper = document.querySelector('.sub-text-wrapper');
    if (!line1 || !line2 || !wrapper) return;
    
    // Get actual container width
    const wrapperRect = wrapper.getBoundingClientRect();
    const availableWidth = wrapperRect.width - 5; // Subtract small safety margin
    
    // Create a temporary element to measure text width
    const temp = document.createElement('span');
    temp.style.visibility = 'hidden';
    temp.style.position = 'absolute';
    temp.style.fontFamily = getComputedStyle(line2).fontFamily;
    temp.style.fontWeight = getComputedStyle(line2).fontWeight;
    temp.style.whiteSpace = 'nowrap';
    temp.style.fontSize = '26px';
    document.body.appendChild(temp);
    
    // Binary search to find the right font size
    let minSize = 10;
    let maxSize = 100;
    let bestSize = 26;
    
    for (let i = 0; i < 30; i++) {
        const testSize = (minSize + maxSize) / 2;
        temp.style.fontSize = testSize + 'px';
        temp.textContent = line2.textContent;
        const textWidth = temp.offsetWidth;
        
        if (textWidth <= availableWidth) {
            bestSize = testSize;
            minSize = testSize;
        } else {
            maxSize = testSize;
        }
    }
    
    // Apply the calculated font size to both lines (with slight reduction for safety)
    const finalSize = Math.floor(bestSize * 0.95); // 5% safety margin
    line1.style.fontSize = finalSize + 'px';
    line2.style.fontSize = finalSize + 'px';
    
    document.body.removeChild(temp);
}

// Animate title characters with staggered delay
function animateTitle() {
    const titleWrapper = document.querySelector('.title-wrapper');
    if (!titleWrapper) return;
    const chars = titleWrapper.querySelectorAll('.char');
    
    chars.forEach((char, index) => {
        setTimeout(() => {
            char.classList.add('animate');
        }, index * 80);
    });
}

// Adjust footer title font size (same logic as main title)
function adjustFooterTitleSize() {
    const wrapper = document.querySelector('.footer-title-wrapper');
    const chars = document.querySelectorAll('.footer-char');
    
    if (!wrapper || chars.length === 0) return;
    
    document.fonts.ready.then(() => {
        const targetWidth = window.innerWidth * 0.975;
        const baseFontSize = 100;
        chars.forEach(char => {
            char.style.fontSize = baseFontSize + 'px';
        });
        wrapper.offsetWidth;
        
        let totalWidth = 0;
        const containers = document.querySelectorAll('.footer-char-container');
        containers.forEach(container => {
            totalWidth += container.getBoundingClientRect().width;
        });
        
        const ratio = targetWidth / totalWidth;
        const newFontSize = Math.floor(baseFontSize * ratio);
        chars.forEach(char => {
            char.style.fontSize = newFontSize + 'px';
        });
        
        // 폰트 크기 조정 후 가림 영역 높이 조정
        adjustFooterMaskHeight();
    });
}

// Adjust footer mask height based on actual rendered height (43.5% 공통 적용)
// 실제 텍스트 높이(wrapperHeight)를 기준으로 계산하여 정확도 향상
function adjustFooterMaskHeight() {
    const footerCreateBlock = document.querySelector('.footer-create-block');
    const footerTitleWrapper = document.querySelector('.footer-title-wrapper');
    if (!footerCreateBlock || !footerTitleWrapper) return;
    
    // 폰트 크기 조정 후 실제 렌더링이 완료될 때까지 충분한 지연
    // 실제 디바이스에서는 폰트 렌더링이 더 오래 걸릴 수 있음
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // 추가 지연으로 실제 렌더링 완료 보장 (특히 모바일 디바이스)
            setTimeout(() => {
                // 실제 렌더링된 높이 측정
                const actualHeight = footerCreateBlock.getBoundingClientRect().height;
                const wrapperHeight = footerTitleWrapper.getBoundingClientRect().height;
                
                // 실제 텍스트 높이를 기준으로 계산 (더 정확함)
                // wrapperHeight가 있으면 그것을 사용, 없으면 actualHeight 사용
                const baseHeight = wrapperHeight > 0 ? wrapperHeight : actualHeight;
                
                if (baseHeight > 0) {
                    // 높이의 43.5% 계산 (모든 화면 크기 공통)
                    const maskHeight = baseHeight * 0.435;
                    
                    // CSS 변수로 설정 (CSS에서 var(--mask-height)로 사용)
                    footerCreateBlock.style.setProperty('--mask-height', maskHeight + 'px');
                    
                    // 디버깅: 실제 디바이스에서 문제 파악을 위한 로그
                    if (window.innerWidth <= 1366) {
                        console.log('[Footer Mask Debug]', {
                            screenWidth: window.innerWidth,
                            screenHeight: window.innerHeight,
                            viewportWidth: document.documentElement.clientWidth,
                            viewportHeight: document.documentElement.clientHeight,
                            actualHeight: actualHeight,
                            wrapperHeight: wrapperHeight,
                            baseHeight: baseHeight,
                            maskHeight: maskHeight,
                            percentage: (maskHeight / baseHeight * 100).toFixed(2) + '%',
                            devicePixelRatio: window.devicePixelRatio,
                            fontSize: window.getComputedStyle(footerTitleWrapper.querySelector('.footer-char')).fontSize,
                            lineHeight: window.getComputedStyle(footerTitleWrapper.querySelector('.footer-char')).lineHeight,
                            userAgent: navigator.userAgent
                        });
                    }
                }
            }, 50); // 실제 디바이스에서 렌더링 완료를 위한 추가 지연
        });
    });
}

// Animate footer title characters with staggered delay (same as archive)
function animateFooterTitle() {
    const wrapper = document.querySelector('.footer-title-wrapper');
    if (!wrapper) return;
    const chars = wrapper.querySelectorAll('.footer-char');
    
    // 애니메이션 완료 후 가림 영역 높이 조정 (애니메이션 시간 1.2초 + 약간의 여유)
    setTimeout(() => {
        adjustFooterMaskHeight();
    }, 1500);
    
    chars.forEach((char, index) => {
        setTimeout(() => {
            char.classList.add('animate');
        }, index * 80);
    });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Detect touch device
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

// Custom cursor (skip on touch devices)
const cursorDot = isTouchDevice ? null : document.querySelector('.cursor-dot');
const canvas = isTouchDevice ? null : document.querySelector('.cursor-trail');
const ctx = canvas ? canvas.getContext('2d') : null;

// Trail points
let points = [];
const maxPoints = 50;
const trailLife = 25;

// Smoothing for cursor position
let mouseX = 0;
let mouseY = 0;
let smoothX = 0;
let smoothY = 0;
const smoothing = 0.35; // Lower = smoother, higher = more responsive

// Vivid colors in RGB
const vividColors = [
    [255, 0, 0],     // Red
    [255, 107, 0],   // Orange
    [255, 229, 0],   // Yellow
    [0, 255, 0],     // Green
    [0, 255, 255],   // Cyan
    [0, 102, 255],   // Blue
    [139, 0, 255],   // Purple
    [255, 0, 255],   // Magenta
    [255, 0, 102],   // Pink
];

let currentColorIndex = 0;
let targetColorIndex = 1;
let colorTransition = 0;
let currentRGB = [...vividColors[0]];

// Interpolate between colors
function lerpColor(from, to, t) {
    return [
        Math.round(from[0] + (to[0] - from[0]) * t),
        Math.round(from[1] + (to[1] - from[1]) * t),
        Math.round(from[2] + (to[2] - from[2]) * t)
    ];
}

function rgbToString(rgb) {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// Update color smoothly
function updateColor() {
    colorTransition += 0.01; // Smooth transition speed
    
    if (colorTransition >= 1) {
        colorTransition = 0;
        currentColorIndex = targetColorIndex;
        // Pick new random target color (different from current)
        do {
            targetColorIndex = Math.floor(Math.random() * vividColors.length);
        } while (targetColorIndex === currentColorIndex);
    }
    
    currentRGB = lerpColor(vividColors[currentColorIndex], vividColors[targetColorIndex], colorTransition);
    
    if (cursorDot) {
        cursorDot.style.backgroundColor = rgbToString(currentRGB);
    }
}

// Setup canvas
function setupCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setupCanvas();
window.addEventListener('resize', setupCanvas);

if (cursorDot && ctx) {
    // Track actual mouse position and move cursor dot immediately
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Move cursor dot immediately (no smoothing)
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    document.addEventListener('mouseenter', () => {
        cursorDot.classList.remove('hidden');
    });
    
    document.addEventListener('mouseleave', () => {
        cursorDot.classList.add('hidden');
    });
    
    // Animation loop for trail
    function animateTrail() {
        // Smooth line position (lagging behind cursor)
        smoothX += (mouseX - smoothX) * smoothing;
        smoothY += (mouseY - smoothY) * smoothing;
        
        // Add point for trail with smoothed position
        if (Math.abs(mouseX - smoothX) > 0.1 || Math.abs(mouseY - smoothY) > 0.1) {
            points.push({
                x: smoothX,
                y: smoothY,
                life: trailLife,
                color: [...currentRGB]
            });
            
            // Limit points
            if (points.length > maxPoints) {
                points.shift();
            }
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw continuous line with color gradient
        if (points.length > 2) {
            for (let i = 1; i < points.length; i++) {
                const point = points[i];
                const prevPoint = points[i - 1];
                
                ctx.beginPath();
                
                if (i === 1) {
                    ctx.moveTo(prevPoint.x, prevPoint.y);
                    ctx.lineTo(point.x, point.y);
                } else {
                    const prevPrevPoint = points[i - 2];
                    ctx.moveTo((prevPrevPoint.x + prevPoint.x) / 2, (prevPrevPoint.y + prevPoint.y) / 2);
                    ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, (prevPoint.x + point.x) / 2, (prevPoint.y + point.y) / 2);
                }
                
                ctx.strokeStyle = rgbToString(point.color);
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
            }
        }
        
        // Update color smoothly
        updateColor();
        
        // Decrease life and remove dead points
        points = points.filter(point => {
            point.life -= 1;
            return point.life > 0;
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Load projects from JSON
let projectsData = [];

async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        projectsData = await response.json();
        // 나중에 추가한 프로젝트가 앞에 오도록 역순 렌더
        renderProjects(projectsData.slice().reverse());
        initProjectFeatures();
    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}

// Render projects to DOM
function renderProjects(projects) {
    const projectList = document.getElementById('project-list');
    if (!projectList) return;
    
    if (!projects || projects.length === 0) {
        projectList.innerHTML = '';
        projectList.classList.remove('is-empty', 'is-filter-empty');
        if (!projectList.classList.contains('animate')) {
            projectList.classList.add('animate');
        }
        return;
    }
    
    projectList.classList.remove('is-empty', 'is-filter-empty');
    // 레이아웃: 큰-작은 / 작은-큰 반복 (인덱스 0,3=large / 1,2=small)
    projectList.innerHTML = projects.map((project, index) => {
        const layoutSize = (index % 4 === 0 || index % 4 === 3) ? 'large' : 'small';
        const isColorThumb = !!project.thumbnailColor;
        const thumbStyle = isColorThumb
            ? `background-color: ${project.thumbnailColor}; background-image: none; background-size: cover; background-position: center;`
            : `background-image: url('${project.thumbnail}'); background-size: cover; background-position: center;`;
        return `
        <article class="project-item" data-category="${project.category}" data-size="${layoutSize}" data-id="${project.id}">
            <a href="${project.link}" class="project-link">
                <div class="project-thumb" ${isColorThumb ? 'data-thumb="color"' : ''} style="${thumbStyle}"></div>
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <span class="project-meta">${project.category}</span>
                </div>
            </a>
        </article>
    `;
    }).join('');
    
    // Animate project items after rendering
    animateProjectItems();
}

// Animate project items with stagger effect
function animateProjectItems() {
    const projectList = document.querySelector('.project-list');
    if (!projectList) return;
    
    // Add animate class to list if not already animated
    if (!projectList.classList.contains('animate')) {
        projectList.classList.add('animate');
    }
    
    // Animate each visible project item
    const visibleItems = projectList.querySelectorAll('.project-item:not(.hidden)');
    visibleItems.forEach((item, index) => {
        // Remove existing animate class to restart animation
        item.classList.remove('animate');
        setTimeout(() => {
            item.classList.add('animate');
        }, index * 100);
    });
}

// Initialize project features after rendering
function initProjectFeatures() {
    initFilterMenu();
    initTiltEffect();
    initThumbnailFallback();
    initProjectNavigation();
}

// Handle project click with navigation
function initProjectNavigation() {
    const projectLinks = document.querySelectorAll('.project-link');
    
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Save scroll position before navigating
            sessionStorage.setItem('scrollPosition', window.scrollY);
            
            // Mark that we're coming from home (for subpage header animation)
            sessionStorage.setItem('fromHome', 'true');
            
            // Navigate immediately without header animation
            window.location.href = href;
        });
    });
}

// Restore scroll position if returning from project page
function restoreScrollPosition() {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition !== null) {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem('scrollPosition');
    }
}

// Filter Menu with Animation
function initFilterMenu() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectList = document.getElementById('project-list');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Prevent layout shift by maintaining scroll position
            const scrollY = window.scrollY;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            const projectItems = projectList.querySelectorAll('.project-item');
            
            // Record which items were visible and their positions
            const wasVisible = new Map();
            const positions = new Map();
            projectItems.forEach(item => {
                const isVisible = !item.classList.contains('hidden');
                wasVisible.set(item, isVisible);
                if (isVisible) {
                    const rect = item.getBoundingClientRect();
                    positions.set(item, { top: rect.top, left: rect.left });
                }
            });
            
            // Apply filter
            projectItems.forEach(item => {
                const shouldShow = filter === 'all' || item.dataset.category === filter;
                if (shouldShow) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
                
                // Show/hide category meta
                const meta = item.querySelector('.project-meta');
                if (meta) {
                    meta.style.opacity = filter === 'all' ? '0.6' : '0';
                }
            });
            
            // Restore scroll position to prevent layout shift
            window.scrollTo(0, scrollY);
            
            // Animate
            projectItems.forEach(item => {
                const shouldShow = filter === 'all' || item.dataset.category === filter;
                const wasVis = wasVisible.get(item);
                
                if (!shouldShow) {
                    // Hide item - reset styles
                    const thumb = item.querySelector('.project-thumb');
                    const info = item.querySelector('.project-info');
                    if (thumb) {
                        thumb.style.opacity = '0';
                        thumb.style.transform = 'translateY(20px)';
                        thumb.style.animation = 'none';
                    }
                    if (info) {
                        info.style.opacity = '0';
                        info.style.transform = 'translateY(20px)';
                        info.style.animation = 'none';
                    }
                    return;
                }
                
                // Reset thumb and info animations for all visible items
                const thumb = item.querySelector('.project-thumb');
                const info = item.querySelector('.project-info');
                
                // Clear any existing animations
                if (thumb) {
                    thumb.style.animation = 'none';
                    thumb.style.opacity = '0';
                    thumb.style.transform = 'translateY(20px)';
                }
                if (info) {
                    info.style.animation = 'none';
                    info.style.opacity = '0';
                    info.style.transform = 'translateY(20px)';
                }
                
                // Ensure item is visible
                item.style.opacity = '1';
                item.style.transform = '';
                
                if (wasVis && positions.has(item)) {
                    // Item was visible - use FLIP animation
                    const oldPos = positions.get(item);
                    const newRect = item.getBoundingClientRect();
                    
                    const deltaX = oldPos.left - newRect.left;
                    const deltaY = oldPos.top - newRect.top;
                    
                    if (deltaX !== 0 || deltaY !== 0) {
                        item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        item.style.transition = 'none';
                        
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                item.style.transform = '';
                                item.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease';
                                
                                // Animate thumb and info
                                setTimeout(() => {
                                    if (thumb) {
                                        thumb.style.animation = 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                                    }
                                    if (info) {
                                        info.style.animation = 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards';
                                    }
                                }, 50);
                            });
                        });
                    } else {
                        // No position change, just animate thumb and info
                        setTimeout(() => {
                            if (thumb) {
                                thumb.style.animation = 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                            }
                            if (info) {
                                info.style.animation = 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards';
                            }
                        }, 50);
                    }
                } else {
                    // Item was hidden, now appearing - use fadeInUp animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    item.style.transition = 'none';
                    item.classList.remove('animate');
                    
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            item.classList.add('animate');
                            item.style.opacity = '1';
                            item.style.transform = '';
                            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            
                            // Animate thumb and info
                            setTimeout(() => {
                                if (thumb) {
                                    thumb.style.animation = 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                                }
                                if (info) {
                                    info.style.animation = 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards';
                                }
                            }, 50);
                        });
                    });
                }
            });
        });
    });
}

// Thumbnail fallback (이미지 없을 때만 랜덤 플레이스홀더, 컬러 썸네일은 제외)
function initThumbnailFallback() {
    const thumbs = document.querySelectorAll('.project-thumb:not([data-thumb="color"])');
    thumbs.forEach((thumb) => {
        const bgImage = thumb.style.backgroundImage;
        if (!bgImage || bgImage === 'none' || bgImage.includes('undefined')) {
            const randomId = Math.floor(Math.random() * 1000);
            thumb.style.backgroundImage = `url('https://picsum.photos/seed/${randomId}/800/450?grayscale')`;
            thumb.style.backgroundSize = 'cover';
            thumb.style.backgroundPosition = 'center';
        }
    });
}

// 3D Tilt + 그레이스케일→컬러 호버 효과 (모든 리스트 공통, desktop만)
function initTiltEffect() {
    if (isTouchDevice) return;
    
    const projectList = document.getElementById('project-list');
    if (!projectList) return;
    
    const projectItems = projectList.querySelectorAll('.project-item');
    const easeSmooth = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
    const grayscaleDefault = 'grayscale(0.4)';
    
    // 다른 모든 썸네일을 그레이스케일로 (아웃 시 복원 누락 방지)
    function setOthersToGrayscale(exceptThumb) {
        projectItems.forEach((it) => {
            const t = it.querySelector('.project-thumb');
            if (t && t !== exceptThumb) {
                t.style.willChange = '';
                t.style.transition = `transform 1.2s ${easeSmooth}, filter 1.1s ${easeSmooth}`;
                t.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                t.style.filter = grayscaleDefault;
            }
        });
    }
    
    function setAllToGrayscale() {
        projectItems.forEach((it) => {
            const t = it.querySelector('.project-thumb');
            if (t) {
                t.style.willChange = '';
                t.style.transition = `transform 1.2s ${easeSmooth}, filter 1.1s ${easeSmooth}`;
                t.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                t.style.filter = grayscaleDefault;
            }
        });
    }
    
    projectItems.forEach(item => {
        const thumb = item.querySelector('.project-thumb');
        if (!thumb) return;
        const isSmall = item.getAttribute('data-size') === 'small';
        const tiltStrength = isSmall ? 2.5 : 1.5;
        
        item.addEventListener('mouseenter', () => {
            setOthersToGrayscale(thumb);
            thumb.style.animation = 'none';
            thumb.style.opacity = '1';
            thumb.style.filter = 'grayscale(0)';
            thumb.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            thumb.style.transition = `transform 1s ${easeSmooth}, filter 1s ${easeSmooth}`;
            thumb.style.willChange = 'transform';
        });
        
        item.addEventListener('mousemove', (e) => {
            const rect = thumb.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -tiltStrength;
            const rotateY = ((x - centerX) / centerX) * tiltStrength;
            
            thumb.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        item.addEventListener('mouseleave', () => {
            thumb.style.willChange = '';
            thumb.style.transition = `transform 1.2s ${easeSmooth}, filter 1.1s ${easeSmooth}`;
            thumb.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            thumb.style.filter = grayscaleDefault;
        });
    });
    
    // 커서가 문서 밖으로 나갔을 때도 전부 그레이스케일 복원
    document.body.addEventListener('mouseleave', setAllToGrayscale);
}
