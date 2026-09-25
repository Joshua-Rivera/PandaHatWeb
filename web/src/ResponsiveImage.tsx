import type { ImgHTMLAttributes } from "react";
import imageVariants from "./image-variants.json";

type ImageVariant = { src: string; width: number; height: number };
const images: Record<string, { width: number; height: number; variants: ImageVariant[] }> = imageVariants;

export function ResponsiveImage({ src, sizes, ...props }: ImgHTMLAttributes<HTMLImageElement> & { src: string; sizes: string }) {
  const image = images[src];
  return <img {...props} src={src} sizes={sizes}
    srcSet={image?.variants.map(variant => `${variant.src} ${variant.width}w`).join(", ")}
    width={image?.width ?? props.width} height={image?.height ?? props.height}
    decoding="async" />;
}
