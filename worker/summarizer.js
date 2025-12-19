const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const logger = require("./utils/logger");

let client = null;

if (process.env.GOOGLE_API_KEY) {
  client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
} else {
  console.log("GOOGLE_API_KEY not found");
}

module.exports = async function summarise(message, meta) {
  if (!client) {
    return `Summarization unavailable. Auto Summary: ${message.slice(0, 200)}`;
  }

  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `Rewrite the following application error log into a concise, developer-friendly summary suitable for a narrow side-panel UI.

Log:
${message}

Meta:
${JSON.stringify(meta || {}, null, 2)}

Format the output EXACTLY like this (Markdown headings on separate lines):

### Summary
(One–two sentences.)

### Likely Cause
(One short sentence.)

### Notes
- (bullet point)
- (bullet point)
- (bullet point)

### What to Check
1. (short step)
2. (short step)
3. (short step)

STRICT RULES:
- The section titles MUST be Markdown headers starting with ### on their own line
- The explanation MUST be on the next line, never on the same line as the header
- Keep everything compact and easy to scan.
- No extra sections, no intro text, no trailing commentary.`;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = result.response.text();

    logger.info("Generated summary: " + text);

    return text.trim().slice(0, 2000);
  } catch (error) {
    logger.error("Error generating summary: " + error);
  }
};
