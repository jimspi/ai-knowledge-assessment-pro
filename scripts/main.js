const questions = [
  { q: "Have you ever used ChatGPT or another AI chatbot?", points: 1 },
  { q: "Can you tell AI to write something for you, like an email or summary?", points: 1 },
  { q: "Do you know how AI tools like Midjourney or DALL·E create images?", points: 1 },
  { q: "Could you explain how AI can help automate boring tasks at work?", points: 1 },
  { q: "Have you ever used voice-to-text or real-time translation apps?", points: 1 },
  { q: "Do you understand what 'training data' means for AI?", points: 1 },
  { q: "Have you tried using AI to generate video, music, or audio?", points: 1 },
  { q: "Do you trust AI to give you reliable information?", points: 1 },
  { q: "Would you know what to do if AI gave you a biased or weird answer?", points: 1 },
  { q: "Do you feel confident you’ll need AI skills in the next 2 years?", points: 1 }
];

let currentQuestion = 0;
let score = 0;
let answers = [];

function startQuiz() {
  document.querySelector('.hero').style.display = 'none';
  showQuestion();
}

function showQuestion() {
  const container = document.getElementById("quizContainer");
  if (currentQuestion >= questions.length) {
    container.innerHTML = ""; // Clear quiz area
    sendToGPT();
    return;
  }

  const q = questions[currentQuestion];
  container.innerHTML = `
    <div class="card">
      <h2>${q.q}</h2>
      <button onclick="answer(true)">Yes</button>
      <button onclick="answer(false)">No</button>
    </div>`;
}

function answer(userSaidYes) {
  const q = questions[currentQuestion];
  answers.push({ question: q.q, answer: userSaidYes ? "Yes" : "No" });
  if (userSaidYes) score += q.points;
  currentQuestion++;
  showQuestion();
}

async function sendToGPT() {
  // Clear quiz container
  document.getElementById("quizContainer").innerHTML = "";

  const container = document.getElementById("resultsContainer");

  // Show loading spinner
  container.innerHTML = `
    <div class="card" id="resultCard">
      <div class="spinner" style="margin: 2rem auto;"></div>
    </div>
  `;

  try {
    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, score })
    });

    const data = await res.json();

    document.getElementById("resultCard").innerHTML = `
      <h2>Your AI Skill Profile</h2>
      <p>${data.result}</p>
      <button onclick="window.location.href='/custom.html'" style="margin-top: 1rem; padding: 1rem 2rem; font-size: 1rem; background: #111; color: white; border: none; border-radius: 12px; cursor: pointer;">
        Get a Custom Learning Path
      </button>
    `;
  } catch (err) {
    document.getElementById("resultCard").innerHTML = `
      <p><strong>Error:</strong> Failed to fetch learning path. Try again later.</p>
    `;
    console.error(err);
  }
}



