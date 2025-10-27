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
    const { title, existing_content, style, tone } = await req.json();

    if (!title) {
      throw new Error('Title is required for content generation');
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Create a detailed prompt for blog content generation
    const systemPrompt = `You are a helpful AI assistant that helps students write authentic, supportive blog posts about their mental health journeys. Your role is to:

1. Generate content that feels personal and genuine
2. Focus on mental health topics relevant to college students
3. Include practical insights and coping strategies
4. Maintain a supportive, non-judgmental tone
5. Encourage community connection and vulnerability
6. Avoid clinical language - write from a peer perspective

Style: ${style || 'personal_journey'}
Tone: ${tone || 'supportive'}

Generate content that students can relate to and find helpful in their own mental health journeys.`;

    const userPrompt = `Please help me expand on this blog post:

Title: "${title}"
${existing_content ? `Existing content: "${existing_content}"` : ''}

Generate additional content that:
- Continues the narrative authentically
- Includes specific, relatable examples
- Offers practical tips or insights
- Maintains a personal, student-to-student voice
- Encourages others to share their experiences
- Is around 300-500 words

Focus on making this feel like it's written by a real student sharing their genuine experience.`;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: userPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedContent = data.candidates[0].content.parts[0].text;

    return new Response(
      JSON.stringify({ 
        success: true, 
        content: generatedContent,
        metadata: {
          style,
          tone,
          word_count: generatedContent.split(' ').length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-blog-content function:', error);
    
    const { title } = await req.json().catch(() => ({ title: 'Mental Health Journey' }));
    const fallbackContent = generateFallbackContent(title);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        content: fallbackContent,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: true 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateFallbackContent(title: string): string {
  const commonThemes = {
    anxiety: `Dealing with anxiety has been one of the most challenging aspects of my college experience, but I've learned so much about myself through this journey.

The racing thoughts, the physical symptoms, the constant worry - if you're reading this and nodding along, you're not alone. What I've discovered is that small, consistent steps make a huge difference.

One thing that really helped me was creating a "worry time" - setting aside 15 minutes each day to acknowledge my anxious thoughts, then consciously choosing to focus on the present moment for the rest of the day.

I've also learned that it's okay to have bad days. Progress isn't linear, and healing isn't a destination - it's an ongoing journey of self-compassion and growth.`,

    depression: `The heaviness that comes with depression is something that's hard to explain to someone who hasn't experienced it. Some days, even the simplest tasks feel overwhelming.

But I want to share what I've learned: small victories count. Getting out of bed, taking a shower, eating a meal - these aren't insignificant. They're acts of self-care and resistance against the darkness.

I've found that connecting with others, even when I don't feel like it, makes a difference. This community has shown me that vulnerability is actually a form of strength.

If you're in a similar place, please know that your feelings are valid, and there are people who care about your wellbeing - including me.`,

    stress: `College stress is real, and it affects all of us differently. Between academic pressure, financial concerns, and social expectations, it's no wonder so many of us feel overwhelmed.

What I've learned through therapy and personal experience is that stress management isn't about eliminating stress entirely - it's about developing healthy coping mechanisms.

Time blocking has been a game-changer for me. Instead of feeling like everything is urgent, I allocate specific times for studying, socializing, and self-care. It's not perfect, but it helps me feel more in control.

Remember: it's okay to ask for help, to take breaks, and to prioritize your mental health alongside your academic goals.`
  };

  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('anxiety')) return commonThemes.anxiety;
  if (titleLower.includes('depression') || titleLower.includes('sad')) return commonThemes.depression;
  if (titleLower.includes('stress')) return commonThemes.stress;
  
  // Generic fallback
  return `This journey hasn't been easy, but I want to share what I've learned along the way. Sometimes the smallest steps forward can make the biggest difference in our mental health journey.

I've discovered that being open about our struggles not only helps us heal but also creates space for others to share their own experiences. Every story matters, and every voice in this community contributes to our collective healing.

Through the challenges I've faced, I've learned the importance of:
- Taking things one day at a time
- Celebrating small victories
- Reaching out for support when needed
- Practicing self-compassion

I hope my experience can offer some comfort or insight to anyone going through similar challenges. Remember, you're not alone in this journey.`;
}