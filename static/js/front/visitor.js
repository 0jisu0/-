(function($){

	function stepSectionInit() {
		var $wrap = $('[data-js="step-section"]');
		var $prev = $('[data-js="step-prev"]');
		var $next = $('[data-js="step-next"]');
		$wrap.uiStep({
			//openindex:2
		});
		if (FES.VARS.IS_HTML) {
			var plugin = $wrap.data('plugin_uiStep')
			$prev.on('click', function(){
				plugin.prev();
			})
			$next.on('click', function(){
				plugin.next();
			})
		}
	}

	function selectstyleInit(){
		$('[data-js="toggle-select"]').styleCombobox();
	}

	function scrollboxInit(){
		var $scrollbox = $(".scrollbox");
		if( !FES.VARS.IS_HAND_DEVICE ) {
			$scrollbox.mCustomScrollbar({
				theme: "light-3",
				updateOnContentResize: true,
			});
		}
	}

	function rdoToggle(){
		var $radioGroup = $('[data-js="rdo-toggle"]');
		$radioGroup.each(function(){
			var $group = $(this);
			var $togglePanel = $group.find( '[data-js="rdo-toggle__panel"]' );
			$group.on('change', '[data-js="rdo-toggle__rdo"]', function(){
				var $this = $(this);
				var targetId = $this.data('target');
				$togglePanel.removeClass('is-active');
				$togglePanel.filter(function(idx, item){
					return $(item).data('id') === targetId
				}).addClass('is-active');
			});
		})
	}

	function modalInit() {
		var $alert = $('#modal_alert');
		$alert.modal({
			src: $alert,
			drag : false
		});

		var $confirm = $('#modal_confirm');
		$confirm.modal({
			src: $confirm,
			drag : false
		});
	}

	function toggleInit() {
		var $wrap = $('[data-js="toggle__wrapper"]');
		if( $wrap.length === 0 ) return;
		$wrap.each( function () {
			var $this = $(this);
			var $toggle = $this.find('[data-js="toggle"]');
			var $panel =  $this.find('[data-js="toggle__panel"]');
			$toggle.uiToggle({
				initOpen : $toggle.data('opend'),
				isAutoClose : $toggle.data('autoClose'),
				isAutoFocus : false,
				mode : $toggle.data('mode') || 'static',
				$panel : $panel,
			});
		} );
	}

	function historyBackBind(){
		var $backbtn = $('[data-js="history-back"]');
		$backbtn.on('click', function(){
			window.history.back();
		});
	}

	$(document).ready(function(){

		FES.UI.elem.$doc = $(document);
		FES.UI.elem.$win = $(window);
		FES.UI.elem.$html = $('html');
		FES.UI.elem.$body = $('body');
		FES.UI.elem.head = document.getElementsByTagName("head")[0];

		if ((location.hostname === "localhost" || location.hostname === "127.0.0.1") && (location.port === "4000" || location.port === "3000")) {
			$('html').addClass('is-html');
			FES.VARS.IS_HTML = true;
		}
		FES.MD.CHK_DEVICE();
		stepSectionInit();
		selectstyleInit();
		rdoToggle();
		toggleInit();
		scrollboxInit();
		modalInit();
		historyBackBind();
	})

})(jQuery)
