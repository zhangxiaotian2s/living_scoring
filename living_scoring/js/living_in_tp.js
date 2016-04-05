var livingInTp = function() {
	this.section_box = $('#sectionlistbox');
	this.loading = $("#loding");
	this.box_height = 561;
	this.api_living_tp = "http://tournament.development.mastergolf.cn/api/screen_livescoring/tp_screen_with_playerscores?uuid=";
	this.api_sponsors = "http://tournament.development.mastergolf.cn//api/screen_livescoring/screen_in_sponsors?uuid=";
	this.api_aside_rank = "http://tournament.development.mastergolf.cn/api/screen_livescoring/tp_screen_in_teams?uuid=";
	this.tp_uuid = "7101bde9-44a6-4a01-98d2-60d0342a7701";
	this.sponsors_uuid = "8b85891f-0307-4e02-b7e5-abbeae99e4c7";
	this.action_time = "5000";

	this.color_style = getUrlParam('color_style');
	this.pattern = getUrlParam('pattern');
	this.group_index = 0; //标识group 的变化
	this.group_teams_length = 0;

	this.scroll_bottom = $('#scrollbottom');
	this.scroll_bottom_box = $('#scrollbottombox');
	this.par = $("#par");
	this.tablelist_ol = $("#tablelistol");
	this.header_title = $("#headtitle");
	this.aside_list_ol = $('#aside_list_ol');
};
livingInTp.prototype.init = function() {
	var self = this;
	self.setTime();
	self.setBrowser();
	self.ajaxGetApiLivingTpData();
	self.ajaxGetSponsorsData();
	$('body').addClass(self.color_style);
	$('body').addClass(self.pattern);
	//如果存在左侧的边栏
	if (self.aside_list_ol.length > 0) {
		self.ajaxGetAsideRankDate()
	}
};

