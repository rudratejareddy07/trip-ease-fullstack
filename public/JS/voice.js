window.addEventListener('DOMContentLoaded', () => {
    console.log("Voice JS Loaded");

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.continuous = false;

    const micBtn = document.getElementById("voice-btn");

    let isRecognizing = false;
    let voiceActive = false;
    let voiceTimeout = null;

    const activateVoiceAssistant = () => {
        voiceActive = true;
        sessionStorage.setItem("voiceActive", "true");
        console.log("Voice assistant active for 10 minutes");

        clearTimeout(voiceTimeout);
        voiceTimeout = setTimeout(() => {
            voiceActive = false;
            sessionStorage.removeItem("voiceActive");
            alert("Voice assistant timed out. Please click the voice button again.");
        }, 10 * 60 * 1000); // 10 minutes
    };

    const processCommand = (command) => {
        console.log("Command received:", command);

        if (command === "create new listing") {
            window.location.href = "/listings/new";
            return;
        }

        if (command === "edit listing") {
            const currentUrl = window.location.pathname;
            if (currentUrl.startsWith("/listings/") && !currentUrl.includes("/edit")) {
                window.location.href = currentUrl + "/edit";
            } else {
                alert("You're not on a listing detail page.");
            }
            return;
        }

        if (command === "save") {
            const btn = document.querySelector("form button[type='submit'], form button");
            if (btn) {
                btn.click();
            } else {
                alert("No save button found.");
            }
            return;
        }

        if (command === "scroll down") {
            window.scrollBy({ top: 500, behavior: 'smooth' });
            return;
        }

        if (command === "scroll up") {
            window.scrollBy({ top: -500, behavior: 'smooth' });
            return;
        }

        if (command === "go back") {
            history.back();
            return;
        }

        if (command === "reload") {
            location.reload();
            return;
        }

        // Voice form filling
        if (command.startsWith("set ")) {
            const parts = command.replace("set ", "").split(" to ");
            if (parts.length === 2) {
                const field = parts[0].trim();
                const value = parts[1].trim();

                const fieldMap = {
                    title: "listing[title]",
                    description: "listing[description]",
                    price: "listing[price]",
                    country: "listing[country]",
                    location: "listing[location]",
                    image: "listing[image]"
                };

                const inputName = fieldMap[field] || `listing[${field}]`;
                const input = document.querySelector(
                    `[name="${inputName}"], [name="listing[${field}]"], #${field}`
                );

                if (input) {
                    input.value = value;
                    input.focus();
                    console.log(`Filled '${field}' with "${value}"`);
                } else {
                    alert(`Field '${field}' not found.`);
                }
            }
            return;
        }

        // Open listing by title
        if (command.startsWith("open ") || command.startsWith("show ")) {
            const spokenTitle = command.replace(/^(open|show)\s+/i, "").trim();

            const match = listings.find(listing => {
                const cleanedTitle = listing.title.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().trim();
                const cleanedSpoken = spokenTitle.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().trim();
                return (
                    cleanedTitle === cleanedSpoken ||
                    cleanedTitle.includes(cleanedSpoken) ||
                    cleanedSpoken.includes(cleanedTitle)
                );
            });

            if (match) {
                window.location.href = match.url;
            } else {
                alert(`No listing found for "${spokenTitle}"`);
            }
            return;
        }

        alert("Sorry, I didn’t understand that.");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log("Heard:", transcript);
        console.log("Voice Active?", voiceActive);

        if (voiceActive) {
            processCommand(transcript);
        }
    };

    recognition.onend = () => {
        isRecognizing = false;
        console.log("Recognition ended.");
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        isRecognizing = false;

        if (voiceActive && event.error === "network") {
            setTimeout(() => startRecognition(), 1000);
        }
    };

    const startRecognition = () => {
        if (!isRecognizing) {
            try {
                recognition.start();
                isRecognizing = true;
            } catch (e) {
                console.warn("Recognition start failed:", e.message);
            }
        }
    };

    if (micBtn) {
        micBtn.addEventListener("click", () => {
            console.log("Voice button clicked.");
            activateVoiceAssistant();
            startRecognition();
        });
    }

    // Resume voice session if user activated before page change
    if (sessionStorage.getItem("voiceActive") === "true") {
        console.log("Voice assistant auto-resumed from previous page.");
        activateVoiceAssistant();
        startRecognition();
    }

    // Continuous polling every 5 seconds
    setInterval(() => {
        if (voiceActive) {
            startRecognition();
        }
    }, 5000);
});
