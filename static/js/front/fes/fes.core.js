(function($){

	FES.UI = {
		COMPONENTS : {},
		LIBS : {},
		elem : {
			$doc : $(document),
			$win : $(window),
			$html : $('html'),
			$body : $('body'),
			head : document.getElementsByTagName("head")[0],
		},
		events : {
			resize : "resize",
			ready : "ready",
			load : "load",
			click : "click",
			mousewheel : "DOMMouseScroll mousewheel wheel",
			mousemove : "mousemove",
			mousedown : "mousedown",
			mouseup : "mouseup",
			touchstart : "touchstart",
			touchmove : "touchmove",
			touchend : "touchend",
			scrolllock: "scrolllock",
			scrollunlock: "scrollunlock"
		},

		log : function( msg, color ){
			if( msg ){
				color || (color = 'red');
				FES.VARS.IS_HTML && window.console.log("%c [DEBUG] " + msg, "color:"+color+";");
			}
		},

		debug : function( msg ){
			if( !FES.VARS.IS_HTML ){
				return;
			}
			if( msg ){
				var $html = '<div id="debug" style="position:fixed;top:0;right:0;z-index:9999;background-color:#000;color:#fff;font-size:14px;"></div>';
				if( !$('#debug').length ){
					$('body').append( $html );
				}
				$('#debug').text( msg );
			}
		},

		transitionRunName : (function(){
			var keys,
				el = document.createElement('fakeelement'),
				transitions = {
					'transition':'transitionrun',
					'OTransition':'oTransitionRun',
					'MozTransition':'transitionrun',
					'WebkitTransition':'webkitTransitionRun'
				};

			for( keys in transitions ){
				if( el.style[keys] !== undefined ){
					return transitions[keys];
				}
			}
		}()),

		transitionStartName : (function(){
			var keys,
				el = document.createElement('fakeelement'),
				transitions = {
					'transition':'transitionstart',
					'OTransition':'oTransitionStart',
					'MozTransition':'transitionstart',
					'WebkitTransition':'webkitTransitionStart'
				};

			for( keys in transitions ){
				if( el.style[keys] !== undefined ){
					return transitions[keys];
				}
			}
		}()),

		transitionEndName : (function(){
			var keys,
				el = document.createElement('fakeelement'),
				transitions = {
					'transition':'transitionend',
					'OTransition':'oTransitionEnd',
					'MozTransition':'transitionend',
					'WebkitTransition':'webkitTransitionEnd'
				};

			for( keys in transitions ){
				if( el.style[keys] !== undefined ){
					return transitions[keys];
				}
			}
		}()),

		animationStartName : (function(){
			var keys,
				el = document.createElement('fakeelement'),
				animations = {
					'animation':'animationstart',
					'OAnimation':'oAnimationStart',
					'MozAnimation':'animationstart',
					'WebkitAnimation':'webkitAnimationStart'
				};
			for( keys in animations ){
				if( el.style[keys] !== undefined ){
					return animations[keys];
				}
			}
		}()),

		animationEndName : (function(){
			var keys,
				el = document.createElement('fakeelement'),
				animations = {
					'animation':'animationend',
					'OAnimation':'oAnimationEnd',
					'MozAnimation':'animationend',
					'WebkitAnimation':'webkitAnimationEnd'
				};

			for( keys in animations ){
				if( el.style[keys] !== undefined ){
					return animations[keys];
				}
			}
		}()),


		getScrollTop : (function(){
			var $wrapper;
			return function(){
				$wrapper = $wrapper || $(window);
				return $wrapper.scrollTop();
			}
		})(),

		getScrollWidth : (function(){
			var _width;
			var _get = function(){
				var outer = document.createElement("div");
				outer.style.visibility = "hidden";
				outer.style.width = "100px";
				outer.style.msOverflowStyle = "scrollbar";

				document.body.appendChild(outer);

				var widthNoScroll = outer.offsetWidth;
				outer.style.overflow = "scroll";

				var inner = document.createElement("div");
				inner.style.width = "100%";
				outer.appendChild(inner);

				var widthWithScroll = inner.offsetWidth;

				outer.parentNode.removeChild(outer);
				return widthNoScroll - widthWithScroll;
			};

			return function() {
				return _width = _width ? _width : _get();
			}
		})(),

		scrollLock : (function(){

			var activeClassName = 'has-modal';
			var $win, $html, $body, isActive;

			return function( setToLock, activeCallback, inactiveCallback){
				$win = $win || $(window);
				$html = $html || $('html');
				$body = $body || $('body');

				if( setToLock ){
					if( isActive ){
						return 'active';
					} else {
						_active();
					}
				} else {
					if( isActive ){
						_inactive( inactiveCallback );
					} else {
						return 'inactive';
					}
				}

				return isActive;
			};

			function _active(){
				var scrollTop = FES.UI.getScrollTop();
				//FES.UI.debug('FES.UI.getScrollTop() : _active '+ scrollTop );
				var scrollbarWidth = ( FES.VARS.VIEWPORT_HEIGHT < $body.height() ) ? FES.UI.getScrollWidth() : 0;
				$body.data('scrollTop',scrollTop)
					.css({
						'marginTop' : '-'+scrollTop+'px',
						'paddingRight' : scrollbarWidth
					});
				$html.addClass( activeClassName );
				$win.trigger(FES.UI.events.scrolllock);
				isActive = true;
			}

			function _inactive( callback ){
				var scrollTop = $body.data('scrollTop');
				//FES.UI.debug('FES.UI.getScrollTop() : _inactive '+ scrollTop );

				$body.css({
					'marginTop' : 0,
					'paddingRight' : 0
				}).removeData('scrollTop');
				$html.removeClass( activeClassName );
				$win.scrollTop( scrollTop ).trigger(FES.UI.events.scrollunlock);

				if( typeof callback === 'function' ){
					callback();
				}

				isActive = false;
			}
		})(),

		layer : (function(){
			var basket = [],
				defaultZindex = 100,
				topZindex = defaultZindex;

			return {
				push : function( layerObj ){
					var exits;

					$.each( basket, function(index, item){
						if( item.id === layerObj.modalID ){
							exits = true;
						}
					});

					if( !exits ){
						basket.push({
							id : layerObj.modalID,
							layer : layerObj
						});
						layerObj.zindex = topZindex+10;

						layerObj.$modal.css('zIndex', layerObj.zindex );
						topZindex = layerObj.zindex;
					}
				},
				pop : function( modalID ){

					var filtered = basket.filter(function(item,index){
						return (item.id !== modalID);
					});

					if( filtered.length ){
						basket = filtered;
						topZindex = basket[basket.length -1].layer.$modal.css('zIndex');
					} else {
						basket = [];
						topZindex = defaultZindex;
					}
				},
				all : function(){
					return basket;
				},
				current : function(){
					return basket[basket.length -1] && basket[basket.length -1].layer;
				},
				usedDim : function(){
					var used = [];

					$.each( basket, function(index,item){
						if( item.layer.usedDim ){
							used.push( index );
						}
					});

					return used.length;
				},
				getZindex : function(){
					return topZindex;
				},
				close : function(){
					if( basket.length ) {
						var target = basket[basket.length - 1];
						target.layer.$modal.trigger('close');
						return true;
					} else {
						return false;
					}
				},
				closeAll : function(){
					if( basket.length ) {
						_.each(basket.slice().reverse(),function(modal){
							modal.layer.close();
						});
					}
				}
			}
		})(),

		dim : (function(){

			var $html, $body, $dim,
				isMoving = false,
				dimedClass = 'o-dimed',
				transitionEndName;

			function _move(){

				$dim.removeClass('is-active').css('zIndex',FES.UI.layer.getZindex()-1).addClass('is-active');

			}

			function _on( withAnimation, callback ){

				var isNewDim = false;

				if( !$dim ){
					isNewDim = true;
					$('<div class="'+dimedClass+'" aria-hidden="true"></div>').prependTo($body);
					$dim = $body.find( '.'+dimedClass );
				}

				if( !isNewDim ){

					_move();

				} else {

					if( withAnimation && !isMoving ){
						isMoving = true;
						$dim.addClass(dimedClass+'--transition').one( transitionEndName, function(){
							isMoving = false;
							(typeof callback === 'function') && callback();
						});
						$dim.get(0).getBoundingClientRect();
						$dim.addClass('is-active');
						FES.UI.scrollLock( true );
						FES.UI.transitionEndName || $dim.trigger(transitionEndName);

					} else {
						FES.UI.scrollLock( true );
						$dim.addClass('is-active');
						(typeof callback === 'function') && callback();
					}

				}
			}

			function _off( withAnimation, callback ){
				if( $dim ){
					if( FES.UI.layer.usedDim() ){
						_move();
						(typeof callback === 'function') && callback();
						return false;
					} else {

						if( withAnimation && !isMoving ){
							isMoving = true;
							$dim.one( transitionEndName, function(){
								isMoving = false;
								$dim.remove();
								$dim = null;
								(typeof callback === 'function') && callback();
							}).removeClass('is-active');

							FES.UI.scrollLock(false);
							FES.UI.transitionEndName || $dim.trigger(transitionEndName);
						} else {
							$dim.remove();
							$dim = null;
							FES.UI.scrollLock(false);
							(typeof callback === 'function') && callback();
						}
					}
				}
			}

			return function( method, withAnimation, callback ){
				$html = $html || $('html');
				$body = $body || $('body');
				transitionEndName = FES.UI.transitionEndName || 'transitionEndFallback';
				if( method === 'get' ){
					return $dim;
				} else {
					method ? _on( withAnimation, callback ) : _off( withAnimation, callback );
				}
			}
		})(),

		modal : (function(){
			return {
				updateOption : function( $el, options ){
					var modalOptions = $el.data('plugin_modal').options;
					$el.data('plugin_modal').options = $.extend( {}, modalOptions, options );
				},
				alert : function( opt ){
					var alertId = 'modal_alert';
					var $alert = $('#' + alertId);
					var $title = $('#' + alertId + '__title');
					var titleText = opt.title || 'Notification'
					if (opt.option) {
						FES.UI.modal.updateOption($alert, opt.option);
					}
					$title.text(titleText);
					$alert.find('.alert-msg').html(opt.text);
					$alert.trigger('open');
				},
				confirm : function( opt ){
					var confirmId = 'modal_confirm';
					var $confirm = $('#' + confirmId);
					var $title = $('#' + confirmId + '__title');
					var titleText = opt.title || 'Confirmation'
					if (opt.option) {
						FES.UI.modal.updateOption($confirm, opt.option);
					}
					$title.text(titleText);
					$confirm.find('.alert-msg').html(opt.text);
					$confirm.trigger('open');
				}
			}
		})(),

		loading : function( target, method, callback ){

			var loading = $('.loading');
			var loadingData = 'loadingOptions';

			loading.each(function() {
				var $this = $(this);
				if ($this.data( loadingData ) === undefined) {
					$this.data( loadingData, $.extend({
						loading : $this,
						loadingBar : $this.find('[data-js=loading]'),
						loadingCheck : false,
						speed : 0.6
					}, $this.data()));
				}
			});

			function loadingOn( target, callback ) {
				var options = $(target).data( loadingData );
				if ( !options.loadingCheck ) {
					options.loading.show();
					options.loadingCheck = true;
					//loadingAnimation( options );
				}
				(typeof callback === 'function') && callback();
			}

			function loadingOff( target, callback ) {

				var options = $(target).data( loadingData );
				if ( options.loadingCheck ) {
					//clearInterval( options.loadingCheck );
					options.loadingCheck = false;
					options.loadingBar.removeAttr('style');
					options.loading.hide();
				}
				(typeof callback === 'function') && callback();

			}

			/*function loadingAnimation( obj ) {
				obj.loadingCheck = true;
				var degree = 0;
				obj.loadingCheck = setInterval(function(){
					if (degree == 360) {
						degree = 0;
					}
					obj.loadingBar.css({
						'-webkit-transform': 'rotate(' + degree + 'deg)',
						'-moz-transform': 'rotate(' + degree + 'deg)',
						'-ms-transform': 'rotate(' + degree + 'deg)',
						'-o-transform': 'rotate(' + degree + 'deg)',
						'transform': 'rotate(' + degree + 'deg)'
					});
					degree++
				}, obj.speed );

			}*/

			if( method === 'get' ){
				return target.data( loadingData );
			} else {
				method ? loadingOn( target, callback ) : loadingOff( target, callback );
			}
		},
	};


})(jQuery);


