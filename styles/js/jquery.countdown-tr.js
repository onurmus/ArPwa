/* http://keith-wood.name/countdown.html
* Turkish initialisation for the jQuery countdown extension
* Written by Bekir Ahmetoğlu (bekir@cerek.com) Aug 2008. */
(function($) {
	$.countdown.regional['tr'] = {
		labels: ['YIL', 'AY', 'HAFTA', 'GÜN', 'SAAT', 'DAKİKA', 'SANİYE'],
		labels1: ['YIL', 'AY', 'HAFTA', 'GÜN', 'SAAT', 'DAKİKA', 'SANİYE'],
		compactLabels: ['y', 'a', 'h', 'g'],
		whichLabels: null,
		digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
		timeSeparator: ':', isRTL: false};
	$.countdown.setDefaults($.countdown.regional['tr']);
})(jQuery);
