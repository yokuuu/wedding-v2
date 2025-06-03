import "./style.css";
import "./media.css";
import { writeUserData, getUserData } from "./firebase";

//firebase
document.getElementById("form").addEventListener("submit", function (e) {
	e.preventDefault();

	const textValue = document.getElementById("userName").value;
	const agreementValue = document.querySelector(
		'input[name="radio"]:checked'
	).value;

	const timestamp = new Date()
		.toISOString()
		.split("T")[0]
		.split("-")
		.reverse()
		.join("-");

	let userId = localStorage.getItem("userUniqueId");

	if (!userId) {
		userId = "user_" + Math.random().toString(36).substring(2, 12);
		localStorage.setItem("userUniqueId", userId);
	}

	getUserData(userId).then(userData => {
		console.log("Данные пользователя:", userData);
		if (userData) alert("Вы уже отправляли форму ранее!");
		writeUserData(userId, textValue, agreementValue, timestamp);
		alert("Данные успешно отправлены!");
	});
});

// checkbox

// timer

function updateTimer(targetDate, displayElement) {
	const intervalId = setInterval(() => {
		const now = new Date().getTime();
		const timeLeft = targetDate - now;

		if (timeLeft <= 0) {
			clearInterval(intervalId);
			displayElement.textContent = "Time's up!";
			return;
		}

		const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

		displayElement.innerHTML = `
		<ul class="timer__list">
			<li class="timer__item">
				<span class="timer__item-number">${days}</span>
				<span class="timer__item-description">Дней</span>
			</li>
			<li class="timer__item">
				<span class="timer__item-number">${hours}</span>
				<span class="timer__item-description">Часов</span>
			</li>
			<li class="timer__item">
				<span class="timer__item-number">${minutes}</span>
				<span class="timer__item-description">Минут</span>
			</li>
			<li class="timer__item">
				<span class="timer__item-number">${seconds}</span>
				<span class="timer__item-description">Секунд</span>
			</li>
		</ul>`;
	}, 1000);
}

const targetDate = new Date("2025-08-23T12:00:00").getTime();
const timerDisplay = document.getElementById("timer");

updateTimer(targetDate, timerDisplay);

// scroll

const lenis = new Lenis({
	duration: 3,
	easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
	infinite: false,
});

function raf(time) {
	lenis.raf(time);
	requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// swiper

var mySwiper = new Swiper(".swiper-container", {
	direction: "vertical",
	loop: true,
	pagination: ".swiper-pagination",
	grabCursor: true,
	speed: 1000,
	paginationClickable: true,
	parallax: true,
	autoplay: true,
	effect: "slide",
	mousewheelControl: 1,
});
// sliderButton

const thumb = document.querySelector(".slider-thumb");
const track = document.querySelector(".slider-track");
const container = document.querySelector(".slider-container");
const target = document.querySelector(".target-circle");
let isDragging = false;

// Функция проверки достижения цели
function checkTargetReached() {
	const thumbRect = thumb.getBoundingClientRect();
	const targetRect = target.getBoundingClientRect();

	// Проверяем пересечение элементов
	const isReached = !(
		thumbRect.right < targetRect.left ||
		thumbRect.left > targetRect.right ||
		thumbRect.bottom < targetRect.top ||
		thumbRect.top > targetRect.bottom
	);

	return isReached;
}

thumb.addEventListener("mousedown", e => {
	isDragging = true;
	thumb.style.cursor = "grabbing";
	e.preventDefault(); // Предотвращаем выделение текста
});

document.addEventListener("mousemove", e => {
	if (!isDragging) return;

	const containerRect = container.getBoundingClientRect();
	const trackRect = track.getBoundingClientRect();

	let newLeft = e.clientX - containerRect.left;

	// Ограничиваем движение в пределах трека
	newLeft = Math.max(trackRect.left - containerRect.left, newLeft);
	newLeft = Math.min(trackRect.right - containerRect.left, newLeft);

	// Обновляем позицию бегунка
	const percent =
		((newLeft - (trackRect.left - containerRect.left)) / trackRect.width) * 100;
	thumb.style.left = `${percent}%`;

	// Проверяем достижение цели
	if (percent > 95 && checkTargetReached()) {
		setTimeout(() => {
			console.log(1);
		}, 100);
	}
});

document.addEventListener("mouseup", () => {
	if (isDragging) {
		isDragging = false;
		thumb.style.cursor = "grab";
		const audio = document.getElementById("bgMusic");
		audio.volume = 0.05;

		// Финишная проверка при отпускании
		if (checkTargetReached()) {
			console.log(2);
			document.querySelector(".preload").style.display = "none";
			document.querySelector(".content").style.display = "block";
			AOS.init();
			if (audio.paused) {
				audio
					.play()
					.catch(e => console.log("Автовоспроизведение заблокировано:", e));
			} else {
				audio.pause();
			}
		}
	}
});

// Добавляем обработчики для touch-событий
thumb.addEventListener("touchstart", e => {
	isDragging = true;
	e.preventDefault();
});

document.addEventListener("touchmove", e => {
	if (!isDragging) return;

	const containerRect = container.getBoundingClientRect();
	const trackRect = track.getBoundingClientRect();
	const touch = e.touches[0];

	let newLeft = touch.clientX - containerRect.left;

	newLeft = Math.max(trackRect.left - containerRect.left, newLeft);
	newLeft = Math.min(trackRect.right - containerRect.left, newLeft);

	const percent =
		((newLeft - (trackRect.left - containerRect.left)) / trackRect.width) * 100;
	thumb.style.left = `${percent}%`;

	// Проверяем достижение цели
	if (percent > 95 && checkTargetReached()) {
		setTimeout(() => {
			console.log(3);
		}, 100);
	}
});

document.addEventListener("touchend", () => {
	if (isDragging) {
		isDragging = false;
		const audio = document.getElementById("bgMusic");
		audio.volume = 0.05;
		// Финишная проверка при отпускании
		if (checkTargetReached()) {
			document.querySelector(".preload").style.display = "none";
			document.querySelector(".content").style.display = "block";
			AOS.init();
			if (audio.paused) {
				audio
					.play()
					.catch(e => console.log("Автовоспроизведение заблокировано:", e));
			} else {
				audio.pause();
			}
			console.log(4);
		}
	}
});
