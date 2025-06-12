interface Props {
  result: {
    constellation: string;
    confidence: number;
  } | null;
  loading: boolean;
}

const ResultSection = ({ result, loading }: Props) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full text-white">
      <h2 className="text-xl font-bold mb-4">Detection Result</h2>

      {loading && (
        <div className="text-yellow-400 animate-pulse">Processing image...</div>
      )}

      {!loading && result && (
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Constellation:</span>{' '}
            {result.constellation}
          </p>
          <p>
            <span className="font-semibold">Confidence:</span>{' '}
            {(result.confidence * 100).toFixed(2)}%
          </p>
        </div>
      )}

      {!loading && !result && (
        <p className="text-gray-400">No result yet. Upload and submit an image.</p>
      )}
    </div>
  );
};

export default ResultSection;
