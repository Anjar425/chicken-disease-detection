export async function POST(req) {
    try {
      // Validasi Content-Type
      const contentType = req.headers.get('content-type') || '';
      if (!contentType.includes('multipart/form-data')) {
        return new Response(JSON.stringify({ error: 'Invalid Content-Type' }), {
          status: 415,
        });
      }
  
      // Parsing form-data
      const buffer = await req.arrayBuffer();
      const decoder = new TextDecoder();
      const text = decoder.decode(buffer);
  
      // Ambil boundary dari header
      const boundary = contentType.split('boundary=')[1];
      const parts = text.split(`--${boundary}`).filter(part => part.trim() && !part.includes('--'));
  
      // Parsing parameter `prompt`
      let prompt = null;
      for (const part of parts) {
        const [header, body] = part.split('\r\n\r\n');
        const nameMatch = header.match(/name="([^"]+)"/);
        const name = nameMatch ? nameMatch[1] : null;
  
        if (name === 'prompt') {
          prompt = body.trim();
          break;
        }
      }
  
      // Validasi prompt
      if (!prompt) {
        return new Response(JSON.stringify({ error: 'Missing prompt parameter' }), {
          status: 400,
        });
      } else {
        const initialInstruction = "Anda adalah seorang ahli dalam penyakit ayam. Mohon menjawab dengan sangat sopan dan sesuai dengan bahasa yang digunakan setelah kalimat 'Berikut pertanyaannya'. Apabila pertanyaan tidak relevan dengan penyakit ayam, tolaklah dengan sopan dan nyatakan bahwa topik tersebut di luar cakupan layanan Anda. Berikut pertanyaannya: ";
        const closingInstruction = ". Mohon pastikan bahasa jawaban Anda sama dengan bahasa yang digunakan pada kalimat pertanyaan di atas.";
        prompt = initialInstruction + prompt + closingInstruction;        
      }
  
      // Kirim prompt ke OpenAI ChatGPT API
      const openaiApiKey = process.env.OPENAI_API_KEY // Ganti dengan API Key OpenAI Anda
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
        }),
      });
  
      if (!openaiResponse.ok) {
        const error = await openaiResponse.json();
        return new Response(JSON.stringify({ error: error.message || 'OpenAI API Error' }), {
          status: openaiResponse.status,
        });
      }
  
      const data = await openaiResponse.json();
  
      // Ambil output dari OpenAI
      const message = data.choices[0]?.message?.content || 'No response from OpenAI';
  
      // Kirim response
      return new Response(
        JSON.stringify({ message }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
      });
    }
  }
  