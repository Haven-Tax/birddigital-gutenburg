import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  const { text, analysisType } = await request.json();

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  // Truncate text based on analysis type
  let truncatedText;
  switch (analysisType) {
    case 'character':
    case 'summary':
      truncatedText = text.slice(0, 20000);
      break;
    case 'language':
    case 'sentiment':
      truncatedText = text.slice(0, 7000); // Truncate to ~1000 characters
      break;
    default:
      return NextResponse.json(
        { error: 'Unsupported analysis type' },
        { status: 400 }
      );
  }

  // Define the prompt based on the analysis type
  let prompt: string = '';
  switch (analysisType) {
    case 'character':
      prompt = `Identify the key characters in the following text. Return the response in JSON format as follows:
      {
        "characters": [
          { "name": "Character Name", "description": "Brief description of the character and their role" },
          ...
        ]
      }\n\nText:\n${truncatedText}`;
      break;
    case 'language':
      prompt = `Determine the language of the following text. Return the response as JSON:
      {
        "language": "Language Name"
      }\n\nText:\n${truncatedText}`;
      break;
    case 'sentiment':
      prompt = `Analyze the sentiment of the following text:\n\n${truncatedText}`;
      break;
    case 'summary':
      prompt = `Provide a plot summary of the following text. Return the response as JSON:
      {
        "summary": "Detailed summary of the plot"
      }\n\nText:\n${truncatedText}`;
      break;
  }

  try {
    // Call Groq API with JSON-specific or plain text prompt
    const apiResponse = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-70b-versatile',
      max_tokens: 2000,
      temperature: 0.5,
    });

    const analysisContent = apiResponse.choices[0]?.message?.content || '';

    // Check if the analysis type is 'sentiment' to bypass JSON parsing
    if (analysisType === 'sentiment') {
      // Return plain text response for sentiment
      return NextResponse.json({ result: analysisContent.trim() });
    } else {
      // For other types, parse JSON response
      try {
        const analysisResult = JSON.parse(analysisContent);
        return NextResponse.json({ result: analysisResult });
      } catch (parsingError) {
        console.error('Error parsing JSON response:', parsingError);
        return NextResponse.json(
          { error: 'Invalid JSON response from analysis' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error performing text analysis:', error);
    return NextResponse.json(
      { error: 'Failed to perform text analysis' },
      { status: 500 }
    );
  }
}
