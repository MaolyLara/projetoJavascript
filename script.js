const inputQuestion = document.getElementById("inputQuestion");
const result = document.getElementById("result");
const sendButton = document.getElementById("sendButton");

// Definir el foco automático en el campo de entrada
inputQuestion.focus();

sendButton.addEventListener("click", async () => {
    await sendQuestion();
});

inputQuestion.addEventListener("keypress", async (e) => {
    if (inputQuestion.value.trim() && e.key === "Enter") {
        await sendQuestion();
    }
});

const OPENAI_API_KEY = "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"; // Inserta aquí tu token de acceso de la API de OpenAI

async function sendQuestion() {
    const sQuestion = inputQuestion.value.trim();

    if (sQuestion === "") {
        return; // Evitar el envío de preguntas vacías
    }

    try {
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + OPENAI_API_KEY,
            },
            body: JSON.stringify({
                model: "text-davinci-003.pt",
                prompt: sQuestion,
                max_tokens: 2048, // tamaño de la respuesta
                temperature: 0.5, // creatividad en la respuesta
            }),
        });

        const json = await response.json();

        if (result.innerHTML) {
            result.innerHTML += "<br>";
        }

        if (json.error?.message) {
            result.innerHTML += `<span class="error">Error: ${json.error.message}</span>`;
            playErrorSound();
        } else if (json.choices?.[0].text) {
            const text = json.choices[0].text || "Sem resposta";
            result.innerHTML += `<span class="chat-output-text">Chat GPT: ${text}</span>`;
            speak(text);
        }

        result.scrollTop = result.scrollHeight;
    } catch (error) {
        console.error("Error:", error);
    } finally {
        inputQuestion.value = "";
        inputQuestion.focus();
    }
}

// Función para reproducir sonido de error
function playErrorSound() {
    const errorSound = new Audio("som-de-erro.mp3");
    errorSound.play();
}

// Función para sintetizar la respuesta en voz
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    } else {
        console.log("La síntesis de voz no es compatible en este navegador.");
    }
}
