import { useRef, useState } from "react";

interface Props {
  setImage: (file: File | null) => void;
}

const UploadForm = ({ setImage }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
        isDragging
          ? "border-blue-400 bg-gray-700"
          : "border-gray-600 bg-gray-800"
      }`}
      onClick={() => inputRef.current?.click()}
    >
      <p className="text-sm text-gray-400">
        Drag and drop an image here, or{" "}
        <span className="text-blue-400 underline">click to upload</span>
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadForm;
