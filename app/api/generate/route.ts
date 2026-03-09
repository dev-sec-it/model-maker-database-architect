import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { DatabaseSchema, Table, Column, Relation } from '@/lib/types';

export const maxDuration = 60; // Max execution time

export async function POST(req: Request) {
  try {
    const { prompt, apiKey } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey || process.env.GEMINI_API_KEY });

    const systemPrompt = `You are an expert software architect and database designer.
Given the user's software description, design a complete relational database schema.
Your output MUST be a valid JSON object matching this structure EXACTLY. Do NOT include markdown blocks, just raw JSON.
{
  "tables": [
    {
      "name": "table_name_snake_case",
      "columns": [
        {
          "name": "column_name",
          "type": "string|integer|boolean|float|date|datetime|text|json",
          "isPrimary": boolean,
          "isNullable": boolean,
          "isUnique": boolean,
          "defaultValue": "string or null"
        }
      ]
    }
  ],
  "relations": [
    {
      "fromTable": "string",
      "fromColumn": "string",
      "toTable": "string",
      "toColumn": "string",
      "type": "one-to-one|one-to-many|many-to-many|many-to-one"
    }
  ]
}

Ensure that:
1. Every table has a primary key (usually 'id' of type 'integer' or 'string').
2. Foreign keys match their corresponding primary keys in type.
3. You create sensible relationships based on standard practices.
4. If the prompt is vague, infer the necessary tables for a standard application of that type.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      }
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error("No response from Gemini");

    const schema: DatabaseSchema = JSON.parse(textResponse);
    return NextResponse.json(schema);
  } catch (error: any) {
    console.error('Error generating schema:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate schema' }, { status: 500 });
  }
}
