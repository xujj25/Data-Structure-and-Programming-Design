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

	ma.briefInfoSet = {
		'北门': '东校园北门广场',
		'超算': '国家超级计算广州中心',
		'真草': '东校园东田径场',
		'图书馆': '东校区图书馆',
		'工学院': '中山大学工学院广场',
		'游泳馆': '东校园游泳馆及健身房',
		'隧道': '东校园隧道',
		'新天地': 'GOGO新天地商业中心',
		'一饭': '东校园学生第一饭堂',
		'花坛': '东校园生活区中心花坛',
	}

	ma.properties = {
		'startPlace': "",
		'endPlace': "",
		'route': null,
		'routeLength': 0,
		'timeCost': 0,
		'transportation': "",
	}

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
		this.addPath();
	}

	ma.addPath = function() {
		var start = {};
		var end = {};
		// $('svg').html('<path id="path_12" d="M 487 1207 L 605 1092 551 1048"/>');
		// console.log($('#place_1').offset().top, $('#place_1').offset().left);
		// $('path').hide();
		// console.log(this.shortest_path);
	}

	ma.listenRouteQueryClick = function() {
		var that = this;
		$('#routeQuery').click(function(event) {
			if ($(event.target).hasClass('underRestore')) {
				that.restore();
			} else {
				$('#infoContainer').slideUp(100);
				$('#confirmBox').slideDown(200);
			}
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

	ma.setPlaceProper = function(enFlag1, placeName) {
		var that = this;
		$('.place').each(function(index, el) {
			if (($(this).attr('title')).substr(3) == placeName) {
				$(this).attr('class', 'place ' + enFlag1 + 'Place');
				that.properties[enFlag1 + 'Place'] = placeName;
				return false;
			}
		});
	}

	ma.setSelect = function(flag, placeName) {
		var zhFlag = (flag ? '终点' : '起点');
		var enFlag1 = (flag ? 'start' : 'end');
		var enFlag2 = ((!flag) ? 'start' : 'end');
		if (($('#' + enFlag2 + 'Result').html()).substr(3) == placeName) {
			alert('请选择与'+ zhFlag +'不同的地点！');
		} else {
			this.setPlaceProper(enFlag1, placeName);
			$('#' + enFlag1 + 'Result').html('已选:' + placeName);
			$('#' + enFlag1 + 'Result').attr('class', 'result chosenResult');
		}
		$('#placeSelect').slideUp();
	}

	ma.listenSelect = function() {
		var that = this;
		$('#placeSelect td').click(function(event) {
			var placeName = $(event.target).html();
			that.setSelect($('#selectTip').html() == '请选择起点', placeName);
		});
	}

	ma.changeRouteQueryButton = function(flag) {
		if (flag) {
			$('#routeQuery').html('还原地图');
			$('#routeQuery').addClass('underRestore');
		} else {
			$('#routeQuery').html('路线查询');
			$('#routeQuery').removeClass('underRestore');
		}
	}

	ma.showResult = function() {
		this.changeRouteQueryButton(true);
		$('#placeName').html('查询结果：');
		$('#briefInfo').html('起点：' + this.properties['startPlace']
							 + '<br>终点：' + this.properties['endPlace']
							 + '<br>路线如图，长度约' + this.properties['routeLength'] + '米'
							 + '<br>' + this.properties['transportation']
							 + '需要约' + this.properties['timeCost'] + '分钟');
		$('#imgBox').css('background-image', 'none');
		$('#confirmBox').slideUp(100);
		$('#infoContainer').slideDown(200);
	}

	ma.setRouteProper = function() {
		// this.properties['routeLength'] = 3500;
		this.properties['transportation'] = $('.chosenTab').html();
		this.properties['timeCost'] =
			(this.properties['routeLength'] /
			 (this.properties['transportation'] == '步行' ? 70 : 500));
		this.quitQuery();
	}

	ma.listenAgree = function() {
		var that = this;
		$('#agree').click(function(event) {
			that.setRouteProper();
			//窗口定位至起点
			$("html,body").animate({scrollTop:$(".startPlace").offset().top - 260}, 'fast');
			that.showResult();
		});
	}

	ma.listenPlaceInfoQuery = function() {
		var that = this;
		$('.place').click(function(event) {
			console.log($(event.target).offset().top + ' ' + $(event.target).offset().left);
			$('#confirmBox').slideUp(100);
			$('#infoContainer').slideDown(200);
			var placeName = ($(event.target).attr('title')).substr(3);
			$('#placeName').html('地名：' + placeName);
			$('#briefInfo').html('简介：' + that.briefInfoSet[placeName]);
			$('#imgBox').css('background-image', 'url(\"../img/spot/' + ($(this).index()) + '.jpg\")');
		});
	}

	ma.listenCloseInfo = function() {
		$('#closeTag').click(function(event) {
			$('#infoContainer').slideUp(100);
		});
	}

	ma.restore = function() {
		this.changeRouteQueryButton(false);
		$('.place').attr('class', 'place normalPlace');
		$('#infoContainer').slideUp(100);
	}

	// 0 -- 北门  1 -- 超算 2 -- 真草 3 -- 图书馆 4 -- 工学院 5 -- 游泳馆 6 -- 隧道 7 -- 新天地 8 -- 一饭 9 -- 花坛

	var max = 10000;
	ma.path_length = new Array(
		   [0, 400, max, 500, max, max, max, max, max, max],
		   [400, 0, 500, 600, max, max, max, max, max, max],
		   [max, 500, 0, 100, max, 500, max, 300, max, max],
		   [500, 600, 100, 0, 780, 300, max, 250, max, max],
		   [max, max, max, 780, 0, 500, 600, max, max, max],
		   [max, max, 500, 300, 500, 0, 500, 500, max, max],
		   [max, max, max, max, 600, 500, 0, max, 400, 500],
		   [max, max, 300, 250, max, 500, max, 0, 300, max],
		   [max, max, max, max, max, max, 400, 300, 0, 100],
		   [max, max, max, max, max, max, 500, max, 100, 0]);  // path_length[i][j]为无向图各条边的长度（即实际距离）

	ma.shortest_path = new Array(10);  // shortest_path[i][j]为从点i到点j的最短距离

	// 使用floyed算法先求出每一对顶点之间的最短路径和具体的路径
	ma.path = (function() {

		var prev = new Array(10);  // prev[i][j]存储从点i到点j的路径上，点j的前一个点的序号

		for (var i = 0; i < 10; i++) {
			ma.shortest_path[i] = new Array(10);
			prev[i] = new Array(10);

			for (var j = 0; j < 10; j++)  {
				ma.shortest_path[i][j] = ma.path_length[i][j];
				prev[i][j] = ma.shortest_path[i][j] != max ? i : -1;
			}
		}

		for (var k = 0; k <  10; k++)
			for (var i = 0; i < 10; i++)
				for (var j = 0; j < 10; j++) {
					if (ma.shortest_path[i][k] + ma.shortest_path[k][j] < ma.shortest_path[i][j]) {
						ma.shortest_path[i][j] = ma.shortest_path[i][k] + ma.shortest_path[k][j];
						prev[i][j] = prev[k][j];
					}
				}

		return prev;
	}) ();

	ma.findShortestPath = function(start, end) {
		var way = [];
		way[0] = end;

		while (ma.path[start][end] != start) {
			way.push(ma.path[start][end]);
			end = ma.path[start][end];
		}

		way.push(start);
		return way.reverse();
	};
})();