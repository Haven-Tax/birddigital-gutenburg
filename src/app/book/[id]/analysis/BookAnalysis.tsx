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
        // For sentiment, expect a plain text string instead of structured JSON
        if (type === 'sentiment') {
          setAnalysisResult({ sentiment: data.result });
        } else {
          setAnalysisResult(data.result); // JSON response for other types
        }
      }
    } catch {
      setError('Error performing text analysis');
    }
  };

  // Render structured JSON results based on analysis type
  const renderResult = () => {
    if (!analysisResult) return null;

    switch (analysisType) {
      case 'character':
        return (
          <div>
            <h3 className="text-lg font-semibold">Key Characters:</h3>
            <ul className="list-disc ml-6 space-y-2">
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
            <h3 className="text-lg font-semibold">Detected Language:</h3>
            <p>{analysisResult.language || 'Unknown'}</p>
          </div>
        );
      case 'sentiment':
        return (
          <div>
            <h3 className="text-lg font-semibold">Sentiment Analysis:</h3>
            <p>
              {analysisResult.sentiment ||
                'No sentiment information available.'}
            </p>
          </div>
        );
      case 'summary':
        return (
          <div>
            <h3 className="text-lg font-semibold">Plot Summary:</h3>
            <p>{analysisResult.summary || 'No summary available.'}</p>
          </div>
        );
      default:
        return <p>No result available.</p>;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Analysis for Book ID: {id}</h2>

      <div className="mt-4 space-y-2">
        <button
          onClick={() => handleAnalyze('character')}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Identify Key Characters
        </button>
        <button
          onClick={() => handleAnalyze('language')}
          className="p-2 bg-purple-500 text-white rounded"
        >
          Language Detection
        </button>
        <button
          onClick={() => handleAnalyze('sentiment')}
          className="p-2 bg-green-500 text-white rounded"
        >
          Sentiment Analysis
        </button>
        <button
          onClick={() => handleAnalyze('summary')}
          className="p-2 bg-orange-500 text-white rounded"
        >
          Plot Summary
        </button>
      </div>

      {error && <div className="text-red-500 mt-4">Error: {error}</div>}

      {analysisResult ? (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Analysis Result:</h3>
          {renderResult()}
        </div>
      ) : (
        analysisType && (
          <p className="mt-4">Loading {analysisType} analysis...</p>
        )
      )}
    </div>
  );
}
