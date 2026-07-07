import { useState, useEffect } from 'react';

/**
 * 打字机效果 Hook - 逐字显示文字
 * @param text 要显示的完整文本
 * @param speed 每个字符的显示速度（毫秒）
 * @param delay 开始前的延迟时间（毫秒）
 * @param startTrigger 是否开始打字（用于控制何时触发）
 */
export function useTypewriter(
  text: string,
  speed: number = 30,
  delay: number = 0,
  startTrigger: boolean = true
) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!startTrigger) return;

    // 重置状态
    setDisplayedText('');
    setIsComplete(false);

    let currentIndex = 0;
    let timerId: ReturnType<typeof setTimeout>;

    const startTyping = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
        timerId = setTimeout(startTyping, speed);
      } else {
        setIsComplete(true);
      }
    };

    // 延迟后开始打字
    const delayTimer = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(timerId);
    };
  }, [text, speed, delay, startTrigger]);

  return { displayedText, isComplete };
}
