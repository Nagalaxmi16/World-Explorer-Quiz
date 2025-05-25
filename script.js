const quizData = [
  {
    question: "Mount Everest is located in which mountain range?",
    options: ["Alps", "Andes", "Rockies", "Himalayas"],
    answer: "Himalayas"
  },
  {
    question: "Which is the largest Island in the world?",
    options: ["Greenland", "New Guinea", "Borneo", "Madagascar"],
    answer: "Greenland"
  },
  {
    question: "Which lake is the largest freshwater lake by area?",
    options: ["Lake Superior", "Lake Victoria", "Lake Michigan", "Lake Baikal"],
    answer: "Lake Superior"
  }
];

const quizContainer = document.getElementById("quiz-container");
const submitBtn = document.getElementById("submit-btn");
const resultContainer = document.getElementById("result");
const getFactBtn = document.getElementById("get-fact-btn");
const factContainer = document.getElementById("fact-container");

function loadQuiz() {
  quizContainer.innerHTML = "";
  quizData.forEach((q, i) => {
    const quizBox = document.createElement("div");
    quizBox.classList.add("quiz-box");
    quizBox.innerHTML = `
      <p class="question">${i + 1}. ${q.question}</p>
      <div class="options">
        ${q.options
          .map(
            (opt) => `
          <label class="option-label">
            <input type="radio" name="question${i}" value="${opt}" /> ${opt}
          </label>
        `
          )
          .join("")}
      </div>
    `;
    quizContainer.appendChild(quizBox);
  });
}

function checkAnswers() {
  let score = 0;
  quizData.forEach((q, i) => {
    const selected = document.querySelector(
      `input[name="question${i}"]:checked`
    );
    if (selected && selected.value === q.answer) {
      score++;
    }
  });
  resultContainer.innerHTML = `<div class="score-box">🎉 You got <strong>${score}</strong> out of <strong>${quizData.length}</strong> questions right!</div>`;
}

async function getCountryFact() {
  factContainer.innerHTML = "<div class='loading'>Loading...</div>";
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();
    const random = countries[Math.floor(Math.random() * countries.length)];
    const name = random.name.common;
    const capital = random.capital ? random.capital[0] : "Unknown";
    const region = random.region;
    const population = random.population.toLocaleString();
    const languages = random.languages ? Object.values(random.languages).join(", ") : "Not available";
    const currencies = random.currencies ? Object.entries(random.currencies).map(([code, val]) => `${val.name} (${code})`).join(", ") : "Not available";
    const flag = random.flags?.png || "";
    const timezone = random.timezones ? random.timezones[0] : "Not available";
    const subregion = random.subregion || "Not available";
    const borders = random.borders ? random.borders.join(", ") : "None";
    const area = random.area ? `${random.area.toLocaleString()} km²` : "Unknown";

    factContainer.innerHTML = `
      <div class="fact-box">
        <img src="${flag}" alt="Flag of ${name}" class="country-flag"/>
        <h3>${name}</h3>
        <div class="fact-grid">
          <p><strong>Capital:</strong> ${capital}</p>
          <p><strong>Region:</strong> ${region}</p>
          <p><strong>Subregion:</strong> ${subregion}</p>
          <p><strong>Population:</strong> ${population}</p>
          <p><strong>Languages:</strong> ${languages}</p>
          <p><strong>Currency:</strong> ${currencies}</p>
          <p><strong>Timezone:</strong> ${timezone}</p>
          <p><strong>Area:</strong> ${area}</p>
          <p><strong>Neighboring Countries:</strong> ${borders}</p>
        </div>
      </div>
    `;
  } catch (err) {
    factContainer.innerHTML = "<div class='error'>❌ Failed to load fact. Try again.</div>";
  }
}

loadQuiz();
submitBtn.addEventListener("click", checkAnswers);
getFactBtn.addEventListener("click", getCountryFact);
