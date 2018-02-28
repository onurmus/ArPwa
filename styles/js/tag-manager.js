var 	listTagManager = {
	el: { btn: '.ems-container .emosInfinite > li.ems-prd', promotion: '.popular-prd-slider .swiper-slide:not(".swiper-slide-duplicate"), .main-slider .swiper-slide:not(".swiper-slide-duplicate")', paging: '[id$="lblPaging"] span.paging' },
	trimText: function( k ){ return k.trim();},
	detectEl: function( ID ){ return ID.length > 0 ? true : false; },
	getPrc: function( ID ){
		var _t = this, k = ID.eq( 0 ).text() || '';
		return parseFloat( k.replace(/\./, '').replace(/\,/, '.') ) 
	},
	getActivePaging: function(){
		var _t = this,  k = parseFloat( _t.trimText( $( _t.el.paging ).text() || '1' ) ) - 1, lng = 12;
		return k * lng
	},
	getCat: function(){
		var k = $('.navigasyon.urunNavigasyon:eq(0) a')
				.map(function(){
					return ( $( this ).text() || '' ).trim();
				})
				.get()
				.join('index.html');
		
		return k;
	},
	getObj: function( o ){
		var _t = this, ID = o['id'], typ = o['typ'] || 'list', obj;
		if( typ == 'list' )
			obj = { id: _t.trimText( ID.find('.ems-prd-code').eq( 0 ).text() || '' ), name: _t.trimText( ID.find('.ems-prd-name').eq( 0 ).text() || '' ), price: _t.getPrc( ID.find('.urunListe_satisFiyat').eq( 0 ) ), 'category': _t.getCat() /*$('.navigasyon.urunNavigasyon a:last-child').eq( 0 ).text() || ''*/, position: ( ID.index() + 1 ) + _t.getActivePaging() };
		else if( typ == 'promotion' ){
			var ord = _t.trimText( ID.attr('data-order') || '' ), n = _t.detectEl( ID.parents('.main-slider') ) ? { typ: 'leftBanner-', name: ID.parents('.main-slider').find('.headline-holder [data-order$="'+ ord +'"] p').text() || '' } : { typ: 'rightBanner-', name: _t.trimText( ID.find('.title').text() || '' ) };
			obj = { 'id': _t.trimText( ord ), 'name': n['name'], 'creative': n['typ'] + ord, 'position': 'slot'  + ord };
		}
		return obj;
	},
	sendGa: function( o ){
		var _t = this, ID = o['ID'] || '', typ = o['typ'] || '', obj = _t.getObj({ id: ID }), uri = ID.find('.ems-prd-image a').eq( 0 ).attr('href') || '';
		if( typ == 'click' ){
			dataLayer.push({
				'event': 'productClick',
				'ecommerce': {
					'actionField': {'list': listTypeTagManager },
					'click': {
						'products': [ obj ]
					}
				},
				'eventCallback': function(){
					if( uri != '' ) 
						document.location = uri;
				}
			});
		}else if( typ == 'hover' ){
			console.log('hover', obj);
			dataLayer.push({
				'ecommerce': {
					'impressions': [ obj ]
				}
			});
		}else if( typ == 'all' ){
			
			obj = $( _t.el.btn ).map(function(){
				var n = _t.getObj({ id: $( this ) }); 
					n['list'] = listTypeTagManager;
                return n;
            }).get();
			console.log('all', obj);
			dataLayer.push({
				'ecommerce': {
					'currencyCode': 'TL',
					'impressions': obj
				}
			});
		}else if( typ == 'proAll' ){
			obj = $( _t.el.promotion ).map(function(){
                return _t.getObj({ id: $( this ), typ: 'promotion' });
            }).get();
			console.log('proAll', obj);
			dataLayer.push({
				'ecommerce': {
					'promoView': {
						'promotions': obj
					}
				}
			});
		}else if( typ == 'proClick' ){
			obj = _t.getObj({ id: ID, typ: 'promotion' });
			uri = ID.find('a').eq( 0 ).attr('href') || '';
			dataLayer.push({
				'event': 'promotionClick',
				'ecommerce': {
				  'promoClick': {
					'promotions': [ obj ]
				  }
				},
				'eventCallback': function(){
				  document.location = uri;
				}
		    });
		}
	},
	addEvent: function(){
		var _t = this, e = $( _t.el.btn );
		if( _t.detectEl( e ) ){
			e
			.unbind('mouseenter click')
			.bind('mouseenter', function(){ _t.sendGa({ ID: $( this ), typ: 'hover' }); })
			//.bind('click', function(){  _t.sendGa({ ID: $( this ), typ: 'click' }); })
			.find('a:not(".enerji-sinifi")')
			.unbind('click')
			.bind('click', function( e ){ 
				e.preventDefault(); 
				_t.sendGa({ ID: $( this ).parents('li').eq( 0 ), typ: 'click' });
			});
			
			_t.sendGa({ ID: $( _t.el.btn ), typ: 'all' });
		}
	},
	initPromation: function(){
		var _t = this, e = $( _t.el.promotion );
		if( _t.detectEl( e ) ){
			_t.sendGa({ ID: $( _t.el.promotion ), typ: 'proAll' });
			
			e
			.bind('click', function(){  _t.sendGa({ ID: $( this ), typ: 'proClick' }); })
			.find('a')
			.unbind('click')
			.bind('click', function( e ){ e.preventDefault(); });
			
		}	
	},
	init: function(){
		if( typeof dataLayer !== 'undefined' )
			this.addEvent();
	}
};
function onListLoaded(){ listTagManager.init(); }
$(window).load(function(){
	if( typeof dataLayer !== 'undefined' ){ 
		listTagManager.initPromation();
		
		if( listTypeTagManager != 'page-home' )
			onListLoaded();
	}
});
stage.addEventListener("CustomEvent", [ { type: "ListLoaded", handler: "onListLoaded" } ]);