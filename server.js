    const express = require('express');
    const { VoiceResponse } = require('twilio').twiml;
    require('dotenv').config();

    const app = express();
    app.use(express.urlencoded({ extended: true }));

    const twilioAccountSid = ACa2f6f16a4fc46da73c04cfb081ae4ef8; 
    const twilioAuthToken = babeb96f04170a82362e78903c3923d5;
    const geminiAPIKey = AIzaSyCOAj-NRpl0PtRlo869u19gQkKO3cb_XNs; 

    async function callGemini(prompt) {
        // Gemini API call logic here...
    }

    app.post('/api/voice', (req, res) => {
      // Call start logic...
    });

    app.post('/api/handle-speech', async (req, res) => {
        const farmerProblem = req.body.SpeechResult;
        console.log(`[Call Log] Farmer asked: "${farmerProblem}"`); // Storing call data
        // Rest of the logic to call Gemini and respond...
    });

    const port = 8080;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    

