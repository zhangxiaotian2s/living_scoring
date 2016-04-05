var livingInSp = function() {
	this.section_box = $('#sectionlistbox');
	this.loading = $("#loding");
	this.boxheight = 561;
	this.scrollbottom = $('#scrollbottom');
	this.scrollbottombox = $('#scrollbottombox');
	this.apilivingsp="";
	
};
livingInSp.prototype.init = function() {
	var self = this;
	self.setBrowser();
	self.loading.remove();
	self.roatexAction();
	self.scrollbottomAction();
};

//浏览器类型判断 如果IE 就引导用户去下载火狐和谷歌
livingInSp.prototype.setBrowser = function() {
	if ($.NV('name') == "" || $.NV('name') == "unkonw") {
		var _html='<div class="browsehappy"> 您的浏览器不支持本页面,建议使用<a href="http://www.googlechromer.cn/">谷歌</a>，<a href="http://www.firefox.com.cn/">火狐</a>浏览器</div>';
		$('body').append(_html);
	}
};

//底部广告滚动动作
livingInSp.prototype.scrollbottomAction = function() {
	var self = this;
	var _boxwidth = self.scrollbottombox.width();
	var _li = self.scrollbottom.children('li'),
		_width = _li.width();
	//设置box居中
	self.scrollbottom.css({
		"width": _width * _li.length + 'px',
		"left": "50%",
		"margin-left": -(_width * _li.length / 2) + 'px'
	});
	//设置滚动方法
	function scrollFn() {
		var _firstli = $('#scrollbottom').children("li").eq(0);
		_firstli.css({
			"-webkit-transition": "1s linear",
			"-moz-transition": "1s linear",
			"-o-transform": "1s linear",
			"transition": "1s linear",
			"width": "0px"
		});
		setTimeout(function() {
			$('#scrollbottom').children('li').eq(0).remove();
			$('#scrollbottom').append(_firstli);
			$('#scrollbottom').children('li').eq(_li.length - 1).css({
				"width": _width + "px"
			})
			scrollFn();
		}, 3000)
	};
	//当ul 小于box 的时候不做滚动效果
	if ((_width * _li.length) > _boxwidth) {
		scrollFn();
	}
};
//翻转内容动作
livingInSp.prototype.roatexAction = function() {
	var self = this;
	var _table_list = self.section_box.children('.Listitem'),
		_table_list_length = _table_list.length;
	//计算角度
	var _d = 360 / _table_list_length,
		_r = (self.boxheight / 2) / Math.tan(_d / 360 * Math.PI);
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