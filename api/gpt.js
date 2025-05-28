export default async function handler(req, res) {
  const { answers, score } = req.body;
  const prompt = `User took an AI readiness quiz and scored ${score} points. Their answers were: ${JSON.stringify(answers)}. Based on this, generate a friendly 2-paragraph summary of their current AI skill level and recommend a 3-step learning path for them to follow.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  res.status(200).json({ result: data.choices[0].message.content });
}