//ajax获取 数据 data
livingInTp.prototype.ajaxGetApiLivingTpData = function() {
	var self = this;
	$.ajax({
		type: "get",
		url: self.api_living_tp + self.tp_uuid,
		success: function(data) {
			if (data.code == 10000 || data.code == 200) {
				self.setGroupsDome(data.data.groups)
				self.setHeadMes(data.data);
			}
		},
		error: function() {

		}
	});
};
//ajax获取
livingInTp.prototype.ajaxGetSponsorsData = function() {
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
//ajax获取左侧排行数据
livingInTp.prototype.ajaxGetAsideRankDate = function() {
	var self = this;
	$.ajax({
		type: "get",
		url: self.api_aside_rank + self.tp_uuid,
		success: function(data) {
			if (data.code == 200 || data.code == 10000) {
				self.setAsideListDome(data.data)
			}
		},
		error: function() {}
	});
};
//添加左侧l列表
livingInTp.prototype.setAsideListDome = function(aisdedata) {
	var self = this;
	console.log(aisdedata)
	for (var i = 0; i < aisdedata.length; i++) {
		self.setAsideLiDome(aisdedata[i].teams)
	}
};
livingInTp.prototype.setAsideLiDome = function(teamdata) {
	var self = this;
	var _html = ""
	_html += '<li><table border="0" cellspacing="0" cellpadding="0" width="100%" class="tablestyle1 tableaside" id="aside_list"><tbody>';
	for (var i = 0; i < teamdata.length; i++) {
		_html += '<tr>'
		_html += '<td width="12.5% " class="fz14">'+teamdata[i].position+'</td>'
		_html += '<td width="12.5%" class="fz14"><img src="'+teamdata[i].image+'"></td>'
		_html += '<td width="50%" class="fz14">'+teamdata[i].team_name+'</td>'
		_html += '<td width="12.5%" class="fz14">'+teamdata[i].score+'</td>'
		_html += '<td width="12.5%" class="fz14">'+teamdata[i].total+'</td>'
		_html += '</tr>'
	}
	_html += '</tbody></table></li>'
   	 self.aside_list_ol[0].innerHTML+=_html;
};
//赞助商
livingInTp.prototype.setSponsorsDome = function(data) {
	var self = this;
	var _html = "";
	for (var i = 0; i < data.length; i++) {
		_html += '<li><img src="' + data[i].name + '"  /></li>';
	}
	self.scroll_bottom.html(_html);
	self.scrollBottomAction();
};
//初始化设置头部信息
livingInTp.prototype.setHeadMes = function(data) {
	var self = this;
	self.header_title.html(data.groups[self.group_index].round_name);
	$("#course").html(data.course);
	$("#logo").attr('src', data.logo);
	self.setParDome(data.groups[self.group_index].par);
};
//添加par数据的方法
livingInTp.prototype.setParDome = function(datapar) {
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
	_html += "<td></td><td></td>";
	self.par.html(_html);
};
//列表数据总起与此处
livingInTp.prototype.setGroupsDome = function(data) {
	var self = this;
	self.tablelist_ol.html("");
	for (var i = 0; i < data.length; i++) {
		//		self.group_index = i
		for (var j = 0; j < data[i].team_detail.length; j++) {
			self.group_teams_length++;
			self.setLiDome(data[i].team_detail[j], data[i].par, i);
		}
	}
	//删除loading
	self.loading.remove();
	self.scrollTableAction(data);
};
//拆分 主体一个li 的内容添加
livingInTp.prototype.setLiDome = function(data, datapar, group_index) {
	var self = this;
	var _html = "";
	_html += '<li data-group-index="' + group_index + '"><table class="full_table tableitem" width="100%" border="0" cellspacing="0" cellpadding="0">';
	_html += '<tr class="full_table_h"><td width="3.5%">' + data.position + '</td><td width="12.5%" class="bright"></td><td colspan="1"><img src="' + data.image + '" width="30px" height="20px"></td><td colspan="20" class="text-left">' + data.team_name + '</td><td width="3.5%"><span >' + data.today + '</span></td><td width="3.5%"><span>' + data.score + '</span></td></tr>';
	for (var i = 0; i < data.players_detail.length; i++) {
		_html += '<tr>';
		_html += '<td width="3.5%"></td>';
		_html += '<td width="12.5%" class="bright">' + data.players_detail[i].name + '</td>';
		_html += self.setOneStrokeDome(data.players_detail[i], datapar);
		_html += '<td width="3.5%"><span>' + data.players_detail[i].today + '</span></td>';
		_html += '<td width="3.5%"><span>' + data.players_detail[i].score + '</span></td>';
		_html += '</tr>';
	}
	_html += '</table></li>';
	self.tablelist_ol[0].innerHTML += _html;
};
//拆分主题 一个组的列表的添加
livingInTp.prototype.setOneStrokeDome = function(data, datapar) {
	var self = this;
	var _html = "";
	for (var i = 0; i < data.stroke.length; i++) {
		var _style = data.stroke[i] - datapar[i];
		if ((i == 9 || i == 19 || i == 20) && data.stroke[i] != null) {
			_html += '<td width="3.5%"><span><em>' + data.stroke[i] + '</em></span></td>';
		} else if (data.stroke[i] == null) {
			_html += '<td width="3.5%"><span><em>-</em></span></td>';
		} else if (_style < -1) {
			_html += '<td width="3.5%"><span class="b_1"><em>' + data.stroke[i] + '</em></span></td>';
		} else if (_style == -1) {
			_html += '<td width="3.5%"><span class="b_2"><em>' + data.stroke[i] + '</em></span></td>';
		} else if (_style == 0) {
			_html += '<td width="3.5%"><span class="b_3"><em>' + data.stroke[i] + '</em></span></td>';
		} else if (_style == 1) {
			_html += '<td width="3.5%"><span class="b_4"><em>' + data.stroke[i] + '</em></span></td>';
		} else if (_style == 2) {
			_html += '<td width="3.5%"><span class="b_5"><em>' + data.stroke[i] + '</em></span></td>';
		} else if (_style > 2) {
			_html += '<td width="3.5%"><span class="b_6"><em>' + data.stroke[i] + '</em></span></td>';
		}
	}
	return _html;
};

//浏览器类型判断 如果IE 就引导用户去下载火狐和谷歌
livingInTp.prototype.setBrowser = function() {
	if ($.NV('name') == "" || $.NV('name') == "unkonw") {
		var _html = '<div class="browsehappy"> 您的浏览器不支持本页面,建议使用<a href="http://www.googlechromer.cn/">谷歌</a>，<a href="http://www.firefox.com.cn/">火狐</a>浏览器</div>';
		$('body').append(_html);
	}
};
//设置显示当前时间
livingInTp.prototype.setTime = function() {
	var self = this
	var _time = $("#nowTime");
	var _data = new Date().Format("MM月dd日  hh:mm");
	_time.html(_data);
};
//左侧滚动的时间处理
livingInTp.prototype.scrollAsideAction=function(index){
	  var self=this;
	  var _height=-432;
	  	self.aside_list_ol.css({
	  		"-webkit-transition": "1s linear",
			"-moz-transition": "1s linear",
			"-o-transform": "1s linear",
			"transition": "1s linear",
			"-webkit-transform": "translateY("+_height*index+"px)",
			"-moz-transform": "translateY("+_height*index+"px)",
			"-o-transform": "translateY("+_height*index+"px)",
			"transform": "translateY("+_height*index+"px)",
	  	})
};
//底部广告滚动动作
livingInTp.prototype.scrollBottomAction = function() {
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
		var _li_first = $('#scroll_bottom').children("li").eq(0);
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
			})
		})
	};
	//当ul 小于box 的时候不做滚动效果
	if ((_width * _li.length) > _box_width) {
		var_timer_sponsors = setInterval(function() {
			scrollFn();
		}, self.action_time)
	}
};
//递减尾部追加 无限循环效果
livingInTp.prototype.scrollTableAction = function(data) {
		var self = this;
		var _tablelist_ol = $(document).find("#tablelistol");
		//获取所有li长度
		var _list_length = _tablelist_ol.children('li').length
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
			_list_first.css({
				"-webkit-transition": "1s linear",
				"-moz-transition": "1s linear",
				"-o-transform": "1s linear",
				"transition": "1s linear",
				"margin-top": -_list_first.height() + 'px'
			})
			_list_first.on('transitionend', function() {
				_tablelist_ol.append(_list_first);
				_list_first.css({
					"-webkit-transition": "0s linear",
					"-moz-transition": "0s linear",
					"-o-transform": "0s linear",
					"transition": "0s linear",
					"margin-top": "0px"
				});
			})
		};

		var _table_list_timer = setInterval(function() {
			tableListScrollFn()
		}, self.action_time)
	}
	//翻转内容动作
