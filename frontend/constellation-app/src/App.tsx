import { useState } from "react";
import Header from "./components/header";
import UploadForm from "./components/UploadForm";
import ImagePreview from "./components/ImagePreview";
import Result from "./components/Result";

interface Star {
  x: number;
  y: number;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDetectStars = async () => {
    if (!image) return;
    setLoading(true);
    setError("");
    setStars([]);
    setLines([]);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/detect-stars", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to detect constellations");
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.status === "success") {
        setLines(data.constellation_lines);

        const starPoints = data.constellation_lines.flatMap((line: Line) => [
          { x: line.x1, y: line.y1 },
          { x: line.x2, y: line.y2 },
        ]);

        const uniqueStars: Star[] = Array.from(
          new Map<string, Star>(
            starPoints.map((p: Star) => [`${p.x},${p.y}`, p])
          ).values()
        );

        setStars(uniqueStars);
      } else {
        throw new Error(data.message || "Constellation detection failed");
      }
    } catch (err) {
      setError("Error detecting constellations.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 py-6">
      <Header />
      <main className="w-full max-w-3xl flex flex-col gap-6 mt-6">
        <UploadForm setImage={setImage} />
        <ImagePreview image={image} setImage={setImage} stars={stars} lines={lines} />
        <Result
          onDetectStars={handleDetectStars}
          hasImage={!!image}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  );
}

export default App;
