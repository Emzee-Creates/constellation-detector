import { useRef, useState, useEffect } from "react";

interface Star {
  x: number;
  y: number;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  name?: string;
}

interface Props {
  image: File | null;
  setImage: (file: File | null) => void;
  stars: Star[];
  lines: Line[];
}

const ImagePreview = ({ image, setImage, stars, lines }: Props) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 1, height: 1 });
  const [displaySize, setDisplaySize] = useState({ width: 1, height: 1 });

  const imageUrl = image ? URL.createObjectURL(image) : "";

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    const handleLoad = () => {
      setNaturalSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });

      const rect = img.getBoundingClientRect();
      setDisplaySize({
        width: rect.width,
        height: rect.height,
      });
    };

    img.addEventListener("load", handleLoad);
    window.addEventListener("resize", handleLoad);

    return () => {
      img.removeEventListener("load", handleLoad);
      window.removeEventListener("resize", handleLoad);
    };
  }, [image]);

  if (!image) return null;

  const scaleX = (x: number) => (x / naturalSize.width) * displaySize.width;
  const scaleY = (y: number) => (y / naturalSize.height) * displaySize.height;

  return (
    <div className="relative border border-gray-700 rounded-lg overflow-hidden w-full">
      <img
        src={imageUrl}
        ref={imageRef}
        alt="Uploaded"
        className="w-full object-contain"
      />

      {naturalSize.width > 1 && (stars.length > 0 || lines.length > 0) && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute w-full h-full">
            {/* Lines with labels */}
            {lines.map((line, idx) => {
              const x1 = scaleX(line.x1);
              const y1 = scaleY(line.y1);
              const x2 = scaleX(line.x2);
              const y2 = scaleY(line.y2);

              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={idx}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="cyan"
                    strokeWidth="1.5"
                  />
                  {line.name && (
                    <text
                      x={midX}
                      y={midY - 5}
                      fill="white"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {line.name}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Star points */}
            {stars.map((star, index) => (
              <circle
                key={index}
                cx={scaleX(star.x)}
                cy={scaleY(star.y)}
                r={4}
                fill="yellow"
                stroke="black"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
      )}

      <button
        onClick={() => setImage(null)}
        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded"
      >
        Remove
      </button>
    </div>
  );
};

export default ImagePreview;
