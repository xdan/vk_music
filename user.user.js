// ==UserScript==
// @name XDSoft VKontakte
// @description Script dlya uporyadochennogo proslushivaniya muziki http://xdan.ru/vk.html
// @author Valeriy Chupurnov
// @license MIT
// @version 1.0
// @include http://vk.com/audio*
// @include https://vk.com/audio*
// ==/UserScript==
(function(){
	var ctrlPressed = false, slots = {}, orderSlot = [], counter = 0, timer = 0;
	
	var eventOnKeyPress = function(evt){
		var e = window.event || evt,
			key = (e.keyCode || e.which);
		ctrlPressed = e.ctrlKey;
	};
	window.addEventListener('keydown',eventOnKeyPress);
	window.addEventListener('keyup',eventOnKeyPress);
	var clearSlot = function( id ){
		slots[id].parentNode.removeChild(slots[id]);
		delete slots[id];
	};
	var recalcSlots = function(){
		counter = 0;
		orderSlot = [];
		for(var id in slots){
			slots[id].innerHTML = ++counter;
			orderSlot.push(id);
		}
	};
	var old_length = 0;
	setInterval(function(){
		var list = document.getElementsByClassName('audio');
		if( list.length!=old_length ){
			clearInterval(timer);
			timer = setTimeout(function(){
				if( counter ){
					var bar = parseFloat(document.getElementById('ac_pr_line').style.width);
					if( bar>=99 ){
						var id = orderSlot[0];
						var event = document.createEvent('Event'), 
							elm = document.getElementById(id.replace('audio','play'));
						event.initEvent('click', true, true);
						elm.dispatchEvent(event);
						clearSlot(id);
						recalcSlots();
						timer = setTimeout(arguments.callee,1000);
						return;
					}
				}
				timer = setTimeout(arguments.callee,200);
			},200);
			for(var i=0;i<list.length;i++) {
				if ( ~list[i].className.indexOf('xdsoft_music') )
					continue;
				list[i].addEventListener('mousedown',function(evt){
					var e = window.event || evt;
					if( ctrlPressed ){
						if( !slots[this.id] ){
							console.log('open');
							var div = document.createElement('div');
							slots[this.id] = div;
							div.style.position = 'absolute';
							div.style.marginTop = '-9px';
							div.style.marginLeft = '2px';
							div.className = 'title_wrap';
							div.innerHTML = '';
							this.childNodes[3].appendChild(div);
						}else{
							console.log('close');
							clearSlot(this.id);
						}
						recalcSlots();
					}
					e.preventDefault();
					e.stopPropagation();
					return false;
				});
				list[i].className+=' xdsoft_music';
			}
			old_length = list.length;
		}
	},1000);
}());
