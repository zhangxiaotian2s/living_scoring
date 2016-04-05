var livingInSp = function() {
	this.section_box = $('#sectionlistbox');
	this.loading = $("#loding");
	this.box_height = 561;
	this.scroll_bottom = $('#scrollbottom');
	this.scroll_bottom_box = $('#scrollbottombox');
	this.apilivingsp = "";
	this.action_time = 5000;
	this.api_living_sp = 'http://tournament.development.mastergolf.cn/api/screen_livescoring/sp_screen_with_playerscores?uuid='
	this.sp_uuid = '7bab6e7f-0158-4c0c-a5e5-f05b161fcb26';
	this.api_sponsors = "http://tournament.development.mastergolf.cn//api/screen_livescoring/screen_in_sponsors?uuid=";
	this.api_aside_rank = "http://tournament.development.mastergolf.cn/api/screen_livescoring/sp_screen_in_leaderboard?uuid=";
	this.sponsors_uuid = "8b85891f-0307-4e02-b7e5-abbeae99e4c7";
	this.group_index = 0; //标识group 的变化1

	this.header_title = $("#headtitle");
	this.par = $("#par");
	this.tablelist_ol = $("#tablelistol");
	this.aside_list_ol = $('#aside_list_ol');
	
    this.color_style = getUrlParam('color_style')||"color_style_green"
	this.pattern = getUrlParam('pattern')//"style_pattern";

};
livingInSp.prototype.init = function() {
	var self = this;
	$('body').addClass(self.color_style);
	$('body').addClass(self.pattern);
	self.setBrowser();
	self.setTime();
	self.ajaxGetLivingSpData()
	self.ajaxGetSponsorsData()
	self.ajaxGetAsideRankDate()
};
//设置标题信息
livingInSp.prototype.setHeadMes = function(data) {
	var self = this;
	self.header_title.html(data.groups[self.group_index].round_name);
	$("#course").html(data.course);
	$("#logo").attr('src', data.logo);
	self.setParDome(data.groups[self.group_index].par);
};
//添加par数据的方法
livingInSp.prototype.setParDome = function(datapar) {
	var self = this;
	var _html = "";
	_html += "<td></td><td>PAR</td>";
	for (var i = 0; i < datapar.length; i++) {
		if (i == 9 || i == 19 || i == 20) {
			_html += '<td class="f_b">' + datapar[i] + '</td>';
		} else {
			_html += "<td>" + datapar[i] + "</td>";
		}
	}
	_html += "<td></td><td></td><td></td>";
	self.par.html(_html);
};
//ajax 获取 数据
livingInSp.prototype.ajaxGetLivingSpData = function() {
	var self = this;
	$.ajax({
		type: "get",
		url: self.api_living_sp + self.sp_uuid,
		success: function(data) {
			if (data.code == 200 || data.code == 10000) {
				self.livingSpDataCut(data.data.groups);
				self.setHeadMes(data.data);
				self.loading.remove();
			}
		},
		error: function() {}
	});
};
//对group 进行重新组合
livingInSp.prototype.livingSpDataCut = function(data) {
	var self = this;
	for (var i = 0; i < data.length; i++) {
		self.setLeaderboardArrData(i, data[i].leaderboard, data[i].par);
	}
	self.scrollTableAction(data);
};
//根据leaderboard追加如html
livingInSp.prototype.setLeaderboardArrData = function(index, leaderboardData, parData) {
	var self = this;
	var _length = 10;
	var _arr_max_length = Math.ceil(leaderboardData.length / _length);
	var _arr_leaderboard = [];
	for (var i = 0; i < _arr_max_length; i++) {
		_arr_leaderboard = leaderboardData.splice(0, _length);
		self.setLeaderboardInsertDome(index, _arr_leaderboard, parData)
	}

};
//执行插入HTML 的方法
livingInSp.prototype.setLeaderboardInsertDome = function(index, arrLeaderboard, parData) {
	var self = this;
	var _html = "";
	_html += '<li data-group-index=' + index + '><table class="tablestyle1 sptablestyle" width="100%" border="0" cellspacing="0" cellpadding="0">';
	for (var i = 0; i < arrLeaderboard.length; i++) {
		_html += '<tr>';
		_html += '<td width="3.5%">' + arrLeaderboard[i].position + '</td>';
		if (arrLeaderboard[i].name == null) {
			_html += '<td width="12.5%" class="tdname">-</td>';
		} else {
			_html += '<td width="12.5%" class="tdname fz14">' + arrLeaderboard[i].name + '</td>';
		}
		_html += self.setLeaderboardStroke(arrLeaderboard[i].stroke, parData);
		if (arrLeaderboard[i].today == null) {
			_html += '<td width="3.5%"><span class="c_blur">-</span></td>';
		} else {
			_html += '<td width="3.5%"><span class="c_blur">' + arrLeaderboard[i].today + '</span></td>';
		}
		if (arrLeaderboard[i].thru == null) {
			_html += '<td width="3.5%"><span class="c_blur">-</span></td>';
		} else {
			_html += '<td width="3.5%"><span class="c_blur">' + arrLeaderboard[i].thru + '</span></td>';
		}
		if (arrLeaderboard[i].score == null) {
			_html += '<td width="3.5%"><span class="c_blur">-</span></td>';
		} else {
			_html += '<td width="3.5%"><span class="c_blur">' + arrLeaderboard[i].score + '</span></td>';
		}
		_html += '</tr>';
	}
	_html += '</table></li>';
	self.tablelist_ol[0].innerHTML += _html;

};
//执行插入html 时对Stroke进行样式计算
livingInSp.prototype.setLeaderboardStroke = function(stroke, parData) {
	var _html = ""
	if (stroke == null) {
		for (var i = 0; i < 21; i++) {
			_html += '<td width="3.5%"><span><em>-</em></span></td>';
		}
	} else {
		for (var i = 0; i < stroke.length; i++) {
			if (stroke[i] == null || stroke[i] == "") {
				_html += '<td width="3.5%"><span><em>-</em></span></td>';
			} else if (i == 9 || i == 19 || i == 20) {
				_html += '<td width="3.5%"><span><em>' + stroke[i] + '</em></span></td>';
			} else if (stroke[i] - parData[i] < -1) {
				_html += '<td width="3.5%"><span class="b_1"><em>' + stroke[i] + '</em></span></td>';
			} else if (stroke[i] - parData[i] == -1) {
				_html += '<td width="3.5%"><span class="b_2"><em>' + stroke[i] + '</em></span></td>';
			} else if (stroke[i] - parData[i] == 0) {
				_html += '<td width="3.5%"><span class="b_3"><em>' + stroke[i] + '</em></span></td>';
			} else if (stroke[i] - parData[i] == 1) {
				_html += '<td width="3.5%"><span class="b_4"><em>' + stroke[i] + '</em></span></td>';
			} else if (stroke[i] - parData[i] == 2) {
				_html += '<td width="3.5%"><span class="b_5"><em>' + stroke[i] + '</em></span></td>';
			} else if (stroke[i] - parData[i] > 2) {
				_html += '<td width="3.5%"><span class="b_6"><em>' + stroke[i] + '</em></span></td>';
			}
		}
	}
	return _html;
};

