'use strict';

function Sticky(elem, settings) {

	(settings) ? this.settings = settings : this.settings = {};

	this.elem = elem;
	this.$elem = $(elem);
	this.parent = this.elem.parentNode;
	this.elemValues = elem.getBoundingClientRect();
	this.windowH = document.documentElement.clientHeight;
	this.stikWrapper = document.createElement('div');

	this.lastScrollingValue = window.pageYOffset;
	this.elDefaultValue = elem.getBoundingClientRect();
	this.fixedBt = false;
	this.fixedTp = false;
	this.staticBt = false;
	this.needTopFix = this.stikWrapper.getBoundingClientRect().top <= 0;
	this.botVisible = this.elem.getBoundingClientRect().bottom <= this.windowH;
	this.outOfParent = this.parent.getBoundingClientRect().bottom <= this.elem.getBoundingClientRect().bottom

	this.init();
}

Sticky.prototype.init = function() {

	this.initWrapper(this.elem, this.stikWrapper);

	$(window).on('scroll', function() {
		this.updateColumn();
	}.bind(this));

	if (this.elemValues.height > window.innerHeight) {
		this.onScrollDown();
	} else {
		if (this.needTopFix) {
			this.fixedTop();
		} else {
			this.static();
		}
	}
};
Sticky.prototype.updateColumn = function() {
	var tooBig = this.elemValues.height > window.innerHeight,
		tooSmall = !tooBig;

	this.needTopFix = this.stikWrapper.getBoundingClientRect().top <= 0;

	var st = window.pageYOffset;
	if (tooBig) { // если высота блока больше высоты вьюпорта
		if (st > this.lastScrollingValue){
			this.onScrollDown();
		} else {
			if (st == this.lastScrollingValue) { return false; }
			this.onScrollUp();
		}
	}
	if (tooSmall){ // если высота блока меньше высоты вьюпорта
		if (this.needTopFix) {
			this.fixedTop();
		} else {
			this.static();
		}
	}
	this.lastScrollingValue = window.pageYOffset; // последние значение скролинга
};
Sticky.prototype.initWrapper = function(el, wrapper) { // оборачиваем фиксированый блок
	el.parentNode.insertBefore(wrapper, el);
	wrapper.appendChild(el);

	this.stikWrapper.id = "stik-wrap";
	this.stikWrapper.classList.add('stik-wrap');
	this.stikWrapper.style.height = this.elDefaultValue.height + 'px';
};
Sticky.prototype.fixedBottom = function() { // фиксируем за нижнюю часть
	if (this.fixedBt) {return false}
	this.fixedBt = true;
	this.fixedTp = false;
	this.staticBt = false;
	this.$elem.addClass('fixed').attr('style', "bottom: 0px;");
}
Sticky.prototype.fixedTop = function() { // фиксируем за верхнюю часть
	if (this.fixedTp) {return false}
	this.fixedBt = false;
	this.fixedTp = true;
	this.staticBt = false;
	this.$elem.addClass('fixed').attr('style', "top: 0px; margin-top: 0px;");
}
Sticky.prototype.static = function () { // приводим в дефолтное положение
	this.fixedBt = false;
	this.fixedTp = false;
	this.staticBt = false;
	this.$elem.removeClass('fixed').removeAttr('style');
}
Sticky.prototype.staticBottom = function() { // ставим верхний отступ для переключения фиксаций
	if (this.staticBt) {return false}
	this.staticBt = true;
	this.fixedTp = false;
	this.fixedBt = false;
	var marginTop = Math.abs(this.stikWrapper.getBoundingClientRect().top) - Math.abs(this.elem.getBoundingClientRect().top);

	this.$elem.attr('style', "margin-top:" + marginTop + "px;").removeClass('fixed');
};
Sticky.prototype.onScrollUp = function() {
	if (this.elem.getBoundingClientRect().top >= 0 && this.needTopFix) { // когда верхняя часть попала во вьюпорт
		this.fixedTop();
	} else {
		if (!this.staticBt) {
			this.staticBottom();
		}
		if (this.stikWrapper.getBoundingClientRect().top >= 0) {
			this.$elem.attr('style', "margin-top: 0px;").removeClass('fixed');
		}
	}
};
Sticky.prototype.onScrollDown = function() {
	this.botVisible = this.elem.getBoundingClientRect().bottom <= this.windowH;

	if (this.botVisible) { // когда нижняя часть попала во вьюпорт
		this.outOfParent = this.parent.getBoundingClientRect().bottom <= this.elem.getBoundingClientRect().bottom
		if (this.outOfParent && this.settings.stikInParent) { // если блок вылазит за пределы родителя
			this.staticBottom();
		} else {
			this.fixedBottom();
		}
	} else {
		if (!this.staticBt) {
			this.staticBottom();
		}
	}
};

// exemple settings
{
	stikInParent: true
}