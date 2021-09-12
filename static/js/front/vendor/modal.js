/** @preserve
 *   jQuery modal
 *  Modal Layer
 *  $(element).modal();
 */
 ;(function($, window, document, undefined) {
	var pluginName = 'modal',
		_uuid = 0;

	$.fn[pluginName] = function ( options ) {
		this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
				FES.UI.log( '[bind] '+pluginName );
			}
		});

		return this;
	};

	$.fn[pluginName].defaults = {
		src : '#',
		type : 'alone',     //'alone', 'group'
		group : '[data-modal-group="anchor"]',
		easing : 'swing',
		speed : 300,
		login : false,
		ajaxType : 'GET',
		auto : false,   // 자동오픈
		autoClose : true,   // 자동닫기
		dim : true,
		dimClose : true,
		onBeforeOpen : null,
		onAfterOpen : null,
		onBeforeClose : null,
		onAfterClose : null,
		onConfirm : null,
		onCancel : null,
		onDestroyComplete : null,
		drag : false,
	};

	function Plugin ( element, options ) {
		this.$body = $('body');
		this.element = element;
		this.$element = $(this.element);
		this._name = pluginName;
		this._defaults = $.fn[pluginName].defaults;
		this.usePointer  = false;

		this.options = $.extend( {}, this._defaults, options);


		this._uuid = ++_uuid;
		this.modalID = pluginName+'-'+this._uuid;
		this.transitionEndName = FES.UI.transitionEndName || 'transitionEndFallback';
		this.isTouchDevice = FES.VARS.IS_HAND_DEVICE;
		this.usedDim = this.options.dim;
		this.$modal = null;
		this.$focusFirst = null;
		this.$focusLast = null;
		this.$trigger = null;
		this.ajaxURL = null;
		this.isMoving = null;
		this.iScroll = null;
		this.resizer = null;
		//this.button = {};
		//this.iScrollTimer = null;

		this.init();
	}

	$.extend( Plugin.prototype, {

		init : function () {
			var plugin = this;
			plugin.buildCache();
			plugin.bindEvents();
		},

		destroy: function() {
			var plugin = this;

			plugin.unBindModalEvent();
			plugin.unbindEvents();
			(plugin.onDestroyComplete !== null) && plugin.onDestroyComplete();
			plugin.$element.removeData("plugin_" + pluginName);
			plugin = null;
		},

		buildCache : function(){
			var plugin = this;
			var _src = plugin.options.src;

			if( _.isString(_src) ){
				if( _src.charAt(0) == '#' && $(_src).length ){
					plugin.modalID = _src;
					plugin.$modal = $(plugin.modalID);
				} else {
					plugin.ajaxURL = _src;
					plugin.options.auto = true;
				}

			} else if( _.isObject(_src) && _src instanceof jQuery ){
				plugin.modalID = plugin._name+'-'+plugin._uuid;
				plugin.$modal = _src;
			}
			plugin.$modalDoc = plugin.$modal.find('[role="document"]');
			plugin.$content = plugin.$modal.find('.c-modal__content');
			plugin.$body = plugin.$modal.find('.c-modal__body');
			plugin.$foot = plugin.$modal.find('.c-modal__foot');
			plugin.$head = plugin.$modal.find('.c-modal__head');


			/*plugin.$foot.find('[data-dismiss]').each(function(){
				var $this = $(this);
				var key = $this.data('dismiss');
				plugin.button[key] = {};
				plugin.button[key].$elem = $this;
				plugin.button[key].html = $this.html();
			})*/
		},

		show : function(){
			var plugin = this;
			plugin.isMoving = true;
			FES.UI.layer.push( plugin );

			if( plugin.options.dim ){
				FES.UI.dim(true,true);
			}

			if( plugin.options.addClass ) {
				plugin.$modal.addClass( plugin.options.addClass );
			}
			plugin.bindIscroll( plugin.$modal.find('.c-modal__scroll') );

			plugin.$modal.show(0,function(){
				plugin.onBeforeOpen();
				plugin.$body.css('height', "calc(100% - "+ plugin.$head.height() +"px)");

//				plugin.$modal.find('.c-modal__scroll').attr('tabindex',0);
				//plugin.$modal.find('.mCustomScrollBox').attr('tabindex',0);
				//console.log("show")
				plugin._addModalHeight();
				if( plugin.$focusFirst == null && plugin.$focusLast == null ){
					plugin.bindModalEvent();
				}
				$(this).addClass('is-active');
			}).one( plugin.transitionEndName ,function(){


				plugin.$bodyScroll = $( plugin.options.bodyScroll );

				if (plugin.$bodyScroll.length) {
					plugin.$bodyScroll.mCustomScrollbar("disable",true);
				}

				if( plugin.options.dimClose ){
					if (FES.UI.dim('get') === null && plugin.options.dim) {
						FES.UI.dim(true,true);
					}
					FES.UI.dim('get').on('click.'+plugin.modalID,function(e){
						e.stopPropagation();
						e.preventDefault();
						if( FES.UI.layer.current() === plugin ){
							plugin.onCancel();
							plugin.hide();
						}
					});
				}

				plugin.$modalDoc.focus();
				plugin.isMoving = false;
				plugin.onAfterOpen();
				//console.log("show1")
				//plugin._addModalHeight();
				//plugin.refreshIscroll();
				//FES.UI.elem.$win.trigger('resize');
			});
			if(plugin.options.drag) {
				plugin.$modal.draggable();
			}
			FES.UI.transitionEndName || plugin.$modal.trigger( plugin.transitionEndName );

		},
		hide : function(){
			var plugin = this;
			if( plugin.isMoving ){
				return
			}

			plugin.isMoving = true;

			FES.UI.layer.pop( plugin.modalID );

			plugin.onBeforeClose();
			plugin.$modal.one( plugin.transitionEndName ,function(){
				$(this).hide();
				plugin.unBindModalEvent();
				plugin.ajaxURL && plugin.remove();
				//plugin.$modal.find('.c-modal__scroll').attr('tabindex',-1);

				if( !_.isNull(plugin.iScroll) ) {
					plugin.iScroll.destroy();
					plugin.iScroll = null;
				}

				if (plugin.$bodyScroll.length) {
					plugin.$bodyScroll.mCustomScrollbar("update");
				}

				if( plugin.options.dim ){

					var isDimClosed = false;

					FES.UI.dim(false,true,onDimClosed);
					var dimCloseTimer = setTimeout(onDimClosed,600);
					function onDimClosed(){
						if( isDimClosed ){
							clearTimeout(dimCloseTimer);
							return;
						}
						isDimClosed = true;
						plugin.onAfterClose();
						plugin.isMoving = false;
						plugin._removeModalHeight();
					}

					if( plugin.options.dimClose ){
						FES.UI.dim('get') && FES.UI.dim('get').off('.'+plugin.modalID);
					}

				} else {

					plugin.onAfterClose();
					plugin.isMoving = false;
					plugin._removeModalHeight();

				}
				plugin.$modal.removeAttr('style');
				plugin.$body.removeAttr('style');
				plugin.$trigger = null;

				if( plugin.options.addClass ) {
					plugin.$modal.removeClass( plugin.options.addClass );
				}

			}).removeClass('is-active');
			// ie 깜빡힘 현상으로 주석처리 :: 2019.10.11
			//plugin._removeModalHeight();
			//console.log("hide")
			//plugin._addModalHeight();
			plugin.$trigger && plugin.$trigger.focus();
			if(plugin.options.drag) {
				plugin.$modal.draggable("destroy");
			}
			FES.UI.transitionEndName || plugin.$modal.trigger( plugin.transitionEndName );
		},
		open : function(){
			var plugin = this;

			if( plugin.isMoving ){
				return
			}

			if ( plugin.options.login ){
				if ( !FES.UI.login.status ){
					// TODO 로그인 체크
					alert('로그인이 필요합니다');
					return ;
				}
			}
			//console.log(plugin.$modal);

			if( plugin.$modal ){
				plugin.show();
				return false;
			}

		},

		close : function(){
			var plugin = this;
			//console.log("check");
			plugin.hide();
			plugin.$body.off('.'+plugin._name+'-'+plugin._uuid);
		},

		_evenCorrector : function( num ){
			num = Math.ceil( num );
			if( num % 2 !== 0){
				num = num + 1;
			}
			return num;
		},

		_addModalHeight : function(){
			var plugin = this,
				_maxHeight =plugin.$modal.css('maxHeight'),
				_styleObject = {},
				_width,
				_height;

			if( _maxHeight === 'none' ){
				return ;
			}

			var modalOffset = plugin.$modal.get(0).getBoundingClientRect();
			_width = plugin._evenCorrector( modalOffset.width );
			_height = plugin._evenCorrector( modalOffset.height );

			if( _maxHeight.indexOf('%') !== -1 ){
				_maxHeight = FES.VARS.VIEWPORT_HEIGHT / 100 * Number( _maxHeight.replace('%', '') );
			} else if ( _maxHeight.indexOf('px') !== -1 ) {
				_maxHeight = Number( _maxHeight.replace('px', '') );
			}
			_maxHeight = plugin._evenCorrector( _maxHeight );
			//console.log("_height", _height)
			//console.log("_maxHeight", _maxHeight)
			if( _height < _maxHeight ){
				_styleObject = {
					width : _width +'px',
					height : 'auto',
					//height : _height+'px',
					marginLeft : -(_width/2) +'px',
					marginTop : -(_height/2) +'px',
					minHeight : _height+'px',
					maxHeight : _maxHeight +'px'
				}
			} else {
				_styleObject = {
					width : _width +'px',
					height : _height+'px',
					marginLeft : -(_width/2) +'px',
					marginTop : -(_height/2) +'px',
					maxHeight : _maxHeight +'px'
				}
			}

			plugin.$modal.css(_styleObject)
		},

		_removeModalHeight : function(){
			var plugin = this;
			plugin.$modal.css({
				width : '',
				height :'',
				minHeight:'',
				maxHeight : ''
			});
		},

		bindIscroll : function( $scroll ){
			var plugin = this;
			if( plugin.iScroll ){
				return;
			}

			if( !plugin.isTouchDevice ){
				if( !$scroll.length ){
					return;
				}
				/*plugin.$scroll = $scroll;
				plugin.iScroll = $scroll.overlayScrollbars({
					overflowBehavior : {
						x : "h"
					}
				}).overlayScrollbars();*/
				if( plugin.iScroll ){
					$scroll.addClass('has-iscroll');
					plugin.$scrollarea = plugin.$modal.find('.os-viewport.os-viewport-native-scrollbars-invisible');
					plugin.scrollTabindex();
				}
			} else {
				$scroll.removeClass('has-iscroll').removeAttr('tabindex');
			}
			plugin.$content = plugin.$modal.find('.c-modal__content');
		},


		/*refreshDotdotdot : function(){
			var plugin = this;
			plugin.$modal.find('[data-js=dot]').each(function(i, el){
				$(this).dotdotdot();
			});
		},*/

		onBeforeOpen : function() {
			var plugin = this,
				onBeforeOpen = plugin.options.onBeforeOpen;
			if ( typeof onBeforeOpen === 'function' ) {
				onBeforeOpen.apply( plugin, [plugin] );
			} else if ( typeof onBeforeOpen === 'string' ){
				if( typeof window[onBeforeOpen] === 'function'){
					window[onBeforeOpen]( plugin );
				}
			}
		},

		onAfterOpen : function() {
			var plugin = this,
				onAfterOpen = plugin.options.onAfterOpen;
			if ( typeof onAfterOpen === 'function' ) {
				onAfterOpen.apply( plugin, [plugin] );
			} else if ( typeof onAfterOpen === 'string' ){
				if( typeof window[onAfterOpen] === 'function'){
					window[onAfterOpen]( plugin );
				}
			}
		},

		onBeforeClose : function() {
			var plugin = this,
				onBeforeClose = plugin.options.onBeforeClose;

			//plugin.unbindIscroll();

			if ( typeof onBeforeClose === 'function' ) {
				onBeforeClose.apply( plugin, [plugin] );
			} else if ( typeof onBeforeClose === 'string' ){
				if( typeof window[onBeforeClose] === 'function'){
					window[onBeforeClose]( plugin );
				}
			}
		},

		onAfterClose : function() {
			var plugin = this,
				onAfterClose = plugin.options.onAfterClose;
			if ( typeof onAfterClose === 'function' ) {
				onAfterClose.apply( plugin, [plugin] );
			} else if ( typeof onAfterClose === 'string' ){
				if( typeof window[onAfterClose] === 'function'){
					window[onAfterClose]( plugin );
				}
			}
		},


		onConfirm : function() {
			var plugin = this,
				onConfirm = plugin.options.onConfirm;
			if ( typeof onConfirm === 'function' ) {
				onConfirm.apply( plugin, [plugin] );
			} else if ( typeof onConfirm === 'string' ){
				if( typeof window[onConfirm] === 'function'){
					window[onConfirm]( plugin );
				}
			}
		},

		onCancel : function() {
			var plugin = this,
				onCancel = plugin.options.onCancel;
			if ( typeof onCancel === 'function' ) {
				onCancel.apply( plugin, [plugin] );
			} else if ( typeof onCancel === 'string' ){
				if( typeof window[onCancel] === 'function'){
					window[onCancel]( plugin );
				}
			}
		},

		onDestroyComplete : function() {
			var plugin = this,
				onDestroyComplete = plugin.options.onDestroyComplete;
			if ( typeof onDestroyComplete === 'function' ) {
				onDestroyComplete.apply( plugin, [plugin] );
			} else if ( typeof onDestroyComplete === 'string' ){
				if( typeof window[onDestroyComplete] === 'function'){
					window[onDestroyComplete]( plugin );
				}
			}
		},

		bindEvents : function(){
			var plugin = this;

			//if( plugin.options.auto ){
			if( plugin.options.type === 'group'){
				plugin.$element.on('click'+'.'+pluginName, plugin.options.group ,function(e){
					e.stopPropagation();
					e.preventDefault();
					plugin.$trigger = $(this);
					plugin.options.auto && plugin.open();
				});
			} else {
				plugin.$element.on('click'+'.'+pluginName,function(e){
					e.stopPropagation();
					e.preventDefault();
					plugin.$trigger = $(this);
					plugin.options.auto && plugin.open();
				});

				if( plugin.options.type === 'input' ) {
					plugin.$element.on('change'+'.'+pluginName,function(e){
						e.stopPropagation();
						e.preventDefault();
						plugin.$trigger = $(this);
						plugin.options.auto && plugin.open();
					});
				}
			}

			if( !plugin.ajaxURL ){
				plugin.$modal.on('open'+'.'+pluginName,function(){
					plugin.open();
				});
			}

			if( plugin.$element.is( plugin.$modal ) ){
				plugin.$modal.on('destroy'+'.'+pluginName, plugin.destroy.bind(plugin) );
			} else {
				plugin.$element.on('destroy'+'.'+pluginName, plugin.destroy.bind(plugin) );
			}



		},

		unbindEvents : function(){
			var plugin = this;

			plugin.$element.off('.'+pluginName);
			plugin.$modal.off('.'+pluginName);

		},

		resizeHandler : function( e ){
			var plugin = this;
			e.stopPropagation();
			plugin.$body.css('height', "calc(100% - "+ plugin.$head.height() +"px)");
			plugin._removeModalHeight();
			//console.log("resize")
			plugin._addModalHeight();
			plugin.resizer = true;
			if( plugin.iScroll ) {
				//plugin.iScroll.update(true);
				plugin.scrollTabindex();
			}

		},

		scrollTabindex : function(){
			var plugin = this;
			FES.MD.DELAY_FUNC(function(){
				if( !plugin.$modal.find('.os-scrollbar-vertical').hasClass('os-scrollbar-unusable') ) {
					plugin.$scrollarea.attr('tabindex',0);
				} else {
					plugin.$scrollarea.attr('tabindex',-1);
				}
			},100)
		},

		bindModalEvent : function(){
			var plugin = this;
			var $content = plugin.$modal.find('.c-modal__content');

			plugin.unBindModalEvent();

			var focusEls = FES.MD.FOCUSABLE( plugin.$modal );

			plugin.$focusFirst = $( focusEls.el_firstFocus );
			plugin.$focusLast = $( focusEls.el_lastFocus );

			plugin.$focusFirst.on('keydown'+'.'+pluginName,function(e){
				if (e.target === this){
					var keyCode = e.keyCode || e.which;
					if (keyCode === 9){
						if (e.shiftKey){
							plugin.$focusLast.focus();
							e.stopPropagation();
							e.preventDefault();
						}
					} else if ( keyCode === 27 ){
						plugin.close();
						e.stopPropagation();
						e.preventDefault();
					}
				}
			});

			plugin.$focusLast.on('keydown'+'.'+pluginName,function(e){
				var keyCode = e.keyCode || e.which;
				if (keyCode === 9){
					if (!e.shiftKey){
						plugin.$focusFirst.focus();
						e.stopPropagation();
						e.preventDefault();
					}
				} else if ( keyCode === 27 ){
					plugin.close();
					e.stopPropagation();
					e.preventDefault();
				}
			});

			plugin.$modal.on('click'+'.'+pluginName, '[data-dismiss]', function(e){
				var _method = $(this).data('dismiss');
				if( _method === 'cancel' || _method === 'confirm'){
					e.stopPropagation();
					(_method === 'confirm') && plugin.onConfirm();
					(_method === 'cancel') && plugin.onCancel();
					if( !plugin.options.autoClose && (_method === 'confirm')) return;
					plugin.close();
				}
			});

			plugin.$modal.on('keydown'+'.'+pluginName,function(e){
				var keyCode = e.keyCode || e.which;

				if (keyCode === 9){
					if (e.shiftKey){
						var evtTarget = e.target;
						if( plugin.$focusFirst.is(evtTarget) ){
							plugin.$focusLast.focus();
							e.stopPropagation();
							e.preventDefault();
						}
					}
				} else if ( keyCode === 27 ){
					plugin.close();
					e.stopPropagation();
					e.preventDefault();
				}

			});


			plugin.$modal.on('dismiss'+'.'+pluginName,function(){
				plugin.close();
			});

			plugin.$modal.on('close'+'.'+pluginName,function(){
				plugin.close();
			});

			/* scroll bugfix focus 팅김현상 방지 코드 :: start */
			plugin.$modal.on('click'+'.'+pluginName + ".mouse", 'input[type="checkbox"] + label, input[type="radio"] + label',function( e ){
				e.preventDefault();
			});
			plugin.$modal.on('mousedown'+'.'+pluginName+".mouse",
				'input[type="checkbox"] + label, input[type="radio"] + label',
				function( e ){
					e.preventDefault();
					var $this = $(this);
					var $input = $this.prev();
					var type = $input.attr('type');
					if( type === 'radio' ) {
						$input.prop('checked', true).focus();
					} else {
						var state = $input.prop('checked');
						$input.prop('checked', !state).focus();
					}
					$input.trigger('change');
				}
			);
			/* scroll bugfix focus 팅김현상 방지 코드 :: end */

			plugin.$modal.resize(plugin.resizeHandler.bind(this));

			FES.UI.elem.$win.on('resize.'+pluginName+'-'+plugin._uuid,function(e){
				e.stopPropagation();
				plugin._removeModalHeight();
				plugin._addModalHeight();
				plugin.resizeHandler(e);
				if( plugin.iScroll ) {
					plugin.iScroll.update(true);
				}
			});
		},



		unBindModalEvent : function(){
			var plugin = this;

			plugin.$focusFirst && plugin.$focusFirst.off('.'+pluginName);
			plugin.$focusLast && plugin.$focusLast.off('.'+pluginName);
			plugin.$modal && plugin.$modal.find('[data-dismiss]') && plugin.$modal.find('[data-dismiss]').off('click'+'.'+pluginName);
			plugin.$modal && plugin.$modal.off('click'+'.'+pluginName);
			plugin.$modal && plugin.$modal.off('click'+'.'+pluginName+".mouse");
			plugin.$modal && plugin.$modal.off('mousedown'+'.'+pluginName+".mouse");
			plugin.$modal && plugin.$modal.off('keydown'+'.'+pluginName);
			plugin.$modal && plugin.$modal.off('dismiss'+'.'+pluginName);
			plugin.$modal && plugin.$modal.off('close'+'.'+pluginName);
			plugin.$modal && plugin.$modal.off('update'+'.'+pluginName);
			plugin.resizer && plugin.$modal.removeResize(plugin.resizeHandler);
			FES.UI.elem.$win.off('.'+pluginName+'-'+plugin._uuid);
			plugin.$focusFirst = null;
			plugin.$focusLast = null;
			plugin.resizer = false;
		},

		// for ajax Modal
		remove : function(){
			var plugin = this;
			plugin.$modal.off('.'+pluginName);
			plugin.$modal.remove();
			plugin.$modal = null;
		}
	});


})(jQuery, window, document);

