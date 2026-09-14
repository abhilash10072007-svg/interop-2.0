import { useEffect, useState, useRef } from 'react';

export function useScrollAnimation() {
  const [scrollDirection, setScrollDirection] = useState('none');
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // 1. Intersection Observer for Scroll-Reveal
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    const elementsToAnimate = document.querySelectorAll('.scroll-reveal');
    elementsToAnimate.forEach((el) => observer.observe(el));

    // 2. Scroll Direction & Progress Listener
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? (currentScrollY / totalScroll) * 100 : 0;
      setScrollProgress(progress);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY <= 15) {
            setScrollDirection('top');
            document.body.classList.remove('is-scrolling-up', 'is-scrolling-down');
          } else if (currentScrollY < lastScrollY.current - 4) {
            // Definite upward scroll
            setScrollDirection('up');
            document.body.classList.add('is-scrolling-up');
            document.body.classList.remove('is-scrolling-down');
          } else if (currentScrollY > lastScrollY.current + 4) {
            // Definite downward scroll
            setScrollDirection('down');
            document.body.classList.remove('is-scrolling-up');
            document.body.classList.add('is-scrolling-down');
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { scrollDirection, isScrollingUp: scrollDirection === 'up', scrollProgress };
}
