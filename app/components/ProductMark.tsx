import Image from "next/image";

export default function ProductMark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      className={`product-mark ${className}`.trim()}
      aria-hidden="true"
    >
      <Image
        src="/images/aiwork-wink-assistant.webp"
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
