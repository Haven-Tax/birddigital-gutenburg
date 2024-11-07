import { useState } from 'react';

interface BookAnalysisProps {
  id: string;
  bookContent: string;
}

interface Character {
  name: string;
  description: string;
}

interface AnalysisResult {
  characters?: Character[];
  language?: string;
  sentiment?: string; // Plain text response for sentiment
  summary?: string;
}

export default function BookAnalysis({ id, bookContent }: BookAnalysisProps) {
  const [analysisType, setAnalysisType] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (type: string) => {
    setAnalysisType(type);
    setAnalysisResult(null);
    setError(null);

    try {
      const response = await fetch(`/api/analyzeText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: bookContent,
          analysisType: type,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        if (type === 'sentiment') {
          setAnalysisResult({ sentiment: data.result });
        } else {
          setAnalysisResult(data.result);
        }
      }
    } catch {
      setError('Error performing text analysis');
    }
  };

  const renderResult = () => {
    if (!analysisResult) return null;

    switch (analysisType) {
      case 'character':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-200">
              Key Characters:
            </h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              {analysisResult.characters?.map((character, index) => (
                <li key={index}>
                  <strong>{character.name}:</strong> {character.description}
                </li>
              )) || <p>No characters found.</p>}
            </ul>
          </div>
        );
      case 'language':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-200">
              Detected Language:
            </h3>
            <p className="text-gray-300">
              {analysisResult.language || 'Unknown'}
            </p>
          </div>
        );
      case 'sentiment':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-200">
              Sentiment Analysis:
            </h3>
            <p className="text-gray-300">
              {analysisResult.sentiment ||
                'No sentiment information available.'}
            </p>
          </div>
        );
      case 'summary':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-200">
              Plot Summary:
            </h3>
            <p className="text-gray-300">
              {analysisResult.summary || 'No summary available.'}
            </p>
          </div>
        );
      default:
        return <p>No result available.</p>;
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-800 text-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-100 mb-4">
        Analysis for Book ID: {id}
      </h2>

      <div className="flex flex-wrap gap-4 mt-4">
        <button
          onClick={() => handleAnalyze('character')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors"
        >
          Identify Key Characters
        </button>
        <button
          onClick={() => handleAnalyze('language')}
          className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition-colors"
        >
          Language Detection
        </button>
        <button
          onClick={() => handleAnalyze('sentiment')}
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition-colors"
        >
          Sentiment Analysis
        </button>
        <button
          onClick={() => handleAnalyze('summary')}
          className="px-4 py-2 bg-orange-600 text-white rounded-md shadow-md hover:bg-orange-700 transition-colors"
        >
          Plot Summary
        </button>
      </div>

      {error && <div className="text-red-500 mt-4">Error: {error}</div>}

      {analysisResult ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-200">
            Analysis Result:
          </h3>
          {renderResult()}
        </div>
      ) : (
        analysisType && (
          <p className="mt-4 text-gray-400">
            Loading {analysisType} analysis...
          </p>
        )
      )}
    </div>
  );
}
