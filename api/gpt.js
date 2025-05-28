export default async function handler(req, res) {
  try {
    const { answers, score } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Missing OpenAI API key in environment.' });
    }

    const prompt = `User took an AI readiness quiz and scored ${score} points. Their answers were: ${JSON.stringify(answers)}. Based on this, generate a friendly 2-paragraph summary of their current AI skill level and recommend a 3-step learning path for them to follow.`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await openaiResponse.json();

    // Handle API errors
    if (!openaiResponse.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ error: data.error?.message || 'OpenAI API call failed.' });
    }

    // Guard against missing choices
    if (!data.choices || data.choices.length === 0 || !data.choices[0].message?.content) {
      console.error("No choices returned:", data);
      return res.status(500).json({ error: 'OpenAI returned no content.' });
    }

    // Safe to grab the generated text now
    const resultText = data.choices[0].message.content;
    res.status(200).json({ result: resultText });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
}