//ajax获取赞助商
livingInSp.prototype.ajaxGetSponsorsData = function() {
	var self = this;
	$.ajax({
		type: "get",
		url: self.api_sponsors + self.sponsors_uuid,
		success: function(data) {
			if (data.code == 200 || data.code == 10000) {
				self.setSponsorsDome(data.data)
			}
		},
		error: function() {

		}
	});
};
//设置赞助商
livingInSp.prototype.setSponsorsDome = function(data) {
	var self = this;
	var _html = "";
	for (var i = 0; i < data.length; i++) {
		_html += '<li><img src="' + data[i].name + '"  /></li>';
	}
	self.scroll_bottom.html(_html);
	self.scrollBottomAction();
};
//ajax获取左侧排行数据
livingInSp.prototype.ajaxGetAsideRankDate = function() {
	var self = this;
	$.ajax({
		type: "get",
		url: self.api_aside_rank + self.sp_uuid,
		success: function(data) {
			if (data.code == 200 || data.code == 10000) {
				self.setAsideListDome(data.data.groups)
			}
		},
		error: function() {}
	});
};
//添加左侧l列表
livingInSp.prototype.setAsideListDome = function(aisdedata) {
	var self = this;
	console.log(aisdedata)
	for (var i = 0; i < aisdedata.length; i++) {
		self.setAsideLiDome(aisdedata[i].leaderboard)
	}
};
livingInSp.prototype.setAsideLiDome = function(leaderboarddata) {
	var self = this;
	var _html = ""
	_html += '<li><table border="0" cellspacing="0" cellpadding="0" width="100%" class="tablestyle1 tableaside" id="aside_list"><tbody>';
	for (var i = 0; i < leaderboarddata.length; i++) {
		_html += '<tr>'
		_html += '<td width="12.5% " class="fz14">' + leaderboarddata[i].position + '</td>'
		_html += '<td width="50%" class="fz14">' + leaderboarddata[i].name + '</td>'
		if (leaderboarddata[i].today == null) {
			_html += '<td width="12.5%" class="fz14">-</td>'
		} else {
			_html += '<td width="12.5%" class="fz14">' + leaderboarddata[i].today + '</td>'
		}
		if (leaderboarddata[i].thru == null) {
			_html += '<td width="12.5%" class="fz14">-</td>'
		} else {
			_html += '<td width="12.5%" class="fz14">' + leaderboarddata[i].thru + '</td>'
		}
		if (leaderboarddata[i].score == null) {
			_html += '<td width="12.5%" class="fz14">-</td>'
		} else {
			_html += '<td width="12.5%" class="fz14">' + leaderboarddata[i].score + '</td>'
		}
		_html += '</tr>'
	}
	_html += '</tbody></table></li>'
	self.aside_list_ol[0].innerHTML += _html;
};

