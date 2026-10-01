 const GROQ_API_URL =
  "https://api.groq.com/openai/v1/chat/completions";

const MODEL =
  "llama-3.1-8b-instant";


exports.handler = async function(event) {

  /* =========================================
     ALLOW BROWSER PREFLIGHT REQUEST
  ========================================= */

  if (event.httpMethod === "OPTIONS") {

    return {
      statusCode: 204,

      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Content-Type",
        "Access-Control-Allow-Methods":
          "POST, OPTIONS"
      },

      body: ""
    };

  }


  /* =========================================
     ONLY ACCEPT POST
  ========================================= */

  if (event.httpMethod !== "POST") {

    return {
      statusCode: 405,

      headers: {
        "Content-Type":
          "application/json",
        "Access-Control-Allow-Origin":
          "*"
      },

      body: JSON.stringify({
        error:
          "Method not allowed."
      })
    };

  }


  /* =========================================
     CHECK API KEY
  ========================================= */

  const apiKey =
    process.env.GROQ_API_KEY;


  if (!apiKey) {

    return {
      statusCode: 500,

      headers: {
        "Content-Type":
          "application/json",
        "Access-Control-Allow-Origin":
          "*"
      },

      body: JSON.stringify({
        error:
          "GROQ_API_KEY is not configured in Netlify."
      })
    };

  }


  /* =========================================
     READ USER MESSAGE
  ========================================= */

  let body;

  try {

    body =
      JSON.parse(
        event.body || "{}"
      );

  } catch (error) {

    return {
      statusCode: 400,

      headers: {
        "Content-Type":
          "application/json",
        "Access-Control-Allow-Origin":
          "*"
      },

      body: JSON.stringify({
        error:
          "Invalid request body."
      })
    };

  }


  const message =
    typeof body.message === "string"
      ? body.message.trim()
      : "";


  if (!message) {

    return {
      statusCode: 400,

      headers: {
        "Content-Type":
          "application/json",
        "Access-Control-Allow-Origin":
          "*"
      },

      body: JSON.stringify({
        error:
          "Please provide a message."
      })
    };

  }


  /* =========================================
     CSC AI ACADEMY AI INSTRUCTIONS
  ========================================= */

  const systemPrompt = `
You are the official AI Assistant for CSC AI ACADEMY.

Academy:
CSC AI ACADEMY

Tagline:
"Learn. Build. Create."

Slogan:
"Intelligence is the new superpower."

Founder and Owner:
Chris Vincent

WhatsApp / Support:
08120897686

WhatsApp link:
https://wa.me/2348120897686


COURSES:

1. AI Tools
2. AI App Development
3. Website with AI
4. Cinematic AI Video
5. AI Content Creation
6. AI Business


CURRENT PLANS:

STARTER — ₦5,000
Includes:
- AI Tools

BASIC — ₦10,000
Includes:
- AI Tools
- AI App Development
- Website with AI

STANDARD — ₦20,000
Includes:
- AI Tools
- AI App Development
- Website with AI
- Cinematic AI Video
- AI Content Creation
- AI Business


IMPORTANT:

There are currently ONLY three plans:
₦5,000
₦10,000
₦20,000

Do not tell users that ₦50,000 or ₦100,000 plans are available.


PAYMENT LINKS:

₦5,000:
https://selar.com/5e16655d91

₦10,000:
https://selar.com/716p7u4a6b

₦20,000:
https://selar.com/4d167101ig


YOUR ROLE:

Help visitors understand CSC AI ACADEMY.

You can explain:
- Courses
- Pricing
- Payment options
- AI learning
- Certificates
- Dashboard
- Contacting the academy
- General questions about the academy

Be friendly, clear and helpful.

Keep answers reasonably short.

Do not invent courses, prices or academy policies.

If someone wants to contact the academy, provide:
08120897686

If someone asks how to pay, explain the appropriate plan and provide the correct Selar payment link.

If someone asks about something unrelated to CSC AI ACADEMY, politely explain that you are the academy's assistant and guide them back to academy-related questions.
`;


  /* =========================================
     CALL GROQ
  ========================================= */

  try {

    const response =
      await fetch(
        GROQ_API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "Authorization":
              "Bearer " + apiKey
          },

          body: JSON.stringify({

            model: MODEL,

            messages: [

              {
                role: "system",
                content: systemPrompt
              },

              {
                role: "user",
                content: message
              }

            ],

            temperature: 0.5,

            max_tokens: 500

          })
        }
      );


    const data =
      await response.json();


    /* =========================================
       GROQ ERROR
    ========================================= */

    if (!response.ok) {

      console.error(
        "Groq API error:",
        data
      );


      return {
        statusCode: 502,

        headers: {
          "Content-Type":
            "application/json",
          "Access-Control-Allow-Origin":
            "*"
        },

        body: JSON.stringify({
          error:
            "The AI service could not respond right now."
        })
      };

    }


    /* =========================================
       GET AI RESPONSE
    ========================================= */

    const reply =
      data?.choices?.[0]?.message?.content;


    if (!reply) {

      return {
        statusCode: 502,

        headers: {
          "Content-Type":
            "application/json",
          "Access-Control-Allow-Origin":
            "*"
        },

        body: JSON.stringify({
          error:
            "The AI returned an empty response."
        })
      };

    }


    /* =========================================
       SEND RESPONSE TO WEBSITE
    ========================================= */

    return {
      statusCode: 200,

      headers: {
        "Content-Type":
          "application/json",

        "Access-Control-Allow-Origin":
          "*"
      },

      body: JSON.stringify({
        reply: reply.trim()
      })
    };


  } catch (error) {

    console.error(
      "AI function error:",
      error
    );


    return {
      statusCode: 500,

      headers: {
        "Content-Type":
          "application/json",

        "Access-Control-Allow-Origin":
          "*"
      },

      body: JSON.stringify({
        error:
          "Unable to connect to the AI service."
      })
    };

  }

};