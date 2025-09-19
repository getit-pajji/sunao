// Step 1: Import all the necessary tools
const express = require('express');
const { VoiceResponse } = require('twilio').twiml;
require('dotenv').config();

// Step 2: Set up our web server
const app = express();
app.use(express.urlencoded({ extended: true }));

// =================================================================
// SECURELY GET YOUR TWILIO & GEMINI CREDENTIALS FROM ENVIRONMENT VARIABLES
// =================================================================
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID; 
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const geminiAPIKey = process.env.GEMINI_API_KEY; 
// =================================================================

// This is our function to call the Gemini AI "Brain"
async function callGemini(prompt) {
    const geminiAPIUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiAPIKey}`;
    try {
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        const response = await fetch(geminiAPIUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) { return "Maaf kijiye, AI se jawab nahi mil paya."; }
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        return text.replace(/[*#]/g, '');
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "AI se sampark karne mein dikkat aa rahi hai.";
    }
}


// --- The Main Logic for the Phone Call ---
app.post('/api/voice', (req, res) => {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    input: 'speech',
    action: '/api/handle-speech',
    language: 'hi-IN',
    speechTimeout: 'auto',
  });
  gather.say({ language: 'hi-IN', voice: 'alice' }, 'नमस्ते, कृषि रक्षक में आपका स्वागत है। कृपया अपनी फसल की समस्या बताएं।');
  twiml.redirect('/api/voice');
  res.type('text/xml');
  res.send(twiml.toString());
});

app.post('/api/handle-speech', async (req, res) => {
  const twiml = new VoiceResponse();
  const farmerProblem = req.body.SpeechResult;

  if (farmerProblem) {
    twiml.say({ language: 'hi-IN', voice: 'alice' }, 'ठीक है, मैं आपकी समस्या की जांच कर रहा हूं। कृपया प्रतीक्षा करें।');
    const prompt = `You are a helpful agricultural AI assistant speaking in simple Hindi. A farmer has this problem: "${farmerProblem}". Analyze the problem and provide a simple, actionable solution in Hindi.`;
    const geminiResponseText = await callGemini(prompt);
    twiml.say({ language: 'hi-IN', voice: 'alice' }, geminiResponseText);
    twiml.say({ language: 'hi-IN', voice: 'alice' }, 'अधिक जानकारी के लिए, आप फिर से कॉल कर सकते हैं। धन्यवाद!');
  } else {
    twiml.redirect('/api/voice');
  }
  
  twiml.hangup();
  res.type('text/xml');
  res.send(twiml.toString());
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running and listening on port ${port}`);
});
