export default {
      async fetch(req, res) {
            return res.json({ status: "ok", service: "parkflow-api-proxy", message: "Gemini API key is runninggg!" });
      }
}