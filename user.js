(function(){
	var ctrlPressed = false, slots = {}, orderSlot = [];
	
	var eventOnKeyPress = function(evt){
		var e = window.event || evt,
			key = (e.keyCode || e.which);
		ctrlPressed = e.ctrlKey;
	};
	window.addEventListener('keydown',eventOnKeyPress);
	window.addEventListener('keyup',eventOnKeyPress);
	var list = document.getElementsByClassName('audio'),counter = 0;
	setInterval(function(){
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
			}
		}
	},200);
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
	for(var i=0;i<list.length;i++)
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
}());
