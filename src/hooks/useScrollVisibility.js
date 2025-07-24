import { useEffect, useState } from 'react';

export default function useScrollVisibility(containerId = 'main-container') {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const scrollContainer = document.getElementById(containerId);
    if (!scrollContainer) return;

    let lastScrollTop = scrollContainer.scrollTop;
    let ticking = false;

    const updateScroll = () => {
      const currentY = scrollContainer.scrollTop;
      const isScrollingDown = currentY > lastScrollTop + 10;
      const isScrollingUp = currentY < lastScrollTop - 10;

      if (isScrollingDown) {
        setVisible(false);
      } else if (isScrollingUp) {
        setVisible(true);
      }

      lastScrollTop = currentY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [containerId]);

  return visible;
}