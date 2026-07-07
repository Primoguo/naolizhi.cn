import { useRef, useCallback } from "react";

/**
 * 给卡片添加鼠标跟随光晕效果（聚光灯）
 * 将 spotRef 绑定到卡片容器，mousemove 时自动更新 CSS 变量 --x / --y
 * 在 CSS 中用 radial-gradient(circle at var(--x) var(--y), ...) 实现光晕
 */
export function useSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = spotRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }, []);

  return { spotRef, onMouseMove };
}
