import "./style.css";
import "./media.css";
import { writeUserData } from "./firebase";

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

	writeUserData(textValue, agreementValue, timestamp);
	alert("Данные успешно отправлены!");
});

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
AOS.init();

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
let animationFrameId = null;
let currentLeft = 0; // Текущая позиция в процентах
let targetLeft = 0; // Целевая позиция в процентах
const maxSpeed = 2; // Максимальная скорость перемещения в % за кадр

// Функция плавного перемещения
function smoothMove() {
	// Вычисляем разницу между текущей и целевой позицией
	const diff = targetLeft - currentLeft;

	// Если разница очень маленькая, останавливаем анимацию
	if (Math.abs(diff) < 0.1) {
		currentLeft = targetLeft;
		thumb.style.left = `${currentLeft}%`;
		animationFrameId = null;
		return;
	}

	// Ограничиваем скорость перемещения
	const moveStep = Math.sign(diff) * Math.min(Math.abs(diff), maxSpeed);
	currentLeft += moveStep;
	thumb.style.left = `${currentLeft}%`;

	// Проверяем достижение цели во время движения
	if (currentLeft > 95 && checkTargetReached()) {
		setTimeout(() => {}, 100);
	}

	// Продолжаем анимацию
	animationFrameId = requestAnimationFrame(smoothMove);
}

// Функция проверки достижения цели
function checkTargetReached() {
	const thumbRect = thumb.getBoundingClientRect();
	const targetRect = target.getBoundingClientRect();

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
	e.preventDefault();

	// Останавливаем текущую анимацию
	if (animationFrameId) {
		cancelAnimationFrame(animationFrameId);
		animationFrameId = null;
	}
});

document.addEventListener("mousemove", e => {
	if (!isDragging) return;

	const containerRect = container.getBoundingClientRect();
	const trackRect = track.getBoundingClientRect();

	let newLeft = e.clientX - containerRect.left;

	// Ограничиваем движение в пределах трека
	newLeft = Math.max(trackRect.left - containerRect.left, newLeft);
	newLeft = Math.min(trackRect.right - containerRect.left, newLeft);

	// Вычисляем процентное положение
	targetLeft =
		((newLeft - (trackRect.left - containerRect.left)) / trackRect.width) * 100;

	// Запускаем плавное движение
	if (!animationFrameId) {
		animationFrameId = requestAnimationFrame(smoothMove);
	}

	// Проверяем достижение цели
	if (targetLeft > 95 && checkTargetReached()) {
		setTimeout(() => {}, 100);
	}
});

document.addEventListener("mouseup", () => {
	if (isDragging) {
		isDragging = false;
		thumb.style.cursor = "grab";
		const audio = document.getElementById("bgMusic");
		audio.volume = 0.05;

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
		}
	}
});

// Touch события
thumb.addEventListener("touchstart", e => {
	isDragging = true;
	e.preventDefault();

	if (animationFrameId) {
		cancelAnimationFrame(animationFrameId);
		animationFrameId = null;
	}
});

document.addEventListener("touchmove", e => {
	if (!isDragging) return;

	const containerRect = container.getBoundingClientRect();
	const trackRect = track.getBoundingClientRect();
	const touch = e.touches[0];

	let newLeft = touch.clientX - containerRect.left;

	newLeft = Math.max(trackRect.left - containerRect.left, newLeft);
	newLeft = Math.min(trackRect.right - containerRect.left, newLeft);

	targetLeft =
		((newLeft - (trackRect.left - containerRect.left)) / trackRect.width) * 100;

	if (!animationFrameId) {
		animationFrameId = requestAnimationFrame(smoothMove);
	}

	if (targetLeft > 95 && checkTargetReached()) {
		setTimeout(() => {}, 100);
	}
});

document.addEventListener("touchend", () => {
	if (isDragging) {
		isDragging = false;
		const audio = document.getElementById("bgMusic");
		audio.volume = 0.05;

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
		}
	}
});
