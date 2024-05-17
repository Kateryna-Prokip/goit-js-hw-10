import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector('[data-start]');
const daysEl = document.querySelector('.value[data-days]');
const hoursEl = document.querySelector('.value[data-hours]');
const minutesEl = document.querySelector('.value[data-minutes]');
const secondsEl = document.querySelector('.value[data-seconds]');

let userSelectedDate = null;
let timerInterval = null;

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}


function validateDate(selectedDate) {
    if (selectedDate <= new Date()) {
        iziToast.error({
            title: 'Error',
            message: 'Please select a date in the future',
        });
        return false;
    }
    return true;  // чи обрана дата в майбутньому.
}

function startTimer() {
    timerInterval = setInterval(() => {
        const now = new Date();
        const timeRemaining = userSelectedDate - now;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
                      return;
        } // запуск таймера який оновлюється щосекунди

        const { days, hours, minutes, seconds } = convertMs(timeRemaining);
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }, 1000);
}

const picker = flatpickr("#datetime-picker", {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];
        if (validateDate(userSelectedDate)) {
            startBtn.disabled = false;
        } else {
            startBtn.disabled = true;
        }
    },
}); // перевірка дати в майбутньому

startBtn.addEventListener('click', () => { // запуск таймера
    if (userSelectedDate) {
        clearInterval(timerInterval); // очищає інтервал перед початком нового
        startTimer();
    }
});