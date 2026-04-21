// Accessibility: High Contrast
function toggleContrast() {
    document.body.classList.toggle('high-contrast');
    const isDark = document.body.classList.contains('high-contrast');
    localStorage.setItem('contrast', isDark);
}

// Text to Speech for Low Literacy
function speakText(text) {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
}

// Mood logic
function setMood(val) {
    const moodDisplay = document.getElementById('moodMsg');
    const advice = [
        "It's okay to feel overwhelmed. Try the 4-7-8 breathing technique below.",
        "Your feelings are valid. Is there one small thing you can do for yourself today?",
        "A steady day is a good day. Keep maintaining your routine.",
        "Glad you're doing well! Use this energy to help a friend or tackle a goal.",
        "You're thriving! Write down what's going right so you can remember this later."
    ];
    
    const selectedMsg = advice[val - 1];
    moodDisplay.innerText = selectedMsg;
    
    // Accessibility: Speak the advice for low-literacy support
    speakText(selectedMsg);
}

// Chat logic
function sendMessage() {
    const input = document.getElementById('chatInput');
    const chatBox = document.getElementById('chatBox');
    if(input.value.trim() !== "") {
        chatBox.innerHTML += `<p><strong>You:</strong> ${input.value}</p>`;
        setTimeout(() => {
            chatBox.innerHTML += `<p><strong>Expert:</strong> Thank you for your question. A health professional will respond shortly.</p>`;
        }, 1000);
        input.value = "";
    }
}

// Smart Ring Simulation
function calculateFertility() {
    const temp = document.getElementById('tempInput').value;
    const status = document.getElementById('fertilityStatus');
    if(temp > 37) {
        status.innerHTML = "🔥 High Fertility Window Detected (Temperature Rise)";
        status.style.color = "var(--accent)";
    } else {
        status.innerHTML = "❄️ Baseline Temperature - Low Fertility";
        status.style.color = "var(--secondary)";
    }
}
function calculateOvulation() {
    const lastPeriodInput = document.getElementById('lastPeriod').value;
    const cycleLength = parseInt(document.getElementById('cycleLength').value);
    
    if (!lastPeriodInput) {
        alert("Please select the date of your last period.");
        return;
    }

    const lastDate = new Date(lastPeriodInput);
    
    // 1. Calculate Next Period
    let nextPeriod = new Date(lastDate);
    nextPeriod.setDate(lastDate.getDate() + cycleLength);

    // 2. Calculate Ovulation Day (14 days before next period)
    let ovulationDay = new Date(nextPeriod);
    ovulationDay.setDate(nextPeriod.getDate() - 14);

    // 3. Calculate Start of Fertile Window (5 days before ovulation)
    let windowStart = new Date(ovulationDay);
    windowStart.setDate(ovulationDay.getDate() - 5);

    // Display Results
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';
    
    document.getElementById('ovulationDate').innerText = 
        `Estimated Ovulation: ${ovulationDay.toDateString()}`;
    
    document.getElementById('fertilityWindow').innerText = 
        `Your Fertility Window: ${windowStart.toDateString()} to ${ovulationDay.toDateString()}`;

    // Audio support for accessibility
    speakText(`Your estimated ovulation date is ${ovulationDay.toDateString()}. Your fertile window begins on ${windowStart.toDateString()}.`);
}
function generateCalendarRing(selectedPeriodStartDay = null) {
    const container = document.getElementById('wheelDots');
    if (!container) return;
    
    container.innerHTML = ''; 
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const todayDate = now.getDate();
    const containerSize = 300; // Diameter of the ring
    
    // Get total days in the current month (e.g., 30 for April)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const radius = 125;

    for (let i = 1; i <= daysInMonth; i++) {
        const dot = document.createElement('div');
        dot.className = 'cycle-dot';
        dot.innerText = i;

        const angle = (i - 1) * (360 / daysInMonth) - 90;
        dot.style.transform = `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`;

        // Default color (Neutral/Purple)
        dot.style.background = "#7e22ce"; 

        // 1. Highlight "Today" so the user knows where they are
        if (i === todayDate) {
            dot.style.boxShadow = "0 0 15px #34A0A4";
            dot.style.fontWeight = "bold";
            dot.style.border = "2px solid #34A0A4";
        }

        // 2. If a period start date is selected, apply the 28-day logic
        if (selectedPeriodStartDay !== null) {
            // Calculate how many days have passed since the period started
            let dayOfCycle = (i - selectedPeriodStartDay + daysInMonth) % daysInMonth + 1;

            if (dayOfCycle >= 1 && dayOfCycle <= 7) {
                dot.style.background = "#b91c1c"; // Menstruation
            } else if (dayOfCycle >= 8 && dayOfCycle <= 19) {
                dot.style.background = "#15803d"; // Fertile
            }
        }

        // 3. User Interaction
        dot.style.cursor = "pointer";
        dot.onclick = () => {
            const monthName = now.toLocaleString('default', { month: 'long' });
            alert(`You set ${monthName} ${i} as your Period Start Date.`);
            generateCalendarRing(i); // Redraw with colors starting from this date
            updateStatusText(i, daysInMonth);
        };

        container.appendChild(dot);
    }
}

