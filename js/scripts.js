
$(document).ready(function() {

	$(".sidebar-nav .lyrow").draggable({
		connectToSortable: ".demo",
		helper: "clone",
		handle: ".drag",
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		drag: function(e, t) {
			t.helper.width(400)
		},
		stop: function(e, t) {
			$(".demo .column").sortable({
				opacity: .35,
				connectWith: ".column",
				start: function(e,t) {
					if (!startdrag) stopsave++;
					startdrag = 1;
				},
				stop: function(e,t) {
					if(stopsave>0) stopsave--;
					startdrag = 0;
				}
			});
			if(stopsave>0) stopsave--;
			startdrag = 0;
		}
	});
	$(".sidebar-nav .box").draggable({
		connectToSortable: ".column",
		helper: "clone",
		handle: ".drag",
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		drag: function(e, t) {
			t.helper.width(400)
		},
		stop: function() {
			handleJsIds();
			if(stopsave>0) stopsave--;
			startdrag = 0;
		}
	});
	
})