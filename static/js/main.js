// Spider Effect - Modified for compatibility with particles.js
const spiderCanvas = document.getElementById('spiderWebCanvas');
const ctx = spiderCanvas.getContext("2d");
const { sin, cos, PI, hypot, min, max } = Math;

spiderCanvas.style.position = 'absolute';
spiderCanvas.style.top = '0';
spiderCanvas.style.left = '0';
spiderCanvas.style.zIndex = '-1';

let w, h;

function spawn() {
  const pts = many(999, () => {
    return { x: rnd(innerWidth), y: rnd(innerHeight), len: 0, r: 0 };
  });
  const pts2 = many(9, (i) => {
    return { x: cos((i / 9) * PI * 2), y: sin((i / 9) * PI * 2) };
  });
  
  let seed = rnd(100);
  let tx = rnd(innerWidth);
  let ty = rnd(innerHeight);
  let x = rnd(innerWidth);
  let y = rnd(innerHeight);
  let kx = rnd(0.8, 0.8);
  let ky = rnd(0.8, 0.8);
  let walkRadius = pt(rnd(50, 50), rnd(50, 50));
  let r = innerWidth / rnd(100, 150);
  
  function paintPt(pt) {
    pts2.forEach((pt2) => {
      if (!pt.len) return;
      drawLine(
        lerp(x + pt2.x * r, pt.x, pt.len * pt.len),
        lerp(y + pt2.y * r, pt.y, pt.len * pt.len),
        x + pt2.x * r,
        y + pt2.y * r
      );
    });
    drawCircle(pt.x, pt.y, pt.r);
  }
  
  return {
    follow(x, y) {
      tx = x;
      ty = y;
    },
    tick(t) {
      const selfMoveX = cos(t * kx + seed) * walkRadius.x;
      const selfMoveY = sin(t * ky + seed) * walkRadius.y;
      let fx = tx + selfMoveX;
      let fy = ty + selfMoveY;
      
      x += min(innerWidth / 100, (fx - x) / 10);
      y += min(innerWidth / 100, (fy - y) / 10);
      
      let i = 0;
      pts.forEach((pt) => {
        const dx = pt.x - x, dy = pt.y - y;
        const len = hypot(dx, dy);
        let r = min(2, innerWidth / len / 5);
        pt.t = 0;
        const increasing = len < innerWidth / 10 && (i++) < 8;
        let dir = increasing ? 0.1 : -0.1;
        if (increasing) {
          r *= 1.5;
        }
        pt.r = r;
        pt.len = max(0, min(pt.len + dir, 1));
        paintPt(pt);
      });
    }
  };
}

const spiders = many(2, spawn);

addEventListener("pointermove", (e) => {
  spiders.forEach(spider => {
    spider.follow(e.clientX, e.clientY);
  });
});

function setupCanvas() {
  if (w !== innerWidth) w = spiderCanvas.width = innerWidth;
  if (h !== innerHeight) h = spiderCanvas.height = innerHeight;
  
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
}

requestAnimationFrame(function anim(t) {
  setupCanvas();
  t /= 1000;
  spiders.forEach(spider => spider.tick(t));
  requestAnimationFrame(anim);
});

function rnd(x = 1, dx = 0) {
  return Math.random() * x + dx;
}

function drawCircle(x, y, r, color) {
  ctx.beginPath();
  ctx.ellipse(x, y, r, r, 0, 0, PI * 2);
  ctx.fill();
}

function drawLine(x0, y0, x1, y1) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  many(100, (i) => {
    i = (i + 1) / 100;
    let x = lerp(x0, x1, i);
    let y = lerp(y0, y1, i);
    let k = noise(x / 5 + x0, y / 5 + y0) * 2;
    ctx.lineTo(x + k, y + k);
  });
  ctx.stroke();
}

function many(n, f) {
  return [...Array(n)].map((_, i) => f(i));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function noise(x, y, t = 101) {
  let w0 = sin(0.3 * x + 1.4 * t + 2.0 + 2.5 * sin(0.4 * y + -1.3 * t + 1.0));
  let w1 = sin(0.2 * y + 1.5 * t + 2.8 + 2.3 * sin(0.5 * x + -1.2 * t + 0.5));
  return w0 + w1;
}

function pt(x, y) {
  return { x, y };
}

window.addEventListener("load", () => {
  // Spider / Particle init
  spiders.forEach(spider => spider.tick(0));
  // Reveal content if needed
  document.querySelectorAll('.content').forEach(el => el.style.opacity = 1);
});

// Consolidated DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM fully loaded, starting initialization');

  // Initialize Lucide icons
  lucide.createIcons();

  // General animation function
  const animateVisibility = (selector, delay = 500, stagger = 0) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.remove('opacity-0', 'translate-y-5', 'translate-x-[-20px]');
        element.classList.add('opacity-100', 'translate-y-0', 'translate-x-0', 'transition-all', 'duration-1000');
      }, delay + stagger * index);
    });
  };

  // Animate all sections
  const defenseContent = document.querySelector('.defense-content');
  if (defenseContent) {
    setTimeout(() => {
      defenseContent.classList.remove('opacity-0', 'translate-y-5');
      defenseContent.classList.add('opacity-100', 'translate-y-0', 'transition-all', 'duration-1000');
    }, 500);
  }

  animateVisibility('.security-header');
  animateVisibility('.service-item', 500, 300);

  animateVisibility('.achievements-header');
  animateVisibility('.coming-soon', 500); // Added to animate the Coming Soon section

  animateVisibility('.insights-header');
  animateVisibility('.post-item', 500, 300);
  animateVisibility('.view-all-insights', 1000);

  animateVisibility('.contact-header');
  animateVisibility('.contact-form', 500, 300);
  animateVisibility('.contact-info', 500, 300);
  animateVisibility('.social-links', 1500);
  animateVisibility('.copyright', 2000);

  // Load More Projects Button
  const loadMoreBtn = document.getElementById("load-more-projects");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      const hiddenProjects = document.querySelectorAll("#project-grid .project-item.hidden");
      hiddenProjects.forEach((project, i) => {
        setTimeout(() => {
          project.classList.remove("hidden");
          project.classList.add("opacity-100", "translate-y-0");
        }, i * 150);
      });
      loadMoreBtn.parentElement.classList.add("hidden");
    });
  }

  // Load More Posts Button
  const loadMorePostsBtn = document.getElementById("load-more-posts");
  if (loadMorePostsBtn) {
    loadMorePostsBtn.addEventListener("click", () => {
      const hiddenPosts = document.querySelectorAll("#cyber-insights .post-item.hidden");
      hiddenPosts.forEach((post, i) => {
        setTimeout(() => {
          post.classList.remove("hidden");
          post.classList.add("opacity-100", "translate-x-0");
        }, i * 150);
      });
      loadMorePostsBtn.parentElement.classList.add("hidden");
    });
  }

  // Icon Rotation Animation
  const icons = document.querySelectorAll('.rotate-icon');
  icons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      icon.style.animation = 'spin-forward 0.6s linear';
    });
    icon.addEventListener('mouseleave', () => {
      icon.style.animation = 'spin-backward 0.6s linear';
    });
    icon.addEventListener('animationend', () => {
      icon.style.animation = '';
    });
  });

  console.log('Initialization complete');
});

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.add('hidden');
  document.getElementById('mobile-menu-content').classList.add('translate-x-full');
}

// Optional: Close menu if backdrop clicked
document.getElementById('mobile-menu-backdrop')?.addEventListener('click', closeMobileMenu);
document.getElementById('mobile-menu-close')?.addEventListener('click', closeMobileMenu);