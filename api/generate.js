const MODEL = "gemini-3.1-flash-lite";

export default async function handler(req, res) {
      if (req.method !== "POST") {
            return res.status(405).json(({ error: "HTTP Method not allowed!" }));
      }
      if (req.headers["x-parkflow-api-key"] !== process.env.PARKFLOW_PROXY_SECRET) {
            return res.status(401).json({ error: "Unauthorized!" });
      }
      const { prompt } = req.body ?? {};
      if (!prompt) {
            return res.status(400).json({ error: "Prompt in request body is required!" });
      }
      try {
            const response = await fetch(
                  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
                  {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json",
                              "x-goog-api-key": process.env.GEMINI_API_KEY
                        },
                        body: JSON.stringify({
                              contents: [
                                    {
                                          parts: [{ text: prompt }]
                                    }
                              ]
                        })
                  }
            );
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            return res.status(response.status).json({
                  text: text,
                  raw: text ? undefined : data,
            });
      }
      catch (error) {
            return res.status(500).json({
                  error: "Proxy request failed!",
                  details: error.message
            });
      }
}