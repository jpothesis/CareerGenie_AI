const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const path = require('path');

const auth = new GoogleAuth({
  keyFile: path.join(__dirname, '../config/gemini-service-account.json'),
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

const getGeminiAccessToken = async () => {
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
};

const getGeminiResponse = async (prompt) => {
  try {
    const token = await getGeminiAccessToken();

    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const requestBody = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    const response = await axios.post(url, requestBody, { headers });

    const reply = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error("No response from Gemini API");

    return reply;
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    throw new Error(`Gemini API Error: ${err.response?.data?.error?.message || err.message}`);
  }
};

module.exports = { getGeminiResponse };
