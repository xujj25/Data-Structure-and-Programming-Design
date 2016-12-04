(function() {
	$(function() { new MapApp(); });

	var MapApp = function() {
		this.init();
		this.listenRouteQueryClick();
		this.listenTabToggle();
		this.listenQueryQuit();
		this.listenSelectRequest();
		this.listenSelect();
		this.listenAgree();
		this.listenPlaceInfoQuery();
		this.listenCloseInfo();
	}

	var ma = MapApp.prototype;

	ma.placeSet = ['北门', '超算', '真草',
					'图书馆', '工学院', '游泳馆',
					'隧道', '新天地', '一饭', '花坛'];

	ma.init = function() {
		$('#placeSelect').hide();
		$('#confirmBox').hide();
		// $('#infoContainer').hide();
		var that = this;
		$('.place').each(function(index, el) {
			$(this).attr('title', '地名：' + that.placeSet[index]);
		});
		$('td').each(function(index, el) {
			$(this).html(that.placeSet[index]);
		});
	}

	ma.listenRouteQueryClick = function() {
		$('#routeQuery').click(function(event) {
			$('#confirmBox').slideDown(100);
		});
	}

	ma.listenTabToggle = function() {
		$('.tab').click(function(event) {
			var tempclass = $('#walkTab').attr('class');
			$('#walkTab').attr('class', $('#carTab').attr('class'));
			$('#carTab').attr('class', tempclass);
		});
	}

	ma.quitQuery = function() {
		$('#placeSelect').hide();
		$('#confirmBox').slideUp(50);
		$('.result').attr('class', 'result notChosenResult');
		$('.result').html('未选择！');
	}

	ma.listenQueryQuit = function() {
		var that = this;
		$('#quit').click(function(event) {
			that.quitQuery();
		});
	}

	ma.showPlaceSelect = function(_eventTarget) {
		$('#placeSelect').slideDown();
		if (_eventTarget == 'startSelect') {
			$('#selectTip').html('请选择起点');
		} else {
			$('#selectTip').html('请选择终点');
		}
	}

	ma.listenSelectRequest = function() {
		var that = this;
		$('#selectContainer button').click(function(event) {
			var _eventTarget = $(event.target).attr('id');
			that.showPlaceSelect(_eventTarget);
		});
	}

	ma.listenSelect = function() {
		$('#placeSelect td').click(function(event) {
			var placeName = $(event.target).html();
			if ($('#selectTip').html() == '请选择起点') {
				if (($('#endResult').html()).match(/:.*/) == (':' + placeName)) {
					alert('请选择与终点不同的地点！');
				} else {
					$('#startResult').html('已选:' + placeName);
					$('#startResult').attr('class', 'result chosenResult');
					$('#placeSelect').slideUp();
				}
			} else {
				if (($('#startResult').html()).match(/:.*/) == (':' + placeName)) {
					alert('请选择与起点不同的地点！');
				} else {
					$('#endResult').html('已选:' + placeName);
					$('#endResult').attr('class', 'result chosenResult');
					$('#placeSelect').slideUp();
				}
			}
		});
	}

	ma.listenAgree = function() {
		var that = this;
		$('#agree').click(function(event) {
			that.quitQuery();
			$("html,body").animate({scrollTop:$(".startPlace").offset().top - 260}, 'fast');  //窗口定位至起点
		});
	}

	ma.briefInfoSet = {
		'北门': '东校园北门广场',
		'超算': '国家超级计算中心',
		'真草': '东校园东田径场',
		'图书馆': '东校区图书馆',
		'工学院': '中山大学工学院广场',
		'游泳馆': '东校园游泳馆及健身房',
		'隧道': '东校园隧道',
		'新天地': 'GOGO新天地商业中心',
		'一饭': '东校园学生第一饭堂',
		'花坛': '东校园生活区中心花坛',
	}

	ma.listenPlaceInfoQuery = function() {
		var that = this;
		$('.place').click(function(event) {
			$('#infoContainer').slideDown(100);
			var placeName = ($(event.target).attr('title')).substr(3);
			$('#placeName').html('地名：' + placeName);
			$('#briefInfo').html('简介：' + that.briefInfoSet[placeName]);
		});
	}

	ma.listenCloseInfo = function() {
		$('#closeTag').click(function(event) {
			$('#infoContainer').slideUp(100);
		});
	}
})();