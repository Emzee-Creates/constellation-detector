interface Props {
  onDetectStars: () => void;
  hasImage: boolean;
  loading: boolean;
  error: string;
}

const Result = ({ onDetectStars, hasImage, loading, error }: Props) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={onDetectStars}
        disabled={!hasImage || loading}
        className={`px-4 py-2 rounded text-white transition ${
          loading
            ? "bg-blue-800 cursor-not-allowed"
            : hasImage
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        {loading ? "Detecting Stars..." : "Detect Stars"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Result;
