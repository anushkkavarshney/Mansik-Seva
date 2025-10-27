import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    
    if (!message?.trim()) {
      throw new Error('Message is required');
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    console.log('Processing chat message:', message);

    // Prepare conversation history for Gemini
    const contents = [
      {
        role: "user",
        parts: [{
          text: `You are a compassionate AI wellness assistant for students. You provide mental health support, listening skills, and helpful resources. Keep responses warm, supportive, and under 200 words. Focus on:
          - Emotional validation and empathy
          - Practical coping strategies
          - Encouraging professional help when needed
          - Being non-judgmental and supportive
          
          Current message: ${message}`
        }]
      }
    ];

    // Add conversation history if available
    conversationHistory.forEach((msg: any) => {
      if (msg.sender === 'user') {
        contents.push({
          role: "user",
          parts: [{ text: msg.text }]
        });
      } else if (msg.sender === 'bot') {
        contents.push({
          role: "model",
          parts: [{ text: msg.text }]
        });
      }
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 300,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response:', data);

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I'm here to support you. Could you tell me more about how you're feeling?";

    return new Response(JSON.stringify({ 
      response: aiResponse,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-gemini function:', error);
    
    // Provide a fallback response for better user experience
    const fallbackResponse = "I'm here to listen and support you. While I'm having technical difficulties right now, please know that your feelings are valid and you're not alone. Would you like to try again, or would you prefer to explore some self-care resources?";
    
    return new Response(JSON.stringify({ 
      response: fallbackResponse,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 200, // Return 200 to provide fallback response
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});