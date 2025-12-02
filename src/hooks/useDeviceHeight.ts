// src/hooks/useDeviceHeight.ts
import {useState, useEffect} from 'react';

export function useDeviceHeight() {
  const getHeight = () =>
    window.visualViewport?.height ||
    window.innerHeight ||
    document.documentElement.clientHeight;

  const [height, setHeight] = useState(getHeight());

  useEffect(() => {
    const onResize = () => setHeight(getHeight());

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    window.visualViewport?.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
    };
  }, []);

  return height;
}
