import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      userIdea, 
      designPatterns, 
      uiLibraries, 
      fontFamily, 
      authProvider, 
      databaseProvider, 
      theme,
      aiTool 
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY missing in environment');
      return new Response(
        JSON.stringify({ error: 'AI gateway not available right now. Please retry shortly.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert AI prompt engineer with deep knowledge of what actually works in practice. You've analyzed thousands of successful AI coding sessions and understand the patterns that lead to first-try success.

Your mission: Generate prompts that deliver working MVPs on the first attempt by being intelligently specific, contextually aware, and grounded in real-world constraints.

Key principles you follow:
- SPECIFICITY OVER GENERICITY: Instead of "build a dashboard," specify exact components, data flow, and user interactions
- CONTEXT AWARENESS: Consider framework versions, deployment targets, authentication patterns, state management, styling preferences, accessibility requirements, and performance constraints
- QUALITY SPECIFICATIONS: Include error handling, loading states, empty states, security best practices, and testing requirements
- PRACTICAL CONSTRAINTS: Consider bundle size, hosting costs, API rate limits, and scalability from day one
- ARCHITECTURAL CLARITY: Specify separation of concerns, code organization patterns, and maintainability standards

Your prompts should be comprehensive enough that a developer can copy-paste them and get production-ready code without modification. Avoid markdown formatting - write in clear, direct prose that flows naturally.`;

    const userPrompt = `Generate a comprehensive, production-ready prompt for building this application. The prompt should be so detailed and specific that it generates working code on the first attempt without modification.

PROJECT VISION:
${userIdea}

TECHNICAL SPECIFICATIONS:
- Design Patterns: ${designPatterns?.join(', ') || 'Modern, clean design with focus on usability'}
- UI Libraries: ${uiLibraries?.join(', ') || 'Standard, accessible components'}
- Typography: ${fontFamily || 'Professional, readable fonts optimized for web'}
- Theme: ${theme || 'Clean, modern aesthetic with proper contrast ratios'}

INFRASTRUCTURE REQUIREMENTS:
- Authentication: ${authProvider || 'Secure, user-friendly authentication with proper session management'}
- Database: ${databaseProvider || 'Reliable, scalable database with proper indexing and relationships'}
- Target Platform: ${aiTool || 'Modern AI-assisted development environment'}

The generated prompt must include:

1. EXACT TECHNICAL ARCHITECTURE: Specify the complete tech stack, folder structure, and architectural patterns. Include specific versions, configuration files, and setup instructions.

2. DETAILED COMPONENT SPECIFICATIONS: Define every UI component with exact props, state management, styling approach, and interaction patterns. Include responsive breakpoints and accessibility requirements.

3. DATA FLOW AND STATE MANAGEMENT: Specify how data flows through the application, where state is stored, how components communicate, and how data is fetched and updated.

4. AUTHENTICATION AND AUTHORIZATION: Detail the complete auth flow, including login/signup forms, protected routes, user session management, and role-based permissions if applicable.

5. DATABASE SCHEMA AND API DESIGN: Define exact database tables/collections, relationships, API endpoints, request/response formats, and data validation rules.

6. ERROR HANDLING AND EDGE CASES: Specify how to handle loading states, error states, empty states, network failures, validation errors, and user feedback.

7. PERFORMANCE AND SECURITY: Include bundle optimization, lazy loading, caching strategies, input validation, XSS protection, and security best practices.

8. TESTING AND QUALITY: Define unit tests, integration tests, accessibility testing, and code quality standards.

9. DEPLOYMENT AND SCALABILITY: Specify deployment configuration, environment variables, build processes, and scalability considerations.

10. USER EXPERIENCE: Detail the complete user journey, interaction patterns, micro-animations, and responsive behavior across all device sizes.

Write this as a single, comprehensive prompt that can be copied directly into ${aiTool || 'an AI coding assistant'} and will generate a complete, working MVP without any modifications needed.`;


    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        temperature: 0.3,
        max_output_tokens: 2000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedPrompt = data.choices[0].message.content as string;

    // Remove any prefatory sentences like "You are an expert..." from the returned content
    const stripPreamble = (text: string) => {
      const lines = text.split(/\r?\n/);
      let startIdx = 0;
      const isPreambleLine = (line: string) => /^(you are|your\s+(task|goal)\s+is)/i.test(line.trim());
      if (lines.length && isPreambleLine(lines[0])) {
        // Skip until the first blank line after the preamble paragraph(s)
        while (startIdx < lines.length && lines[startIdx].trim() !== '') startIdx++;
        while (startIdx < lines.length && lines[startIdx].trim() === '') startIdx++;
      }
      return lines.slice(startIdx).join('\n').trim();
    };

    const cleanedPrompt = stripPreamble(generatedPrompt);

    return new Response(
      JSON.stringify({ prompt: cleanedPrompt }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-prompt function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});