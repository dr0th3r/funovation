async function test() {
  const res = await fetch('http://localhost:5173/api/realtime-session', { 
    method: 'POST', 
    headers: {'Content-Type': 'application/json'}, 
    body: '{}' 
  });
  const sessionData = await res.json();
  const ephemeralToken = sessionData.client_secret.value;
  console.log("Got token!", ephemeralToken.substring(0, 10));

  const dummySdp = `v=0\r\no=- 4611731400430051336 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n`;
  const webrtcUrl = 'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17';
  
  const webrtcRes = await fetch(webrtcUrl, {
    method: 'POST',
    body: dummySdp,
    headers: {
      'Authorization': `Bearer ${ephemeralToken}`,
      'Content-Type': 'application/sdp'
    }
  });

  console.log("WebRTC STATUS:", webrtcRes.status);
  console.log("WebRTC RESPONSE:", await webrtcRes.text());
}
test();
