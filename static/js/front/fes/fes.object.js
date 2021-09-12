var FES = FES || {};
FES.VARS = FES.VARS || {};
FES.VARS.IS_HTML = ( $('html').hasClass('is-html') );
FES.VARS.USERAGENT = navigator.userAgent.toLowerCase();
FES.VARS.IS_HAND_DEVICE = false;                                    // 핸드 드바이스 체크 변수
FES.VARS.IS_SIZE = FES.VARS.IS_SIZE || {};                          // 반응형시 SIZE OBJECT
FES.VARS.IS_SIZE.MAXMOBILE = 768;                                   // 반응형시 MOBILE 최대값
FES.VARS.IS_SIZE.MAXTABLET = 1024;                                  // 반응형시 TABLET 최대값

FES.MD = FES.MD || {};
FES.DEV = FES.DEV || {};
FES.UI = FES.UI || {};

FES.VARS.VIEWPORT_WIDTH = null;                                     // WIDTH
FES.VARS.VIEWPORT_HEIGHT = null;                                    // HEIGHT