function updateStatusText(startDay, totalDays) {
    const now = new Date();
    const today = now.getDate();
    
    // Calculate current cycle day
    let currentCycleDay = (today - startDay + totalDays) % totalDays + 1;
    
    document.getElementById('currentDayText').innerText = `Day ${currentCycleDay}`;
    
    if (currentCycleDay >= 8 && currentCycleDay <= 19) {
        document.getElementById('phaseStatus').innerText = "Fertile Window - High Chance";
        document.getElementById('phaseStatus').style.color = "#15803d";
    } else {
        document.getElementById('phaseStatus').innerText = "Infertile Phase";
        document.getElementById('phaseStatus').style.color = "#7e22ce";
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    generateCalendarRing(); 
});

function updateStatusText(startDay, totalDays) {
    const now = new Date();
    const today = now.getDate();
    
    // Logic to find current cycle day
    let currentCycleDay = (today - startDay + totalDays) % totalDays + 1;
    
    // Updates the text on the left side
    document.getElementById('currentDayText').innerText = `Day ${currentCycleDay}`;
    
    if (currentCycleDay >= 8 && currentCycleDay <= 19) {
        document.getElementById('phaseStatus').innerText = "Fertility Status: HIGH";
        document.getElementById('phaseStatus').style.color = "#15803d";
    } else {
        document.getElementById('phaseStatus').innerText = "Fertility Status: LOW";
        document.getElementById('phaseStatus').style.color = "#7e22ce";
    }
}
// Toggle Myths and Facts
function toggleMyth(element) {
    const fact = element.querySelector('.fact');
    fact.style.display = (fact.style.display === 'none') ? 'block' : 'none';
}

// Simulated Online Testing Logic
function nextQuestion(isAtRisk) {
    const quizContent = document.getElementById('quiz-content');
    if (isAtRisk) {
        quizContent.innerHTML = `
            <p style="color: #b91c1c; font-weight: bold;">Recommendation:</p>
            <p>Based on your activity, we recommend a clinical HIV test. It is fast, private, and often free at local health centers in Rwanda.</p>
            <button class="btn btn-primary" onclick="location.reload()">Start Over</button>
        `;
    } else {
        quizContent.innerHTML = `
            <p style="color: #15803d; font-weight: bold;">You are likely low risk.</p>
            <p>Keep using protection and stay informed! We recommend testing every 6-12 months as a routine health check.</p>
            <button class="btn btn-primary" onclick="location.reload()">Done</button>
        `;
    }
}

// Anonymous Question Simulation
function submitHivQuestion() {
    const question = document.getElementById('hivQuestion').value;
    const responseBox = document.getElementById('hivResponse');

    if (question.length < 5) {
        alert("Please type a full question.");
        return;
    }

    responseBox.innerText = "Connecting to an anonymous health advisor...";
    
    setTimeout(() => {
        responseBox.innerHTML = `<strong>Response:</strong> Thank you for asking. HIV cannot be spread through ${question.includes('hugging') ? 'hugging' : 'casual contact'}. Your privacy is safe with us.`;
        document.getElementById('hivQuestion').value = "";
    }, 2000);
}
const translations = {
    'en': {
        'hero-title': 'Know Your Status, Protect Your Future',
        'hero-desc': 'Your health is your greatest asset. Stay informed.',
        'hiv-what': 'What is HIV?',
        'hiv-desc': 'HIV is a virus that attacks the body’s immune system.',
        'btn-test': 'Take Online Test'
    },
    'rw': {
        'hero-title': 'Menya uko uhagaze, urinde ejo hazaza hawe',
        'hero-desc': 'Ubuzima bwawe ni bwo butunzi bwawe bukomeye. Guma uzi amakuru.',
        'hiv-what': 'HIV ni iki?',
        'hiv-desc': 'HIV ni virusi itera kuryamana n’uburyo bwo kwirinda bw’umubiri.',
        'btn-test': 'Pimira hano kuri interineti'
    }
};

function changeLanguage(lang) {
    // 1. Save the choice so it stays when the user moves between pages
    localStorage.setItem('preferredLang', lang);

    // 2. Loop through all elements that have a "data-key" attribute
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
}

// 3. Load the saved language when the page opens
window.onload = () => {
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    changeLanguage(savedLang);
};