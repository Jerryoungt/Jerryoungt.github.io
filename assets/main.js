(() => {
  const root = document.documentElement;
  const themeButtons = document.querySelectorAll('[data-theme-toggle]');

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    themeButtons.forEach((button) => {
      const nextTheme = theme === 'dark' ? '浅色' : '深色';
      button.setAttribute('aria-label', `切换到${nextTheme}主题`);
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    });
  };

  applyTheme(root.dataset.theme || 'light');

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      try {
        localStorage.setItem('jerryoungt-theme', nextTheme);
      } catch (_) {}
    });
  });

  const progress = document.querySelector('.reading-progress');
  const article = document.querySelector('.post-body');

  if (progress && article) {
    let ticking = false;
    const updateProgress = () => {
      const start = article.offsetTop;
      const distance = article.offsetHeight - window.innerHeight;
      const value = distance > 0 ? Math.min(1, Math.max(0, (window.scrollY - start) / distance)) : 0;
      progress.style.transform = `scaleX(${value})`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const archiveItems = [...document.querySelectorAll('[data-category]')];
  const postCount = document.querySelector('[data-post-count]');
  const emptyState = document.querySelector('[data-empty-state]');

  if (filterButtons.length && archiveItems.length) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        let visibleCount = 0;

        filterButtons.forEach((item) => {
          const active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        });

        archiveItems.forEach((item) => {
          const visible = filter === 'all' || item.dataset.category === filter;
          item.hidden = !visible;
          if (visible) visibleCount += 1;
        });

        if (postCount) postCount.textContent = `${visibleCount} 篇文章`;
        if (emptyState) emptyState.hidden = visibleCount !== 0;
      });
    });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('has-motion');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    document.querySelectorAll('.section-heading, .featured-post, .now-panel, .post-row, .principle-grid article').forEach((element) => {
      element.classList.add('reveal');
      observer.observe(element);
    });
  }
})();
