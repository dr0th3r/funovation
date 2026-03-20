async function test() {
  console.log("1. Fetching Ephemeral Token...");
  const res = await fetch('http://localhost:5173/api/realtime-session', { 
    method: 'POST', 
    headers: {'Content-Type': 'application/json'}, 
    body: '{}' 
  });
  if(!res.ok) {
     console.log("Backend failed:", await res.text());
     return;
  }
  const sessionData = await res.json();
  const ephemeralToken = sessionData.client_secret?.value;
  console.log("Got token!", ephemeralToken.substring(0, 10));

  console.log("2. Sending valid Audio SDP Offer to OpenAI...");
  const sdpWithAudio = `v=0\r\no=- 4611731400430051336 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:dummy\r\na=ice-pwd:dummy\r\na=fingerprint:sha-256 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00\r\na=setup:actpass\r\na=mid:0\r\na=sendrecv\r\na=rtpmap:111 opus/48000/2\r\n`;

  const webrtcUrl = 'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17';
  
  const webrtcRes = await fetch(webrtcUrl, {
    method: 'POST',
    body: sdpWithAudio,
    headers: {
      'Authorization': `Bearer ${ephemeralToken}`,
      'Content-Type': 'application/sdp'
    }
  });

  console.log("OpenAI Status:", webrtcRes.status);
  const text = await webrtcRes.text();
  if (text.startsWith("v=")) {
      console.log("SUCCESS! OpenAI replied with a valid SDP Answer.");
  } else {
      console.log("ERROR! OpenAI replied with non-SDP JSON:", text);
  }
}
test();