livingInTp.prototype.roatexAction = function() {
	var self = this;
	var _table_list = self.section_box.children('.Listitem'),
		_table_list_length = _table_list.length;
	//计算角度
	var _d = 360 / _table_list_length,
		_r = (self.box_height / 2) / Math.tan(_d / 360 * Math.PI);
	//循环添加样式CSS3样式初始布局
	_table_list.each(function(index) {
		$(this).css({
			"-webkit-transform": "rotateX(-" + _d * index + "deg)  translateZ(" + _r + "px)",
			"-moz-transform": "rotateX(-" + _d * index + "deg)  translateZ(" + _r + "px)",
			"-o-transform": "rotateX(-" + _d * index + "deg)  translateZ(" + _r + "px)",
			"transform": "rotateX(-" + _d * index + "deg)  translateZ(" + _r + "px)",
		});
	});
	var _rindex = 0; //累加参数
	function actionFn(index) {
		//添加css3 动作
		self.section_box.css({
			"-webkit-transition": "2s linear",
			"-moz-transition": "2s linear",
			"-o-transform": "2s linear",
			"transition": "2s linear",
			"-webkit-transform": "rotateX(" + _d * index + "deg)",
			"-moz-transform": "rotateX(" + _d * index + "deg)",
			"-o-transform": "rotateX(" + _d * index + "deg)",
			"transform": "rotateX(" + _d * index + "deg)"
		});
	};
	self.section_box.on('transitionend', function() {
		setTimeout(function() {
			_rindex++;
			actionFn(_rindex);
		}, 3000);
	});
	if (_table_list_length > 1) {
		actionFn(_rindex);
	}
};