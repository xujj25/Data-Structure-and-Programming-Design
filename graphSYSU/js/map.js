(function() {
	$(function() { new MapApp(); });

	var MapApp = function() {
		this.init();
		this.listenRouteQueryClick();
	}

	var ma = MapApp.prototype;

	ma.init = function() {
		$('#confirmBox').slideUp();
	}

	ma.listenRouteQueryClick = function() {
		$('#routeQuery').click(function(event) {
			$('#confirmBox').slideToggle();
		});
	}
})();