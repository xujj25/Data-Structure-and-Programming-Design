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
		this.listenCloseInfoContainer();
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
			$(this).attr('id', that.placeSet[index]);
			$(this).html(that.placeSet[index] + '(' + index + ')');
		});
		// this.addPath();


		$('path').hide();
		$('.place').each(function(index, el) {
			$(this).html(index);
		});
	}
/*
	ma.hasDirectPathBetweenVertexes = function(v1, v2) {
		var flag = (this.path_length[v1][v2] > 0 && this.path_length[v1][v2] != max);
		console.log(flag, this.path_length[v1][v2]);
		return flag;
	}

	ma.getPathVertexCoordinate = function(vtx) {
		return {
			x: $('#place_' + vtx).offset().left + 18,
			y: $('#place_' + vtx).offset().top + 56,
		}
	}

	ma.addSingleDirectPathOnMap = function(v1, v2) {
		var pathId = '\"path_' + v1 + v2 + '\"';
		var startVertex = this.getPathVertexCoordinate(v1);
		var endVertex = this.getPathVertexCoordinate(v2);
		var pathStr = '<path id=' + pathId + ' d=\"M ' + startVertex.x + ' ' + startVertex.y
						+ ' L ' + endVertex.x + ' ' + endVertex.y + '\"></path>';
		$('svg').html($('svg').html() + pathStr);
	}

	ma.addPath = function() {
		var preIdx = 0;
		var afterIdx = 1;
		for (preIdx = 0; preIdx < 9; preIdx ++) {
			for (afterIdx = preIdx + 1; afterIdx < 10; afterIdx ++) {
				if (this.hasDirectPathBetweenVertexes(preIdx, afterIdx)) {
					this.addSingleDirectPathOnMap(preIdx, afterIdx);
				}
			}
		}
	}*/

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
		$('.place').attr('class', 'place normalPlace');
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
				$('.' + enFlag1 + 'Place').attr('class', 'place normalPlace');
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
			var placeName = $(event.target).attr('id');
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

	ma.showPath = function() {
		//补丁：对以工学院为起点或终点的路线，如果交通方式是开车，需要先绕行至游泳馆
		if (this.properties['transportation'] == '开车') {
			if (this.pathStartIdx == 4) {
				this.pathStartIdx = 5;
				this.properties['routeLength'] = this.shortest_path[this.pathStartIdx][this.pathEndIdx]
												 + this.shortest_path[4][5];
				this.properties['timeCost'] = Math.ceil(this.properties['routeLength'] / 500);
				$('#path_45').show();
			} else if (this.pathEndIdx == 4) {
				this.pathEndIdx = 5;
				this.properties['routeLength'] = this.shortest_path[this.pathStartIdx][this.pathEndIdx]
												 + this.shortest_path[4][5];
				this.properties['timeCost'] = Math.ceil(this.properties['routeLength'] / 500);
				$('#path_45').show();
			}
		}
		//结束补丁
		var pathFound = this.findShortestPath(this.pathStartIdx, this.pathEndIdx);
		for (var idx = 0; idx < pathFound.length - 1; idx ++) {
			if (pathFound[idx] < pathFound[idx + 1])
				$('#path_' + pathFound[idx] + pathFound[idx + 1]).show();
			else
				$('#path_' + pathFound[idx + 1] + pathFound[idx]).show();
		}
	}

	ma.showResult = function() {
		this.changeRouteQueryButton(true);
		this.showPath();
		$('#placeName').html('查询结果：');
		$('#briefInfo').html('起点：' + this.properties['startPlace'] + '(' + $('.startPlace').text() + ')'
							 + '<br>终点：' + this.properties['endPlace'] + '(' + $('.endPlace').text() + ')'
							 + '<br>路线如图，长度约' + this.properties['routeLength'] + '米'
							 + '<br>' + this.properties['transportation']
							 + '需要约' + this.properties['timeCost'] + '分钟');
		$('#imgBox').css('background-image', 'none');
		$('#confirmBox').slideUp(100);
		$('#infoContainer').slideDown(200);
	}

	ma.setRouteProper = function() {
		this.pathStartIdx = parseInt($(".startPlace").html());
		this.pathEndIdx = parseInt($(".endPlace").html());
		this.properties['transportation'] = $('.chosenTab').html();
		this.properties['routeLength'] =
			this.shortest_path[this.pathStartIdx][this.pathEndIdx];
		this.properties['timeCost'] =
			Math.ceil(this.properties['routeLength'] /
			 (this.properties['transportation'] == '步行' ? 70 : 500));
	}

	ma.listenAgree = function() {
		var that = this;
		$('#agree').click(function(event) {
			var notChosenResult = ($('.notChosenResult'));
			if (notChosenResult.length != 0) {
				alert('路线端点未选择齐全!');
			} else {
				that.setRouteProper();
				//窗口定位至起点
				$("html,body").animate({scrollTop:$(".startPlace").offset().top - 260}, 'fast');
				that.showResult();
				that.quitQuery();
			}
		});
	}

	ma.listenPlaceInfoQuery = function() {
		var that = this;
		$('.place').click(function(event) {
			console.log($(event.target).offset().top + ' ' + $(event.target).offset().left);
			that.quitQuery();
			$('#infoContainer').slideDown(200);
			var placeName = ($(event.target).attr('title')).substr(3);
			$('#placeName').html('地名：' + placeName);
			$('#briefInfo').html('编号：' + $(event.target).text() + '<br>简介：' + that.briefInfoSet[placeName]);
			$('#imgBox').css('background-image', 'url(\"../img/spot/' + ($(this).index()) + '.jpg\")');
		});
	}

	ma.listenCloseInfoContainer = function() {
		$('#closeTag').click(function(event) {
			$('#infoContainer').slideUp(100);
		});
	}

	ma.restore = function() {
		this.changeRouteQueryButton(false);
		$('.place').attr('class', 'place normalPlace');
		$('path').hide();
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