"use strict"

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

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

// if (isMobile.any()) {
// 	document.body.classList.add('touch');

// 	let menuArrows = document.querySelectorAll('.menu__arrow');
// 	if (menuArrows.length > 0) {
// 		for (let index = 0; index < menuArrows.length; index++) {
// 			const menuArrow = menuArrows[index];
// 			menuArrow.addEventListener("click", function (e) {
// 				menuArrow.parentElement.classList.toggle('active');
// 			});
// 		}
// 	}
// } else {
// 	document.body.classList.add('pc');
// }

//..........................................................................................................................


//Бургер
const iconMenu = document.querySelector(".menu__icon");
if (iconMenu) {
	const menuBody = document.querySelector(".menu__body");
	const subMenuBody = document.querySelector(".sub-menu");
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle("lock");
		iconMenu.classList.toggle("active");
		menuBody.classList.toggle("active");
		subMenuBody.classList.remove("active");
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

let swiperQualification = new Swiper(".qualificationSwiper", {
	slidesPerView: 4,
	freeMode: true,
	breakpoints: {
		359.98: {
			slidesPerView: 2,
		},
		767.98: {
			slidesPerView: 3,
		},
		1010.98: {
			slidesPerView: 4,
		},
	},
});


let ctxMain = document.querySelector('#myChart').getContext('2d');
let myChart = new Chart(ctxMain, {
	type: 'line',
	data: {
		labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
		datasets: [{
			label: 'false',
			data: [0, 200, 190, 170, 180, 160, 165, 170, 200, 210, 215, 210, 205, 200, 205, 220, 250, 305, 325, 320, 305, 300, 250, 240, 240, 240, 240, 230, 205, 180, 160],
			backgroundColor: ['white'],
			borderColor: ['#adc896'],
			borderWidth: 4,
			tension: 0.4,
			radius: 0
		}, {
			label: 'false',
			data: [0, 110, 130, 180, 230, 280, 300, 305, 305, 305, 305, 295, 285, 250, 240, 240, 240, 240, 240, 245, 285, 280, 305, 300, 295, 285, 275, 275, 280, 290, 300],
			backgroundColor: ['white'],
			borderColor: ['#6c7f6d'],
			borderWidth: 4,
			tension: 0.4,
			radius: 0
		}, {
			type: 'bar',
			label: 'Наивысший показатель',
			data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 320, 0, 0, 0, 0, 0, 0, 0],
			backgroundColor: ['#cfdec3'],
			categoryPercentage: 3
		}, {
			type: 'bar',
			label: 'Самый низкий показатель',
			data: [0, 0, 195, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			backgroundColor: ['#cfdec3'],
			categoryPercentage: 3
		}
		]
	},
	options: {
		plugins: {
			legend: {
				display: false
			}
		},
		elements: {
			bar: {
				borderRadius: 5
			}
		}
	}
});

let ctxLeft = document.querySelector('#myCharLeft').getContext('2d');
let myChartLeft = new Chart(ctxLeft, {
	type: 'bar',
	data: {
		labels: ["Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь", "Январь"],
		datasets: [{
			label: 'total',
			data: [4000, 4000, 4000, 4000, 4000, 4000],
			backgroundColor: ['#eaede9'],
			borderColor: ['#eaede9'],
			borderWidth: 0,
			tension: 0.4,
			grouped: false,
			order: 1
		}, {
			label: 'Командный обьем',
			data: [1400, 1700, 2000, 2500, 1400, 3400],
			backgroundColor: ['#e3e1c6', '#98b089'],
			borderColor: ['#e3e1c6', '#98b089'],
			borderWidth: 0,
			tension: 0.4,
		},
		]
	},
	options: {
		plugins: {
			legend: {
				display: false
			}
		},
		elements: {
			bar: {
				borderRadius: 10
			}
		}
	}
});

let ctxRight = document.querySelector('#myCharRight').getContext('2d');
let myChartRight = new Chart(ctxRight, {
	type: 'bar',
	data: {
		labels: ["Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь", "Январь"],
		datasets: [{
			label: 'total',
			data: [70, 70, 70, 70, 70, 70],
			backgroundColor: ['#eaede9'],
			borderColor: ['#eaede9'],
			borderWidth: 0,
			tension: 0.4,
			grouped: false,
			order: 3
		}, {
			label: 'false',
			data: [30, 30, 25, 10, 40, 15],
			backgroundColor: ['#738772'],
			borderColor: ['#738772'],
			borderWidth: 0,
			tension: 0.4,
		}, {
			label: 'false',
			data: [21, 15, 55, 40, 5, 60],
			backgroundColor: ['#adc896'],
			borderColor: ['#adc896'],
			borderWidth: 0,
			tension: 0.4,
		}
		]
	},
	options: {
		plugins: {
			legend: {
				display: false
			}
		},
		elements: {
			bar: {
				borderRadius: 10
			}
		}
	}
});


$(document).ready(function () {
	$('.lang-top__link').click(function (event) {
		$(this).toggleClass('active').next().slideToggle(300);
	});

	$('.menu-page__link-arrow').click(function (event) {
		$(this).toggleClass('active').next().slideToggle(300);
	});

	$('.teamleaders__btn').click(function (event) {
		$('.teamleader-hidden-columns').slideToggle(300);
	});
	$('.teamleaders__btn').click(function () {
		if ($(this).attr('data-show') === "true") {
			$(this).html("закрыть");
			$(this).attr('data-show', "false");
		}
		else {
			$(this).html("смотреть больше");
			$(this).attr('data-show', "true");
		}
	});
});

jQuery(($) => {
	if ($(window).width() < 850.98) {
		$('.menu__link-header-active').click(function (event) {
			$(this).toggleClass('active').next().slideToggle(300);
		});
	}

	$('.menu__sub-link-beauty').click(function (event) {
		$('.sub-menu').addClass('active');
	});
	$('.sub-menu__back').click(function (event) {
		$('.sub-menu').removeClass('active');
	});
	$('.sub-menu__title').click(function (event) {
		$(this).toggleClass('active').next().slideToggle(300);
	});
});