//浏览器类型判断 如果IE 就引导用户去下载火狐和谷歌
livingInSp.prototype.setBrowser = function() {
	if ($.NV('name') == "" || $.NV('name') == "unkonw") {
		var _html = '<div class="browsehappy"> 您的浏览器不支持本页面,建议使用<a href="http://www.googlechromer.cn/">谷歌</a>，<a href="http://www.firefox.com.cn/">火狐</a>浏览器</div>';
		$('body').append(_html);
	}
};
//设置显示当前时间
livingInSp.prototype.setTime = function() {
	var self = this
	var _time = $("#nowTime");
	var _data = new Date().Format("MM月dd日  hh:mm");
	_time.html(_data);
};
//左侧滚动的时间处理
livingInSp.prototype.scrollAsideAction = function(index) {
	var self = this;
	var _height = -432;
	self.aside_list_ol.css({
		"-webkit-transition": "1s linear",
		"-moz-transition": "1s linear",
		"-o-transform": "1s linear",
		"transition": "1s linear",
		"-webkit-transform": "translateY(" + _height * index + "px)",
		"-moz-transform": "translateY(" + _height * index + "px)",
		"-o-transform": "translateY(" + _height * index + "px)",
		"transform": "translateY(" + _height * index + "px)",
	})
};
//底部广告滚动动作
livingInSp.prototype.scrollBottomAction = function() {
	var self = this;
	var _box_width = self.scroll_bottom_box.width();
	var _li = self.scroll_bottom.children('li'),
		_width = _li.width();
	//设置box居中
	self.scroll_bottom.css({
		"width": _width * _li.length + 'px',
		"left": "50%",
		"margin-left": -(_width * _li.length / 2) + 'px'
	});
	//设置滚动方法
	function scrollFn() {
		var _li_first = $('#scrollbottom').children("li").eq(0);
		_li_first.css({
			"-webkit-transition": "1s linear",
			"-moz-transition": "1s linear",
			"-o-transform": "1s linear",
			"transition": "1s linear",
			"width": "0px"
		});
		_li_first.on('transitionend', function() {
			$('#scroll_bottom').children('li').eq(0).remove();
			$('#scroll_bottom').append(_li_first);
			$('#scroll_bottom').children('li').eq(_li.length - 1).css({
				"width": _width + "px"
			});
		});
	};
	//当ul 小于box 的时候不做滚动效果
	if ((_width * _li.length) > _box_width) {
		var_timer_sponsors = setInterval(function() {
			scrollFn();
		}, self.action_time)
	}
};
//递减尾部追加 无限循环效果
livingInSp.prototype.scrollTableAction = function(data) {
	var self = this;
	var _tablelist_ol = $(document).find("#tablelistol");
	//获取所有li长度
	var _list_length = _tablelist_ol.children('li').length;
	//统计执行次数的参数  次数与_listlength相等时刷新当前页面
	var _num = 0;

	function tableListScrollFn() {
		_num++
		if (_num == _list_length) {
			window.location.reload()
		}
		var _list_first = _tablelist_ol.children("li").eq(0);
		//要根据第二个来设置大标题
		var _group_index = _list_first.next('li').attr('data-group-index');
		if (self.group_index != _group_index) {
			self.group_index = _group_index;
			self.setParDome(data[self.group_index].par);
			self.scrollAsideAction(self.group_index);
			self.header_title.html(data[self.group_index].round_name);
		}
		_tablelist_ol.css({
			"-webkit-transition": "1s linear",
			"-moz-transition": "1s linear",
			"-o-transform": "1s linear",
			"transition": "1s linear",
			"-webkit-transform": "translateY(-" + self.box_height + "px)",
			"-moz-transform": "translateY(-" + self.box_height + "px)",
			"-o-transform": "translateY(-" + self.box_height + "px)",
			"transform": "translateY(-" + self.box_height + "px)"
		})
		_tablelist_ol.on('transitionend', function() {
			_tablelist_ol.append(_list_first);
			_tablelist_ol.css({
				"-webkit-transition": "0s linear",
				"-moz-transition": "0s linear",
				"-o-transform": "0s linear",
				"transition": "0s linear",
				"-webkit-transform": "translateY(0px)",
				"-moz-transform": "translateY(0px)",
				"-o-transform": "translateY(0px)",
				"transform": "translateY(0px)"
			});
		})
	};

	var _table_list_timer = setInterval(function() {
		tableListScrollFn()
	}, self.action_time)
};