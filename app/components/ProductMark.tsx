"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

export default function ProductMark({
  className = "",
}: {
  className?: string;
}) {
  const [isTouchWinking, setIsTouchWinking] = useState(false);
  const touchWinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerTouchWink = useCallback(
    (event: ReactPointerEvent<HTMLSpanElement>) => {
      if (event.pointerType === "mouse") return;

      if (touchWinkTimer.current) {
        clearTimeout(touchWinkTimer.current);
      }

      setIsTouchWinking(true);
      touchWinkTimer.current = setTimeout(() => {
        setIsTouchWinking(false);
        touchWinkTimer.current = null;
      }, 720);
    },
    [],
  );

  useEffect(
    () => () => {
      if (touchWinkTimer.current) {
        clearTimeout(touchWinkTimer.current);
      }
    },
    [],
  );

  return (
    <span
      className={`product-mark${isTouchWinking ? " is-touch-winking" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      onPointerUp={triggerTouchWink}
    >
      <Image
        className="product-mark-image product-mark-image-open"
        src="/images/aiwork-assistant-open.webp"
        alt=""
        width={1024}
        height={1024}
        decoding="async"
        draggable="false"
        loading="eager"
        unoptimized
      />
      <Image
        className="product-mark-image product-mark-image-wink"
        src="/images/aiwork-assistant-wink.webp"
        alt=""
        width={1024}
        height={1024}
        decoding="async"
        draggable="false"
        loading="eager"
        unoptimized
      />
    </span>
  );
}
