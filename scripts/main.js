const questions = [
  { question: "Have you ever asked AI (like ChatGPT) to help you write something?", points: 2 },
  { question: "Do you use voice assistants (like Siri or Alexa) in your daily life?", points: 1 },
  { question: "Have you used AI to create an image, video, or voice recording?", points: 2 },
  { question: "Would you trust AI to help plan your schedule or manage tasks?", points: 2 },
  { question: "Have you used AI tools at work or for a side project?", points: 3 },
  { question: "Do you know how to get better results by asking AI better questions?", points: 2 },
  { question: "Have you explored using AI to learn new skills or improve your career?", points: 3 },
  { question: "Would you feel comfortable letting AI help with customer support or sales?", points: 2 },
  { question: "Do you understand how AI is already changing your job or industry?", points: 3 },
  { question: "Are you curious and open to working alongside AI in the future?", points: 2 }
];
let current = 0;
let score = 0;
let userAnswers = [];

function startQuiz() {
  showQuestion();
}

function showQuestion() {
  const container = document.getElementById('quizContainer');
  if (current >= questions.length) {
    sendToGPT();
    return;
  }
  const q = questions[current];
  container.innerHTML = `
    <div class="card">
      <h2>${q.question}</h2>
      <button onclick="answer(0, 'No')">No</button>
      <button onclick="answer(${q.points}, 'Yes')">Yes</button>
    </div>
  `;
}

function answer(points, text) {
  score += points;
  userAnswers.push({ question: questions[current].question, answer: text });
  current++;
  showQuestion();
}

async function sendToGPT() {
  const container = document.getElementById('quizContainer');
  container.innerHTML = "<p>Generating your AI Learning Path...</p>";
  const res = await fetch('/api/gpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers: userAnswers, score: score })
  });
  const data = await res.json();
  document.getElementById('resultsContainer').innerText = data.result;
}
