const API_KEY = "AQ.Ab8RN6K_cIAKUQv3439eoeogchANjuILf_mLdAZrF-lfyj3Hgw";

const askButton = document.getElementById("askBtn");
const result = document.getElementById("result");
const promptInput = document.getElementById("prompt");
const loading = document.getElementById("loading");

askButton.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (!prompt) {
        result.textContent = "Please enter a question.";
        return;
    }

    loading.style.display = "block";
    askButton.disabled = true;
    result.textContent = "";

    const startTime = Date.now();

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": API_KEY
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error?.message || "API request failed"
            );
        }

        const answer =
            data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!answer) {
            throw new Error("No answer received.");
        }

        // Show answer after minimum 2 seconds
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, 2000 - elapsed);

        setTimeout(() => {
            result.textContent = answer;
            loading.style.display = "none";
            askButton.disabled = false;
        }, delay);

    } catch (error) {
        console.error("Gemini Error:", error);

        result.textContent = "❌ " + error.message;
        loading.style.display = "none";
        askButton.disabled = false;
    }
});