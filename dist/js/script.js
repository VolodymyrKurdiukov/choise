"use strict"

//Проверка на тачскрин
const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},

	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	ios: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.ios() ||
			isMobile.Opera() ||
			isMobile.Windows());
	}
};

if (isMobile.any()) {
	document.body.classList.add('touch');

	let menuArrows = document.querySelectorAll('.menu__arrow');
	if (menuArrows.length > 0) {
		for (let index = 0; index < menuArrows.length; index++) {
			const menuArrow = menuArrows[index];
			menuArrow.addEventListener("click", function (e) {
				menuArrow.parentElement.classList.toggle('active');
			});
		}
	}
} else {
	document.body.classList.add('pc');
}
//..........................................................................................................................


//Бургер
const iconMenu = document.querySelector(".menu__icon");
if (iconMenu) {
	const menuBody = document.querySelector(".menu__body");
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle("lock");
		iconMenu.classList.toggle("active");
		menuBody.classList.toggle("active");
	});
}
//..........................................................................................................................


//IBG
function ibg() {
	let ibg = document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector('img')) {
			ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
		}
	}
}
ibg();


// let swiper = new Swiper(".mySwiper", {
// 	effect: "coverflow",
// 	grabCursor: true,
// 	centeredSlides: true,
// 	slidesPerView: "auto",
// 	coverflowEffect: {
// 		rotate: 0,
// 		stretch: 0,
// 		depth: 200,
// 		modifier: 1,
// 		slideShadows: true,
// 	},
// });


$(document).ready(function () {
	$('.lang-top__link').click(function (event) {
		$(this).toggleClass('active').next().slideToggle(300);
	});

	$('.menu-page__link-arrow').click(function (event) {
		$(this).toggleClass('active').next().slideToggle(300);
	});
});