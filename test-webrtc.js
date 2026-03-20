import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("NO OPENAI_API_KEY FOUND IN .ENV");
    return;
  }

  console.log("1. Generating Ephemeral Token...");
  const createRes = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-realtime-preview-2024-12-17',
      voice: 'verse'
    })
  });

  if (!createRes.ok) {
    console.error("FAILED TO GENERATE TOKEN:", await createRes.text());
    return;
  }

  const sessionData = await createRes.json();
  const ephemeralToken = sessionData.client_secret?.value;
  console.log("Token generated:", ephemeralToken.substring(0, 10) + "...");

  console.log("2. Simulating WebRTC Connection...");
  const baseUrl = 'https://api.openai.com/v1/realtime';
  const model = 'gpt-4o-realtime-preview-2024-12-17';
  
  // Send a dummy SDP offer 
  const dummySdp = `v=0\r\no=- 4611731400430051336 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n`;

  const webrtcRes = await fetch(`${baseUrl}?model=${model}`, {
    method: 'POST',
    body: dummySdp,
    headers: {
      'Authorization': `Bearer ${ephemeralToken}`,
      'Content-Type': 'application/sdp'
    }
  });

  const text = await webrtcRes.text();
  console.log("HTTP STATUS:", webrtcRes.status);
  console.log("RESPONSE BODY:", text);
}

test().catch(console.error);
