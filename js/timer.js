
        let count = 0;
        let timerInterval;
        let running = false;

        function startTimer() {
            if (!running) {
                timerInterval = setInterval(updateTimer, 1000); // Increments every second
                running = true;
                console.log(count)
            }
        }

        function stopTimer() {
            if (running) {
                clearInterval(timerInterval);
                running = false;
            }
        }

        function resetTimer() {
            clearInterval(timerInterval);
            count = 0;
            document.getElementById("timer").innerText = "000";
            running = false;
        }

        function updateTimer() {
            count++;
            document.getElementById("timer").innerText = String(count).padStart(3, '0');
        }
