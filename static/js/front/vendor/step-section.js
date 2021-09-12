;(function($, window, document, undefined) {
	var pluginName = 'uiStep';

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
		isInit : false,
		openindex : 0,
		label : '[data-js="step-section__label"]',
		container : '[data-js="step-section__container"]',
		content : '[data-js="step-section__content"]',
		anchor : '[data-js="step-section__anchor"]',
		panel : '[data-js="step-section__panel"]',
		passClass : 'is-pass',
		activeClass : 'is-active',
		anchorIsButton : false,
	};

	function Plugin ( element, options ) {
		this.element = element;
		this._defaults = $.fn[pluginName].defaults;
		this.isFlag = false;
		this.options = $.extend( {}, this._defaults, options);
		this.init();
	}

	$.extend( Plugin.prototype, {

		init : function () {
			this.buildCache();
			this.bindEvents();
			if( !_.isNull(this.options.openindex) ){
				if (this.options.openindex !== 0) {
					this.old = this.options.openindex-1;
				}
				this.new = this.options.openindex;
				this.open( this.new );

			}
		},

		buildCache : function(){
			var plugin = this;
			plugin.scrollbarWidth = ( FES.VARS.VIEWPORT_HEIGHT < FES.UI.elem.$body.height() ) ? FES.UI.getScrollWidth() : 0;
			plugin.$wrap = $( plugin.element );
			plugin.$label =  plugin.$wrap.find( plugin.options.label );
			plugin.$container = plugin.$wrap.find( plugin.options.container );
			plugin.$content = plugin.$wrap.find( plugin.options.content );
			plugin.$anchor = plugin.$wrap.find( plugin.options.anchor );
			plugin.$panel = plugin.$wrap.find( plugin.options.panel );
			plugin.width = plugin.$content.width() - plugin.scrollbarWidth;
			plugin.$content.parent().css({
				width: plugin.width
			})
			plugin.$anchor.each(function(idx){
				var $this = $(this);
				$this.data('index', idx);
				plugin.$panel.eq(idx)
					.css({
						width: plugin.width
					})
					.data('index', idx);
			})
			plugin.new = 0;
			plugin.old = 0;
		},

		getLeft : function(){
			var plugin = this;
			var left;
			if (plugin.new > plugin.old) {
				left = -plugin.width
			} else {
				left = 0
			}
			return left;
		},

		open : function( idx ){
			var plugin = this;
			var $openPanel = plugin.$panel.eq(idx);
			$openPanel.addClass('is-active');
			gsap.killTweensOf( plugin.$wrap );
			plugin.stepActive();
			function openComplete(){
				plugin.isFlag = false;
				plugin.$content.removeAttr('style');
				if (plugin.options.isInit) {
					plugin.$panel.eq(plugin.old).removeClass('is-active');
				} else {
					plugin.options.isInit = true;
				}
				plugin.$panel.eq( plugin.add ).addClass('is-active');
			}

			if (plugin.new < plugin.old) {
				gsap.set(plugin.$content, { marginLeft: -plugin.width });
			}


			var openTween = {
				marginLeft : plugin.getLeft(),
				ease: Power2.easeOut,
				onComplete : openComplete
			};
			plugin.isFlag = true;
			FES.UI.elem.$win.scrollTop(0);
			gsap.to( plugin.$content, 0.7, openTween);

		},

		prev: function(){
			var plugin = this;
			if (plugin.new <= 0 ) return;
			plugin.old = plugin.new;
			plugin.new--;
			plugin.open(plugin.new);
		},

		next: function(){
			var plugin = this;
			if (plugin.new >= plugin.$panel.length - 1) return ;
			plugin.old = plugin.new;
			plugin.new--;
			plugin.open(plugin.new);
		},

		stepActive: function(){
			var plugin = this;
			var label = plugin.$panel.eq(plugin.new).data('panelLabel');
			plugin.$label.text( label );
			plugin.$anchor.removeClass(plugin.options.passClass);
			plugin.$anchor.removeClass(plugin.options.activeClass);
			for (var i = 0, len = plugin.$anchor.length; i < len; i++) {
				if (i < plugin.new) {
					plugin.$anchor.eq(i).addClass(plugin.options.passClass);
				}
				if (i === plugin.new) {
					plugin.$anchor.eq(plugin.new).addClass(plugin.options.activeClass);
					break;
				}
			}
		},

		resize: function(){
			var plugin = this;
			plugin.$wrap.removeAttr('style');
			plugin.$panel.removeAttr('style');
			var resizeSection = _.debounce(function(){
				plugin.width = plugin.$content.width();
				plugin.$content.parent().css({
					width: plugin.width
				});
				plugin.$anchor.each(function(idx){
					plugin.$panel.eq(idx)
						.css({
							width: plugin.width
						})
				})
			}, 100);
			resizeSection();
		},

		bindEvents : function() {
			var plugin = this;
			if (plugin.options.anchorIsButton) {
				plugin.$anchor.on('click' + "." + pluginName, function () {
					var $this = $(this);
					var openIdx = $this.data('index');
					if ($this.hasClass(plugin.options.activeClass)) return;
					if (plugin.isFlag) return;
					plugin.old = plugin.new;
					plugin.new = openIdx;
					plugin.open(openIdx);
				})
			}

			FES.UI.elem.$win.resize( function(){
				plugin.resize();
			} )
		},
	});

})(jQuery, window, document);
