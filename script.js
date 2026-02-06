// Portfolio Script


document.addEventListener('DOMContentLoaded', () => {
    // Adjust font size first, then animate
    adjustTitleSize();
    adjustSubTextSize();
    window.addEventListener('resize', () => {
        adjustTitleSize();
        adjustSubTextSize();
    });
    
    // Enable transitions after page load to prevent flash
    setTimeout(() => {
        const topBar = document.querySelector('.top-bar');
        if (topBar) topBar.classList.add('ready');
    }, 100);
    
    // Restore scroll position if returning from project
    restoreScrollPosition();
    
    // Load projects
    loadProjects();
});

// Adjust title font size to fit screen width - 2.5vw (1.25vw padding each side)
function adjustTitleSize() {
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
        
        // Animate only on first load
        if (!titleWrapper.classList.contains('animated')) {
            titleWrapper.classList.add('animated');
            animateTitle();
        }
    });
}

// Adjust sub text SVG viewBox
function adjustSubTextSize() {
    const svg = document.querySelector('.sub-text-svg');
    const line1 = document.querySelector('.sub-line-1');
    const line2 = document.querySelector('.sub-line-2');
    if (!svg || !line1 || !line2) return;
    
    document.fonts.ready.then(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Get bounding boxes
                const bbox1 = line1.getBBox();
                const bbox2 = line2.getBBox();
                
                // Second line is the reference for width (longer line)
                const totalWidth = bbox2.width;
                
                // Position first line at 35% indent
                const indent = totalWidth * 0.35;
                line1.setAttribute('x', indent);
                
                // Recalculate bbox after repositioning
                const newBbox1 = line1.getBBox();
                
                // Calculate viewBox dimensions
                const padding = 5;
                const minX = 0 - padding;
                const minY = Math.min(newBbox1.y, bbox2.y) - padding;
                const maxX = Math.max(newBbox1.x + newBbox1.width, bbox2.x + bbox2.width) + padding;
                const maxY = Math.max(newBbox1.y + newBbox1.height, bbox2.y + bbox2.height) + padding;
                
                const width = maxX - minX;
                const height = maxY - minY;
                
                // Set viewBox
                svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
                
                // Show SVG after viewBox is set
                svg.classList.add('loaded');
                
                // Animate sub lines
                const subLines = document.querySelectorAll('.sub-line');
                subLines.forEach((line, index) => {
                    setTimeout(() => {
                        line.classList.add('animate');
                    }, index * 250); // 250ms delay between each line
                });
            });
        });
    });
}

// Animate title characters with staggered delay
function animateTitle() {
    const chars = document.querySelectorAll('.char');
    
    // Animate title characters
    chars.forEach((char, index) => {
        setTimeout(() => {
            char.classList.add('animate');
        }, index * 80); // 80ms delay between each character
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

// Custom cursor
const cursorDot = document.querySelector('.cursor-dot');
const canvas = document.querySelector('.cursor-trail');
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
        renderProjects(projectsData);
        initProjectFeatures();
    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}

// Render projects to DOM
function renderProjects(projects) {
    const projectList = document.getElementById('project-list');
    if (!projectList) return;
    
    projectList.innerHTML = projects.map(project => `
        <article class="project-item" data-category="${project.category}" data-size="${project.size}" data-id="${project.id}">
            <a href="${project.link}" class="project-link">
                <div class="project-thumb" style="background-image: url('${project.thumbnail}'); background-size: cover; background-position: center;"></div>
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <span class="project-meta">${project.category}</span>
                </div>
            </a>
        </article>
    `).join('');
}

// Initialize project features after rendering
function initProjectFeatures() {
    initFilterMenu();
    initTiltEffect();
    initThumbnailFallback();
    initProjectNavigation();
}

// Handle project click with navigation animation
function initProjectNavigation() {
    const projectLinks = document.querySelectorAll('.project-link');
    const topBar = document.querySelector('.top-bar');
    
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Save scroll position before navigating
            sessionStorage.setItem('scrollPosition', window.scrollY);
            
            // Add transitioning class to trigger animation
            topBar.classList.add('transitioning');
            
            // Navigate after animation
            setTimeout(() => {
                window.location.href = href;
            }, 400);
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
        btn.addEventListener('click', () => {
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
            
            // Animate
            projectItems.forEach(item => {
                if (item.classList.contains('hidden')) return;
                
                const wasVis = wasVisible.get(item);
                
                if (wasVis && positions.has(item)) {
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
                            });
                        });
                    }
                } else {
                    item.style.opacity = '0';
                    item.style.transition = 'none';
                    
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            item.style.opacity = '1';
                            item.style.transition = 'opacity 0.4s ease';
                        });
                    });
                }
            });
        });
    });
}

// Thumbnail fallback (if no image, use random placeholder)
function initThumbnailFallback() {
    const thumbs = document.querySelectorAll('.project-thumb');
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

// 3D Tilt Effect for Project Thumbnails
function initTiltEffect() {
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
        const thumb = item.querySelector('.project-thumb');
        if (!thumb) return;
        
        item.addEventListener('mouseenter', () => {
            thumb.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        item.addEventListener('mousemove', (e) => {
            const rect = thumb.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -12;
            const rotateY = (x - centerX) / centerX * 12;
            
            thumb.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        item.addEventListener('mouseleave', () => {
            thumb.style.transition = 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)';
            thumb.style.transform = 'rotateX(0) rotateY(0)';
        });
    });
}
