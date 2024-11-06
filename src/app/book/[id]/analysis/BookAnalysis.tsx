'use client';

import { useState } from 'react';

interface BookAnalysisProps {
  id: string;
}

export default function BookAnalysis({ id }: BookAnalysisProps) {
  const [analysisType, setAnalysisType] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
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
          text: 'Sample book content here',
          analysisType: type,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setAnalysisResult(data.result);
      }
    } catch {
      setError('Error performing text analysis');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Analysis for Book ID: {id}</h2>

      <div className="mt-4">
        <button
          onClick={() => handleAnalyze('sentiment')}
          className="mr-2 p-2 bg-blue-500 text-white rounded"
        >
          Sentiment Analysis
        </button>
        <button
          onClick={() => handleAnalyze('character')}
          className="p-2 bg-green-500 text-white rounded"
        >
          Character Identification
        </button>
      </div>

      {error && <div className="text-red-500 mt-4">Error: {error}</div>}

      {analysisResult ? (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Analysis Result:</h3>
          <p>{analysisResult}</p>
        </div>
      ) : (
        analysisType && (
          <p className="mt-4">Loading {analysisType} analysis...</p>
        )
      )}
    </div>
  );
}
