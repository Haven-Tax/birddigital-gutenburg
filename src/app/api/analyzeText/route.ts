import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { text, analysisType } = await request.json();

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  // Here, call the selected LLM API provider
  try {
    const apiResponse = await fetch(
      'https://api.your-llm-provider.com/analyze',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer YOUR_API_KEY`, // Replace with actual API key
        },
        body: JSON.stringify({ text, analysisType }),
      }
    );

    const analysisResult = await apiResponse.json();

    return NextResponse.json({ result: analysisResult });
  } catch (error) {
    console.error('Error performing text analysis:', error);
    return NextResponse.json(
      { error: 'Failed to perform text analysis' },
      { status: 500 }
    );
  }
}
