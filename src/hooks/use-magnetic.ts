import { useRef, useCallback } from "react";

/**
 * 磁性按钮效果：鼠标靠近时按钮被吸引向鼠标方向偏移
 * @param strength 磁力强度，默认 0.3（越大偏移越明显）
 */
export function useMagnetic(strength = 0.3) {
  const magRef = useRef<HTMLAnchorElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = magRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    const el = magRef.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  }, []);

  return { magRef, onMouseMove, onMouseLeave };
}
