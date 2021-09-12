/** @preserve
 *  $(element).combobox();
 *  select tag를 감싸고있는 태그
 *  <div class="element">
 *      <select></select>
 *  </div>
 **/
 ;(function ( $, window, document, undefined ) {

	var pluginName = 'styleCombobox',
		uuid = 0;

	$.fn[pluginName] = function ( options ) {
		this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
				FES.UI.log('[Bind] '+ pluginName , 'pink');
			}
		});

		return this;
	};

	$.fn[pluginName].defaults = {
		button : '[data-js="toggle-select__anchor"]',
		panel : '[data-js="toggle-select__panel"]',
		input : '[data-js="toggle-select__search-input"]',
		item : '[data-js="toggle-select__select-item"]',
		selectBtn : '[data-js="toggle-select__select-btn"]',
		scroll : '[data-js="toggle-select__scroll"]',
		value : '[data-js="toggle-select__search-value"]',
		selectedClassName : 'is-selected',
		disabledClassName : 'is-disabled',
		hiddenClassName : 'is-hidden',
		onBeforeChange : null,
		onAfterChange : null,
		zIndex : 99,
	};


	function Plugin ( element, options ) {
		this.element = element;
		this._name = pluginName;
		this._defaults = $.fn[pluginName].defaults;
		this.options = $.extend( {}, this._defaults, options );
		this.scroll = null;
		this.searchKeyword = "";
		this.init();
	}

	$.extend( Plugin.prototype, {

		buindCache: function(){
			var plugin = this;
			plugin.$wrap = $( plugin.element );
			plugin.$button = plugin.$wrap.find( plugin.options.button );
			plugin.$panel = plugin.$wrap.find( plugin.options.panel );
			plugin.$input = plugin.$wrap.find( plugin.options.input );
			plugin.$value = plugin.$wrap.find( plugin.options.value );
			plugin.$item = plugin.$wrap.find( plugin.options.item );
			plugin.$scroll = plugin.$wrap.find( plugin.options.scroll );
			if (plugin.$wrap.data('maxHeight')) {
				plugin.$scroll.css({
					maxHeight: plugin.$wrap.data('maxHeight')
				})
			}
			var emptyText = plugin.$scroll.data('empty') || 'No data'
			plugin.$scroll.append('<p class="toggle-select__empty" data-js="toggle-select__empty" style="display:none;">'+ emptyText +'</p>');
			plugin.$empty = plugin.$wrap.find( '[data-js="toggle-select__empty"]' );
			plugin.$button.uiToggle({
				isAutoFocus : false,
				$panel : plugin.$panel,
				onAfterOpen: function(){
					if (!FES.VARS.IS_HAND_DEVICE) {
						var $active = plugin.$wrap.find("." + plugin.options.selectedClassName);
						var options = {
							updateOnContentResize: true,
						};
						if ($active.length > 0) {
							options.setTop = $active.position().top + "px";
						}

						if ($active.length > 0) {
							$active.focus();
						} else {
							plugin.$input.focus();
						}
						plugin.$scroll.mCustomScrollbar(options);

					} else {
						plugin.$scroll.css({
							overflowY : "auto"
						});
						plugin.$input.focus();
					}
				},
				onAfterClose: function(){
					plugin.$input.val('');
					plugin.$input.trigger('keyup');
					plugin.$scroll.mCustomScrollbar("destroy")
				}
			});

		},

		bindEvent: function(){
			var plugin = this;

			plugin.$input.on('keyup'+'.'+plugin._name, function(){
				var $this = $(this);
				var val = $this.val();
				plugin.$item = plugin.$wrap.find( plugin.options.item );
				plugin.$item.hide();
				var $visible = plugin.$item.filter(function( index, o ){
					var $item = $(o);
					var text = $item.text();
					return text.toLowerCase().indexOf( val.toLowerCase() ) > -1
				});
				if ($visible.length > 0  ){
					plugin.$empty.hide();
					$visible.show();
				} else {
					plugin.$empty.css('display', 'block');
				}
			});

			plugin.$wrap.on('click'+'.'+plugin._name, plugin.options.selectBtn, function(){
				var $this = $(this);
				var text = $this.text();
				var val = $this.val();
				plugin.$wrap.find(plugin.options.selectBtn).removeClass(plugin.options.selectedClassName);
				$this.addClass(plugin.options.selectedClassName)
				plugin.$button.addClass('toggle-select__anchor--selected');
				plugin.$button.find('span').text(text);
				plugin.$value.val(val);
				plugin.$panel.trigger('close');
			});
		},

		update: function( open ){
			var plugin = this;
			var value = plugin.$value.val();
			var $selected = plugin.$wrap.find(plugin.options.selectBtn).filter(function(index, o){
				var $item = $(o);
				var val = $item.val();
				return val === value
			});
			var text = $.trim($selected.text());
			plugin.$button.find('span').text(text);
			$selected.addClass(plugin.options.selectedClassName);
			if(open){
				plugin.$panel.trigger('open');
				plugin.$input.val(text);
				plugin.$input.trigger('keyup');
			}
		},

		updateOpen: function(){
			var plugin = this;
			plugin.update( true );
		},

		init: function () {
			var plugin = this;
			plugin.buindCache();
			plugin.bindEvent();
		}

	});


})( jQuery, window, document );
