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



const rangeSlider = document.querySelector('.range-filter__slider');

noUiSlider.create(rangeSlider, {
	start: [0, 15],
	connect: false,
	range: {
		'min': 0,
		'max': 15
	}
});

const priceStart = document.getElementById('price-start');
const priceEnd = document.getElementById('price-end');
priceStart.addEventListener('change', setPriceValues);
priceEnd.addEventListener('change', setPriceValues);

function setPriceValues() {
	let priceStartValue;
	let priceEndValue;
	if (priceStart.value != '') {
		priceStartValue = priceStart.value;
	}
	if (priceEnd.value != '') {
		priceEndValue = priceEnd.value;
	}
	rangeSlider.noUiSlider.set([priceStartValue, priceEndValue]);
}

$(document).ready(function () {
	$('.lang-top__link').click(function (event) {
		$(this).toggleClass('active').next().slideToggle(300);
	});

	$('.menu-page__link-arrow').click(function (event) {
		$(this).toggleClass('active').next().slideToggle(300);
	});

	// $('.shopping__column').click(function (event) {
	// 	if ($('.shopping__body').hasClass('one')) {
	// 		$('.shopping__column').not($(this)).removeClass('active');
	// 		$('.hide-shopping').not($(this).next()).slideUp(300);
	// 	}
	// 	$(this).toggleClass('active').next().slideToggle(300);
	// });


	$('.shopping__icon-info-top-1').click(function (event) {
		$('.shopping__1-1').toggleClass('active');
		$('.hide-shopping-top-1').slideToggle(300);
	});
	$('.shopping__icon-info-top-2').click(function (event) {
		$('.shopping__1-2').toggleClass('active');
		$('.hide-shopping-top-2').slideToggle(300);
	});
	$('.shopping__icon-info-top-3').click(function (event) {
		$('.shopping__1-3').toggleClass('active');
		$('.hide-shopping-top-3').slideToggle(300);
	});
	$('.shopping__icon-info-top-4').click(function (event) {
		$('.shopping__1-4').toggleClass('active');
		$('.hide-shopping-top-4').slideToggle(300);
	});
	$('.shopping__icon-info-top-5').click(function (event) {
		$('.shopping__1-5').toggleClass('active');
		$('.hide-shopping-top-5').slideToggle(300);
	});
	$('.shopping__icon-info-top-6').click(function (event) {
		$('.shopping__1-6').toggleClass('active');
		$('.hide-shopping-top-6').slideToggle(300);
	});
	$('.shopping__icon-info-top-7').click(function (event) {
		$('.shopping__1-7').toggleClass('active');
		$('.hide-shopping-top-7').slideToggle(300);
	});
	$('.shopping__icon-info-bottom-1').click(function (event) {
		$('.shopping__1-bottom-1').toggleClass('active');
		$('.hide-shopping-bottom-1').slideToggle(300);
	});
	$('.shopping__icon-info-bottom-2').click(function (event) {
		$('.shopping__1-bottom-2').toggleClass('active');
		$('.hide-shopping-bottom-2').slideToggle(300);
	});
	$('.shopping__icon-info-bottom-3').click(function (event) {
		$('.shopping__1-bottom-3').toggleClass('active');
		$('.hide-shopping-bottom-3').slideToggle(300);
	});
	$('.shopping__icon-info-bottom-4').click(function (event) {
		$('.shopping__1-bottom-4').toggleClass('active');
		$('.hide-shopping-bottom-4').slideToggle(300);
	});
	$('.shopping__icon-info-bottom-5').click(function (event) {
		$('.shopping__1-bottom-5').toggleClass('active');
		$('.hide-shopping-bottom-5').slideToggle(300);
	});
	$('.shopping__icon-info-bottom-6').click(function (event) {
		$('.shopping__1-bottom-6').toggleClass('active');
		$('.hide-shopping-bottom-6').slideToggle(300);
	});
	$('.shopping__icon-info-bottom-7').click(function (event) {
		$('.shopping__1-bottom-7').toggleClass('active');
		$('.hide-shopping-bottom-7').slideToggle(300);
	});


	$('.header-mobile-shopping__info-1').click(function (event) {
		$('.mobile-shopping-hide-1').slideToggle(300);
	});
	$('.header-mobile-shopping__info-2').click(function (event) {
		$('.mobile-shopping-hide-2').slideToggle(300);
	});
	$('.header-mobile-shopping__info-3').click(function (event) {
		$('.mobile-shopping-hide-3').slideToggle(300);
	});
	$('.header-mobile-shopping__info-4').click(function (event) {
		$('.mobile-shopping-hide-4').slideToggle(300);
	});
	$('.header-mobile-shopping__info-5').click(function (event) {
		$('.mobile-shopping-hide-5').slideToggle(300);
	});

	$('.header-mobile-shopping__info-bottom-1').click(function (event) {
		$('.mobile-shopping-hide-bottom-1').slideToggle(300);
	});
	$('.header-mobile-shopping__info-bottom-2').click(function (event) {
		$('.mobile-shopping-hide-bottom-2').slideToggle(300);
	});
	$('.header-mobile-shopping__info-bottom-3').click(function (event) {
		$('.mobile-shopping-hide-bottom-3').slideToggle(300);
	});
	$('.header-mobile-shopping__info-bottom-4').click(function (event) {
		$('.mobile-shopping-hide-bottom-4').slideToggle(300);
	});
	$('.header-mobile-shopping__info-bottom-5').click(function (event) {
		$('.mobile-shopping-hide-bottom-5').slideToggle(300);
	});

	$('.shopping-sale__btn-plus').click(function (event) {
		$('.shopping-sale__btn-plus,.item-filter').toggleClass('active');
	});

	$('.checkbox1__label1').click(function (event) {
		$('.checkbox1__list1,.checkbox1__label1').toggleClass('active');
	});

	$('.checkbox2__label2').click(function (event) {
		$('.checkbox2__list2,.checkbox2__label2').toggleClass('active');
	});


	$('.shopping-sale__btn-plus').click(function () {
		if ($(this).attr('data-show') === "true") {
			$(this).html("<span></span>" + "закрыть");
			$(this).attr('data-show', "false");
		}
		else {
			$(this).html("<span></span>" + "добавить фильтр");
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
});