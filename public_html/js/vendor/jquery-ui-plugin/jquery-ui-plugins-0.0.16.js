/*
 * jQuery UI Combobox 0.0.9
 *
 * Copyright 2012, Chad LaVigne
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php) 
 *
 * http://code.google.com/p/jquery-ui-plugins/wiki/Combobox
 *
 * Depends:
 *  jquery 1.8.2
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 */
;(function($, undefined) {
	$.widget("uiplugins.combobox", {
		options: {
			"autocompleteOn": true,
			"buttonClass": "",
			"buttonStyle": {},
			"height": 20,
			"ignoreCase": true,
			"inputClass": "",
			"inputStyle": {},
			"maxHeight": 200,
			"searchType": "startsWith",
			"width": 200
		},
		_create: function() {
			var self = this;				
			var $select = this.$select = this.element.addClass("ui-combobox-select").hide(),
				selected = $select.children(":selected"),
				value = selected.val() ? selected.text() : "";
			var $input = this.$input = $("<input />")
				.keydown(function(event) {
					var $this = $(this);
					// if they hit arrow down and the list isn't showing, show the whole thing regardless of the current value
					if(event.which == $.ui.keyCode.DOWN && !$this.autocomplete("widget").is(":visible")) {
						$this.autocomplete("search", "");
						return false;
					}
				})
				.height(this.options.height)
				.insertAfter($select)
				.val(value)
				// wrap elements in a div because they're floated to make the tops align but we don't want the widget floated
				.wrap($("<div></div>").addClass("ui-combobox"))
				.autocomplete(this._initAutocomplete())
				.addClass("ui-widget ui-widget-content ui-corner-left ui-combobox-input" + (this.options.inputClass ? " " + this.options.inputClass : ""))
				.css(this.options.inputStyle);		
			
			$input.data("autocomplete")._renderItem = function(ul, item) {
				ul.addClass("ui-combobox-list");
				ul.css("max-height", self.options.maxHeight);	
				return $("<li></li>")
					.data("item.autocomplete", item)
					.append("<a>" + item.label + "</a>")
					.appendTo(ul);
			};				   
			
			this.$button = this._initButton();		
			$input.width(this.options.width - this.$button.width());
			
			if(!this.options.autocompleteOn) {
				$input.attr("disabled", "disabled");
			}
		},
		_initAutocomplete: function() {
			var self = this;
			
			return {
				delay: 0,
				minLength: 0,
				source: function(request, response) {
					var quantifier = self.options.searchType == "startsWith" ? "^" : "";					
					var modifier = self.options.ignoreCase && self.options.ignoreCase !== "false" ? "i" : "";					
					var matcher = new RegExp(quantifier + $.ui.autocomplete.escapeRegex(request.term), modifier);
					
					response(self.$select.children("option").map(function() {
						var text = $(this).text();
						if (this.value && (!request.term || matcher.test(text))) {
							return {
								// this regex highlights the matching part of the label
								label: text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(request.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
								value: text,
								option: this
							};
						}
					}));					
				},
				select: function( event, ui ) {
					ui.item.option.selected = true;
					self._trigger("select", event, {
						"item": ui.item.option
					});
				},
				change: function(event, ui) {
					self._onChange(event, ui);
				},
				open: function(event, ui) {					
					self._trigger("open"); // note this is triggered whenever the value is updated, not just when the list is opened			
				},
				close: function() {
					self._trigger("close");
				}
			};
		},
		_initButton: function() {
			var $input = this.$input;
			
			return $("<button>&nbsp;</button>")
				.attr("tabIndex", -1)
				.attr("title", "Show All Items")
				.insertAfter($input)
				.button({
					icons: {
						primary: "ui-icon-triangle-1-s"
					},
					text: false
				})									
				.removeClass("ui-corner-all")
				.addClass("ui-corner-right ui-button-icon ui-combobox-button" + (this.options.buttonClass ? " " + this.options.buttonClass : ""))
				.css(this.options.buttonStyle)
				.height(this._getButtonHeight())
				.mousedown(function() {
					// close if already visible				
					if ($input.autocomplete("widget").is(":visible")) {
						$input.autocomplete("close");
						return;
					}
					// pass empty string as value to search for, displaying all results
					$input.autocomplete("search", "").select();
					return false;
				});
		},
		_onChange: function(event, ui) {
			if (!ui.item) {
				// check the contents of the text field and see if it matches the text of any options
				var self = this;
				var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(this.$input.val()) + "$", "i");
				var valid = false;
				var $select = this.$select;
				
				$select.children("option").each(function() {							
					if (this.text.match(matcher)) {
						this.selected = valid = true;
						$select.val(this.value);
						self._trigger("change", event, {"item": this});
						return false;
					}
				});
				
				if (!valid) {
					// remove invalid value that didn't match anything, just set the value back to what it was							
					this.$input.val($select.children("option:selected").text());
					return false;
				}
			}
		},
		_getButtonHeight: function() {
			return this.$input.height() + Number(this.$input.css("border-top-width").replace("px", "")) + Number(this.$input.css("border-bottom-width").replace("px", ""));
		},
		_setOption: function(option, value) {
			
			switch(option) {				
				case "width":
					this.$input.width(value - this.$button.width());					
					break;
				case "height":
					this.$input.height(value);
					this.$button.height(this._getButtonHeight());				
					break;	
				case "maxHeight":
					this.$input.autocomplete("widget").css("max-height", value + "px");
					break;
				case "buttonClass":				
					this.$button.removeClass(this.options.buttonClass).addClass(value);
					break;
				case "buttonStyle":
					if(typeof value === 'string') {
						value = $.parseJSON(value);
					}					
					this.$button.css(value);
					break;
				case "inputClass":
					this.$input.removeClass(this.options.inputClass).addClass(value);
					break;
				case "inputStyle":
					if(typeof value === 'string') {
						value = $.parseJSON(value);
					}					
					this.$input.css(value);
					break;	
				case "autocompleteOn":
					if(value && value !== "false") {
						this.$input.removeAttr("disabled", "disabled");
					} else {
						this.$input.attr("disabled", "disabled");
					}
					
					break;
			}
			
			$.Widget.prototype._setOption.apply(this, arguments);
		},
		disable: function() {
			$.Widget.prototype.disable.call(this);
			this.close();
			this.$input.addClass("ui-state-disabled").attr("disabled", "disabled");
			this.$button.addClass("ui-state-disabled").button('disable');
			this._trigger("disable");
		},
		enable: function() {
			$.Widget.prototype.enable.call(this);
			this.$input.removeClass("ui-state-disabled").removeAttr("disabled");
			this.$button.removeClass("ui-state-disabled").button('enable');
			this._trigger("enable");
		},
		open: function() {
			this.$input.autocomplete("search", "").select();
			this._trigger("open");
		},
		close: function() {
			this.$input.autocomplete("close");
			this._trigger("close");
		},
		destroy: function() {
			var $select = this.element;
			$select.next("div.ui-combobox").remove();
			$select.show();
			$.Widget.prototype.destroy.call(this);		
		}
	});
})(jQuery);if(!String.prototype.left) {
	String.prototype.left = function(n) {
		if (n <= 0) {
			return '';
		} else if (n > this.length) {
			return this;
		} else
			return this.substring(0, n);
	};
}

if(!String.prototype.right) {
	String.prototype.right = function(n) {
		if(n <= 0) {
			return '';
		} else if (n > this.length) {
			return this;
		} else {
			var iLen = this.length;
			return this.substring(iLen, iLen - n);
		}
	};
}

if(!String.prototype.padLeft) {
	String.prototype.padLeft = function(toLength, character) {
		var padded = this;
		while(padded.length < toLength) {
			padded = character + padded;
		}
	
		return padded;
	};
}

if(!String.prototype.contains) {
    String.prototype.contains = function(prefix) {
        return this.indexOf(prefix) > -1;
    };
}

if(!String.prototype.containsAny) {
    String.prototype.containsAny = function(arrayOfStrings) {
        for (var x in arrayOfStrings) {
            if (this.indexOf(arrayOfStrings[x]) > -1) {
                return true;
            }
        }
        return false;
    };
}

if(!String.prototype.startsWith) {
    String.prototype.startsWith = function(prefix) {
        return this.indexOf(prefix) === 0;
    };
}

if(!String.prototype.endsWith) {
    String.prototype.endsWith = function(suffix) {    	
    	if (this.length < suffix.length) {
    		return false;
    	}
 
    	return this.lastIndexOf(suffix) === this.length - suffix.length;     	
    };
}

if(!String.prototype.toProperCase) {
	String.prototype.toProperCase = function () {
	    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};
}

;(function($, undefined) {	
	
	$.fn.padding = function(position) {
  
		var value = 0;
	
		this.each(function() {
			value = Number($(this).css('padding-' + position).replace('px', ''));
		});
	
		return value;
	};
	
	var chars = new Array();
	chars[32]=' ';
	chars[48]='0';
	chars[49]='1';
	chars[50]='2';
	chars[51]='3';
	chars[52]='4';
	chars[53]='5';
	chars[54]='6';
	chars[55]='7';
	chars[56]='8';
	chars[57]='9';
	chars[65]='a';
	chars[66]='b';
	chars[67]='c';
	chars[68]='d';
	chars[69]='e';
	chars[70]='f';
	chars[71]='g';
	chars[72]='h';
	chars[73]='i';
	chars[74]='j';
	chars[75]='k';
	chars[76]='l';
	chars[77]='m';
	chars[78]='n';
	chars[79]='o';
	chars[80]='p';
	chars[81]='q';
	chars[82]='r';
	chars[83]='s';
	chars[84]='t';
	chars[85]='u';
	chars[86]='v';
	chars[87]='w';
	chars[88]='x';
	chars[89]='y';
	chars[90]='z';
	chars[96]='0';
	chars[97]='1';
	chars[98]='2';
	chars[99]='3';
	chars[100]='4';
	chars[101]='5';
	chars[102]='6';
	chars[103]='7';
	chars[104]='8';
	chars[105]='9';
	chars[106]='*';
	chars[107]='+';
	chars[109]='-';
	chars[110]='.';
	chars[111]='/';
	chars[186]=';';
	chars[187]='=';
	chars[188]=',';
	chars[189]='-';
	chars[190]='.';
	chars[191]='/';
	chars[192]='`';
	chars[219]='[';
	chars[220]='\\';
	chars[221]=']';
	chars[222]='\'';
	
	var shiftChars = new Array();
	shiftChars[32]=' ';
	shiftChars[48]=')';
	shiftChars[49]='!';
	shiftChars[50]='@';
	shiftChars[51]='#';
	shiftChars[52]='$';
	shiftChars[53]='%';
	shiftChars[54]='^';
	shiftChars[55]='&';
	shiftChars[56]='*';
	shiftChars[57]='(';
	shiftChars[65]='A';
	shiftChars[66]='B';
	shiftChars[67]='C';
	shiftChars[68]='D';
	shiftChars[69]='E';
	shiftChars[70]='F';
	shiftChars[71]='G';
	shiftChars[72]='H';
	shiftChars[73]='I';
	shiftChars[74]='J';
	shiftChars[75]='K';
	shiftChars[76]='L';
	shiftChars[77]='M';
	shiftChars[78]='N';
	shiftChars[79]='O';
	shiftChars[80]='P';
	shiftChars[81]='Q';
	shiftChars[82]='R';
	shiftChars[83]='S';
	shiftChars[84]='T';
	shiftChars[85]='U';
	shiftChars[86]='V';
	shiftChars[87]='W';
	shiftChars[88]='X';
	shiftChars[89]='Y';
	shiftChars[90]='Z';
	shiftChars[96]='0';
	shiftChars[97]='1';
	shiftChars[98]='2';
	shiftChars[99]='3';
	shiftChars[100]='4';
	shiftChars[101]='5';
	shiftChars[102]='6';
	shiftChars[103]='7';
	shiftChars[104]='8';
	shiftChars[105]='9';
	shiftChars[106]='*';
	shiftChars[107]='+';
	shiftChars[109]='-';
	shiftChars[110]=',';
	shiftChars[111]='/';
	shiftChars[186]=':';
	shiftChars[187]='+';
	shiftChars[188]='<';
	shiftChars[189]='_';
	shiftChars[190]='>';
	shiftChars[191]='?';
	shiftChars[192]='~';
	shiftChars[219]='{';
	shiftChars[220]='|';
	shiftChars[221]='}';
	shiftChars[222]='"';
	
	$.extend($.ui.keyCode, {
		A: 65,
		NUM_LOCK: 144,					
		NUMPAD_ZERO: 96,		
		PAUSE_BREAK: 19,		
		SCROLL_LOCK: 145,
		WINDOWS_RIGHT: 92,
		// This function returns the correct character for the keyboard scan code returned by keyup and keydown events.
		// This is only necessary because for some keys like the num lock key pad numbers, the keyboard scan code that
		// is returned by keyup and keydown events is not the correct ascii code and will therefore not return the correct
		// character when passed to String.fromCharCode(), i.e. if you press '7' on the number pad the keydown event returns
		// 103 which is actually an ascii 'g' so String.fromCharCode(event.keyCode) would return 'g' instead of '7'.
		keyCode2Char: function(keyCode, shift) {
			var myChar = shift ? shiftChars[keyCode] : chars[keyCode];
			myChar = (typeof myChar == 'undefined') ? '' : myChar;
			return myChar;
		}
	});
	
	if(!$.currency) {
		$.currency = function(amount, settings) {
			return formatCurrency(amount, settings);
		};
	}	
	
	function formatCurrency(amount, settings) {
	    var bc = settings.region;
	    var currency_before = '';
	    var currency_after = '';
	    
	    if(bc == 'ALL') currency_before = 'Lek';
	    if(bc == 'ARS') currency_before = '$';
	    if(bc == 'AWG') currency_before = 'f';
	    if(bc == 'AUD') currency_before = '$';
	    if(bc == 'BSD') currency_before = '$';
	    if(bc == 'BBD') currency_before = '$';
	    if(bc == 'BYR') currency_before = 'p.';
	    if(bc == 'BZD') currency_before = 'BZ$';
	    if(bc == 'BMD') currency_before = '$';
	    if(bc == 'BOB') currency_before = '$b';
	    if(bc == 'BAM') currency_before = 'KM';
	    if(bc == 'BWP') currency_before = 'P';
	    if(bc == 'BRL') currency_before = 'R$';
	    if(bc == 'BND') currency_before = '$';
	    if(bc == 'CAD') currency_before = '$';
	    if(bc == 'KYD') currency_before = '$';
	    if(bc == 'CLP') currency_before = '$';
	    if(bc == 'CNY') currency_before = '&yen;';
	    if(bc == 'COP') currency_before = '$';
	    if(bc == 'CRC') currency_before = 'c';
	    if(bc == 'HRK') currency_before = 'kn';
	    if(bc == 'CZK') currency_before = 'Kc';
	    if(bc == 'DKK') currency_before = 'kr';
	    if(bc == 'DOP') currency_before = 'RD$';
	    if(bc == 'XCD') currency_before = '$';
	    if(bc == 'EGP') currency_before = '&pound;';
	    if(bc == 'SVC') currency_before = '$';
	    if(bc == 'EEK') currency_before = 'kr';
	    if(bc == 'EUR') currency_before = '&euro;';
	    if(bc == 'FKP') currency_before = '&pound;';
	    if(bc == 'FJD') currency_before = '$';
	    if(bc == 'GBP') currency_before = '&pound;';
	    if(bc == 'GHC') currency_before = 'c';
	    if(bc == 'GIP') currency_before = '&pound;';
	    if(bc == 'GTQ') currency_before = 'Q';
	    if(bc == 'GGP') currency_before = '&pound;';
	    if(bc == 'GYD') currency_before = '$';
	    if(bc == 'HNL') currency_before = 'L';
	    if(bc == 'HKD') currency_before = '$';
	    if(bc == 'HUF') currency_before = 'Ft';
	    if(bc == 'ISK') currency_before = 'kr';
	    if(bc == 'IDR') currency_before = 'Rp';
	    if(bc == 'IMP') currency_before = '&pound;';
	    if(bc == 'JMD') currency_before = 'J$';
	    if(bc == 'JPY') currency_before = '&yen;';
	    if(bc == 'JEP') currency_before = '&pound;';
	    if(bc == 'LVL') currency_before = 'Ls';
	    if(bc == 'LBP') currency_before = '&pound;';
	    if(bc == 'LRD') currency_before = '$';
	    if(bc == 'LTL') currency_before = 'Lt';
	    if(bc == 'MYR') currency_before = 'RM';
	    if(bc == 'MXN') currency_before = '$';
	    if(bc == 'MZN') currency_before = 'MT';
	    if(bc == 'NAD') currency_before = '$';
	    if(bc == 'ANG') currency_before = 'f';
	    if(bc == 'NZD') currency_before = '$';
	    if(bc == 'NIO') currency_before = 'C$';
	    if(bc == 'NOK') currency_before = 'kr';
	    if(bc == 'PAB') currency_before = 'B/.';
	    if(bc == 'PYG') currency_before = 'Gs';
	    if(bc == 'PEN') currency_before = 'S/.';
	    if(bc == 'PLN') currency_before = 'zl';
	    if(bc == 'RON') currency_before = 'lei';
	    if(bc == 'SHP') currency_before = '&pound;';
	    if(bc == 'SGD') currency_before = '$';
	    if(bc == 'SBD') currency_before = '$';
	    if(bc == 'SOS') currency_before = 'S';
	    if(bc == 'ZAR') currency_before = 'R';
	    if(bc == 'SEK') currency_before = 'kr';
	    if(bc == 'CHF') currency_before = 'CHF';
	    if(bc == 'SRD') currency_before = '$';
	    if(bc == 'SYP') currency_before = '&pound;';
	    if(bc == 'TWD') currency_before = 'NT$';
	    if(bc == 'TTD') currency_before = 'TT$';
	    if(bc == 'TRY') currency_before = 'TL';
	    if(bc == 'TRL') currency_before = '&pound;';
	    if(bc == 'TVD') currency_before = '$';
	    if(bc == 'GBP') currency_before = '&pound;';
	    if(bc == 'USD') currency_before = '$';
	    if(bc == 'UYU') currency_before = '$U';
	    if(bc == 'VEF') currency_before = 'Bs';
	    if(bc == 'ZWD') currency_before = 'Z$';
	    
	    if( currency_before == '' && currency_after == '' ) currency_before = '$';
	    
	    var output = '';
	    if(!settings.hidePrefix) output += currency_before;
	    output += numberFormat( amount, settings.decimals, settings.decimal, settings.thousands );
	    if(!settings.hidePostfix) output += currency_after;
	    return output;
	}
	
	// Kindly borrowed from http://phpjs.org/functions/number_format
	function numberFormat(number, decimals, dec_point, thousands_sep) {
	    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	    var n = !isFinite(+number) ? 0 : +number,
	        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
	        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
	        s = '',
	        toFixedFix = function (n, prec) {
	            var k = Math.pow(10, prec);
	            return '' + Math.round(n * k) / k;
	        };
	    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
	    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	    if (s[0].length > 3) {
	        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	    }
	    if ((s[1] || '').length < prec) {
	        s[1] = s[1] || '';
	        s[1] += new Array(prec - s[1].length + 1).join('0');
	    }
	    return s.join(dec);
	}
	
	function isNumber(n) {
	    return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
})(jQuery);/*
 * jQuery UI Grid Plugin 0.0.9
 *
 * Copyright 2012, Chad LaVigne
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php) 
 *
 * http://code.google.com/p/jquery-ui-plugins/wiki/Grid
 *
 * Depends:
 *  jquery 1.7 // currently broken with 1.8.2 and 1.9  
 *	jquery.ui.core.1.8.16.js
 *	jquery.ui.widget.1.8.16.js
 *	jquery.event.drag-2.0.js // required for column re-order
 *	jquery.event.drop-2.0.js // required for column re-order		
 *	slick.core.2.0.2.js
 *	slick.grid.2.0.2.js
 *	slick.dataview.2.0.2.js // required for filtering, sorting & editing date columns
 *  slick.rowselectionmodel.js // required for row selection
 *  slick.cellselectionmodel.js // required for cell selection
 *  slick.cellrangeselector.js // required for cell selection
 *  slick.cellrangedecorator.js // required for cell selection
 *	date.js // required for date sorting
 *  jquery.ui-plugins-textinput.js // required for numeric editing and filtering
 *
 */
// this plugin is currently broken with jquery 1.8.2 and 1.9
/**
 *	@module jquery-ui-plugins
 *	@requires http://code.jquery.com/jquery-1.7.1.js,
 *		jquery.ui.core.1.8.16.js,
 *		jquery.ui.widget.1.8.16.js,
 *		jquery.event.drag-2.0.js,
 *		jquery.event.drop-2.0.js,		
 *		slick.core.2.0.2.js,
 *		slick.grid.2.0.2.js,
 *		slick.dataview.2.0.2.js,
 *		date.js
 *	@namespace uiplugins	
 */
;(function($, undefined) {
	/**
	 * A jQuery UI grid widget that wraps <a href="https://github.com/mleibman/SlickGrid">SlickGrid</a> and 
	 * exposes options, methods and events to make accomplishing common tasks such as sorting, filtering and 
	 * in-line editing simple using familiar jQuery UI syntax. 
	 * 
	 * @class Grid
	 */
	$.widget('uiplugins.grid', {
		options: {
			rowKey: 'id',
			calendarImage: 'http://jquery-ui-plugins.googlecode.com/svn/trunk/examples/images/calendar.png'			
			// should think about just having an options property on column that identifies valid values, this could be an array of strings or objects that are used to
			// create both filters and editors. In addition, it could really be used to do automatic formatting in the case of an object array with name/value, i.e. if there
			// are a list of option object assigned to the column, I know we probably have to translate the "value" to the correct "name" to display 
		},
		slickMethods: ['addCellCssStyles','autosizeColumns','canCellBeActive','canCellBeSelected','editActiveCell','flashCell','focus','getActiveCell','getActiveCellNode','getActiveCellPosition','getCanvasNode','getCellCssStyles','getCellEditor','getCellFromEvent','getCellFromPoint','getCellNode','getCellNodeBox','getColumnIndex','getColumns','getData','getDataItem','getDataLength','getEditController','getEditorLock','getGridPosition','getHeaderRow','getHeaderRowColumn','getOptions','getRenderedRange','getSelectedRows','getSelectionModel','getSortColumns','getTopPanel','getViewport','gotoCell','init','invalidate','invalidateAllRows','invalidateRow','invalidateRows','navigateDown','navigateLeft','navigateNext','navigatePrev','navigateRight','navigateUp','registerPlugin','removeCellCssStyles','render','resetActiveCell','resizeCanvas','scrollCellIntoView','scrollRowIntoView','scrollRowToTop','setActiveCell','setCellCssStyles','setColumns','setData','setHeaderRowVisibility','setOptions','setSelectedRows','setSelectionModel','setSortColumn','setSortColumns','setTopPanelVisibility','unregisterPlugin','updateCell','updateColumnHeader','updateRow','updateRowCount'],
		slickEvents: ['onActiveCellChanged','onActiveCellPositionChanged','onAddNewRow','onBeforeCellEditorDestroy','onBeforeDestroy','onBeforeEditCell','onCellChange','onCellCssStylesChanged','onClick','onColumnsReordered','onColumnsResized','onContextMenu','onDblClick','onDrag','onDragEnd','onDragInit','onDragStart','onHeaderClick','onHeaderContextMenu','onKeyDown','onMouseEnter','onMouseLeave','onScroll','onSelectedRowsChanged','onSort','onValidationError','onViewportChanged'],
		filterValues: {
			'numericDialog': [
				{'name': 'Equal To', 'value': 'eq'},
				{'name': 'Not Equal To', 'value': 'neq'},
				{'name': 'Greater Than', 'value': 'gt'}, 
				{'name': 'Greater Than OR Equal To', 'value': 'gte'}, 
				{'name': 'Less Than', 'value': 'lt'}, 
				{'name': 'Less Than OR Equal To', 'value': 'lte'}
			],
			'dateDialog': [
				{'name': 'On', 'value': 'eq'},
				{'name': 'Before', 'value': 'lt'},
				{'name': 'After', 'value': 'gt'}
			],
			'date': [
			    {'name': 'Today', 'value': 'today'},
			    {'name': 'Tomorrow', 'value': 'tomorrow'},					
				{'name': 'Yesterday', 'value': 'yesterday'},					
				{'name': 'This Week', 'value': 'thisweek'},
				{'name': 'Next Week', 'value': 'nextweek'},
				{'name': 'Last Week', 'value': 'lastweek'},
				{'name': 'This Month', 'value': 'thismonth'},
				{'name': 'Next Month', 'value': 'nextmonth'},					
				{'name': 'Last Month', 'value': 'lastmonth'},
				{'name': 'This Year', 'value': 'thisyear'},
				{'name': 'Next Year', 'value': 'nextyear'},					
				{'name': 'Last Year', 'value': 'lastyear'}
			]
		},
		logicOperators: [
		    {'name': 'And', 'value': 'and'},
			{'name': 'Or', 'value': 'or'}
		],
		operators: {
		    'gt': function(a, b) {return +a > +b;}, // the plus is a fast way to convert the string to a number
		    'gte': function(a, b) {return +a >= +b;},
		    'lt': function(a, b) {return +a < +b;},
		    'lte': function(a, b) {return +a <= +b;},
		    'eq': function(a, b) {return +a == +b;},
		    'neq': function(a, b) {return +a != +b;},
		    'and': function(a, b) {return a && b;},
		    'or': function(a, b) {return a || b;}
		},
		formatDefaults: {
		    'checkbox': {'checkedValue': 'true', 'notCheckedValue': 'false'},				
			'currency': {'region': 'USD', 'thousands': ',', 'decimal': '.', 'decimals': 2},
		},
		cssStyleHash: {},
		_create: function() {			
			var self = this,
				opts = this.options,
				dataView = this.dataView = new Slick.Data.DataView();			
			this.dataHash = this._initDataHash();
			this.dateInfo = this._initDateInfo();			
			this.element.addClass('ui-grid');
			this.options.editDisabled = this.options.editable;
			this._initColumns();
			opts.showHeaderRow = this.filters ? true : opts.showHeaderRow;
			var grid = this.grid = new Slick.Grid(this.element, this.dataView, opts.columns, opts);
			this.options = grid.getOptions();
			
			if(this.filters) {
				this._renderFilters();				
				this._bindFilterEvents();
			}
			
			this._initSlickMethods();
			this._initEventHandlers();
			this._initSelectionModel();
			grid.onSort.subscribe(function(e, args) {
	            sortCol = args.sortCol;
	            self.dataView.sort(self.sortFunctions[sortCol.id], args.sortAsc);	            
	            // fast sort seems to be much better in IE & FF but actually slower in Chrome so probably do a browser check here
	            //self.dataView.fastSort(sortCol.id, args.sortAsc);
	            if(self.options.selectionModel) {
	            	self.dataView.syncGridSelection(grid, true);
	            }
	            grid.invalidate();
	        });			
						
			grid.onColumnsReordered.subscribe(function() {
				self._renderFilters();
			});
		
			grid.onColumnsResized.subscribe(function() {
				self._renderFilters();
			});
			
			
			dataView.getItemMetadata = function (rowIndex) {
				var rowData = {};
				var row = this.getItem(rowIndex);				
				
			    if(row && row.cssClasses) {
			    	rowData.cssClasses = row.cssClasses;			    	
			    }			    
			    
			    return rowData;
			};
			
			dataView.beginUpdate();
			dataView.setItems(opts.data, opts.rowKey);
			dataView.endUpdate();
			grid.invalidate();			
		},
		_initColumns: function() {
			this.columns = {};			
			this.originalColumnDefs = [];
			for(var i = 0; i < this.options.columns.length; i++) {
				this.originalColumnDefs[i] = $.extend(true, {}, this.options.columns[i]);
			}
			var columns = this.options.columns;
			
			for(var i = 0; i < columns.length; i++) {
				var col = columns[i];
				col.headerCssClass += ' ui-grid-header';
				this.columns[col.id] = col; // store columns in a hash so we can access them by id easily later
				
				this._initSorting(col);				
				this._initFiltering(col);				
				this._initEditing(col);
				this._initFormatting(col);
			}			
			
			if(this.filters) {								
				var self = this;			
				this.dataView.setFilter(function(item) {
					return self._filter(item);
				});
			}			
		},
		_initSorting: function(col, sortFunctions) {
			if(col.sort !== false) {
				if(!this.sortFunctions) {
					this.sortFunctions = {};
				}
				col.sortable = true;
				col.headerCssClass += col.headerCssClass + ' ui-grid-sortable';
				
				if(typeof col.sort === 'function') {
					this.sortFunctions[col.id] = col.sort;
				} else if(col.sort === 'date' && col.dateFormat) {
					// parse the date, convert to standard format, store standard format on row as new column, sort on that column
					this._initDateSort(col);						
					this.sortFunctions[col.id] = this._dateSort;
				} else if(col.dataType === 'numeric' || col.dataType === 'integer' || col.sort === 'numeric' || col.sort === 'integer') {
					this.sortFunctions[col.id] = this._numericSort;
				} else {
					this.sortFunctions[col.id] = this._sort;
				}
			}			
		},
		_initFiltering: function(col) {
			if(col.filter) {			
				if(!this.filters) {
					this.filters = {};
				}
				
				var isList = (typeof col.filter === 'object' && col.filter.type === 'list') || $.isArray(col.filter);
				var defaultVal = isList && !col.filterDefault ? '$NO_FILTER$' : col.filterDefault; 
				// if the filter is an object, it's a custom filter and we expect an impl attribute that's a function that will do the filtering
				// if the custom filter has an options attribute, we render a list and it's value is used in the custom filter otherwise we do a text field
				if(col.filter.impl) {
					this.filters[col.id] = $.extend(col.filter, {'type': 'custom', 'value': defaultVal});						
				} else {
					var type = isList ? 'list' : col.filter;
					var options = null;
					if(isList) {
						options = col.filter.options ? col.filter.options : col.filter;
					}
					this.filters[col.id] = {'type': type, 'value': defaultVal, 'options': options, 'dataItemAttribute': col.filter.dataItemAttribute};
				}
			}
		},
		_initEditing: function(col) {
			if(col.editor) {
				// if it's not a custom function apply the correct built-in editor
				if(typeof col.editor !== 'function') {
					var editor = col.editor;
					var isList = $.isArray(editor);
					
					if(editor === 'list' || isList) {
						col.editor = this._dropDownEdit;
						col.editorOptions = isList ? editor : col.editorOptions;
					} else if(editor === 'date') {
						col.editor = this._dateEdit;
					} else {
						col.editor = this._textEdit;
						col.dataType = editor;
					}													
				}
			}
		},
		_initFormatting: function(col) {
			// maintain a list of formatters so they can be chained together
			var formatters = [];	
			
			// column specific formatters override formatterFactory
			if(col.formatter) {
				if(typeof col.formatter === 'function') {
					formatters.push(col.formatter);
				} else {
					if(typeof col.formatter === 'string') {
						col.formatOptions = $.extend({'type': col.formatter}, this.formatDefaults[col.formatter]);
					} else if(typeof col.formatter === 'object' && col.formatter.type) {
						col.formatOptions = $.extend({}, this.formatDefaults[col.formatter.type], col.formatter);
					}
					
					switch(col.formatOptions.type) {
						case 'checkbox':							
							formatters.push(this._checkboxFormatter);
							this.hasCheckboxes = true;
							break;
						case 'currency':
							formatters.push(this._currencyFormatter);
							break;
						case 'properCase':
							formatters.push(this._properCaseFormatter);
							break;
					}
				}
								
			} else if(this.options.formatterFactory && this.options.formatterFactory.getFormatter(col)) {				
				formatters.push(this.options.formatterFactory.getFormatter(col));
			}			
						
			formatters.push(this._addCellCssFormatter);
			
			if(formatters.length > 0) {
				var self = this;
				col.formatters = formatters;
				col.formatter = function(rowNum, cellNum, value, columnDef, row) {
					return self._formatterChain.call(this, rowNum, cellNum, value, columnDef, row, self);
				};					
			}
		},
		_initDataHash: function() {			
			var dataHash = {};
			var rowKey = this.options.rowKey;
			
			for(var i = 0; i < this.options.data.length; i++) {
				var row = this.options.data[i];
				dataHash[row[rowKey]] = row;
			}
			
			return dataHash;
		},
		_initDateInfo: function() {
			var today = Date.today().clearTime();
			
			return {
				'today': today.getTime(),
				'tomorrow': Date.today().addDays(1).getTime(),
				'yesterday': Date.today().addDays(-1).getTime(),
				'sunday': today.getDay() == 0 ? today.clone() : Date.today().moveToDayOfWeek(0, -1).getTime(),
				'lastSunday': today.getDay() == 0 ? Date.today().moveToDayOfWeek(0, -1).getTime() : Date.today().moveToDayOfWeek(0, -1).moveToDayOfWeek(0, -1).getTime(),
				'nextSunday': Date.today().moveToDayOfWeek(0).getTime(),
				'dayMillis': 60 * 60 * 24 * 1000,
				'weekMillis': 60 * 60 * 24 * 7 * 1000,
				'lastMonthStart': Date.today().moveToFirstDayOfMonth().addDays(-1).moveToFirstDayOfMonth().getTime(),
				'thisMonthStart': Date.today().moveToFirstDayOfMonth().getTime(),				
				'nextMonthStart': Date.today().moveToLastDayOfMonth().addDays(1).getTime(),
				'nextMonthEnd': Date.today().moveToLastDayOfMonth().addDays(1).moveToLastDayOfMonth().addDays(1).getTime(),				
				'lastYearStart': Date.today().set({day: 1, month: 0, year: today.getFullYear() - 1}).getTime(),
				'thisYearStart': Date.today().set({day: 1, month: 0}).getTime(),
				'nextYearStart': Date.today().set({day: 1, month: 0, year: today.getFullYear() + 1}).getTime(),
				'nextYearEnd': Date.today().set({day: 1, month: 0, year: today.getFullYear() + 2}).getTime()
			};								
		},
		_initDateSort:function (column) {	            
			var rows = this.option('data');
			
			for(var i = 0; i < rows.length; i++) {
				var row = rows[i];
				// we'll need to simulate some threading in this
				// init method so the page load doesn't take forever when the dataset is huge				
				// parse date and store it as separate column so we don't take the hit of parsing on every sort
				row[column.field + '-sort'] = Date.parseExact(row[column.field], column.dateFormat).getTime();
			}
		},
		_initSlickMethods: function() {			
			for(var i = 0; i < this.slickMethods.length; i++) {
				var methodName = this.slickMethods[i];
				
				// underlying slick grid "getData" method actually returns dataView which is a little misleading
				// so we expose a 'getDataView' method to return the dataView and getData will return the data array
				switch(methodName) {
					case 'getData':
						this[methodName] = function() {return this.options.data;};
						this['getDataView'] = this.grid[methodName];
						break;
					case 'setData':
						this[methodName] = function(data) {
							this.options.data = data;
							this.dataHash = this._initDataHash();
							this.grid.setData(data);
							this.grid.invalidate();
						};
						break;
					case 'getColumns':
						this[methodName] = function() {
							return this.originalColumnDefs;
						};				
						break;						
					case 'setColumns':
						this[methodName] = function(data) {
							this.options.columns = data;
							this._initColumns();
							this.grid.setColumns(this.options.columns);
							this.grid.render();
							this._renderFilters();
						};				
						break;
					default:
						this[methodName] = this.grid[methodName];
				}				
			}
		},
		_initEventHandlers: function() {
			for(var i = 0; i < this.slickMethods.length; i++) {
				var eventName = this.slickEvents[i];
				this._bindEventHandler(eventName, this.options[eventName]);
			}
			
			if(this.hasCheckboxes) {
				this._bindCheckboxHandler();
			}			
		},
		_initSelectionModel: function() {
			var selectionModel = this.options.selectionModel;
			
			if(selectionModel) {
				if(typeof selectionModel === 'string') {
					switch(selectionModel) {
						case 'row':
							selectionModel = new Slick.RowSelectionModel({selectActiveRow: this.options.selectActiveRow});
							break;
						case 'cell':
							selectionModel = new Slick.CellSelectionModel({selectActiveCell: this.options.selectActiveCell});
							break;
					}
				}
				
				this.grid.setSelectionModel(selectionModel);
			}
		},
		_bindCheckboxHandler: function() {
			var self = this;
			var grid = this.grid;
			
			this.element.on('click', 'input.ui-grid-checkbox', function(e) {
				var activeCell = grid.getActiveCell();
				var item = grid.getDataItem(activeCell.row);
				var col = grid.getColumns()[activeCell.cell];	
				var $checkbox = $(this);
				item[col.field] = $checkbox.is(':checked') ? col.formatOptions.checkedValue : col.formatOptions.notCheckedValue;
				
				var $wrapperDiv = $checkbox.parent('div');
				$wrapperDiv.toggleClass('ui-changed-cell');
									
				if($wrapperDiv.hasClass('ui-changed-cell')) {
					var change = {};
					var originalValue = item[col.field] === col.formatOptions.checkedValue ? col.formatOptions.notCheckedValue : col.formatOptions.checkedValue;
		    		change[col.field] = originalValue;
		    		$.extend(true, item, {'changedCells': change});
				} else {
					delete item.changedCells[col.field];
				}		
				
				self._slickGridTrigger(grid.onCellChange, {
					row: activeCell.row,
					cell: activeCell.cell,
					item: item
				 });
			});
		},
		_slickGridTrigger: function(evt, args, e) {	
			e = e || new Slick.EventData();
			args = args || {};
			args.grid = self;
			return evt.notify(args, e, self);
		},
		_bindEventHandler: function(eventName, handler) {
			if(handler) {
				this.grid[eventName].subscribe(handler);
			}
		},
		_sort: function(row1, row2) {
			// sortCol is set in the onSort.subscribe callback
			var val = row1[sortCol.field], val2 = row2[sortCol.field];
			return (val == val2 ? 0 : (val > val2 ? 1 : -1));
		},
		_numericSort: function(row1, row2) {
			var val = +row1[sortCol.field], val2 = +row2[sortCol.field];
			return (val == val2 ? 0 : (val > val2 ? 1 : -1));
		},
		_dateSort: function(row1, row2) {
			// sortCol is set in the onSort.subscribe callback
			var val = row1[sortCol.field + '-sort'], val2 = row2[sortCol.field + '-sort'];
			return (val == val2 ? 0 : (val > val2 ? 1 : -1));
		},
		_renderFilters: function() {
			var self = this;
			var grid = this.grid;
			var columns = grid.getColumns();
			
			for(var i = 0; i < columns.length; i++) {
				var column = columns[i];
				var filter = self.filters[column.id];
				
                if(filter) {
                    var $header = $(grid.getHeaderRowColumn(column.id)).empty();
                    var id = 'ui-grid-filter-' + column.id;
                    var value = filter.value ? filter.value : '';
                    
                    if(filter.options) {
                    	self._renderDropDownFilter(id, $header, column, filter.options);                    	
                    } else if(filter.type === 'numeric') {
                		self._renderTextFilter(id, $header, column, value)
                    		.width($header.width() - 24)
                    		.css('float', 'left')
                    		.textinput({'filter': 'numeric'});                    	                    	
                    	self._renderFilterButton(filter.type, column, $header);                    	
                    } else if(filter.type === 'date') {
                    	self._renderDropDownFilter(id, $header, column, self.filterValues[filter.type])
                    		.width($header.width() - 20)
                    		.css('float', 'left'); 
                    	self._renderFilterButton(filter.type, column, $header);
                    } else {
                    	self._renderTextFilter(id, $header, column, value);
                    }                    		          
                }
			}
		},
		_renderFilterButton: function(type, column, $appendTo) {
			$('<span class="ui-filter-button"/>')
        		.appendTo($appendTo)
        		.data({'columnId': column.id, 'type': type});
		},
		_renderTextFilter: function(id, $header, column, value) {
			var self = this;
			return $('<input type="text" class="ui-grid-filter ' + id + '" value="' + value + '">')
        		.appendTo($header)
        		.data('columnId', column.id)
        		.width($header.width() - 4)
        		.height($header.height() - 12)
        		.click(function() {
                	self.saveCurrentEdit();
                	$(this).focus();
                });
		},
		_renderDropDownFilter: function(id, $header, column, options) {
			var self = this;
			var html = '<select class="ui-grid-filter ' + id + '">';
			html += '<option value="$NO_FILTER$"></option>';
			var filter = this.filters[column.id];
			var filterValue = filter.value;
			
			for(var i = 0; i < options.length; i++) {
				var option = options[i];
				var isObject = typeof option === 'object';
				var value = isObject ? option.value : option;
				var name = isObject ? option.name : option;				
				html += '<option value="' + value + '"' + (value === filterValue ? 'selected' : '') + '>' + name + '</option>';								
			}			
            html += '</select>';
            return $(html).appendTo($header)
            	.data('columnId', column.id)
            	.width($header.width() - 4)
                .val(filterValue)
                .click(function() {
                	self.saveCurrentEdit();
                	$(this).focus();
                });
		},
		_renderFilterDialog: function(columnId, type) {
			var $dialog = $('#ui-grid-filter-dialog-' + columnId);
			
			if($dialog.length == 0) {
				var html = '<div id="ui-grid-filter-dialog-' + columnId + '" style="display: none;" class="ui-grid-filter-dialog">';
				html += '<div><label>Show rows where </label><label class="columnName"></label></div>';
				
				html += this._getFilterHtml(type + 'Dialog');				
				html += '<div>';
				
				for(var i = 0; i < this.logicOperators.length; i++) {
					var operator = this.logicOperators[i];
					html += '<input type="radio" name="logicOperator" class="ui-filter-logic-operator" value="' + operator.value + '"/><label>' + operator.name + '</label>';
				}
				
				html += '</div>';				
				html += this._getFilterHtml(type + 'Dialog');
					
				html += '</div>';
				$dialog = $(html);
			}
			
			return $dialog;			
		},
		_getFilterHtml: function(type) {
			var html = '<div><select class="ui-filter-compare-operator">';
			var filters = this.filterValues[type];
			
			for(var i = 0; i < filters.length; i++) {
				var filter = filters[i];
				html += '<option value="' + filter.value + '">' + filter.name + '</option>';
			}

			html += '<input type="text" class="ui-filter-val' + (type.startsWith('date') ? ' ui-date-filter' : '') + '"/>';			
			html += '</select>';
			html += '</div>';
			
			return html;
		},
		_bindFilterEvents: function() {
			var self = this;
			// bind events that will cause filters to run when filter value changes
			$headerRow = $(this.grid.getHeaderRow());
			$headerRow.on('change keyup', 'input, select', function(e) {
				var columnId = $(this).data('columnId');					
				self._filterColumn(columnId);
			});
			
			// numeric filters show a dialog where the user enters compare values, those filters run when they hit the ok button on the dialog
			$headerRow.on('click', 'span.ui-filter-button', function(e) {
				if(!self.disabled) {
					var $this = $(this);
					var columnId = $this.data('columnId');
					var filterType = $this.data('type'); 
					self._showFilterDialog($(this), columnId, filterType);
				}				
			});
		},
		_showFilterDialog: function($filterButton, columnId, type) {
			var self = this;
			var $dialog = this._renderFilterDialog(columnId, type);
			var column = this.columns[columnId];
			var buttons = {				
				'Cancel': function() {
					$(this).dialog('close');
				},
				'OK': function() {					
					self._applyDialogFilter($dialog, column);
				}
			};
			
			if(this.filters[columnId].logic) {
				buttons['Clear'] = function() {
					self._clearDialogFilter($dialog, columnId);
				};
			}
			$dialog.find('label.columnName').text(column.name + ' is:');
			var $dateinputs = $dialog.find('input.ui-date-filter');
			$dateinputs.datepicker({
				showOn: 'button',
				buttonImageOnly: true,
				buttonImage: self.options.calendarImage,
				beforeShow: function() {
					$('#ui-datepicker-div').addClass('ui-grid-datepicker');			       
				},
				onClose: function() {
					$('#ui-datepicker-div').addClass('ui-grid-datepicker');
				}
			});
			// this is necessary because if calendarImage is changed via grid.setOption after the date pickers have been initialized, the new image won't be used
			$dateinputs.datepicker('option', 'buttonImage', self.options.calendarImage); 
			$dialog.keypress(function(event) {
				if (event.keyCode == $.ui.keyCode.ENTER) {
					self._applyDialogFilter($dialog, column);
				}
			});
			
			$dialog.dialog({
				'title': (type.toProperCase() + ' Filter'), 
				'modal': true,
				'dialogClass': "ui-filter-dialog",
				'buttons': buttons,
				'position': {my: 'left top', at: 'left bottom', of: $filterButton}
    			}).show();
		},		
		_filterColumn: function(columnId) {
			// shouldn't need this null check but there's some inconsistent behavior with the event handling that requires it
			if (columnId) {				
				var filter = this.filters[columnId];
				
				if(filter.type === 'numeric' || filter.type === 'date') {
					var $dialog = $('#ui-grid-filter-dialog-' + columnId);
					var column = this.columns[columnId];
					var filterLogic = {};
					filterLogic.comparisons = [];
					$dialog.find('select.ui-filter-compare-operator').each(function() {
						var $select = $(this);
						var compareValue = $select.next('input.ui-filter-val').val();
						
						if(compareValue) {
							compareValue = filter.type === 'date' ? Date.parseExact(compareValue, column.dateFormat).getTime() : compareValue;
							filterLogic.comparisons.push({'operator': $select.val(), 'value': compareValue});
						}						
					});
					filterLogic.logicOperator = $dialog.find('input.ui-filter-logic-operator:checked').val();
					
					if(filterLogic.comparisons.length) {
						filter.logic = filterLogic;
					} 					
				}
				
				filter.value = $.trim($('#' + this.element.attr('id') + ' .ui-grid-filter-' + columnId).val());				
				this.dataView.refresh();				
				// invalidate will cause slick grid to call _filter because we registered _filter as the filter function for the grid
				this.grid.invalidate();				
			}	
		},		
		_filter: function(item) {		
			var grid = this.grid;
            var filters = this.filters;
            
			if (item && filters) {
				var result = true;
            
	            for (var columnId in filters) {
	            	var filter = filters[columnId];
	            		              
	            	if((filter && filter.value !== undefined && filter.value !== '$NO_FILTER$') || (filter.logic)) {
	                    var columns = grid.getColumns();
	                    var column = columns[grid.getColumnIndex(columnId)];
	                    
	                    if (column == null || column == undefined) {
	                    	//column is in the filter list, but is not visible, no need to filter
	                    	continue;
	                    }
	                    
	                    var itemVal = item[column.field];
	                    itemVal = typeof itemVal === 'object' && filter.dataItemAttribute ? itemVal[filter.dataItemAttribute] + '' : itemVal + '';
	                    
	                    if(itemVal || itemVal === '') {
	                    	switch(filter.type) {	                    		
	                    		case 'startsWith':
		                    		result =  itemVal.toLowerCase().startsWith(filter.value.toLowerCase());
		                    		break;
		                    	case 'endsWith':
		                    		result =  itemVal.toLowerCase().endsWith(filter.value.toLowerCase());
		                    		break;
		                    	case 'contains':
		                    		result =  itemVal.toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
		                    		break;
		                    	case 'doesNotContain':
		                    		result =  !filter.value || itemVal.toLowerCase().indexOf(filter.value.toLowerCase()) === -1;
		                    		break;
		                    	case 'list':
		                    		result = itemVal === filter.value;
		                    		break;		                    	
		                    	case 'numeric':		
		                    		result = this._applyNumericFilter(filter, itemVal);                   				                    				                    			                    
		                    		break;
		                    	case 'date':
		                    		result = this._applyDateFilter(filter, item[column.field + '-sort']);
		                    		break;
		                    	case 'custom':
		                    		result = filter.impl.call(filter, filter.value, itemVal);
		                    		break;
	                    	}	                    	                   
	                    }
	
	                    if (!result) {
	                        return result;
	                    }                
	                }
	            }
			}
            
            return true;        
		},
		_applyNumericFilter: function(filter, itemVal) {
			var result = true;
			var logic = filter.logic;
		                    		
			if(logic && logic.comparisons.length > 0) {
    			var compare1 =  logic.comparisons[0];
    			var compare2 =  logic.comparisons[1];
        		var logicOperator = logic.logicOperator;
        		
        		if(compare2 && logicOperator) {
        			var result1 = this.operators[compare1.operator](itemVal, compare1.value);
        			var result2 = this.operators[compare2.operator](itemVal, compare2.value);		                    			
        			result = this.operators[logicOperator](result1, result2);			                    			
        		} else {
        			result = this.operators[compare1.operator](itemVal, compare1.value);
        		}
    		}
			
			if(filter.value) {
    			result = result && +itemVal == +filter.value;
    		}
			
			return result;
		},
		_applyDateFilter: function(filter, itemVal) {
			var result = true;
			itemVal = +itemVal;
			var logic = filter.logic;
		                    		
			if(logic && logic.comparisons.length > 0) {
    			var compare1 =  logic.comparisons[0];
    			var compare2 =  logic.comparisons[1];
        		var logicOperator = logic.logicOperator;
        		
        		if(compare2 && logicOperator) {
        			var result1 = this.operators[compare1.operator](itemVal, compare1.value);
        			var result2 = this.operators[compare2.operator](itemVal, compare2.value);		                    			
        			result = this.operators[logicOperator](result1, result2);			                    			
        		} else {
        			result = this.operators[compare1.operator](itemVal, compare1.value);
        		}
    		}
			
			if(filter.value) {
				switch(filter.value) {
					case 'today':						
						result = itemVal >= this.dateInfo.today && itemVal < this.dateInfo.tomorrow;
						break;
					case 'tomorrow':
						result = itemVal >= this.dateInfo.tomorrow && itemVal < this.dateInfo.tomorrow + this.dateInfo.dayMillis;
						break;
					case 'yesterday':
						result = itemVal >= this.dateInfo.yesterday && itemVal < this.dateInfo.today;
						break;
					case 'thisweek':
						result = itemVal >= this.dateInfo.sunday && itemVal < this.dateInfo.nextSunday;
						break;
					case 'nextweek':
						result = itemVal >= this.dateInfo.nextSunday && itemVal < this.dateInfo.nextSunday + this.dateInfo.weekMillis;
						break;
					case 'lastweek':
						result = itemVal >= this.dateInfo.lastSunday && itemVal < this.dateInfo.sunday;
						break;
					case 'thismonth':
						result = itemVal >= this.dateInfo.thisMonthStart && itemVal < this.dateInfo.nextMonthStart;
						break;
					case 'nextmonth':						
						result = itemVal >= this.dateInfo.nextMonthStart && itemVal < this.dateInfo.nextMonthEnd;
						break;
					case 'lastmonth':
						result = itemVal >= this.dateInfo.lastMonthStart && itemVal < this.dateInfo.thisMonthStart;
						break;
					case 'thisyear':
						result = itemVal >= this.dateInfo.thisYearStart && itemVal < this.dateInfo.nextYearStart;
						break;
					case 'nextyear':
						result = itemVal >= this.dateInfo.nextYearStart && itemVal < this.dateInfo.nextYearEnd;
						break;
					case 'lastyear':
						result = itemVal >= this.dateInfo.lastYearStart && itemVal < this.dateInfo.thisYearStart;
						break;
				}    			
    		}
			
			return result;
		},
		_applyDialogFilter: function($dialog, column) {
			var self = this;
			var columnId = column.id;
			this._filterColumn(columnId);					
			this.grid.updateColumnHeader(columnId, column.name + '<span id="' + columnId + '_removeFilterButton" class="ui-remove-filter-button"></span>', '');
			$('#' + columnId + '_removeFilterButton').click(function() {
				self._clearDialogFilter($dialog, columnId);						
			});
			$dialog.dialog('close');
		},
		_clearDialogFilter: function($dialog, columnId) {
			this.filters[columnId].logic = null;
			$dialog.find('select.ui-filter-compare-operator').val('');
			$dialog.find('input.ui-filter-val').val('');					
			$dialog.find('input.ui-filter-logic-operator').removeAttr('checked');					
			this._filterColumn(columnId);			
			$('#' + columnId + '_removeFilterButton').remove();
			$dialog.dialog('close');
		},
		_dateEdit: function(args) {			
			var $input = null;
			var defaultValue = null;
			var calendarOpen = false;
			
			this.init = function () {
				var $cell = $(args.container);
		    	var $paddingTop = $cell.padding('top');
				$input = $('<input type="text" class="ui-grid-editor" />')
					.appendTo(args.container)
					.width($cell.width() + $cell.padding('right') - ($.browser.msie || $.browser.mozilla ? 2 : 1))
					.height($cell.height() - $paddingTop - $cell.padding('bottom'))
					.css({'position': 'relative', 'top': -$paddingTop, 'left': -$cell.padding('left')})
					.focus().select();
				
				$input.datepicker({
					showOn: 'button',
					buttonImageOnly: true,
					buttonImage: args.grid.getOptions()['calendarImage'],
					beforeShow: function () {
						$('#ui-datepicker-div').addClass('ui-grid-datepicker');	
						calendarOpen = true;
					},
					onClose: function () {
						$('#ui-datepicker-div').addClass('ui-grid-datepicker');
						calendarOpen = false;
					}
				});
				
				$input.width($input.width() - 18);
			};
			
			this.destroy = function () {
				$.datepicker.dpDiv.stop(true, true);
				$input.datepicker('hide');
				$input.datepicker('destroy');
				$input.remove();
			};
			
			this.show = function () {
				if (calendarOpen) {
					$.datepicker.dpDiv.stop(true, true).show();
				}
			};
			
			this.hide = function () {
				if (calendarOpen) {
					$.datepicker.dpDiv.stop(true, true).hide();
				}
			};
			
			this.position = function (position) {
				if (!calendarOpen) {
					return;
				}
				$.datepicker.dpDiv.css('top', position.top + 30).css('left', position.left);
			};
			
			this.focus = function () {
				$input.focus();
			};
			
			this.loadValue = function (item) {
				defaultValue = item[args.column.field];
					$input.val(defaultValue);
					$input[0].defaultValue = defaultValue;
					$input.select();
			};
			
			this.serializeValue = function () {
				return $input.val();
			};
			
			this.applyValue = function (item, state) {
				var col = args.column;
				item[col.field] = state;
				
				if(col.sort === 'date' && col.dateFormat) {
					item[col.field + '-sort'] = Date.parseExact(state, col.dateFormat).getTime();
				}				
			};
			
			this.isValueChanged = function () {
				return $.uiplugins.grid.prototype._trackChange.call(this, $input, defaultValue, args);	    			    	
			};
			
			this.validate = function () {
				return {
					valid: true,
					msg: null
				};
			};
			
			this.init();
		},
		_textEdit: function(args) {			
			var $input = null;
			var defaultValue = null;

		    this.init = function () {
		    	var $cell = $(args.container);
		    	var $paddingTop = $cell.padding('top');
		    	$input = $('<input type="text" class="ui-grid-editor"/>')
					.appendTo(args.container)
					.bind('keydown.nav', function (e) {
						if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
							e.stopImmediatePropagation();
						}
					})
					.width($cell.width() + $cell.padding('right') - ($.browser.msie || $.browser.mozilla ? 2 : 1))
					.height($cell.height() - $paddingTop - $cell.padding('bottom'))
					.css({'position': 'relative', 'top': -$paddingTop, 'left': -$cell.padding('left'), 'text-align': $cell.css('text-align')})
					.focus()
					.select();
		    	
		    	switch(args.column.dataType) {
		    		case 'integer':
		    			$input.textinput({'filter': 'digits'});
		    			break;
		    		case 'numeric':
		    			$input.textinput({'filter': 'numeric'});
		    			break;		    		
		    	}
		    };
		
		    this.destroy = function () {				
		    	$input.remove();
		    };
		
		    this.focus = function () {
		    	$input.focus();
		    };
		
		    this.getValue = function () {
		    	return $input.val();
		    };
		
		    this.setValue = function (val) {
		    	$input.val(val);
		    };
		
		    this.loadValue = function (item) {
				defaultValue = item[args.column.field] || '';
				$input.val(defaultValue);
				$input[0].defaultValue = defaultValue;
				$input.select();
		    };		    
		
		    this.serializeValue = function () {
		    	return $input.val();
		    };
		
		    this.applyValue = function (item, state) {
		    	item[args.column.field] = state;
		    };
		
		    this.isValueChanged = function () {
		    	return $.uiplugins.grid.prototype._trackChange.call(this, $input, defaultValue, args);				
		    };
		
		    this.validate = function () {
		    	if (args.column.validator) {
		    		var validationResults = args.column.validator($input.val());
		    		if (!validationResults.valid) {
		    			return validationResults;
		    		}
		    	}
		
		    	return {
		    		valid: true,
		    		msg: null
		    	};
		    };
		
		    this.init();
		},
		_dropDownEdit: function(args) {
			var $select = null;
			var defaultValue = null;

			this.init = function () {
				var html = '<select tabIndex="0" class="ui-grid-editor">';
				var options = typeof args.column.editorOptions === 'function' ? args.column.editorOptions.call(this, args.item, args.column) : args.column.editorOptions;
				var $cell = $(args.container);
		    	var paddingTop = $cell.padding('top');
		    	var paddingLeft = $cell.padding('left');
		    	
				for(var i = 0; i < options.length; i++) {
					var option = options[i];
					var isObject = typeof option === 'object';
					var name = isObject ? option.name : option;
					var value = isObject ? option.value : option;
					var disabled = isObject && option.disabled ? ' disabled="disabled"' : '';
					html += '<option value="' + value + '"' + disabled + '>' + name + '</option>';									
				}
				
				html += '</select>';
				$select = $(html)
					.width($cell.width() + $cell.padding('right') + paddingLeft)
					.height($cell.height() + paddingTop + $cell.padding('bottom'))
					.css({'position': 'relative', 'top': -paddingTop, 'left': -paddingLeft, 'text-align': $cell.css('text-align')})
					.appendTo(args.container)
					.focus();
			};

			this.destroy = function () {
				$select.remove();
			};

			this.focus = function () {
				$select.focus();
			};

			this.loadValue = function (item) {				
				$select.val((defaultValue = item[args.column.field] || ''));
				$select.select();
			};

			this.serializeValue = function () {
				return $select.val();
			};

			this.applyValue = function (item, state) {
				item[args.column.field] = state;
			};

			this.isValueChanged = function () {
		    	return $.uiplugins.grid.prototype._trackChange.call(this, $select, defaultValue, args);
			};

			this.validate = function () {
				return {
					valid: true,
					msg: null
				};
			};

			this.init();
		},		
		_trackChange: function($input, defaultValue, args) {
			var item = args.item;
			var isNumeric = args.column.dataType === 'numeric';
			var value = isNumeric ? Number($input.val()) : $input.val();			
			var isChanged = (!(value == '' && defaultValue == null)) && (value != defaultValue);	
			var changeTracked = item.changedCells && item.changedCells[args.column.field] !== undefined;
			
			// track the original value of changed items
			if(isChanged && !changeTracked) {
				var change = {};
				change[args.column.field] = defaultValue;
				$.extend(true, item, {'changedCells': change});
			} else if(isChanged && changeTracked) {
				var originalValue = isNumeric ? Number(item.changedCells[args.column.field]) : item.changedCells[args.column.field];
				if(value === originalValue) {
					delete item.changedCells[args.column.field];
				}		    		
			}
			
			return isChanged;
		},
		_currencyFormatter: function(rowNum, cellNum, value, columnDef, row) {			
			if($.currency) {
				value = $.currency(value, columnDef.formatOptions);
			}			
						
			return value;
		},
		_checkboxFormatter: function(rowNum, cellNum, value, columnDef, row, self) {
			var html = '<input type="checkbox" class="ui-grid-checkbox"';			
			
			if(value && (value + '').toLowerCase() !== columnDef.formatOptions.notCheckedValue.toLowerCase()) {
				html += ' checked="checked"';
			}
			
			if(self.disabled) {
				html += ' disabled="disabled"';
			}
			
			html += '/>';			
			return html;
		},
		_properCaseFormatter: function(rowNum, cellNum, value, columnDef, row) {
			return value ? value.toProperCase() : '';			
		},	
		_addCellCssFormatter: function(rowNum, cellNum, value, columnDef, row) {
			html = '<div';						
						
			if(row.cellClasses && row.cellClasses[columnDef.field] !== undefined) {
				html += ' class="' + row.cellClasses[columnDef.field] + '"';
			}
			
			html += '>' + value + '</div>';
			return html;
		},
		_formatterChain: function(rowNum, cellNum, value, columnDef, row, self) {
			var cellClasses = row.cellClasses ? row.cellClasses : {};
			
			if(row.changedCells && row.changedCells[columnDef.field] !== undefined) {					
				cellClasses[columnDef.field] = cellClasses[columnDef.field] ? cellClasses[columnDef.field] + ' ui-changed-cell' : 'ui-changed-cell';
				row.cellClasses = cellClasses;
			} else if(cellClasses[columnDef.field]) {
				var classes = cellClasses[columnDef.field].split(' ');
				var newClasses = '';
				
				for(var i = 0; i < classes.length; i++) {
					if(classes[i] !== 'ui-changed-cell') {
						newClasses += (' ' + classes[i]); 
					}
				}
				
				row.cellClasses[columnDef.field] = newClasses;
			}
			
			for(var i = 0; i < columnDef.formatters.length; i++) {
				value = columnDef.formatters[i].call(this, rowNum, cellNum, value, columnDef, row, self);
			}
			
			return value;
		},
		_removeFromClassList: function(currentList, removeList) {		
			var remove = removeList.split(' ');
			var current = currentList.split(' ');
			var newClasses = '';
				
			for(var i = 0; i < current.length; i++) {
				if($.inArray(current[i], remove) === -1) {
					newClasses += current[i] + ' ';
				}					
			}
			
			return newClasses.trim();
		},
		_toggleColumnAttributesDisabled: function(attributes, disable) {
			var columns = this.options.columns;
			
			for(var i = 0; i < columns.length; i++) {
				var column = columns[i];
				
				for(var j = 0; j < attributes.length; j++) {
					var attribute = attributes[j];
					
					if(disable && column[attribute]) {
						column[attribute] = false;
						column[attribute + 'Disabled'] = true;														
					} else if(column[attribute + 'Disabled']) {
						column[attribute] = true;
						column[attribute + 'Disabled'] = false;					
					}
				}							
			}			
		},
		_setOption: function(option, value) {
			$.Widget.prototype._setOption.apply(this, arguments);
			this.grid.setOptions(this.options);
			
			switch(option) {
				case 'showHeaderRow':
					this.grid.setHeaderRowVisibility(value && value !== 'false');
					break;				
			}
		},
		getSlickGrid: function() {
			return this.grid;
		},
		cancelCurrentEdit: function() {
			var gridEditorLock = this.grid.getEditorLock();
			
			if(gridEditorLock.isActive()) {
				gridEditorLock.cancelCurrentEdit();
			}			
		},
		saveCurrentEdit: function() {
			var gridEditorLock = this.grid.getEditorLock();
			
			if(gridEditorLock.isActive()) {
				gridEditorLock.commitCurrentEdit();
			}
		},	
		setRowCssClass: function(rowKey, cssClass) {
			var row = this.getItem(rowKey);
			
			if(row) {
				row.cssClasses = cssClass;
				this.grid.invalidate();
			}
		},
		removeRowCssClass: function(rowKey, classToRemove) {
			var row = this.getItem(rowKey);
			
			if(row && row.cssClasses) {
				this.setRowCssClass(rowKey, this._removeFromClassList(row.cssClasses, classToRemove));				
				this.grid.invalidate();
			}						
		},
		/**
		 * Method to set CSS classes on several cells in one call. The <code>cssData</code> parameter is an
		 * array of objects containing, by row, a list of CSS classes to apply to columns. An
		 * example cssData parameter follows:<br/> 
		 * 
		 * <code>
		 * [
		 * 	{
		 * 		rowKey: 'row1234',
		 * 		cellClasses: {'column1': 'error', 'column3': 'warning anotherClass'}
		 *	},
		 *	{
		 * 		rowKey: 'row4567',
		 * 		cellClasses: {'column1': 'warning'}
		 *	} 
		 * ]
		 * </code>
		 * @method setCellCssClasses 
		 * 
		 * @param cssData
		 */
		setCellCssClasses: function(cssData) {
			if(cssData && cssData.length) {
				for(var i = 0; i < cssData.length; i++) {
					var rowCssData = cssData[i];
					var row = this.getItem(rowCssData.rowKey);
					if(row) {
						var cssClasses = row.cellClasses ? row.cellClasses : {};
						$.extend(cssClasses, rowCssData.cellClasses);
						row.cellClasses = cssClasses;
					}								
				}
				
				this.grid.invalidate();
			}			
		},	
		/**
		 * Add the specified <code>cssClass</code> to the cell at <code>rowKey</code> and <code>columnName</code>.
		 * 
		 * @method addCellCssClass
		 * 
		 * @param rowKey
		 * @param columnName
		 * @param cssClass
		 */
		addCellCssClass: function(rowKey, columnName, cssClass) {
			var classes = this.getCellCssClass(rowKey, columnName);
			classes += ' ' + cssClass;				
			this.setCellCssClass(rowKey, columnName, classes.trim());
			this.grid.invalidate();
		},
		/**
		 * Remove the specified <code>cssClass</code> from the cell at <code>rowKey</code> and <code>columnName</code>.
		 * 
		 * @method removeCellCssClass
		 * 
		 * @param rowKey
		 * @param columnName
		 * @param cssClass
		 */
		removeCellCssClass: function(rowKey, columnName, classToRemove) {
			var currentClasses = this.getCellCssClass(rowKey, columnName);
			
			if(currentClasses) {				
				this.setCellCssClass(rowKey, columnName, this._removeFromClassList(currentClasses, classToRemove));
				this.grid.invalidate();
			}	
		},
		/**
		 * Get the css classes that have been applied to the cell at <code>rowKey</code> and <code>columnName</code>
		 * via <code>addCellCssClass</code>, <code>setCellCssClass</code> or <code>setCellCssClasses</code>.
		 * 
		 * @method getCellCssClass
		 * 
		 * @param rowKey
		 * @param columnName
		 * @return {String} The list of classes that have been applied to the cell at <code>rowKey</code> and
		 * 
		 * <code>columnName</code>. 
		 */
		getCellCssClass: function(rowKey, columnName) {
			var classes = '';
			var row = this.getItem(rowKey);
			
			if(row) {
				classes = row.cellClasses ? row.cellClasses[columnName] : classes;
			}
			
			return classes;
		},
		/**
		 * Set the css class of the cell at <code>rowKey</code> and <code>columnName</code> to <code>cssClass</code>,
		 * thus removing any class set on the cell previously by <code>setCellCssClass</code>, <code>addCellCssClass</code>
		 * or <code>setCellCssClasses</code>.
		 * 
		 * @method setCellCssClass
		 * 
		 * @param rowKey
		 * @param columnName
		 * @param cssClass
		 */
		setCellCssClass: function(rowKey, columnName, cssClass) {
			var row = this.getItem(rowKey);
			
			if(row) {
				var clazz = {};
				clazz[columnName] = cssClass;
				this.setCellCssClasses([{rowKey: rowKey, cellClasses: clazz}]);
			}				       	 
		},		
		/**
		 * Clear all user specified classes from the cell at <code>rowKey</code> and <code>columnName</code>.
		 * @method clearCellCssClass
		 *
		 * @param rowKey
		 * @param columnName
		 */
		clearCellCssClass: function(rowKey, columnName) {
			this.setCellCssClass(rowKey, columnName, '');				
		},
		getItem: function(rowKey) {
			return this.dataHash[rowKey];						
		},
		setItem: function(rowKey, item) {
			this.dataHash[rowKey] = item;
			this.dataView.updateItem(rowKey, item);		
			this.grid.invalidate();
		},
		getItems: function(rowKeys) {
			var items = [];
			
			for(var i = 0; i < rowKeys.length; i++) {
				items.push(this.dataHash[rowKeys[i]]);
			}
			
			return items;
		},
		replaceItem: function(rowKey, newItem) {
			delete this.dataHash[rowKey];
			this.dataHash[newItem.id] = newItem;
			var rowNumber = this.dataView.getRowById(rowKey);
			this.dataView.insertItem(rowNumber, newItem);
			this.dataView.deleteItem(rowKey);
			this.grid.invalidate();
		},
		isItemChanged: function(rowKey) {
			var isChanged = false;
			var item = this.getItem(rowKey);
			
			if(item && item.changedCells) {
				for(var field in item.changedCells) {
					isChanged = true;
					break;
				}
			}
			
			return isChanged;
		},
		getOriginalValue: function(rowKey, columnName) {
			var item = this.getItem(rowKey);
			var originalValue = item[columnName];
			
			if(item && item.changedCells) {
				var changes = this.getChanges();
			
				for(var i = 0; i < changes.length; i++) {
					var change = changes[i];
					if(change[this.options.rowKey] === rowKey) {
						for(var j = 0; j < change.changes.length; j++) {
							var cellChange = change.changes[j];
							
							if(cellChange.field == columnName) {
								originalValue = cellChange.oldValue;
								break;
							}
						}
					}				
				}
			}
			
			return originalValue;
		},
		markItemChanged: function(rowKey, columnName, originalValue) {
			var item = this.getItem(rowKey);			
			var changeTracked = item.changedCells && item.changedCells[columnName] !== undefined;
			
			if(!changeTracked) {				
				var change = {};
				change[columnName] = originalValue;
				$.extend(true, item, {'changedCells': change});
			}			
			
			this.grid.invalidate();
		},
		getChanges: function() {
			var changes = [];
			
			for(var i = 0; i < this.options.data.length; i++) {
				var item = this.options.data[i];
				
				if(item.changedCells) {
					var itemChanges = [];
					
					for(var field in item.changedCells) {
						itemChanges.push({
							'field': field, 
							'oldValue': item.changedCells[field], 
							'newValue': item[field]}
						);
					}
										
					if(itemChanges.length > 0) {
						var itemChange = {'changes': itemChanges};
						itemChange[this.options.rowKey] = item[this.options.rowKey];						
						changes.push(itemChange);
					}					
				}
			}
			
			return changes;
		},
		getChangedItems: function() {
			var changedItems = [];
			
			for(var i = 0; i < this.options.data.length; i++) {
				var item = this.options.data[i];
				
				if(item.changedCells) {
					// this loop is here so we don't return items with an empty changeCells object, i.e. it had changes that were removed
					for(var field in item.changedCells) {
						var clone = $.extend(true, {}, item);
						delete clone.cssClasses;
						delete clone.changedCells;
						delete clone.cellClasses;
						changedItems.push(clone);
						break;
					}									
				}
			}
			
			return changedItems;
		},
		clearItemChanges: function(rowKey) {
			for(var i = 0; i < this.options.data.length; i++) {
				var item = this.options.data[i];
				
				if(item[this.options.rowKey] == rowKey) {
					delete item.changedCells;
					break;
				}
			}
			
			this.grid.invalidate();
		},
		clearChangedItems: function() {
			for(var i = 0; i < this.options.data.length; i++) {
				var item = this.options.data[i];
				
				if(item.changedCells) {						
					delete item.changedCells;		
				}
			}
			
			this.grid.invalidate();
		},
		/**
		 * @method disable
		 */
		disable: function() {			
			$.Widget.prototype.disable.call(this);			
			this.options.editDisabled = this.options.editable;
			this.options.columnReorderDisabled = this.options.enableColumnReorder;
			this.options.editable = false;			
			this.options.enableColumnReorder = false;
			this.grid.setOptions(this.options);
			this.element.find('div.slick-header-columns').sortable('disable');
			this._toggleColumnAttributesDisabled(['sortable', 'resizable'], true);
			this.element.find('div.slick-headerrow-columns .ui-grid-filter').attr('disabled', 'disabled');
			this.element.find('div.slick-viewport').css('overflow-y', 'hidden');
			this.disabled = true;
			this.grid.invalidate();
			this._trigger('disable');
		},
		/**
		 * @method enable
		 */
		enable: function() {
			$.Widget.prototype.enable.call(this);			
			this.options.editable = this.options.editDisabled;
			this.options.enableColumnReorder = this.options.columnReorderDisabled;
			this.grid.setOptions(this.options);
			if(this.options.enableColumnReorder) {
				this.element.find('div.slick-header-columns').sortable('enable');
			}
			this._toggleColumnAttributesDisabled(['sortable', 'resizable'], false);
			this.element.find('div.slick-headerrow-columns .ui-grid-filter').removeAttr('disabled');
			this.element.find('div.slick-viewport').css('overflow-y', 'auto');
			this.disabled = false;
			this.grid.invalidate();
			this._trigger('enable');
		},	
		/**
		 * @method destroy
		 */
		destroy: function() {
			this.grid.onColumnsReordered.unsubscribe();
			this.grid.onColumnsResized.unsubscribe();
			this.grid.destroy();
			this.element.removeClass('ui-grid ui-widget').unbind().empty();
			$.Widget.prototype.destroy.call(this);		
		}
	});
})(jQuery);/*
 * jQuery UI Groupbox 0.0.9
 *
 * Copyright 2012, Chad LaVigne
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php) 
 *
 * http://code.google.com/p/jquery-ui-plugins/wiki/Groupbox
 *
 * Depends:
 *  jquery 1.8.2
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
;(function($, undefined) {
	
	$.widget('uiplugins.groupbox', {  
		options: {		
			"buttonSize": "medium",
			"buttonStyle": {},
			"cssClassList1": "",
			"cssClassList2": "",
			"height": "500",
			"idAttr": "id",
			"itemSize": "medium",
			"itemsList1": [],
			"itemsList2": [],
			"itemStyle": {},			
			"labelAttr": "name",
			"labelList1": "From",						
			"labelList2": "To",
			"selectable": true,
			"width": "300",			
		},
		_create: function() {
			var $groupbox = this.element;
			$groupbox.addClass('ui-groupbox');			
			this.$groupbox = $groupbox;			
			this.$lastSelection;
			// assign items to an object so we can quickly access items by id
			this._initItemsObject();			
			this._render();
		},
		_initItemsObject: function() {
			var opts = this.options;	
			this.itemsObject = {};
			this._addToItemsObject(opts.itemsList1);
			this._addToItemsObject(opts.itemsList2);	
		},
		_addToItemsObject: function(itemList) {
			var itemsObject = this.itemsObject;
			var opts = this.options;	
			
			for(var i = 0; i < itemList.length; i++) {
				var item = itemList[i];
				itemsObject['ui-groupbox-item-' + item[opts.idAttr]] = item;
			}	
		},
		_render: function() {
			var self = this;
			var $groupbox = this.$groupbox;
			var opts = this.options;
			var $itemsList1 = this._renderList(opts.labelList1, opts.itemsList1, opts.cssClassList1);			
			$itemsList1.addClass('group1');
			var $buttons = $('<div class="ui-groupbox-buttons"></div>');
			$addButton = $('<button class="ui-groupbox-add"><span class="ui-icon ui-icon-arrowthick-1-e" title="Add Selected">Add</span></button>').button();
			$removeButton = $('<button class="ui-groupbox-remove"><span class="ui-icon ui-icon-arrowthick-1-w" title="Remove Selected">Remove</span></button>').button();			
			$buttons.append($addButton).append('<br/>').append($removeButton);			
			$groupbox.append($buttons).after('<div class="ui-groupbox-clear"/>');
			
			var $itemsList2 = this._renderList(opts.labelList2, opts.itemsList2, opts.cssClassList2);
			$itemsList2.addClass('group2');
			$addButton.click(function() {
				self._moveSelected($itemsList1, $itemsList2);
			});
			
			$removeButton.click(function() {
				self._moveSelected($itemsList2, $itemsList1);
			});
						
			$('div.ui-groupbox-buttons button span.ui-button-text').addClass('ui-button-' + opts.buttonSize);			
			$buttons.css('top', this._getButtonTop());
			$buttons.find('button').css(opts.buttonStyle);			
			this._bindListEvents($itemsList1, $itemsList2);
			this._bindListEvents($itemsList2, $itemsList1);			
		},
		_renderList: function(label, items, cssClass) {
			var $wrapperDiv = $('<div class="ui-groupbox-list-wrapper"></div>');
			var opts = this.options;
			$wrapperDiv.append('<label class="ui-groupbox-label">' + label + '</label>');
			
			if(cssClass) {
				$wrapperDiv.addClass(cssClass);
			}	
			
			$scrollDiv = $('<div class="ui-groupbox-scroll"></div>');
			$scrollDiv.css({"width": opts.width, "height": opts.height});
			$list = $('<ul class="ui-groupbox-list"></ul>');			
			this._refreshItems($list, items);			
			$scrollDiv.append($list);
			$wrapperDiv.append($scrollDiv);				
			this.$groupbox.append($wrapperDiv);
			
			return $list;
		},
		_refreshItems: function($list, items) {
			var itemsHtml = '';
			var opts = this.options;
			
			if(items.length) {
				for(var i = 0; i < items.length; i++) {
					var item = items[i];
					var classList = item.selected ? 'ui-selected ui-state-active ui-groupbox-item ui-item-' + opts.itemSize : 'ui-state-default ui-groupbox-item ui-item-' + opts.itemSize;
					itemsHtml += '<li id="ui-groupbox-item-' + item[opts.idAttr] + '" class="' + classList + '">' + item[opts.labelAttr] + '</li>';
				}
			}
						
			$list.html(itemsHtml);	
			$list.children('li.ui-groupbox-item').css(opts.itemStyle);
		},
		_bindListEvents: function($list, $otherList) {
			var self = this;

			$list.children('li.ui-groupbox-item').each(function() {
				self._bindListItemEvents($(this), $otherList);
			});			
			
			if(this.options.selectable) {
				this._makeListSelectable($list);
			}
		},
		_bindListItemEvents: function($listItem, $otherList) {
			var self = this;
			
			$listItem.click(function(event) {
				if(!self.options['disabled']) {
					var $item = $(this);
					var $list = $item.parent('ul');
					var selected = $item.toggleClass('ui-selected ui-state-active').hasClass('ui-selected');				
					
					if(selected) {														
						if(event.shiftKey && self.$lastSelection) {
							var itemIndex = $item.index();
							var lastItemIndex = self.$lastSelection.index();
							var start = itemIndex > lastItemIndex ? lastItemIndex + 1 : itemIndex + 1;
							var end = itemIndex > lastItemIndex ? itemIndex : lastItemIndex;										
							$list.children('li').slice(start, end).addClass('ui-selected ui-state-active');										
						}
						
						self.$lastSelection = $item;
				}
				}							
			});
			
			$listItem.dblclick(function() {
				self._moveItem($(this), $otherList);				
			});
		},
		_makeListSelectable: function($list) {			
			$list.selectable({
				distance: 10,
				start: function(event, ui) {
					$(event.target).children('li.ui-selected').removeClass('ui-state-active');					
				},
				stop: function(event, ui) {
					$(event.target).children('li.ui-selected').addClass('ui-state-active');
				}
			});
		},
		_getButtonTop: function() {
			return this.$groupbox.find('div.ui-groupbox-list-wrapper').height()/2 - this.$groupbox.find('div.ui-groupbox-buttons').height()/2 + this.$groupbox.find('label.ui-groupbox-label').height()/2;
		},
		_setOption: function(option, value) {			
			var self = this;									

			switch(option) {				
				case 'width':
					this.$groupbox.find('div.ui-groupbox-scroll').width(value);					
					break;
				case 'height':
					this.$groupbox.find('div.ui-groupbox-scroll').height(value);
					this.$groupbox.find('div.ui-groupbox-buttons').css('top', this._getButtonTop());
					break;	
				case 'selectable':
					this.$groupbox.find('ul.ui-groupbox-list').each(function() {
						if(eval(value)) {
							self._makeListSelectable($(this));
						} else {
							$(this).selectable('destroy');
						}
					});					
					break;				
				case 'labelList1':
				case 'labelList2':
					this.$groupbox.find('ul.group' + option.charAt(option.length - 1)).parents('div.ui-groupbox-list-wrapper').children('label.ui-groupbox-label').text(value);
					break;				
				case 'cssClassList1':
				case 'cssClassList2':
					this.$groupbox.find('ul.group' + option.charAt(option.length - 1)).parents('div.ui-groupbox-list-wrapper').attr('class', 'ui-groupbox-list-wrapper ' + value);
					break;				
				case 'itemsList1':
				case 'itemsList2':
					var listNumber = option == 'itemsList1' ? 1 : 2;
					if(typeof value === 'string') {
						value = $.parseJSON(value);
					}					
					this.setItems(listNumber, value);
					break;
				case 'buttonSize':					
					this.$groupbox.find('div.ui-groupbox-buttons button span.ui-button-text').removeClass('ui-button-' + this.options.buttonSize).addClass('ui-button-' + value);
					this.$groupbox.find('div.ui-groupbox-buttons').css('top', this._getButtonTop());
					break;
				case 'buttonStyle':
					if(typeof value === 'string') {
						value = $.parseJSON(value);
					}					
					this.$groupbox.find('div.ui-groupbox-buttons button').css(value);					
					break;
				case 'itemSize':
					this.$groupbox.find('li.ui-groupbox-item').removeClass('ui-item-' + this.options.itemSize).addClass('ui-item-' + value);			
					break;
				case 'itemStyle':
					if(typeof value === 'string') {
						value = $.parseJSON(value);
					}					
					this.$groupbox.find('li.ui-groupbox-item').css(value);					
					break;
			}
			
			$.Widget.prototype._setOption.apply(this, arguments);
		},
		_moveItem: function($item, $toList) {	
			if(!this.options['disabled']) {
				var $fromList = $item.parent('ul');
				var removeFromList1 = $fromList.hasClass('group1');
				var fromList = removeFromList1 ? this.options.itemsList1 : this.options.itemsList2;
				var toList = removeFromList1 ? this.options.itemsList2 : this.options.itemsList1;
				var itemIndex = $item.index();
				this._trigger('beforeMove', null, {"item": fromList[itemIndex], "fromList": fromList, "toList": toList, "fromListElement": $fromList, "toListElement": $toList});				
				var removedItem = fromList.splice(itemIndex, 1)[0];
				toList.push(removedItem);				
				var $newItem = $('<li id="' + $item.attr('id') + '" class="ui-state-default ui-groupbox-item ui-item-' + this.options.itemSize + '">' + $item.html() + '</li>');	
				$newItem.css(this.options.itemStyle);
				this._bindListItemEvents($newItem, $fromList);
				$toList.append($newItem);			
				$item.remove();
				this._trigger('afterMove', null, {"item": removedItem, "fromList": fromList, "toList": toList, "fromListElement": $fromList, "toListElement": $toList});
			}			
		},		
		_moveSelected: function($fromList, $toList) {
			var self = this;
			
			$fromList.children('li.ui-state-active').each(function() {
				self._moveItem($(this), $toList);				
			});		
		},			
		getItems: function(listNumber) {
			return listNumber == 1 ? this.options.itemsList1 : this.options.itemsList2;
		},		
		setItems: function(listNumber, items) {
			this.options['itemsList' + listNumber] = items;
			var $items = this.$groupbox.find('ul.group' + listNumber);
			this._initItemsObject();
			this._refreshItems($items, items);
			var otherListNumber = listNumber == 1 ? 2 : 1;
			this._bindListEvents($items, this.$groupbox.find('ul.group' + otherListNumber));
		},				
		getSelected: function(listNumber) {			
			var items = [];
			var itemsObject = this.itemsObject;
			
			this.$groupbox.find('ul.group' + listNumber).children('li.ui-state-active').each(function() {
				items.push(itemsObject[$(this).attr('id')]);
			});
			
			return items;
		},
		setSelected: function(listNumber, items, clearSelections) {
			var $list = this.$groupbox.find('ul.group' + listNumber);
			var isIdList = typeof items[0] !== 'object';
			
			if(clearSelections) {
				$list.children('li.ui-groupbox-item').removeClass('ui-state-active');
			}
			
			for(var i = 0; i < items.length; i++) {
				var id = isIdList ? items[i] : items[i][this.options.idAttr];
				$list.children('#ui-groupbox-item-' + id).addClass('ui-state-active');
			}
		},		
		addItem: function(listNumber, item) {	
			var opts = this.options;
			var id = 'ui-groupbox-item-' + item[opts.idAttr];			
			var otherListNumber = listNumber == 1 ? 2 : 1;
			var $list = this.$groupbox.find('ul.group' + listNumber);
			var $otherList = this.$groupbox.find('ul.group' + otherListNumber);
			var list = listNumber == 1 ? opts.itemsList1 : opts.itemsList2;
			this._trigger('beforeAdd', null, {"item": item, "list": list, "listElement": $list});
			list.push(item);			
			this.itemsObject[id] = item;
			var $newItem = $('<li id="' + id + '" class="ui-state-default ui-groupbox-item ui-item-' + this.options.itemSize + '">' + item[opts.labelAttr] + '</li>');
			$newItem.css(this.options.itemStyle);
			this._bindListItemEvents($newItem, $otherList);
			$list.append($newItem);
			this._trigger('afterAdd', null, {"item": item, "list": list, "listElement": $list});					
		},
		removeItem: function(listNumber, item) {			
			var id = typeof item === 'object' ? item[this.options.idAttr] : item;
			var theItem = this.itemsObject['ui-groupbox-item-' + id];
			var $list = this.$groupbox.find('ul.group' + listNumber);
			var $item = $list.children('#ui-groupbox-item-' + id);			
			this._trigger('beforeRemove', null, {"item": theItem, "list": list, "listElement": $list});
				
			if(theItem && $item.length) {				
				var list = this.options['itemsList' + listNumber];
				list.splice($item.index(), 1);
				delete this.itemsObject['ui-groupbox-item-' + id];
				$item.remove();
				this._trigger('afterRemove', null, {"item": theItem, "list": list, "listElement": $list});
			}			
		},
		enable: function() {			
			this.$groupbox.find('ul.ui-groupbox-list').selectable('enable');
			this.$groupbox.find('div.ui-groupbox-buttons button').button('enable');
			this.$groupbox.find('div.ui-groupbox-scroll').css('overflow-y', 'scroll');
			$.Widget.prototype.enable.call(this);
			this._trigger("enable", null, this.element);
		},
		disable: function() {
			this.$groupbox.find('ul.ui-groupbox-list').selectable('disable');
			this.$groupbox.find('div.ui-groupbox-buttons button').button('disable');
			this.$groupbox.find('div.ui-groupbox-scroll').css('overflow-y', 'hidden');
			$.Widget.prototype.disable.call(this);
			this._trigger("disable", null, this.element);
		},
		destroy: function() {
			var $groupbox = this.$groupbox;			
			$groupbox.empty();
			$groupbox.siblings('div.ui-groupbox-clear').remove();
			$groupbox.removeClass('ui-groupbox');			
			
			$.Widget.prototype.destroy.call(this);		
		}
	});
})(jQuery);/*
 * jQuery UI Textarea 0.0.9
 *
 * Copyright 2012, Chad LaVigne
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php) 
 *
 * http://code.google.com/p/jquery-ui-plugins/wiki/Textarea
 *
 * Depends:
 *  jquery 1.8.2
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.plugins.core.js
 */
;(function($, undefined) {
	
	$.widget('uiplugins.textarea', {  
		options: {			
			"maxChars": -1, // number or function returning the number of chars allowed, using a function is valuable for dynamic limits, for example, when the limit depends on the contents of another textarea
			"charLimitMessage": "", // message displaying character limit info
			"pasteFlickerFix": true, // turning this off will help performance but you'll see a flicker in some browsers when text that's too long is pasted into the textarea
			"limitMessageStyle": {}, // css style applied to limit message
			"limitMessageClass": "" // css class applied to limit message,
		},
		_create: function() {
			var opts = this.options,				
				$textarea = this.element;
				$textarea.addClass('ui-textarea');
			
			this.$textarea = $textarea;
			
			if(opts.maxChars && opts.charLimitMessage) {				
				this._renderLimitMessage();
			}
			
			if(typeof opts.maxChars === 'function' || Number(opts.maxChars) >= 0) {
				this._initCharLimit();			
			}			
		},
		_setOption: function(option, value) {
			$.Widget.prototype._setOption.apply(this, arguments);
			var opts = this.options;

			switch(option) {				
				case 'maxChars':
					this._setMaxChars(value);					
					break;
				case 'charLimitMessage':
					if(value) {
						this.refresh();
					}
					break;								
				case 'limitMessageStyle':
					if(typeof opts.limitMessageStyle === 'string') {
						opts.limitMessageStyle = $.parseJSON(opts.limitMessageStyle);
					}					
					this.$limitMessage.css(opts.limitMessageStyle);					
					break;
				case 'limitMessageClass':
					opts.limitMessageClass += ' ui-char-limit-message';
					this.$limitMessage.attr('class', opts.limitMessageClass);
					break;
			}
		},
		_renderLimitMessage: function() {	
			var $textarea = this.$textarea;
			var opts = this.options;
			var $limitMessage = $('<div class="ui-char-limit-message"></div>').insertAfter($textarea);			
			$limitMessage.css(opts.limitMessageStyle);
			$limitMessage.addClass(opts.limitMessageClass);
			$textarea.parent('div').css('margin-bottom', $limitMessage.height() + 'px');
			this.$limitMessage = $limitMessage;
		},
		_getLimitMessageLoc: function() {
			var $textarea = this.$textarea;
			var location = $textarea.offset();
			location.top += $.browser.msie ? $textarea.height() + 7 : $textarea.height() + 3;
			location.left += 2;
			return location;
		},
		_handleKeyPress: function(event) {		
			this._trigger('beforeChange', event, this.element);
			var self = this;
			var opts = this.options;
			var max = typeof opts.maxChars === 'function' ? opts.maxChars.apply() : opts.maxChars;
			var key = event.which;
			var oldVal = self._getValueData();
			var newVal = oldVal.beforeCursor + String.fromCharCode(key) + this.afterCursor();									
			var emptyChar = (key >= $.ui.keyCode.SHIFT && key <= $.ui.keyCode.CAPS_LOCK) || key == $.ui.keyCode.ESCAPE || (key > $.ui.keyCode.SPACE && key <= $.ui.keyCode.DOWN) || key == $.ui.keyCode.INSERT || (key >= $.ui.keyCode.COMMAND && key <= $.ui.keyCode.COMMAND_RIGHT) || (key >= $.ui.keyCode.NUM_LOCK && key <= $.ui.keyCode.SCROLL_LOCK);			
			var alwaysValid = key == 0 || key == $.ui.keyCode.BACKSPACE || key == $.ui.keyCode.DELETE || (event.ctrlKey && key == $.ui.keyCode.A);
			
			if(!(emptyChar || alwaysValid)) {											
				if(newVal.length > max) {
					return false;
				}								
			}
			
			if(!emptyChar) {
				setTimeout(function() {
					self._trigger('afterChange', event, self.element);
				}, 0);	
			}			
		},
		_handlePaste: function(event) {		
			this._trigger('beforeChange', event, this.element);
			var self = this;
			// grab the value before the content gets pasted in
			var oldVal = self._getValueData();
			var opts = self.options;
			var max = typeof opts.maxChars === 'function' ? opts.maxChars.apply() : opts.maxChars;
			var $textarea = self.$textarea;
			var $textareaClone = null;
			
			// the paste flicker fix puts a text area containing a copy of the current value on top of the original text area so the original one is hidden, 
			// this hides the flicker that sometimes occurs when the pasted text is too long but we see it for a split second before it's truncated to fit				
			if(opts.pasteFlickerFix && opts.pasteFlickerFix !== 'false') {
				var location = self._getPasteFixLocation();
				
				$textareaClone = $('<textarea rows="' + $textarea.attr('rows') + '" cols="' + $textarea.attr('cols') + '"></textarea>')
					.addClass($textarea.attr('class'))
					.css({'position': 'absolute', 'top': location.top, 'left': location.left})
					.insertAfter($textarea)
					.val(oldVal.text);
			}
			
			// immediately after paste, trunc the pasted content if it's too long
			setTimeout(
				function() {
					var newVal = $textarea.val();
					var inserted = newVal.substring(oldVal.beforeCursor.length, newVal.length - oldVal.afterCursor.length);
					
					if(newVal.length > max) {
						var truncInserted = inserted.substring(0, max - oldVal.beforeCursor.length - oldVal.afterCursor.length);
						$textarea.val(oldVal.beforeCursor + truncInserted + oldVal.afterCursor);
					}
					
					$textarea.caret({'start': oldVal.beforeCursor.length, 'end': self._getValueData().text.length - oldVal.afterCursor.length});
					
					if($textareaClone) {
						$textareaClone.remove();						
					}					

					self.refresh(event);					
					self._trigger('afterChange', event, self.element);				
				}, 
			0);
		},
		_getPasteFixLocation: function() {
			var location = this.$textarea.offset();
			
			// for whatever reason, placing another textarea with absolute positioning at the exact same offset as the original text area is slightly off by different amounts in different browsers
			if($.browser.webkit) {
				location.top -= 2;
				location.left -= 2;
			} else if($.browser.mozilla) {
				location.top -= 1;
			}
			
			return location;
		},
		_showCharLimitMessage: function () {	
			var opts = this.options;
			var $textarea = this.$textarea;
			var max = typeof opts.maxChars === 'function' ? opts.maxChars.apply() : opts.maxChars;				
			var entered = $textarea.val().length;
			var messageText = opts.charLimitMessage.replace('{MAX}', max).replace('{ENTERED}', entered).replace('{REMAINING}', max - entered); 		
			$textarea.next('div.ui-char-limit-message').text(messageText);			
		},		
		_setMaxChars: function(max) {
			var $textarea = this.$textarea;
			var text = $textarea.val();
			if(text.length > Number(max)) {
				$textarea.val(text.substring(0, max));
			}
			this.refresh();
		},
		_initCharLimit: function() {
			var self = this;
			var opts = self.options;
			var $textarea = self.$textarea;
			
			$textarea.keydown(function(event) {
				return self._handleKeyPress(event);				
			});
			
			$textarea.bind('paste', function(event) {
				self._handlePaste(event);			
			});
			
			if(opts.charLimitMessage) {
				self._showCharLimitMessage();
				$textarea.keyup(function(event) {
					var key = event.which;
					if(!self._ignoreKeyPress(key)) {
						self.refresh(event);
					}					
				});				
			}
		},
		_getValueData: function() {
			var $textarea = this.$textarea;
			var selection = $textarea.caret();
			var text = $textarea.val();
			
			return {
				'selection': selection,
				'text': text,
				'beforeCursor': text.substring(0, selection.start),
				'afterCursor': text.substring(selection.end)
			};
		},
		_ignoreKeyPress: function(key) {
			return key == $.ui.keyCode.ALT ||
				key == $.ui.keyCode.CAPS_LOCK ||
				key == $.ui.keyCode.COMMAND ||
				key == $.ui.keyCode.COMMAND_LEFT ||
				key == $.ui.keyCode.COMMAND_RIGHT ||
				key == $.ui.keyCode.CONTROL ||
				key == $.ui.keyCode.DOWN ||
				key == $.ui.keyCode.END ||
				key == $.ui.keyCode.ESCAPE ||
				key == $.ui.keyCode.HOME ||
				key == $.ui.keyCode.INSERT ||
				key == $.ui.keyCode.LEFT ||
				key == $.ui.keyCode.PAGE_DOWN ||
				key == $.ui.keyCode.PAGE_UP ||
				key == $.ui.keyCode.RIGHT ||
				key == $.ui.keyCode.SHIFT ||
				key == $.ui.keyCode.UP;
		},		
		refresh: function(event) {	
			this._showCharLimitMessage();
		},
		selectedText: function(start, end) {
			if($.isNumeric(start) && $.isNumeric(end)) {
				this.$textarea.caret({'start': Number(start), 'end': Number(end)});
			} else {
				return this.$textarea.caret().text;
			}			
		},
		selectionStart: function() {
			return this.$textarea.caret().start;
		},
		selectionEnd: function() {
			return this.$textarea.caret().end;
		},
		replaceSelection: function(replacement) {
			var selection = this.$textarea.caret();
			
			if(selection.start != selection.end) {
				this.$textarea.val(selection.replace(replacement));
				this.selectedText(selection.start, selection.start + replacement.length);
				this.refresh();
			}			
		},		
		beforeCursor: function() {
			return this._getValueData().beforeCursor;			
		},
		afterCursor: function() {
			return this._getValueData().afterCursor;
		},	
		remaining: function() {
			var opts = this.options;
			var max = typeof opts.maxChars === 'function' ? opts.maxChars.apply() : opts.maxChars;				
			var entered = this.$textarea.val().length;			
			return max - entered;
		},
		enable: function() {			
			this.element.removeAttr('disabled');			
			$.Widget.prototype.enable.call(this);
			this._trigger('enable', null, this.element);
		},
		disable: function() {
			this.element.attr('disabled', 'disabled');
			$.Widget.prototype.disable.call(this);
			this._trigger('disable', null, this.element);
		},
		destroy: function() {
			var $textarea = this.$textarea;			
			$textarea.unbind();			
			$textarea.removeClass('ui-textarea');				
			
			if(this.options.charLimitMessage) {
				$textarea.next('.ui-char-limit-message').remove();
			}
			
			$.Widget.prototype.destroy.call(this);		
		}
	});
})(jQuery);

// include required jquery caret plugin
/*
 *
 * Copyright (c) 2010 C. F., Wong (<a href="http://cloudgen.w0ng.hk">Cloudgen Examplet Store</a>)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
;(function($, len, createRange, duplicate) {
    $.fn.caret = function(options, opt2) {
        var start, end, t = this[0], browser = $.browser.msie, s, e;
        if (typeof options === "object" && typeof options.start === "number" && typeof options.end === "number") {
            start = options.start;
            end = options.end;
        } else if (typeof options === "number" && typeof opt2 === "number") {
            start = options;
            end = opt2;
        } else if (typeof options === "string") {
            if ((start = t.value.indexOf(options)) > -1) end = start + options[len];
            else start = null;
        } else if (Object.prototype.toString.call(options) === "[object RegExp]") {
            var re = options.exec(t.value);
            if (re != null) {
                start = re.index;
                end = start + re[0][len];
            }
        }
        if (typeof start != "undefined") {
            if (browser) {
                var selRange = this[0].createTextRange();
                selRange.collapse(true);
                selRange.moveStart('character', start);
                selRange.moveEnd('character', end - start);
                selRange.select();
            } else {
                this[0].selectionStart = start;
                this[0].selectionEnd = end;
            }
            this[0].focus();
            return this
        } else {
            if (browser) {
                var selection = document.selection;
                if (this[0].tagName.toLowerCase() != "textarea") {
                    var val = this.val(), range = selection[createRange]()[duplicate]();
                    range.moveEnd("character", val[len]);
                    s = (range.text == "" ? val[len] : val.lastIndexOf(range.text));
                    range = selection[createRange]()[duplicate]();
                    range.moveStart("character", -val[len]);
                    e = range.text[len];
                } else {
                    range = selection[createRange](), stored_range = range[duplicate]();
                    stored_range.moveToElementText(this[0]);
                    stored_range.setEndPoint('EndToEnd', range);
                    s = stored_range.text[len] - range.text[len], e = s + range.text[len]
                }
            } else {
                s = t.selectionStart, e = t.selectionEnd;
            }
            var te = t.value.substring(s, e);
            return {start: s, end: e, text: te, replace: function(st) {
                var result = t.value.substring(0, s) + st + t.value.substring(e, t.value[len]);
                return result;
            }}
        }
    }
})(jQuery, "length", "createRange", "duplicate");/*
 * jQuery UI Text 0.0.9
 *
 * Copyright 2012, Chad LaVigne
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php) 
 *
 * http://code.google.com/p/jquery-ui-plugins/wiki/Text
 *
 * Depends:
 *  jquery 1.8.2
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
;(function($, undefined) {
	$.widget('uiplugins.textinput', {  
		options: {
			'allow': null, // array or string of characters that should be allowed, even if filtered out by filter
			'blacklist': null, // black list of characters that are never valid
			'filter': null, // type of filter to apply, valid values are numeric, digits, alpha	
			'stylize': false,
			'whitelist': null // white list of valid characters, everything else is excluded regardless of other filter
		},
		_create: function() {
			var self = this;
			self._initFilters();
			var cssClass = this.options.stylize ? 'ui-text ui-state-default ui-corner-all' : 'ui-text';
			this.element.addClass(cssClass);
			this.element.bind('keydown', function(event) {
				var result = self._isValidKeyPress(event);
				
				if(!result.valid) {
					self._trigger('keyEventSuppressed', event, {"key": result.key});
				}
				
				return result.valid;					
			});
		},
		_isValidKeyPress: function(keyEvent) {
			var valid = true;
			var key = keyEvent.which;
			var emptyChar = (key >= $.ui.keyCode.SHIFT && key <= $.ui.keyCode.CAPS_LOCK) || key == $.ui.keyCode.ESCAPE || (key > $.ui.keyCode.SPACE && key <= $.ui.keyCode.DOWN) || key == $.ui.keyCode.INSERT || (key >= $.ui.keyCode.COMMAND && key <= $.ui.keyCode.COMMAND_RIGHT) || (key >= $.ui.keyCode.NUM_LOCK && key <= $.ui.keyCode.SCROLL_LOCK);
			var alwaysValid = key == 0 || key == $.ui.keyCode.BACKSPACE || key == $.ui.keyCode.DELETE || (keyEvent.ctrlKey && key == $.ui.keyCode.A) || key == $.ui.keyCode.TAB;
			var value = $.ui.keyCode.keyCode2Char(keyEvent.keyCode, keyEvent.shiftKey);

			if(!(emptyChar || alwaysValid)) {
							
				if(this.filterRegex) {
					valid = !value.match(this.filterRegex);
				}
				
				// if there's a whitelist nothing else is allowed so don't even bother with allow regex
				if(this.whitelistRegex) {
					valid = valid && !value.match(this.whitelistRegex);
				} else if(this.allowRegex) {
					// allow is an exception to the filter, so if it passes the filter OR it's on the allow list
					valid = valid || !value.match(this.allowRegex);
				}
				
				if(this.blacklistRegex) {				
					valid = valid && !value.match(this.blacklistRegex);
				} 
			}			
			
			return {"valid": valid, "key": value};
		},				
		_initFilters: function() {			
			switch(this.options.filter) {
				case 'numeric':
					this.filterRegex = new RegExp('[^0-9.]');
					break;
				case 'digits':
					this.filterRegex = new RegExp('[^0-9]');					
					break;
				case 'alpha':
					this.filterRegex = new RegExp('[^a-zA-Z]');
					break;				
			}
						
			this.allowRegex = this._createCharsRegEx(this.options.allow, true);
			this.whitelistRegex = this._createCharsRegEx(this.options.whitelist, true);												
			this.blacklistRegex = this._createCharsRegEx(this.options.blacklist, false);									
		},
		_createCharsRegEx: function(chars, negate) {
			var regex = null;
			
			if(chars && chars.length) {
				if(chars instanceof Array) {
					chars = chars.join("");
				}
				
				regex = new RegExp('[' + (negate ? '^' : '') + chars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + ']');				
			}
			
			return regex;
		},		
		_setOption: function(option, value) {
			$.Widget.prototype._setOption.apply(this, arguments);
			
			if(option == 'stylize') {
				if(value && value !== 'false') {
					this.element.addClass('ui-state-default ui-corner-all');
				} else {
					this.element.removeClass('ui-state-default ui-corner-all');
				}
			} else {
				this._initFilters();
			}						
		},
		enable: function() {			
			this.element.removeAttr('disabled');			
			$.Widget.prototype.enable.call(this);
			this._trigger('enable', null, this.element);
		},
		disable: function() {
			this.element.attr('disabled', 'disabled');
			$.Widget.prototype.disable.call(this);
			this._trigger('disable', null, this.element);
		},
		destroy: function() {
			this.element.removeClass('ui-text');
			this.element.unbind();			
		}
	});
})(jQuery);/**
 * Version: 1.0 Alpha-1 
 * Build Date: 13-Nov-2007
 * Copyright (c) 2006-2007, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * Website: http://www.datejs.com/ or http://www.coolite.com/datejs/
 */
Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|after|from)/i,subtract:/^(\-|before|ago)/i,yesterday:/^yesterday/i,today:/^t(oday)?/i,tomorrow:/^tomorrow/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^min(ute)?s?/i,hour:/^h(ou)?rs?/i,week:/^w(ee)?k/i,month:/^m(o(nth)?s?)?/i,day:/^d(ays?)?/i,year:/^y((ea)?rs?)?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a|p)/i},abbreviatedTimeZoneStandard:{GMT:"-000",EST:"-0400",CST:"-0500",MST:"-0600",PST:"-0700"},abbreviatedTimeZoneDST:{GMT:"-000",EDT:"-0500",CDT:"-0600",MDT:"-0700",PDT:"-0800"}};
Date.getMonthNumberFromName=function(name){var n=Date.CultureInfo.monthNames,m=Date.CultureInfo.abbreviatedMonthNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.getDayNumberFromName=function(name){var n=Date.CultureInfo.dayNames,m=Date.CultureInfo.abbreviatedDayNames,o=Date.CultureInfo.shortestDayNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.isLeapYear=function(year){return(((year%4===0)&&(year%100!==0))||(year%400===0));};Date.getDaysInMonth=function(year,month){return[31,(Date.isLeapYear(year)?29:28),31,30,31,30,31,31,30,31,30,31][month];};Date.getTimezoneOffset=function(s,dst){return(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST[s.toUpperCase()]:Date.CultureInfo.abbreviatedTimeZoneStandard[s.toUpperCase()];};Date.getTimezoneAbbreviation=function(offset,dst){var n=(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST:Date.CultureInfo.abbreviatedTimeZoneStandard,p;for(p in n){if(n[p]===offset){return p;}}
return null;};Date.prototype.clone=function(){return new Date(this.getTime());};Date.prototype.compareTo=function(date){if(isNaN(this)){throw new Error(this);}
if(date instanceof Date&&!isNaN(date)){return(this>date)?1:(this<date)?-1:0;}else{throw new TypeError(date);}};Date.prototype.equals=function(date){return(this.compareTo(date)===0);};Date.prototype.between=function(start,end){var t=this.getTime();return t>=start.getTime()&&t<=end.getTime();};Date.prototype.addMilliseconds=function(value){this.setMilliseconds(this.getMilliseconds()+value);return this;};Date.prototype.addSeconds=function(value){return this.addMilliseconds(value*1000);};Date.prototype.addMinutes=function(value){return this.addMilliseconds(value*60000);};Date.prototype.addHours=function(value){return this.addMilliseconds(value*3600000);};Date.prototype.addDays=function(value){return this.addMilliseconds(value*86400000);};Date.prototype.addWeeks=function(value){return this.addMilliseconds(value*604800000);};Date.prototype.addMonths=function(value){var n=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+value);this.setDate(Math.min(n,this.getDaysInMonth()));return this;};Date.prototype.addYears=function(value){return this.addMonths(value*12);};Date.prototype.add=function(config){if(typeof config=="number"){this._orient=config;return this;}
var x=config;if(x.millisecond||x.milliseconds){this.addMilliseconds(x.millisecond||x.milliseconds);}
if(x.second||x.seconds){this.addSeconds(x.second||x.seconds);}
if(x.minute||x.minutes){this.addMinutes(x.minute||x.minutes);}
if(x.hour||x.hours){this.addHours(x.hour||x.hours);}
if(x.month||x.months){this.addMonths(x.month||x.months);}
if(x.year||x.years){this.addYears(x.year||x.years);}
if(x.day||x.days){this.addDays(x.day||x.days);}
return this;};Date._validate=function(value,min,max,name){if(typeof value!="number"){throw new TypeError(value+" is not a Number.");}else if(value<min||value>max){throw new RangeError(value+" is not a valid value for "+name+".");}
return true;};Date.validateMillisecond=function(n){return Date._validate(n,0,999,"milliseconds");};Date.validateSecond=function(n){return Date._validate(n,0,59,"seconds");};Date.validateMinute=function(n){return Date._validate(n,0,59,"minutes");};Date.validateHour=function(n){return Date._validate(n,0,23,"hours");};Date.validateDay=function(n,year,month){return Date._validate(n,1,Date.getDaysInMonth(year,month),"days");};Date.validateMonth=function(n){return Date._validate(n,0,11,"months");};Date.validateYear=function(n){return Date._validate(n,1,9999,"seconds");};Date.prototype.set=function(config){var x=config;if(!x.millisecond&&x.millisecond!==0){x.millisecond=-1;}
if(!x.second&&x.second!==0){x.second=-1;}
if(!x.minute&&x.minute!==0){x.minute=-1;}
if(!x.hour&&x.hour!==0){x.hour=-1;}
if(!x.day&&x.day!==0){x.day=-1;}
if(!x.month&&x.month!==0){x.month=-1;}
if(!x.year&&x.year!==0){x.year=-1;}
if(x.millisecond!=-1&&Date.validateMillisecond(x.millisecond)){this.addMilliseconds(x.millisecond-this.getMilliseconds());}
if(x.second!=-1&&Date.validateSecond(x.second)){this.addSeconds(x.second-this.getSeconds());}
if(x.minute!=-1&&Date.validateMinute(x.minute)){this.addMinutes(x.minute-this.getMinutes());}
if(x.hour!=-1&&Date.validateHour(x.hour)){this.addHours(x.hour-this.getHours());}
if(x.month!==-1&&Date.validateMonth(x.month)){this.addMonths(x.month-this.getMonth());}
if(x.year!=-1&&Date.validateYear(x.year)){this.addYears(x.year-this.getFullYear());}
if(x.day!=-1&&Date.validateDay(x.day,this.getFullYear(),this.getMonth())){this.addDays(x.day-this.getDate());}
if(x.timezone){this.setTimezone(x.timezone);}
if(x.timezoneOffset){this.setTimezoneOffset(x.timezoneOffset);}
return this;};Date.prototype.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this;};Date.prototype.isLeapYear=function(){var y=this.getFullYear();return(((y%4===0)&&(y%100!==0))||(y%400===0));};Date.prototype.isWeekday=function(){return!(this.is().sat()||this.is().sun());};Date.prototype.getDaysInMonth=function(){return Date.getDaysInMonth(this.getFullYear(),this.getMonth());};Date.prototype.moveToFirstDayOfMonth=function(){return this.set({day:1});};Date.prototype.moveToLastDayOfMonth=function(){return this.set({day:this.getDaysInMonth()});};Date.prototype.moveToDayOfWeek=function(day,orient){var diff=(day-this.getDay()+7*(orient||+1))%7;return this.addDays((diff===0)?diff+=7*(orient||+1):diff);};Date.prototype.moveToMonth=function(month,orient){var diff=(month-this.getMonth()+12*(orient||+1))%12;return this.addMonths((diff===0)?diff+=12*(orient||+1):diff);};Date.prototype.getDayOfYear=function(){return Math.floor((this-new Date(this.getFullYear(),0,1))/86400000);};Date.prototype.getWeekOfYear=function(firstDayOfWeek){var y=this.getFullYear(),m=this.getMonth(),d=this.getDate();var dow=firstDayOfWeek||Date.CultureInfo.firstDayOfWeek;var offset=7+1-new Date(y,0,1).getDay();if(offset==8){offset=1;}
var daynum=((Date.UTC(y,m,d,0,0,0)-Date.UTC(y,0,1,0,0,0))/86400000)+1;var w=Math.floor((daynum-offset+7)/7);if(w===dow){y--;var prevOffset=7+1-new Date(y,0,1).getDay();if(prevOffset==2||prevOffset==8){w=53;}else{w=52;}}
return w;};Date.prototype.isDST=function(){console.log('isDST');return this.toString().match(/(E|C|M|P)(S|D)T/)[2]=="D";};Date.prototype.getTimezone=function(){return Date.getTimezoneAbbreviation(this.getUTCOffset,this.isDST());};Date.prototype.setTimezoneOffset=function(s){var here=this.getTimezoneOffset(),there=Number(s)*-6/10;this.addMinutes(there-here);return this;};Date.prototype.setTimezone=function(s){return this.setTimezoneOffset(Date.getTimezoneOffset(s));};Date.prototype.getUTCOffset=function(){var n=this.getTimezoneOffset()*-10/6,r;if(n<0){r=(n-10000).toString();return r[0]+r.substr(2);}else{r=(n+10000).toString();return"+"+r.substr(1);}};Date.prototype.getDayName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedDayNames[this.getDay()]:Date.CultureInfo.dayNames[this.getDay()];};Date.prototype.getMonthName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedMonthNames[this.getMonth()]:Date.CultureInfo.monthNames[this.getMonth()];};Date.prototype._toString=Date.prototype.toString;Date.prototype.toString=function(format){var self=this;var p=function p(s){return(s.toString().length==1)?"0"+s:s;};return format?format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g,function(format){switch(format){case"hh":return p(self.getHours()<13?self.getHours():(self.getHours()-12));case"h":return self.getHours()<13?self.getHours():(self.getHours()-12);case"HH":return p(self.getHours());case"H":return self.getHours();case"mm":return p(self.getMinutes());case"m":return self.getMinutes();case"ss":return p(self.getSeconds());case"s":return self.getSeconds();case"yyyy":return self.getFullYear();case"yy":return self.getFullYear().toString().substring(2,4);case"dddd":return self.getDayName();case"ddd":return self.getDayName(true);case"dd":return p(self.getDate());case"d":return self.getDate().toString();case"MMMM":return self.getMonthName();case"MMM":return self.getMonthName(true);case"MM":return p((self.getMonth()+1));case"M":return self.getMonth()+1;case"t":return self.getHours()<12?Date.CultureInfo.amDesignator.substring(0,1):Date.CultureInfo.pmDesignator.substring(0,1);case"tt":return self.getHours()<12?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator;case"zzz":case"zz":case"z":return"";}}):this._toString();};
Date.now=function(){return new Date();};Date.today=function(){return Date.now().clearTime();};Date.prototype._orient=+1;Date.prototype.next=function(){this._orient=+1;return this;};Date.prototype.last=Date.prototype.prev=Date.prototype.previous=function(){this._orient=-1;return this;};Date.prototype._is=false;Date.prototype.is=function(){this._is=true;return this;};Number.prototype._dateElement="day";Number.prototype.fromNow=function(){var c={};c[this._dateElement]=this;return Date.now().add(c);};Number.prototype.ago=function(){var c={};c[this._dateElement]=this*-1;return Date.now().add(c);};(function(){var $D=Date.prototype,$N=Number.prototype;var dx=("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),mx=("january february march april may june july august september october november december").split(/\s/),px=("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),de;var df=function(n){return function(){if(this._is){this._is=false;return this.getDay()==n;}
return this.moveToDayOfWeek(n,this._orient);};};for(var i=0;i<dx.length;i++){$D[dx[i]]=$D[dx[i].substring(0,3)]=df(i);}
var mf=function(n){return function(){if(this._is){this._is=false;return this.getMonth()===n;}
return this.moveToMonth(n,this._orient);};};for(var j=0;j<mx.length;j++){$D[mx[j]]=$D[mx[j].substring(0,3)]=mf(j);}
var ef=function(j){return function(){if(j.substring(j.length-1)!="s"){j+="s";}
return this["add"+j](this._orient);};};var nf=function(n){return function(){this._dateElement=n;return this;};};for(var k=0;k<px.length;k++){de=px[k].toLowerCase();$D[de]=$D[de+"s"]=ef(px[k]);$N[de]=$N[de+"s"]=nf(de);}}());Date.prototype.toJSONString=function(){return this.toString("yyyy-MM-ddThh:mm:ssZ");};Date.prototype.toShortDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern);};Date.prototype.toLongDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.longDatePattern);};Date.prototype.toShortTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern);};Date.prototype.toLongTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.longTimePattern);};Date.prototype.getOrdinal=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};
(function(){Date.Parsing={Exception:function(s){this.message="Parse error at '"+s.substring(0,10)+" ...'";}};var $P=Date.Parsing;var _=$P.Operators={rtoken:function(r){return function(s){var mx=s.match(r);if(mx){return([mx[0],s.substring(mx[0].length)]);}else{throw new $P.Exception(s);}};},token:function(s){return function(s){return _.rtoken(new RegExp("^\s*"+s+"\s*"))(s);};},stoken:function(s){return _.rtoken(new RegExp("^"+s));},until:function(p){return function(s){var qx=[],rx=null;while(s.length){try{rx=p.call(this,s);}catch(e){qx.push(rx[0]);s=rx[1];continue;}
break;}
return[qx,s];};},many:function(p){return function(s){var rx=[],r=null;while(s.length){try{r=p.call(this,s);}catch(e){return[rx,s];}
rx.push(r[0]);s=r[1];}
return[rx,s];};},optional:function(p){return function(s){var r=null;try{r=p.call(this,s);}catch(e){return[null,s];}
return[r[0],r[1]];};},not:function(p){return function(s){try{p.call(this,s);}catch(e){return[null,s];}
throw new $P.Exception(s);};},ignore:function(p){return p?function(s){var r=null;r=p.call(this,s);return[null,r[1]];}:null;},product:function(){var px=arguments[0],qx=Array.prototype.slice.call(arguments,1),rx=[];for(var i=0;i<px.length;i++){rx.push(_.each(px[i],qx));}
return rx;},cache:function(rule){var cache={},r=null;return function(s){try{r=cache[s]=(cache[s]||rule.call(this,s));}catch(e){r=cache[s]=e;}
if(r instanceof $P.Exception){throw r;}else{return r;}};},any:function(){var px=arguments;return function(s){var r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){r=null;}
if(r){return r;}}
throw new $P.Exception(s);};},each:function(){var px=arguments;return function(s){var rx=[],r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){throw new $P.Exception(s);}
rx.push(r[0]);s=r[1];}
return[rx,s];};},all:function(){var px=arguments,_=_;return _.each(_.optional(px));},sequence:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;if(px.length==1){return px[0];}
return function(s){var r=null,q=null;var rx=[];for(var i=0;i<px.length;i++){try{r=px[i].call(this,s);}catch(e){break;}
rx.push(r[0]);try{q=d.call(this,r[1]);}catch(ex){q=null;break;}
s=q[1];}
if(!r){throw new $P.Exception(s);}
if(q){throw new $P.Exception(q[1]);}
if(c){try{r=c.call(this,r[1]);}catch(ey){throw new $P.Exception(r[1]);}}
return[rx,(r?r[1]:s)];};},between:function(d1,p,d2){d2=d2||d1;var _fn=_.each(_.ignore(d1),p,_.ignore(d2));return function(s){var rx=_fn.call(this,s);return[[rx[0][0],r[0][2]],rx[1]];};},list:function(p,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return(p instanceof Array?_.each(_.product(p.slice(0,-1),_.ignore(d)),p.slice(-1),_.ignore(c)):_.each(_.many(_.each(p,_.ignore(d))),px,_.ignore(c)));},set:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return function(s){var r=null,p=null,q=null,rx=null,best=[[],s],last=false;for(var i=0;i<px.length;i++){q=null;p=null;r=null;last=(px.length==1);try{r=px[i].call(this,s);}catch(e){continue;}
rx=[[r[0]],r[1]];if(r[1].length>0&&!last){try{q=d.call(this,r[1]);}catch(ex){last=true;}}else{last=true;}
if(!last&&q[1].length===0){last=true;}
if(!last){var qx=[];for(var j=0;j<px.length;j++){if(i!=j){qx.push(px[j]);}}
p=_.set(qx,d).call(this,q[1]);if(p[0].length>0){rx[0]=rx[0].concat(p[0]);rx[1]=p[1];}}
if(rx[1].length<best[1].length){best=rx;}
if(best[1].length===0){break;}}
if(best[0].length===0){return best;}
if(c){try{q=c.call(this,best[1]);}catch(ey){throw new $P.Exception(best[1]);}
best[1]=q[1];}
return best;};},forward:function(gr,fname){return function(s){return gr[fname].call(this,s);};},replace:function(rule,repl){return function(s){var r=rule.call(this,s);return[repl,r[1]];};},process:function(rule,fn){return function(s){var r=rule.call(this,s);return[fn.call(this,r[0]),r[1]];};},min:function(min,rule){return function(s){var rx=rule.call(this,s);if(rx[0].length<min){throw new $P.Exception(s);}
return rx;};}};var _generator=function(op){return function(){var args=null,rx=[];if(arguments.length>1){args=Array.prototype.slice.call(arguments);}else if(arguments[0]instanceof Array){args=arguments[0];}
if(args){for(var i=0,px=args.shift();i<px.length;i++){args.unshift(px[i]);rx.push(op.apply(null,args));args.shift();return rx;}}else{return op.apply(null,arguments);}};};var gx="optional not ignore cache".split(/\s/);for(var i=0;i<gx.length;i++){_[gx[i]]=_generator(_[gx[i]]);}
var _vector=function(op){return function(){if(arguments[0]instanceof Array){return op.apply(null,arguments[0]);}else{return op.apply(null,arguments);}};};var vx="each any all".split(/\s/);for(var j=0;j<vx.length;j++){_[vx[j]]=_vector(_[vx[j]]);}}());(function(){var flattenAndCompact=function(ax){var rx=[];for(var i=0;i<ax.length;i++){if(ax[i]instanceof Array){rx=rx.concat(flattenAndCompact(ax[i]));}else{if(ax[i]){rx.push(ax[i]);}}}
return rx;};Date.Grammar={};Date.Translator={hour:function(s){return function(){this.hour=Number(s);};},minute:function(s){return function(){this.minute=Number(s);};},second:function(s){return function(){this.second=Number(s);};},meridian:function(s){return function(){this.meridian=s.slice(0,1).toLowerCase();};},timezone:function(s){return function(){var n=s.replace(/[^\d\+\-]/g,"");if(n.length){this.timezoneOffset=Number(n);}else{this.timezone=s.toLowerCase();}};},day:function(x){var s=x[0];return function(){this.day=Number(s.match(/\d+/)[0]);};},month:function(s){return function(){this.month=((s.length==3)?Date.getMonthNumberFromName(s):(Number(s)-1));};},year:function(s){return function(){var n=Number(s);this.year=((s.length>2)?n:(n+(((n+2000)<Date.CultureInfo.twoDigitYearMax)?2000:1900)));};},rday:function(s){return function(){switch(s){case"yesterday":this.days=-1;break;case"tomorrow":this.days=1;break;case"today":this.days=0;break;case"now":this.days=0;this.now=true;break;}};},finishExact:function(x){x=(x instanceof Array)?x:[x];var now=new Date();this.year=now.getFullYear();this.month=now.getMonth();this.day=1;this.hour=0;this.minute=0;this.second=0;for(var i=0;i<x.length;i++){if(x[i]){x[i].call(this);}}
this.hour=(this.meridian=="p"&&this.hour<13)?this.hour+12:this.hour;if(this.day>Date.getDaysInMonth(this.year,this.month)){throw new RangeError(this.day+" is not a valid value for days.");}
var r=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);if(this.timezone){r.set({timezone:this.timezone});}else if(this.timezoneOffset){r.set({timezoneOffset:this.timezoneOffset});}
return r;},finish:function(x){x=(x instanceof Array)?flattenAndCompact(x):[x];if(x.length===0){return null;}
for(var i=0;i<x.length;i++){if(typeof x[i]=="function"){x[i].call(this);}}
if(this.now){return new Date();}
var today=Date.today();var method=null;var expression=!!(this.days!=null||this.orient||this.operator);if(expression){var gap,mod,orient;orient=((this.orient=="past"||this.operator=="subtract")?-1:1);if(this.weekday){this.unit="day";gap=(Date.getDayNumberFromName(this.weekday)-today.getDay());mod=7;this.days=gap?((gap+(orient*mod))%mod):(orient*mod);}
if(this.month){this.unit="month";gap=(this.month-today.getMonth());mod=12;this.months=gap?((gap+(orient*mod))%mod):(orient*mod);this.month=null;}
if(!this.unit){this.unit="day";}
if(this[this.unit+"s"]==null||this.operator!=null){if(!this.value){this.value=1;}
if(this.unit=="week"){this.unit="day";this.value=this.value*7;}
this[this.unit+"s"]=this.value*orient;}
return today.add(this);}else{if(this.meridian&&this.hour){this.hour=(this.hour<13&&this.meridian=="p")?this.hour+12:this.hour;}
if(this.weekday&&!this.day){this.day=(today.addDays((Date.getDayNumberFromName(this.weekday)-today.getDay()))).getDate();}
if(this.month&&!this.day){this.day=1;}
return today.set(this);}}};var _=Date.Parsing.Operators,g=Date.Grammar,t=Date.Translator,_fn;g.datePartDelimiter=_.rtoken(/^([\s\-\.\,\/\x27]+)/);g.timePartDelimiter=_.stoken(":");g.whiteSpace=_.rtoken(/^\s*/);g.generalDelimiter=_.rtoken(/^(([\s\,]|at|on)+)/);var _C={};g.ctoken=function(keys){var fn=_C[keys];if(!fn){var c=Date.CultureInfo.regexPatterns;var kx=keys.split(/\s+/),px=[];for(var i=0;i<kx.length;i++){px.push(_.replace(_.rtoken(c[kx[i]]),kx[i]));}
fn=_C[keys]=_.any.apply(null,px);}
return fn;};g.ctoken2=function(key){return _.rtoken(Date.CultureInfo.regexPatterns[key]);};g.h=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),t.hour));g.hh=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/),t.hour));g.H=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),t.hour));g.HH=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/),t.hour));g.m=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.minute));g.mm=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.minute));g.s=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.second));g.ss=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.second));g.hms=_.cache(_.sequence([g.H,g.mm,g.ss],g.timePartDelimiter));g.t=_.cache(_.process(g.ctoken2("shortMeridian"),t.meridian));g.tt=_.cache(_.process(g.ctoken2("longMeridian"),t.meridian));g.z=_.cache(_.process(_.rtoken(/^(\+|\-)?\s*\d\d\d\d?/),t.timezone));g.zz=_.cache(_.process(_.rtoken(/^(\+|\-)\s*\d\d\d\d/),t.timezone));g.zzz=_.cache(_.process(g.ctoken2("timezone"),t.timezone));g.timeSuffix=_.each(_.ignore(g.whiteSpace),_.set([g.tt,g.zzz]));g.time=_.each(_.optional(_.ignore(_.stoken("T"))),g.hms,g.timeSuffix);g.d=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.dd=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.ddd=g.dddd=_.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"),function(s){return function(){this.weekday=s;};}));g.M=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/),t.month));g.MM=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/),t.month));g.MMM=g.MMMM=_.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),t.month));g.y=_.cache(_.process(_.rtoken(/^(\d\d?)/),t.year));g.yy=_.cache(_.process(_.rtoken(/^(\d\d)/),t.year));g.yyy=_.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/),t.year));g.yyyy=_.cache(_.process(_.rtoken(/^(\d\d\d\d)/),t.year));_fn=function(){return _.each(_.any.apply(null,arguments),_.not(g.ctoken2("timeContext")));};g.day=_fn(g.d,g.dd);g.month=_fn(g.M,g.MMM);g.year=_fn(g.yyyy,g.yy);g.orientation=_.process(g.ctoken("past future"),function(s){return function(){this.orient=s;};});g.operator=_.process(g.ctoken("add subtract"),function(s){return function(){this.operator=s;};});g.rday=_.process(g.ctoken("yesterday tomorrow today now"),t.rday);g.unit=_.process(g.ctoken("minute hour day week month year"),function(s){return function(){this.unit=s;};});g.value=_.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/),function(s){return function(){this.value=s.replace(/\D/g,"");};});g.expression=_.set([g.rday,g.operator,g.value,g.unit,g.orientation,g.ddd,g.MMM]);_fn=function(){return _.set(arguments,g.datePartDelimiter);};g.mdy=_fn(g.ddd,g.month,g.day,g.year);g.ymd=_fn(g.ddd,g.year,g.month,g.day);g.dmy=_fn(g.ddd,g.day,g.month,g.year);g.date=function(s){return((g[Date.CultureInfo.dateElementOrder]||g.mdy).call(this,s));};g.format=_.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(fmt){if(g[fmt]){return g[fmt];}else{throw Date.Parsing.Exception(fmt);}}),_.process(_.rtoken(/^[^dMyhHmstz]+/),function(s){return _.ignore(_.stoken(s));}))),function(rules){return _.process(_.each.apply(null,rules),t.finishExact);});var _F={};var _get=function(f){return _F[f]=(_F[f]||g.format(f)[0]);};g.formats=function(fx){if(fx instanceof Array){var rx=[];for(var i=0;i<fx.length;i++){rx.push(_get(fx[i]));}
return _.any.apply(null,rx);}else{return _get(fx);}};g._formats=g.formats(["yyyy-MM-ddTHH:mm:ss","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","d"]);g._start=_.process(_.set([g.date,g.time,g.expression],g.generalDelimiter,g.whiteSpace),t.finish);g.start=function(s){try{var r=g._formats.call({},s);if(r[1].length===0){return r;}}catch(e){}
return g._start.call({},s);};}());Date._parse=Date.parse;Date.parse=function(s){var r=null;if(!s){return null;}
try{r=Date.Grammar.start.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};Date.getParseFunction=function(fx){var fn=Date.Grammar.formats(fx);return function(s){var r=null;try{r=fn.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};};Date.parseExact=function(s,fx){return Date.getParseFunction(fx)(s);};
/*! 
 * jquery.event.drag - v 2.0.0 
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
;(function(f){f.fn.drag=function(b,a,d){var e=typeof b=="string"?b:"",k=f.isFunction(b)?b:f.isFunction(a)?a:null;if(e.indexOf("drag")!==0)e="drag"+e;d=(b==k?a:d)||{};return k?this.bind(e,d,k):this.trigger(e)};var i=f.event,h=i.special,c=h.drag={defaults:{which:1,distance:0,not:":input",handle:null,relative:false,drop:true,click:false},datakey:"dragdata",livekey:"livedrag",add:function(b){var a=f.data(this,c.datakey),d=b.data||{};a.related+=1;if(!a.live&&b.selector){a.live=true;i.add(this,"draginit."+ c.livekey,c.delegate)}f.each(c.defaults,function(e){if(d[e]!==undefined)a[e]=d[e]})},remove:function(){f.data(this,c.datakey).related-=1},setup:function(){if(!f.data(this,c.datakey)){var b=f.extend({related:0},c.defaults);f.data(this,c.datakey,b);i.add(this,"mousedown",c.init,b);this.attachEvent&&this.attachEvent("ondragstart",c.dontstart)}},teardown:function(){if(!f.data(this,c.datakey).related){f.removeData(this,c.datakey);i.remove(this,"mousedown",c.init);i.remove(this,"draginit",c.delegate);c.textselect(true); this.detachEvent&&this.detachEvent("ondragstart",c.dontstart)}},init:function(b){var a=b.data,d;if(!(a.which>0&&b.which!=a.which))if(!f(b.target).is(a.not))if(!(a.handle&&!f(b.target).closest(a.handle,b.currentTarget).length)){a.propagates=1;a.interactions=[c.interaction(this,a)];a.target=b.target;a.pageX=b.pageX;a.pageY=b.pageY;a.dragging=null;d=c.hijack(b,"draginit",a);if(a.propagates){if((d=c.flatten(d))&&d.length){a.interactions=[];f.each(d,function(){a.interactions.push(c.interaction(this,a))})}a.propagates= a.interactions.length;a.drop!==false&&h.drop&&h.drop.handler(b,a);c.textselect(false);i.add(document,"mousemove mouseup",c.handler,a);return false}}},interaction:function(b,a){return{drag:b,callback:new c.callback,droppable:[],offset:f(b)[a.relative?"position":"offset"]()||{top:0,left:0}}},handler:function(b){var a=b.data;switch(b.type){case !a.dragging&&"mousemove":if(Math.pow(b.pageX-a.pageX,2)+Math.pow(b.pageY-a.pageY,2)<Math.pow(a.distance,2))break;b.target=a.target;c.hijack(b,"dragstart",a); if(a.propagates)a.dragging=true;case "mousemove":if(a.dragging){c.hijack(b,"drag",a);if(a.propagates){a.drop!==false&&h.drop&&h.drop.handler(b,a);break}b.type="mouseup"}case "mouseup":i.remove(document,"mousemove mouseup",c.handler);if(a.dragging){a.drop!==false&&h.drop&&h.drop.handler(b,a);c.hijack(b,"dragend",a)}c.textselect(true);if(a.click===false&&a.dragging){jQuery.event.triggered=true;setTimeout(function(){jQuery.event.triggered=false},20);a.dragging=false}break}},delegate:function(b){var a= [],d,e=f.data(this,"events")||{};f.each(e.live||[],function(k,j){if(j.preType.indexOf("drag")===0)if(d=f(b.target).closest(j.selector,b.currentTarget)[0]){i.add(d,j.origType+"."+c.livekey,j.origHandler,j.data);f.inArray(d,a)<0&&a.push(d)}});if(!a.length)return false;return f(a).bind("dragend."+c.livekey,function(){i.remove(this,"."+c.livekey)})},hijack:function(b,a,d,e,k){if(d){var j={event:b.originalEvent,type:b.type},n=a.indexOf("drop")?"drag":"drop",l,o=e||0,g,m;e=!isNaN(e)?e:d.interactions.length; b.type=a;b.originalEvent=null;d.results=[];do if(g=d.interactions[o])if(!(a!=="dragend"&&g.cancelled)){m=c.properties(b,d,g);g.results=[];f(k||g[n]||d.droppable).each(function(q,p){l=(m.target=p)?i.handle.call(p,b,m):null;if(l===false){if(n=="drag"){g.cancelled=true;d.propagates-=1}if(a=="drop")g[n][q]=null}else if(a=="dropinit")g.droppable.push(c.element(l)||p);if(a=="dragstart")g.proxy=f(c.element(l)||g.drag)[0];g.results.push(l);delete b.result;if(a!=="dropinit")return l});d.results[o]=c.flatten(g.results); if(a=="dropinit")g.droppable=c.flatten(g.droppable);a=="dragstart"&&!g.cancelled&&m.update()}while(++o<e);b.type=j.type;b.originalEvent=j.event;return c.flatten(d.results)}},properties:function(b,a,d){var e=d.callback;e.drag=d.drag;e.proxy=d.proxy||d.drag;e.startX=a.pageX;e.startY=a.pageY;e.deltaX=b.pageX-a.pageX;e.deltaY=b.pageY-a.pageY;e.originalX=d.offset.left;e.originalY=d.offset.top;e.offsetX=b.pageX-(a.pageX-e.originalX);e.offsetY=b.pageY-(a.pageY-e.originalY);e.drop=c.flatten((d.drop||[]).slice()); e.available=c.flatten((d.droppable||[]).slice());return e},element:function(b){if(b&&(b.jquery||b.nodeType==1))return b},flatten:function(b){return f.map(b,function(a){return a&&a.jquery?f.makeArray(a):a&&a.length?c.flatten(a):a})},textselect:function(b){f(document)[b?"unbind":"bind"]("selectstart",c.dontstart).attr("unselectable",b?"off":"on").css("MozUserSelect",b?"":"none")},dontstart:function(){return false},callback:function(){}};c.callback.prototype={update:function(){h.drop&&this.available.length&& f.each(this.available,function(b){h.drop.locate(this,b)})}};h.draginit=h.dragstart=h.dragend=c})(jQuery);/*! 
 * jquery.event.drop - v 2.0.0 
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
;(function(f){f.fn.drop=function(c,a,d){var g=typeof c=="string"?c:"",e=f.isFunction(c)?c:f.isFunction(a)?a:null;if(g.indexOf("drop")!==0)g="drop"+g;d=(c==e?a:d)||{};return e?this.bind(g,d,e):this.trigger(g)};f.drop=function(c){c=c||{};b.multi=c.multi===true?Infinity:c.multi===false?1:!isNaN(c.multi)?c.multi:b.multi;b.delay=c.delay||b.delay;b.tolerance=f.isFunction(c.tolerance)?c.tolerance:c.tolerance===null?null:b.tolerance;b.mode=c.mode||b.mode||"intersect"};var l=f.event,i=l.special,b=f.event.special.drop= {multi:1,delay:20,mode:"overlap",targets:[],datakey:"dropdata",livekey:"livedrop",add:function(c){var a=f.data(this,b.datakey);a.related+=1;if(!a.live&&c.selector){a.live=true;l.add(this,"dropinit."+b.livekey,b.delegate)}},remove:function(){f.data(this,b.datakey).related-=1},setup:function(){if(!f.data(this,b.datakey)){f.data(this,b.datakey,{related:0,active:[],anyactive:0,winner:0,location:{}});b.targets.push(this)}},teardown:function(){if(!f.data(this,b.datakey).related){f.removeData(this,b.datakey); l.remove(this,"dropinit",b.delegate);var c=this;b.targets=f.grep(b.targets,function(a){return a!==c})}},handler:function(c,a){var d;if(a)switch(c.type){case "mousedown":d=f(b.targets);if(typeof a.drop=="string")d=d.filter(a.drop);d.each(function(){var g=f.data(this,b.datakey);g.active=[];g.anyactive=0;g.winner=0});a.droppable=d;b.delegates=[];i.drag.hijack(c,"dropinit",a);b.delegates=f.unique(i.drag.flatten(b.delegates));break;case "mousemove":b.event=c;b.timer||b.tolerate(a);break;case "mouseup":b.timer= clearTimeout(b.timer);if(a.propagates){i.drag.hijack(c,"drop",a);i.drag.hijack(c,"dropend",a);f.each(b.delegates||[],function(){l.remove(this,"."+b.livekey)})}break}},delegate:function(c){var a=[],d,g=f.data(this,"events")||{};f.each(g.live||[],function(e,h){if(h.preType.indexOf("drop")===0){d=f(c.currentTarget).find(h.selector);d.length&&d.each(function(){l.add(this,h.origType+"."+b.livekey,h.origHandler,h.data);f.inArray(this,a)<0&&a.push(this)})}});b.delegates.push(a);return a.length?f(a):false}, locate:function(c,a){var d=f.data(c,b.datakey),g=f(c),e=g.offset()||{},h=g.outerHeight();g=g.outerWidth();e={elem:c,width:g,height:h,top:e.top,left:e.left,right:e.left+g,bottom:e.top+h};if(d){d.location=e;d.index=a;d.elem=c}return e},contains:function(c,a){return(a[0]||a.left)>=c.left&&(a[0]||a.right)<=c.right&&(a[1]||a.top)>=c.top&&(a[1]||a.bottom)<=c.bottom},modes:{intersect:function(c,a,d){return this.contains(d,[c.pageX,c.pageY])?1E9:this.modes.overlap.apply(this,arguments)},overlap:function(c, a,d){return Math.max(0,Math.min(d.bottom,a.bottom)-Math.max(d.top,a.top))*Math.max(0,Math.min(d.right,a.right)-Math.max(d.left,a.left))},fit:function(c,a,d){return this.contains(d,a)?1:0},middle:function(c,a,d){return this.contains(d,[a.left+a.width*0.5,a.top+a.height*0.5])?1:0}},sort:function(c,a){return a.winner-c.winner||c.index-a.index},tolerate:function(c){var a,d,g,e,h,m,j=0,k,p=c.interactions.length,n=[b.event.pageX,b.event.pageY],o=b.tolerance||b.modes[b.mode];do if(k=c.interactions[j]){if(!k)return; k.drop=[];h=[];m=k.droppable.length;if(o)g=b.locate(k.proxy);a=0;do if(d=k.droppable[a]){e=f.data(d,b.datakey);if(d=e.location){e.winner=o?o.call(b,b.event,g,d):b.contains(d,n)?1:0;h.push(e)}}while(++a<m);h.sort(b.sort);a=0;do if(e=h[a])if(e.winner&&k.drop.length<b.multi){if(!e.active[j]&&!e.anyactive)if(i.drag.hijack(b.event,"dropstart",c,j,e.elem)[0]!==false){e.active[j]=1;e.anyactive+=1}else e.winner=0;e.winner&&k.drop.push(e.elem)}else if(e.active[j]&&e.anyactive==1){i.drag.hijack(b.event,"dropend", c,j,e.elem);e.active[j]=0;e.anyactive-=1}while(++a<m)}while(++j<p);if(b.last&&n[0]==b.last.pageX&&n[1]==b.last.pageY)delete b.timer;else b.timer=setTimeout(function(){b.tolerate(c)},b.delay);b.last=b.event}};i.dropinit=i.dropstart=i.dropend=b})(jQuery);(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "AutoTooltips": AutoTooltips
    }
  });


  function AutoTooltips(options) {
    var _grid;
    var _self = this;
    var _defaults = {
      maxToolTipLength: null
    };

    function init(grid) {
      options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      _grid.onMouseEnter.subscribe(handleMouseEnter);
    }

    function destroy() {
      _grid.onMouseEnter.unsubscribe(handleMouseEnter);
    }

    function handleMouseEnter(e, args) {
      var cell = _grid.getCellFromEvent(e);
      if (cell) {
        var node = _grid.getCellNode(cell.row, cell.cell);
        if ($(node).innerWidth() < node.scrollWidth) {
          var text = $.trim($(node).text());
          if (options.maxToolTipLength && text.length > options.maxToolTipLength) {
            text = text.substr(0, options.maxToolTipLength - 3) + "...";
          }
          $(node).attr("title", text);
        } else {
          $(node).attr("title", "");
        }
      }
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy
    });
  }
})(jQuery);(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CellRangeDecorator": CellRangeDecorator
    }
  });

  /***
   * Displays an overlay on top of a given cell range.
   *
   * TODO:
   * Currently, it blocks mouse events to DOM nodes behind it.
   * Use FF and WebKit-specific "pointer-events" CSS style, or some kind of event forwarding.
   * Could also construct the borders separately using 4 individual DIVs.
   *
   * @param {Grid} grid
   * @param {Object} options
   */
  function CellRangeDecorator(grid, options) {
    var _elem;
    var _defaults = {
      selectionCss: {
        "zIndex": "9999",
        "border": "2px dashed red"
      }
    };

    options = $.extend(true, {}, _defaults, options);


    function show(range) {
      if (!_elem) {
        _elem = $("<div></div>", {css: options.selectionCss})
            .css("position", "absolute")
            .appendTo(grid.getCanvasNode());
      }

      var from = grid.getCellNodeBox(range.fromRow, range.fromCell);
      var to = grid.getCellNodeBox(range.toRow, range.toCell);

      _elem.css({
        top: from.top - 1,
        left: from.left - 1,
        height: to.bottom - from.top - 2,
        width: to.right - from.left - 2
      });

      return _elem;
    }

    function hide() {
      if (_elem) {
        _elem.remove();
        _elem = null;
      }
    }

    $.extend(this, {
      "show": show,
      "hide": hide
    });
  }
})(jQuery);(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CellRangeSelector": CellRangeSelector
    }
  });


  function CellRangeSelector(options) {
    var _grid;
    var _canvas;
    var _dragging;
    var _decorator;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _defaults = {
      selectionCss: {
        "border": "2px dashed blue"
      }
    };


    function init(grid) {
      options = $.extend(true, {}, _defaults, options);
      _decorator = new Slick.CellRangeDecorator(grid, options);
      _grid = grid;
      _canvas = _grid.getCanvasNode();
      _handler
        .subscribe(_grid.onDragInit, handleDragInit)
        .subscribe(_grid.onDragStart, handleDragStart)
        .subscribe(_grid.onDrag, handleDrag)
        .subscribe(_grid.onDragEnd, handleDragEnd);
    }

    function destroy() {
      _handler.unsubscribeAll();
    }

    function handleDragInit(e, dd) {
      // prevent the grid from cancelling drag'n'drop by default
      e.stopImmediatePropagation();
    }

    function handleDragStart(e, dd) {
      var cell = _grid.getCellFromEvent(e);
      if (_self.onBeforeCellRangeSelected.notify(cell) !== false) {
        if (_grid.canCellBeSelected(cell.row, cell.cell)) {
          _dragging = true;
          e.stopImmediatePropagation();
        }
      }
      if (!_dragging) {
        return;
      }

      var start = _grid.getCellFromPoint(
          dd.startX - $(_canvas).offset().left,
          dd.startY - $(_canvas).offset().top);

      dd.range = {start: start, end: {}};

      return _decorator.show(new Slick.Range(start.row, start.cell));
    }

    function handleDrag(e, dd) {
      if (!_dragging) {
        return;
      }
      e.stopImmediatePropagation();

      var end = _grid.getCellFromPoint(
          e.pageX - $(_canvas).offset().left,
          e.pageY - $(_canvas).offset().top);

      if (!_grid.canCellBeSelected(end.row, end.cell)) {
        return;
      }

      dd.range.end = end;
      _decorator.show(new Slick.Range(dd.range.start.row, dd.range.start.cell, end.row, end.cell));
    }

    function handleDragEnd(e, dd) {
      if (!_dragging) {
        return;
      }

      _dragging = false;
      e.stopImmediatePropagation();

      _decorator.hide();
      _self.onCellRangeSelected.notify({
        range: new Slick.Range(
            dd.range.start.row,
            dd.range.start.cell,
            dd.range.end.row,
            dd.range.end.cell
        )
      });
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,

      "onBeforeCellRangeSelected": new Slick.Event(),
      "onCellRangeSelected": new Slick.Event()
    });
  }
})(jQuery);(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CellSelectionModel": CellSelectionModel
    }
  });


  function CellSelectionModel(options) {
    var _grid;
    var _canvas;
    var _ranges = [];
    var _self = this;
    var _selector = new Slick.CellRangeSelector({
      "selectionCss": {
        "border": "2px solid black"
      }
    });
    var _options;
    var _defaults = {
      selectActiveCell: true
    };


    function init(grid) {
      _options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      _canvas = _grid.getCanvasNode();
      _grid.onActiveCellChanged.subscribe(handleActiveCellChange);
      grid.registerPlugin(_selector);
      _selector.onCellRangeSelected.subscribe(handleCellRangeSelected);
      _selector.onBeforeCellRangeSelected.subscribe(handleBeforeCellRangeSelected);
    }

    function destroy() {
      _grid.onActiveCellChanged.unsubscribe(handleActiveCellChange);
      _selector.onCellRangeSelected.unsubscribe(handleCellRangeSelected);
      _selector.onBeforeCellRangeSelected.unsubscribe(handleBeforeCellRangeSelected);
      _grid.unregisterPlugin(_selector);
    }

    function removeInvalidRanges(ranges) {
      var result = [];

      for (var i = 0; i < ranges.length; i++) {
        var r = ranges[i];
        if (_grid.canCellBeSelected(r.fromRow, r.fromCell) && _grid.canCellBeSelected(r.toRow, r.toCell)) {
          result.push(r);
        }
      }

      return result;
    }

    function setSelectedRanges(ranges) {
      _ranges = removeInvalidRanges(ranges);
      _self.onSelectedRangesChanged.notify(_ranges);
    }

    function getSelectedRanges() {
      return _ranges;
    }

    function handleBeforeCellRangeSelected(e, args) {
      if (_grid.getEditorLock().isActive()) {
        e.stopPropagation();
        return false;
      }
    }

    function handleCellRangeSelected(e, args) {
      setSelectedRanges([args.range]);
    }

    function handleActiveCellChange(e, args) {
      if (_options.selectActiveCell && args.row != null && args.cell != null) {
        setSelectedRanges([new Slick.Range(args.row, args.cell)]);
      }
    }

    $.extend(this, {
      "getSelectedRanges": getSelectedRanges,
      "setSelectedRanges": setSelectedRanges,

      "init": init,
      "destroy": destroy,

      "onSelectedRangesChanged": new Slick.Event()
    });
  }
})(jQuery);/***
 * Contains core SlickGrid classes.
 * @module Core
 * @namespace Slick
 */

(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Event": Event,
      "EventData": EventData,
      "EventHandler": EventHandler,
      "Range": Range,
      "NonDataRow": NonDataItem,
      "Group": Group,
      "GroupTotals": GroupTotals,
      "EditorLock": EditorLock,

      /***
       * A global singleton editor lock.
       * @class GlobalEditorLock
       * @static
       * @constructor
       */
      "GlobalEditorLock": new EditorLock()
    }
  });

  /***
   * An event object for passing data to event handlers and letting them control propagation.
   * <p>This is pretty much identical to how W3C and jQuery implement events.</p>
   * @class EventData
   * @constructor
   */
  function EventData() {
    var isPropagationStopped = false;
    var isImmediatePropagationStopped = false;

    /***
     * Stops event from propagating up the DOM tree.
     * @method stopPropagation
     */
    this.stopPropagation = function () {
      isPropagationStopped = true;
    };

    /***
     * Returns whether stopPropagation was called on this event object.
     * @method isPropagationStopped
     * @return {Boolean}
     */
    this.isPropagationStopped = function () {
      return isPropagationStopped;
    };

    /***
     * Prevents the rest of the handlers from being executed.
     * @method stopImmediatePropagation
     */
    this.stopImmediatePropagation = function () {
      isImmediatePropagationStopped = true;
    };

    /***
     * Returns whether stopImmediatePropagation was called on this event object.\
     * @method isImmediatePropagationStopped
     * @return {Boolean}
     */
    this.isImmediatePropagationStopped = function () {
      return isImmediatePropagationStopped;
    }
  }

  /***
   * A simple publisher-subscriber implementation.
   * @class Event
   * @constructor
   */
  function Event() {
    var handlers = [];

    /***
     * Adds an event handler to be called when the event is fired.
     * <p>Event handler will receive two arguments - an <code>EventData</code> and the <code>data</code>
     * object the event was fired with.<p>
     * @method subscribe
     * @param fn {Function} Event handler.
     */
    this.subscribe = function (fn) {
      handlers.push(fn);
    };

    /***
     * Removes an event handler added with <code>subscribe(fn)</code>.
     * @method unsubscribe
     * @param fn {Function} Event handler to be removed.
     */
    this.unsubscribe = function (fn) {
      for (var i = handlers.length - 1; i >= 0; i--) {
        if (handlers[i] === fn) {
          handlers.splice(i, 1);
        }
      }
    };

    /***
     * Fires an event notifying all subscribers.
     * @method notify
     * @param args {Object} Additional data object to be passed to all handlers.
     * @param e {EventData}
     *      Optional.
     *      An <code>EventData</code> object to be passed to all handlers.
     *      For DOM events, an existing W3C/jQuery event object can be passed in.
     * @param scope {Object}
     *      Optional.
     *      The scope ("this") within which the handler will be executed.
     *      If not specified, the scope will be set to the <code>Event</code> instance.
     */
    this.notify = function (args, e, scope) {
      e = e || new EventData();
      scope = scope || this;

      var returnValue;
      for (var i = 0; i < handlers.length && !(e.isPropagationStopped() || e.isImmediatePropagationStopped()); i++) {
        returnValue = handlers[i].call(scope, e, args);
      }

      return returnValue;
    };
  }

  function EventHandler() {
    var handlers = [];

    this.subscribe = function (event, handler) {
      handlers.push({
        event: event,
        handler: handler
      });
      event.subscribe(handler);

      return this;  // allow chaining
    };

    this.unsubscribe = function (event, handler) {
      var i = handlers.length;
      while (i--) {
        if (handlers[i].event === event &&
            handlers[i].handler === handler) {
          handlers.splice(i, 1);
          event.unsubscribe(handler);
          return;
        }
      }

      return this;  // allow chaining
    };

    this.unsubscribeAll = function () {
      var i = handlers.length;
      while (i--) {
        handlers[i].event.unsubscribe(handlers[i].handler);
      }
      handlers = [];

      return this;  // allow chaining
    }
  }

  /***
   * A structure containing a range of cells.
   * @class Range
   * @constructor
   * @param fromRow {Integer} Starting row.
   * @param fromCell {Integer} Starting cell.
   * @param toRow {Integer} Optional. Ending row. Defaults to <code>fromRow</code>.
   * @param toCell {Integer} Optional. Ending cell. Defaults to <code>fromCell</code>.
   */
  function Range(fromRow, fromCell, toRow, toCell) {
    if (toRow === undefined && toCell === undefined) {
      toRow = fromRow;
      toCell = fromCell;
    }

    /***
     * @property fromRow
     * @type {Integer}
     */
    this.fromRow = Math.min(fromRow, toRow);

    /***
     * @property fromCell
     * @type {Integer}
     */
    this.fromCell = Math.min(fromCell, toCell);

    /***
     * @property toRow
     * @type {Integer}
     */
    this.toRow = Math.max(fromRow, toRow);

    /***
     * @property toCell
     * @type {Integer}
     */
    this.toCell = Math.max(fromCell, toCell);

    /***
     * Returns whether a range represents a single row.
     * @method isSingleRow
     * @return {Boolean}
     */
    this.isSingleRow = function () {
      return this.fromRow == this.toRow;
    };

    /***
     * Returns whether a range represents a single cell.
     * @method isSingleCell
     * @return {Boolean}
     */
    this.isSingleCell = function () {
      return this.fromRow == this.toRow && this.fromCell == this.toCell;
    };

    /***
     * Returns whether a range contains a given cell.
     * @method contains
     * @param row {Integer}
     * @param cell {Integer}
     * @return {Boolean}
     */
    this.contains = function (row, cell) {
      return row >= this.fromRow && row <= this.toRow &&
          cell >= this.fromCell && cell <= this.toCell;
    };

    /***
     * Returns a readable representation of a range.
     * @method toString
     * @return {String}
     */
    this.toString = function () {
      if (this.isSingleCell()) {
        return "(" + this.fromRow + ":" + this.fromCell + ")";
      }
      else {
        return "(" + this.fromRow + ":" + this.fromCell + " - " + this.toRow + ":" + this.toCell + ")";
      }
    }
  }


  /***
   * A base class that all special / non-data rows (like Group and GroupTotals) derive from.
   * @class NonDataItem
   * @constructor
   */
  function NonDataItem() {
    this.__nonDataRow = true;
  }


  /***
   * Information about a group of rows.
   * @class Group
   * @extends Slick.NonDataItem
   * @constructor
   */
  function Group() {
    this.__group = true;
    this.__updated = false;

    /***
     * Number of rows in the group.
     * @property count
     * @type {Integer}
     */
    this.count = 0;

    /***
     * Grouping value.
     * @property value
     * @type {Object}
     */
    this.value = null;

    /***
     * Formatted display value of the group.
     * @property title
     * @type {String}
     */
    this.title = null;

    /***
     * Whether a group is collapsed.
     * @property collapsed
     * @type {Boolean}
     */
    this.collapsed = false;

    /***
     * GroupTotals, if any.
     * @property totals
     * @type {GroupTotals}
     */
    this.totals = null;
  }

  Group.prototype = new NonDataItem();

  /***
   * Compares two Group instances.
   * @method equals
   * @return {Boolean}
   * @param group {Group} Group instance to compare to.
   */
  Group.prototype.equals = function (group) {
    return this.value === group.value &&
        this.count === group.count &&
        this.collapsed === group.collapsed;
  };

  /***
   * Information about group totals.
   * An instance of GroupTotals will be created for each totals row and passed to the aggregators
   * so that they can store arbitrary data in it.  That data can later be accessed by group totals
   * formatters during the display.
   * @class GroupTotals
   * @extends Slick.NonDataItem
   * @constructor
   */
  function GroupTotals() {
    this.__groupTotals = true;

    /***
     * Parent Group.
     * @param group
     * @type {Group}
     */
    this.group = null;
  }

  GroupTotals.prototype = new NonDataItem();

  /***
   * A locking helper to track the active edit controller and ensure that only a single controller
   * can be active at a time.  This prevents a whole class of state and validation synchronization
   * issues.  An edit controller (such as SlickGrid) can query if an active edit is in progress
   * and attempt a commit or cancel before proceeding.
   * @class EditorLock
   * @constructor
   */
  function EditorLock() {
    var activeEditController = null;

    /***
     * Returns true if a specified edit controller is active (has the edit lock).
     * If the parameter is not specified, returns true if any edit controller is active.
     * @method isActive
     * @param editController {EditController}
     * @return {Boolean}
     */
    this.isActive = function (editController) {
      return (editController ? activeEditController === editController : activeEditController !== null);
    };

    /***
     * Sets the specified edit controller as the active edit controller (acquire edit lock).
     * If another edit controller is already active, and exception will be thrown.
     * @method activate
     * @param editController {EditController} edit controller acquiring the lock
     */
    this.activate = function (editController) {
      if (editController === activeEditController) { // already activated?
        return;
      }
      if (activeEditController !== null) {
        throw "SlickGrid.EditorLock.activate: an editController is still active, can't activate another editController";
      }
      if (!editController.commitCurrentEdit) {
        throw "SlickGrid.EditorLock.activate: editController must implement .commitCurrentEdit()";
      }
      if (!editController.cancelCurrentEdit) {
        throw "SlickGrid.EditorLock.activate: editController must implement .cancelCurrentEdit()";
      }
      activeEditController = editController;
    };

    /***
     * Unsets the specified edit controller as the active edit controller (release edit lock).
     * If the specified edit controller is not the active one, an exception will be thrown.
     * @method deactivate
     * @param editController {EditController} edit controller releasing the lock
     */
    this.deactivate = function (editController) {
      if (activeEditController !== editController) {
        throw "SlickGrid.EditorLock.deactivate: specified editController is not the currently active one";
      }
      activeEditController = null;
    };

    /***
     * Attempts to commit the current edit by calling "commitCurrentEdit" method on the active edit
     * controller and returns whether the commit attempt was successful (commit may fail due to validation
     * errors, etc.).  Edit controller's "commitCurrentEdit" must return true if the commit has succeeded
     * and false otherwise.  If no edit controller is active, returns true.
     * @method commitCurrentEdit
     * @return {Boolean}
     */
    this.commitCurrentEdit = function () {
      return (activeEditController ? activeEditController.commitCurrentEdit() : true);
    };

    /***
     * Attempts to cancel the current edit by calling "cancelCurrentEdit" method on the active edit
     * controller and returns whether the edit was successfully cancelled.  If no edit controller is
     * active, returns true.
     * @method cancelCurrentEdit
     * @return {Boolean}
     */
    this.cancelCurrentEdit = function cancelCurrentEdit() {
      return (activeEditController ? activeEditController.cancelCurrentEdit() : true);
    };
  }
})(jQuery);


(function ($) {
  $.extend(true, window, {
    Slick: {
      Data: {
        DataView: DataView,
        Aggregators: {
          Avg: AvgAggregator,
          Min: MinAggregator,
          Max: MaxAggregator,
          Sum: SumAggregator
        }
      }
    }
  });


  /***
   * A sample Model implementation.
   * Provides a filtered view of the underlying data.
   *
   * Relies on the data item having an "id" property uniquely identifying it.
   */
  function DataView(options) {
    var self = this;

    var defaults = {
      groupItemMetadataProvider: null,
      inlineFilters: false
    };


    // private
    var idProperty = "id";  // property holding a unique row id
    var items = [];         // data by index
    var rows = [];          // data by row
    var idxById = {};       // indexes by id
    var rowsById = null;    // rows by id; lazy-calculated
    var filter = null;      // filter function
    var updated = null;     // updated item ids
    var suspend = false;    // suspends the recalculation
    var sortAsc = true;
    var fastSortField;
    var sortComparer;
    var refreshHints = {};
    var prevRefreshHints = {};
    var filterArgs;
    var filteredItems = [];
    var compiledFilter;
    var compiledFilterWithCaching;
    var filterCache = [];

    // grouping
    var groupingGetter;
    var groupingGetterIsAFn;
    var groupingFormatter;
    var groupingComparer;
    var groups = [];
    var collapsedGroups = {};
    var aggregators;
    var aggregateCollapsed = false;
    var compiledAccumulators;

    var pagesize = 0;
    var pagenum = 0;
    var totalRows = 0;

    // events
    var onRowCountChanged = new Slick.Event();
    var onRowsChanged = new Slick.Event();
    var onPagingInfoChanged = new Slick.Event();

    options = $.extend(true, {}, defaults, options);


    function beginUpdate() {
      suspend = true;
    }

    function endUpdate() {
      suspend = false;
      refresh();
    }

    function setRefreshHints(hints) {
      refreshHints = hints;
    }

    function setFilterArgs(args) {
      filterArgs = args;
    }

    function updateIdxById(startingIndex) {
      startingIndex = startingIndex || 0;
      var id;
      for (var i = startingIndex, l = items.length; i < l; i++) {
        id = items[i][idProperty];
        if (id === undefined) {
          throw "Each data element must implement a unique 'id' property";
        }
        idxById[id] = i;
      }
    }

    function ensureIdUniqueness() {
      var id;
      for (var i = 0, l = items.length; i < l; i++) {
        id = items[i][idProperty];
        if (id === undefined || idxById[id] !== i) {
          throw "Each data element must implement a unique 'id' property";
        }
      }
    }

    function getItems() {
      return items;
    }

    function setItems(data, objectIdProperty) {
      if (objectIdProperty !== undefined) {
        idProperty = objectIdProperty;
      }
      items = filteredItems = data;
      idxById = {};
      updateIdxById();
      ensureIdUniqueness();
      refresh();
    }

    function setPagingOptions(args) {
      if (args.pageSize != undefined) {
        pagesize = args.pageSize;
        pagenum = pagesize ? Math.min(pagenum, Math.max(0, Math.ceil(totalRows / pagesize) - 1)) : 0;
      }

      if (args.pageNum != undefined) {
        pagenum = Math.min(args.pageNum, Math.max(0, Math.ceil(totalRows / pagesize) - 1));
      }

      onPagingInfoChanged.notify(getPagingInfo(), null, self);

      refresh();
    }

    function getPagingInfo() {
      var totalPages = pagesize ? Math.max(1, Math.ceil(totalRows / pagesize)) : 1;
      return {pageSize: pagesize, pageNum: pagenum, totalRows: totalRows, totalPages: totalPages};
    }

    function sort(comparer, ascending) {
      sortAsc = ascending;
      sortComparer = comparer;
      fastSortField = null;
      if (ascending === false) {
        items.reverse();
      }
      items.sort(comparer);
      if (ascending === false) {
        items.reverse();
      }
      idxById = {};
      updateIdxById();
      refresh();
    }

    /***
     * Provides a workaround for the extremely slow sorting in IE.
     * Does a [lexicographic] sort on a give column by temporarily overriding Object.prototype.toString
     * to return the value of that field and then doing a native Array.sort().
     */
    function fastSort(field, ascending) {
      sortAsc = ascending;
      fastSortField = field;
      sortComparer = null;
      var oldToString = Object.prototype.toString;
      Object.prototype.toString = (typeof field == "function") ? field : function () {
        return this[field];
      };
      // an extra reversal for descending sort keeps the sort stable
      // (assuming a stable native sort implementation, which isn't true in some cases)
      if (ascending === false) {
        items.reverse();
      }
      items.sort();
      Object.prototype.toString = oldToString;
      if (ascending === false) {
        items.reverse();
      }
      idxById = {};
      updateIdxById();
      refresh();
    }

    function reSort() {
      if (sortComparer) {
        sort(sortComparer, sortAsc);
      } else if (fastSortField) {
        fastSort(fastSortField, sortAsc);
      }
    }

    function setFilter(filterFn) {
      filter = filterFn;
      if (options.inlineFilters) {
        compiledFilter = compileFilter();
        compiledFilterWithCaching = compileFilterWithCaching();
      }
      refresh();
    }

    function groupBy(valueGetter, valueFormatter, sortComparer) {
      if (!options.groupItemMetadataProvider) {
        options.groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
      }

      groupingGetter = valueGetter;
      groupingGetterIsAFn = typeof groupingGetter === "function";
      groupingFormatter = valueFormatter;
      groupingComparer = sortComparer;
      collapsedGroups = {};
      groups = [];
      refresh();
    }

    function setAggregators(groupAggregators, includeCollapsed) {
      aggregators = groupAggregators;
      aggregateCollapsed = (includeCollapsed !== undefined)
          ? includeCollapsed : aggregateCollapsed;

      // pre-compile accumulator loops
      compiledAccumulators = [];
      var idx = aggregators.length;
      while (idx--) {
        compiledAccumulators[idx] = compileAccumulatorLoop(aggregators[idx]);
      }

      refresh();
    }

    function getItemByIdx(i) {
      return items[i];
    }

    function getIdxById(id) {
      return idxById[id];
    }

    function ensureRowsByIdCache() {
      if (!rowsById) {
        rowsById = {};
        for (var i = 0, l = rows.length; i < l; i++) {
          rowsById[rows[i][idProperty]] = i;
        }
      }
    }

    function getRowById(id) {
      ensureRowsByIdCache();
      return rowsById[id];
    }

    function getItemById(id) {
      return items[idxById[id]];
    }

    function mapIdsToRows(idArray) {
      var rows = [];
      ensureRowsByIdCache();
      for (var i = 0; i < idArray.length; i++) {
        var row = rowsById[idArray[i]];
        if (row != null) {
          rows[rows.length] = row;
        }
      }
      return rows;
    }

    function mapRowsToIds(rowArray) {
      var ids = [];
      for (var i = 0; i < rowArray.length; i++) {
        if (rowArray[i] < rows.length) {
          ids[ids.length] = rows[rowArray[i]][idProperty];
        }
      }
      return ids;
    }

    function updateItem(id, item) {
      if (idxById[id] === undefined || id !== item[idProperty]) {
        throw "Invalid or non-matching id";
      }
      items[idxById[id]] = item;
      if (!updated) {
        updated = {};
      }
      updated[id] = true;
      refresh();
    }

    function insertItem(insertBefore, item) {
      items.splice(insertBefore, 0, item);
      updateIdxById(insertBefore);
      refresh();
    }

    function addItem(item) {
      items.push(item);
      updateIdxById(items.length - 1);
      refresh();
    }

    function deleteItem(id) {
      var idx = idxById[id];
      if (idx === undefined) {
        throw "Invalid id";
      }
      delete idxById[id];
      items.splice(idx, 1);
      updateIdxById(idx);
      refresh();
    }

    function getLength() {
      return rows.length;
    }

    function getItem(i) {
      return rows[i];
    }

    function getItemMetadata(i) {
      var item = rows[i];
      if (item === undefined) {
        return null;
      }

      // overrides for group rows
      if (item.__group) {
        return options.groupItemMetadataProvider.getGroupRowMetadata(item);
      }

      // overrides for totals rows
      if (item.__groupTotals) {
        return options.groupItemMetadataProvider.getTotalsRowMetadata(item);
      }

      return null;
    }

    function collapseGroup(groupingValue) {
      collapsedGroups[groupingValue] = true;
      refresh();
    }

    function expandGroup(groupingValue) {
      delete collapsedGroups[groupingValue];
      refresh();
    }

    function getGroups() {
      return groups;
    }

    function extractGroups(rows) {
      var group;
      var val;
      var groups = [];
      var groupsByVal = [];
      var r;

      for (var i = 0, l = rows.length; i < l; i++) {
        r = rows[i];
        val = (groupingGetterIsAFn) ? groupingGetter(r) : r[groupingGetter];
        val = val || 0;
        group = groupsByVal[val];
        if (!group) {
          group = new Slick.Group();
          group.count = 0;
          group.value = val;
          group.rows = [];
          groups[groups.length] = group;
          groupsByVal[val] = group;
        }

        group.rows[group.count++] = r;
      }

      return groups;
    }

    // TODO:  lazy totals calculation
    function calculateGroupTotals(group) {
      if (group.collapsed && !aggregateCollapsed) {
        return;
      }

      // TODO:  try moving iterating over groups into compiled accumulator
      var totals = new Slick.GroupTotals();
      var agg, idx = aggregators.length;
      while (idx--) {
        agg = aggregators[idx];
        agg.init();
        compiledAccumulators[idx].call(agg, group.rows);
        agg.storeResult(totals);
      }
      totals.group = group;
      group.totals = totals;
    }

    function calculateTotals(groups) {
      var idx = groups.length;
      while (idx--) {
        calculateGroupTotals(groups[idx]);
      }
    }

    function finalizeGroups(groups) {
      var idx = groups.length, g;
      while (idx--) {
        g = groups[idx];
        g.collapsed = (g.value in collapsedGroups);
        g.title = groupingFormatter ? groupingFormatter(g) : g.value;
      }
    }

    function flattenGroupedRows(groups) {
      var groupedRows = [], gl = 0, g;
      for (var i = 0, l = groups.length; i < l; i++) {
        g = groups[i];
        groupedRows[gl++] = g;

        if (!g.collapsed) {
          for (var j = 0, jj = g.rows.length; j < jj; j++) {
            groupedRows[gl++] = g.rows[j];
          }
        }

        if (g.totals && (!g.collapsed || aggregateCollapsed)) {
          groupedRows[gl++] = g.totals;
        }
      }
      return groupedRows;
    }

    function getFunctionInfo(fn) {
      var fnRegex = /^function[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/;
      var matches = fn.toString().match(fnRegex);
      return {
        params: matches[1].split(","),
        body: matches[2]
      };
    }

    function compileAccumulatorLoop(aggregator) {
      var accumulatorInfo = getFunctionInfo(aggregator.accumulate);
      var fn = new Function(
          "_items",
          "for (var " + accumulatorInfo.params[0] + ", _i=0, _il=_items.length; _i<_il; _i++) {" +
              accumulatorInfo.params[0] + " = _items[_i]; " +
              accumulatorInfo.body +
              "}"
      );
      fn.displayName = fn.name = "compiledAccumulatorLoop";
      return fn;
    }

    function compileFilter() {
      var filterInfo = getFunctionInfo(filter);

      var filterBody = filterInfo.body
          .replace(/return false[;}]/gi, "{ continue _coreloop; }")
          .replace(/return true[;}]/gi, "{ _retval[_idx++] = $item$; continue _coreloop; }")
          .replace(/return ([^;}]+?);/gi,
          "{ if ($1) { _retval[_idx++] = $item$; }; continue _coreloop; }");

      // This preserves the function template code after JS compression,
      // so that replace() commands still work as expected.
      var tpl = [
        //"function(_items, _args) { ",
        "var _retval = [], _idx = 0; ",
        "var $item$, $args$ = _args; ",
        "_coreloop: ",
        "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ",
        "$item$ = _items[_i]; ",
        "$filter$; ",
        "} ",
        "return _retval; "
        //"}"
      ].join("");
      tpl = tpl.replace(/\$filter\$/gi, filterBody);
      tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
      tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);

      var fn = new Function("_items,_args", tpl);
      fn.displayName = fn.name = "compiledFilter";
      return fn;
    }

    function compileFilterWithCaching() {
      var filterInfo = getFunctionInfo(filter);

      var filterBody = filterInfo.body
          .replace(/return false[;}]/gi, "{ continue _coreloop; }")
          .replace(/return true[;}]/gi, "{ _cache[_i] = true;_retval[_idx++] = $item$; continue _coreloop; }")
          .replace(/return ([^;}]+?);/gi,
          "{ if ((_cache[_i] = $1)) { _retval[_idx++] = $item$; }; continue _coreloop; }");

      // This preserves the function template code after JS compression,
      // so that replace() commands still work as expected.
      var tpl = [
        //"function(_items, _args, _cache) { ",
        "var _retval = [], _idx = 0; ",
        "var $item$, $args$ = _args; ",
        "_coreloop: ",
        "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ",
        "$item$ = _items[_i]; ",
        "if (_cache[_i]) { ",
        "_retval[_idx++] = $item$; ",
        "continue _coreloop; ",
        "} ",
        "$filter$; ",
        "} ",
        "return _retval; "
        //"}"
      ].join("");
      tpl = tpl.replace(/\$filter\$/gi, filterBody);
      tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
      tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);

      var fn = new Function("_items,_args,_cache", tpl);
      fn.displayName = fn.name = "compiledFilterWithCaching";
      return fn;
    }

    function uncompiledFilter(items, args) {
      var retval = [], idx = 0;

      for (var i = 0, ii = items.length; i < ii; i++) {
        if (filter(items[i], args)) {
          retval[idx++] = items[i];
        }
      }

      return retval;
    }

    function uncompiledFilterWithCaching(items, args, cache) {
      var retval = [], idx = 0, item;

      for (var i = 0, ii = items.length; i < ii; i++) {
        item = items[i];
        if (cache[i]) {
          retval[idx++] = item;
        } else if (filter(item, args)) {
          retval[idx++] = item;
          cache[i] = true;
        }
      }

      return retval;
    }

    function getFilteredAndPagedItems(items) {
      if (filter) {
        var batchFilter = options.inlineFilters ? compiledFilter : uncompiledFilter;
        var batchFilterWithCaching = options.inlineFilters ? compiledFilterWithCaching : uncompiledFilterWithCaching;

        if (refreshHints.isFilterNarrowing) {
          filteredItems = batchFilter(filteredItems, filterArgs);
        } else if (refreshHints.isFilterExpanding) {
          filteredItems = batchFilterWithCaching(items, filterArgs, filterCache);
        } else if (!refreshHints.isFilterUnchanged) {
          filteredItems = batchFilter(items, filterArgs);
        }
      } else {
        // special case:  if not filtering and not paging, the resulting
        // rows collection needs to be a copy so that changes due to sort
        // can be caught
        filteredItems = pagesize ? items : items.concat();
      }

      // get the current page
      var paged;
      if (pagesize) {
        if (filteredItems.length < pagenum * pagesize) {
          pagenum = Math.floor(filteredItems.length / pagesize);
        }
        paged = filteredItems.slice(pagesize * pagenum, pagesize * pagenum + pagesize);
      } else {
        paged = filteredItems;
      }

      return {totalRows: filteredItems.length, rows: paged};
    }

    function getRowDiffs(rows, newRows) {
      var item, r, eitherIsNonData, diff = [];
      var from = 0, to = newRows.length;

      if (refreshHints && refreshHints.ignoreDiffsBefore) {
        from = Math.max(0,
            Math.min(newRows.length, refreshHints.ignoreDiffsBefore));
      }

      if (refreshHints && refreshHints.ignoreDiffsAfter) {
        to = Math.min(newRows.length,
            Math.max(0, refreshHints.ignoreDiffsAfter));
      }

      for (var i = from, rl = rows.length; i < to; i++) {
        if (i >= rl) {
          diff[diff.length] = i;
        } else {
          item = newRows[i];
          r = rows[i];

          if ((groupingGetter && (eitherIsNonData = (item.__nonDataRow) || (r.__nonDataRow)) &&
              item.__group !== r.__group ||
              item.__updated ||
              item.__group && !item.equals(r))
              || (aggregators && eitherIsNonData &&
              // no good way to compare totals since they are arbitrary DTOs
              // deep object comparison is pretty expensive
              // always considering them 'dirty' seems easier for the time being
              (item.__groupTotals || r.__groupTotals))
              || item[idProperty] != r[idProperty]
              || (updated && updated[item[idProperty]])
              ) {
            diff[diff.length] = i;
          }
        }
      }
      return diff;
    }

    function recalc(_items) {
      rowsById = null;

      if (refreshHints.isFilterNarrowing != prevRefreshHints.isFilterNarrowing ||
          refreshHints.isFilterExpanding != prevRefreshHints.isFilterExpanding) {
        filterCache = [];
      }

      var filteredItems = getFilteredAndPagedItems(_items);
      totalRows = filteredItems.totalRows;
      var newRows = filteredItems.rows;

      groups = [];
      if (groupingGetter != null) {
        groups = extractGroups(newRows);
        if (groups.length) {
          finalizeGroups(groups);
          if (aggregators) {
            calculateTotals(groups);
          }
          groups.sort(groupingComparer);
          newRows = flattenGroupedRows(groups);
        }
      }

      var diff = getRowDiffs(rows, newRows);

      rows = newRows;

      return diff;
    }

    function refresh() {
      if (suspend) {
        return;
      }

      var countBefore = rows.length;
      var totalRowsBefore = totalRows;

      var diff = recalc(items, filter); // pass as direct refs to avoid closure perf hit

      // if the current page is no longer valid, go to last page and recalc
      // we suffer a performance penalty here, but the main loop (recalc) remains highly optimized
      if (pagesize && totalRows < pagenum * pagesize) {
        pagenum = Math.max(0, Math.ceil(totalRows / pagesize) - 1);
        diff = recalc(items, filter);
      }

      updated = null;
      prevRefreshHints = refreshHints;
      refreshHints = {};

      if (totalRowsBefore != totalRows) {
        onPagingInfoChanged.notify(getPagingInfo(), null, self);
      }
      if (countBefore != rows.length) {
        onRowCountChanged.notify({previous: countBefore, current: rows.length}, null, self);
      }
      if (diff.length > 0) {
        onRowsChanged.notify({rows: diff}, null, self);
      }
    }

    function syncGridSelection(grid, preserveHidden) {
      var self = this;
      var selectedRowIds = self.mapRowsToIds(grid.getSelectedRows());;
      var inHandler;

      grid.onSelectedRowsChanged.subscribe(function(e, args) {
        if (inHandler) { return; }
        selectedRowIds = self.mapRowsToIds(grid.getSelectedRows());
      });

      this.onRowsChanged.subscribe(function(e, args) {
        if (selectedRowIds.length > 0) {
          inHandler = true;
          var selectedRows = self.mapIdsToRows(selectedRowIds);
          if (!preserveHidden) {
            selectedRowIds = self.mapRowsToIds(selectedRows);
          }
          grid.setSelectedRows(selectedRows);
          inHandler = false;
        }
      });
    }

    function syncGridCellCssStyles(grid, key) {
      var hashById;
      var inHandler;

      // since this method can be called after the cell styles have been set,
      // get the existing ones right away
      storeCellCssStyles(grid.getCellCssStyles(key));

      function storeCellCssStyles(hash) {
        hashById = {};       
        	for (var row in hash) {	          
	          var id = rows[row][idProperty];
	          hashById[id] = hash[row];
	        }
      }

      grid.onCellCssStylesChanged.subscribe(function(e, args) {
        if (inHandler) { return; }
        if (key != args.key) { return; }
        if (args.hash) {
          storeCellCssStyles(args.hash);
        }
      });

      this.onRowsChanged.subscribe(function(e, args) {
        if (hashById) {
          inHandler = true;
          ensureRowsByIdCache();
          var newHash = {};
          for (var id in hashById) {
            var row = rowsById[id];
            if (row != undefined) {
              newHash[row] = hashById[id];
            }
          }
          grid.setCellCssStyles(key, newHash);
          inHandler = false;
        }
      });
    }

    return {
      // methods
      "beginUpdate": beginUpdate,
      "endUpdate": endUpdate,
      "setPagingOptions": setPagingOptions,
      "getPagingInfo": getPagingInfo,
      "getItems": getItems,
      "setItems": setItems,
      "setFilter": setFilter,
      "sort": sort,
      "fastSort": fastSort,
      "reSort": reSort,
      "groupBy": groupBy,
      "setAggregators": setAggregators,
      "collapseGroup": collapseGroup,
      "expandGroup": expandGroup,
      "getGroups": getGroups,
      "getIdxById": getIdxById,
      "getRowById": getRowById,
      "getItemById": getItemById,
      "getItemByIdx": getItemByIdx,
      "mapRowsToIds": mapRowsToIds,
      "mapIdsToRows": mapIdsToRows,
      "setRefreshHints": setRefreshHints,
      "setFilterArgs": setFilterArgs,
      "refresh": refresh,
      "updateItem": updateItem,
      "insertItem": insertItem,
      "addItem": addItem,
      "deleteItem": deleteItem,
      "syncGridSelection": syncGridSelection,
      "syncGridCellCssStyles": syncGridCellCssStyles,

      // data provider methods
      "getLength": getLength,
      "getItem": getItem,
      "getItemMetadata": getItemMetadata,

      // events
      "onRowCountChanged": onRowCountChanged,
      "onRowsChanged": onRowsChanged,
      "onPagingInfoChanged": onPagingInfoChanged
    };
  }

  function AvgAggregator(field) {
    this.field_ = field;

    this.init = function () {
      this.count_ = 0;
      this.nonNullCount_ = 0;
      this.sum_ = 0;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      this.count_++;
      if (val != null && val != "" && val != NaN) {
        this.nonNullCount_++;
        this.sum_ += parseFloat(val);
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.avg) {
        groupTotals.avg = {};
      }
      if (this.nonNullCount_ != 0) {
        groupTotals.avg[this.field_] = this.sum_ / this.nonNullCount_;
      }
    };
  }

  function MinAggregator(field) {
    this.field_ = field;

    this.init = function () {
      this.min_ = null;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      if (val != null && val != "" && val != NaN) {
        if (this.min_ == null || val < this.min_) {
          this.min_ = val;
        }
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.min) {
        groupTotals.min = {};
      }
      groupTotals.min[this.field_] = this.min_;
    }
  }

  function MaxAggregator(field) {
    this.field_ = field;

    this.init = function () {
      this.max_ = null;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      if (val != null && val != "" && val != NaN) {
        if (this.max_ == null || val > this.max_) {
          this.max_ = val;
        }
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.max) {
        groupTotals.max = {};
      }
      groupTotals.max[this.field_] = this.max_;
    }
  }

  function SumAggregator(field) {
    this.field_ = field;

    this.init = function () {
      this.sum_ = null;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      if (val != null && val != "" && val != NaN) {
        this.sum_ += parseFloat(val);
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.sum) {
        groupTotals.sum = {};
      }
      groupTotals.sum[this.field_] = this.sum_;
    }
  }

  // TODO:  add more built-in aggregators
  // TODO:  merge common aggregators in one to prevent needles iterating

})(jQuery);/**
 * @license
 * (c) 2009-2012 Michael Leibman
 * michael{dot}leibman{at}gmail{dot}com
 * http://github.com/mleibman/slickgrid
 *
 * Distributed under MIT license.
 * All rights reserved.
 *
 * SlickGrid v2.1
 *
 * NOTES:
 *     Cell/row DOM manipulations are done directly bypassing jQuery's DOM manipulation methods.
 *     This increases the speed dramatically, but can only be done safely because there are no event handlers
 *     or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
 *     and do proper cleanup.
 */

// make sure required JavaScript modules are loaded
if (typeof jQuery === "undefined") {
  throw "SlickGrid requires jquery module to be loaded";
}
if (!jQuery.fn.drag) {
  throw "SlickGrid requires jquery.event.drag module to be loaded";
}
if (typeof Slick === "undefined") {
  throw "slick.core.js not loaded";
}


(function ($) {
  // Slick.Grid
  $.extend(true, window, {
    Slick: {
      Grid: SlickGrid
    }
  });

  // shared across all grids on the page
  var scrollbarDimensions;
  var maxSupportedCssHeight;  // browser's breaking point

  //////////////////////////////////////////////////////////////////////////////////////////////
  // SlickGrid class implementation (available as Slick.Grid)

  /**
   * Creates a new instance of the grid.
   * @class SlickGrid
   * @constructor
   * @param {Node}              container   Container node to create the grid in.
   * @param {Array,Object}      data        An array of objects for databinding.
   * @param {Array}             columns     An array of column definitions.
   * @param {Object}            options     Grid options.
   **/
  function SlickGrid(container, data, columns, options) {
    // settings
    var defaults = {
      explicitInitialization: false,
      rowHeight: 25,
      defaultColumnWidth: 80,
      enableAddRow: false,
      leaveSpaceForNewRows: false,
      editable: false,
      autoEdit: true,
      enableCellNavigation: true,
      enableColumnReorder: true,
      asyncEditorLoading: false,
      asyncEditorLoadDelay: 100,
      forceFitColumns: false,
      enableAsyncPostRender: false,
      asyncPostRenderDelay: 50,
      autoHeight: false,
      editorLock: Slick.GlobalEditorLock,
      showHeaderRow: false,
      headerRowHeight: 25,
      showTopPanel: false,
      topPanelHeight: 25,
      formatterFactory: null,
      editorFactory: null,
      cellFlashingCssClass: "flashing",
      selectedCellCssClass: "selected",
      multiSelect: true,
      enableTextSelectionOnCells: false,
      dataItemColumnValueExtractor: null,
      fullWidthRows: false,
      multiColumnSort: false,
      defaultFormatter: defaultFormatter,
      forceSyncScrolling: false
    };

    var columnDefaults = {
      name: "",
      resizable: true,
      sortable: false,
      minWidth: 30,
      rerenderOnResize: false,
      headerCssClass: null,
      defaultSortAsc: true
    };

    // scroller
    var th;   // virtual height
    var h;    // real scrollable height
    var ph;   // page height
    var n;    // number of pages
    var cj;   // "jumpiness" coefficient

    var page = 0;       // current page
    var offset = 0;     // current page offset
    var vScrollDir = 1;

    // private
    var initialized = false;
    var $container;
    var uid = "slickgrid_" + Math.round(1000000 * Math.random());
    var self = this;
    var $focusSink;
    var $headerScroller;
    var $headers;
    var $headerRow, $headerRowScroller, $headerRowSpacer;
    var $topPanelScroller;
    var $topPanel;
    var $viewport;
    var $canvas;
    var $style;
    var $boundAncestors;
    var stylesheet, columnCssRulesL, columnCssRulesR;
    var viewportH, viewportW;
    var canvasWidth;
    var viewportHasHScroll, viewportHasVScroll;
    var headerColumnWidthDiff = 0, headerColumnHeightDiff = 0, // border+padding
        cellWidthDiff = 0, cellHeightDiff = 0;
    var absoluteColumnMinWidth;
    var numberOfRows = 0;

    var activePosX;
    var activeRow, activeCell;
    var activeCellNode = null;
    var currentEditor = null;
    var serializedEditorValue;
    var editController;

    var rowsCache = {};
    var renderedRows = 0;
    var numVisibleRows;
    var prevScrollTop = 0;
    var scrollTop = 0;
    var lastRenderedScrollTop = 0;
    var lastRenderedScrollLeft = 0;
    var prevScrollLeft = 0;
    var scrollLeft = 0;

    var selectionModel;
    var selectedRows = [];

    var plugins = [];
    var cellCssClasses = {};

    var columnsById = {};
    var sortColumns = [];
    var columnPosLeft = [];
    var columnPosRight = [];


    // async call handles
    var h_editorLoader = null;
    var h_render = null;
    var h_postrender = null;
    var postProcessedRows = {};
    var postProcessToRow = null;
    var postProcessFromRow = null;

    // perf counters
    var counter_rows_rendered = 0;
    var counter_rows_removed = 0;


    //////////////////////////////////////////////////////////////////////////////////////////////
    // Initialization

    function init() {
      $container = $(container);
      if ($container.length < 1) {
        throw new Error("SlickGrid requires a valid container, " + container + " does not exist in the DOM.");
      }

      // calculate these only once and share between grid instances
      maxSupportedCssHeight = maxSupportedCssHeight || getMaxSupportedCssHeight();
      scrollbarDimensions = scrollbarDimensions || measureScrollbar();

      options = $.extend({}, defaults, options);
      validateAndEnforceOptions();
      columnDefaults.width = options.defaultColumnWidth;

      columnsById = {};
      for (var i = 0; i < columns.length; i++) {
        var m = columns[i] = $.extend({}, columnDefaults, columns[i]);
        columnsById[m.id] = i;
        if (m.minWidth && m.width < m.minWidth) {
          m.width = m.minWidth;
        }
        if (m.maxWidth && m.width > m.maxWidth) {
          m.width = m.maxWidth;
        }
      }

      // validate loaded JavaScript modules against requested options
      if (options.enableColumnReorder && !$.fn.sortable) {
        throw new Error("SlickGrid's 'enableColumnReorder = true' option requires jquery-ui.sortable module to be loaded");
      }

      editController = {
        "commitCurrentEdit": commitCurrentEdit,
        "cancelCurrentEdit": cancelCurrentEdit
      };

      $container
          .empty()
          .css("overflow", "hidden")
          .css("outline", 0)
          .addClass(uid)
          .addClass("ui-widget");

      // set up a positioning container if needed
      if (!/relative|absolute|fixed/.test($container.css("position"))) {
        $container.css("position", "relative");
      }

      $focusSink = $("<div tabIndex='0' hideFocus style='position:fixed;width:0;height:0;top:0;left:0;outline:0;'></div>").appendTo($container);

      $headerScroller = $("<div class='slick-header ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
      $headers = $("<div class='slick-header-columns' style='left:-1000px' />").appendTo($headerScroller);
      $headers.width(getHeadersWidth());

      $headerRowScroller = $("<div class='slick-headerrow ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
      $headerRow = $("<div class='slick-headerrow-columns' />").appendTo($headerRowScroller);
      $headerRowSpacer = $("<div style='display:block;height:1px;position:absolute;top:0;left:0;'></div>")
          .css("width", getCanvasWidth() + scrollbarDimensions.width + "px")
          .appendTo($headerRowScroller);

      $topPanelScroller = $("<div class='slick-top-panel-scroller ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
      $topPanel = $("<div class='slick-top-panel' style='width:10000px' />").appendTo($topPanelScroller);

      if (!options.showTopPanel) {
        $topPanelScroller.hide();
      }

      if (!options.showHeaderRow) {
        $headerRowScroller.hide();
      }

      $viewport = $("<div class='slick-viewport' style='width:100%;overflow:auto;outline:0;position:relative;;'>").appendTo($container);
      $viewport.css("overflow-y", options.autoHeight ? "hidden" : "auto");

      $canvas = $("<div class='grid-canvas' />").appendTo($viewport);

      if (!options.explicitInitialization) {
        finishInitialization();
      }
    }

    function finishInitialization() {
      if (!initialized) {
        initialized = true;

        viewportW = parseFloat($.css($container[0], "width", true));

        // header columns and cells may have different padding/border skewing width calculations (box-sizing, hello?)
        // calculate the diff so we can set consistent sizes
        measureCellPaddingAndBorder();

        // for usability reasons, all text selection in SlickGrid is disabled
        // with the exception of input and textarea elements (selection must
        // be enabled there so that editors work as expected); note that
        // selection in grid cells (grid body) is already unavailable in
        // all browsers except IE
        disableSelection($headers); // disable all text selection in header (including input and textarea)

        if (!options.enableTextSelectionOnCells) {
          // disable text selection in grid cells except in input and textarea elements
          // (this is IE-specific, because selectstart event will only fire in IE)
          $viewport.bind("selectstart.ui", function (event) {
            return $(event.target).is("input,textarea");
          });
        }

        updateColumnCaches();
        createColumnHeaders();
        setupColumnSort();
        createCssRules();
        resizeCanvas();
        bindAncestorScrollEvents();

        $container
            .bind("resize.slickgrid", resizeCanvas);
        $viewport
            .bind("scroll", handleScroll);
        $headerScroller
            .bind("contextmenu", handleHeaderContextMenu)
            .bind("click", handleHeaderClick)
            .delegate(".slick-header-column", "mouseenter", handleHeaderMouseEnter)
            .delegate(".slick-header-column", "mouseleave", handleHeaderMouseLeave);
        $headerRowScroller
            .bind("scroll", handleHeaderRowScroll);
        $focusSink
            .bind("keydown", handleKeyDown);
        $canvas
            .bind("keydown", handleKeyDown)
            .bind("click", handleClick)
            .bind("dblclick", handleDblClick)
            .bind("contextmenu", handleContextMenu)
            .bind("draginit", handleDragInit)
            .bind("dragstart", handleDragStart)
            .bind("drag", handleDrag)
            .bind("dragend", handleDragEnd)
            .delegate(".slick-cell", "mouseenter", handleMouseEnter)
            .delegate(".slick-cell", "mouseleave", handleMouseLeave);
      }
    }

    function registerPlugin(plugin) {
      plugins.unshift(plugin);
      plugin.init(self);
    }

    function unregisterPlugin(plugin) {
      for (var i = plugins.length; i >= 0; i--) {
        if (plugins[i] === plugin) {
          if (plugins[i].destroy) {
            plugins[i].destroy();
          }
          plugins.splice(i, 1);
          break;
        }
      }
    }

    function setSelectionModel(model) {
      if (selectionModel) {
        selectionModel.onSelectedRangesChanged.unsubscribe(handleSelectedRangesChanged);
        if (selectionModel.destroy) {
          selectionModel.destroy();
        }
      }

      selectionModel = model;
      if (selectionModel) {
        selectionModel.init(self);
        selectionModel.onSelectedRangesChanged.subscribe(handleSelectedRangesChanged);
      }
    }

    function getSelectionModel() {
      return selectionModel;
    }

    function getCanvasNode() {
      return $canvas[0];
    }

    function measureScrollbar() {
      var $c = $("<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>").appendTo("body");
      var dim = {
        width: $c.width() - $c[0].clientWidth,
        height: $c.height() - $c[0].clientHeight
      };
      $c.remove();
      return dim;
    }

    function getHeadersWidth() {
      var headersWidth = 0;
      for (var i = 0, ii = columns.length; i < ii; i++) {
        var width = columns[i].width;
        headersWidth += width;
      }
      headersWidth += scrollbarDimensions.width;
      return Math.max(headersWidth, viewportW) + 1000;
    }

    function getCanvasWidth() {
      var availableWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;
      var rowWidth = 0;
      var i = columns.length;
      while (i--) {
        rowWidth += columns[i].width;
      }
      return options.fullWidthRows ? Math.max(rowWidth, availableWidth) : rowWidth;
    }

    function updateCanvasWidth(forceColumnWidthsUpdate) {
      var oldCanvasWidth = canvasWidth;
      canvasWidth = getCanvasWidth();

      if (canvasWidth != oldCanvasWidth) {
        $canvas.width(canvasWidth);
        $headerRow.width(canvasWidth);
        $headers.width(getHeadersWidth());
        viewportHasHScroll = (canvasWidth > viewportW - scrollbarDimensions.width);
      }

      $headerRowSpacer.width(canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0));

      if (canvasWidth != oldCanvasWidth || forceColumnWidthsUpdate) {
        applyColumnWidths();
      }
    }

    function disableSelection($target) {
      if ($target && $target.jquery) {
        $target
            .attr("unselectable", "on")
            .css("MozUserSelect", "none")
            .bind("selectstart.ui", function () {
              return false;
            }); // from jquery:ui.core.js 1.7.2
      }
    }

    function getMaxSupportedCssHeight() {
      var supportedHeight = 1000000;
      // FF reports the height back but still renders blank after ~6M px
      var testUpTo = ($.browser.mozilla) ? 6000000 : 1000000000;
      var div = $("<div style='display:none' />").appendTo(document.body);

      while (true) {
        var test = supportedHeight * 2;
        div.css("height", test);
        if (test > testUpTo || div.height() !== test) {
          break;
        } else {
          supportedHeight = test;
        }
      }

      div.remove();
      return supportedHeight;
    }

    // TODO:  this is static.  need to handle page mutation.
    function bindAncestorScrollEvents() {
      var elem = $canvas[0];
      while ((elem = elem.parentNode) != document.body && elem != null) {
        // bind to scroll containers only
        if (elem == $viewport[0] || elem.scrollWidth != elem.clientWidth || elem.scrollHeight != elem.clientHeight) {
          var $elem = $(elem);
          if (!$boundAncestors) {
            $boundAncestors = $elem;
          } else {
            $boundAncestors = $boundAncestors.add($elem);
          }
          $elem.bind("scroll." + uid, handleActiveCellPositionChange);
        }
      }
    }

    function unbindAncestorScrollEvents() {
      if (!$boundAncestors) {
        return;
      }
      $boundAncestors.unbind("scroll." + uid);
      $boundAncestors = null;
    }

    function updateColumnHeader(columnId, title, toolTip) {
      if (!initialized) { return; }
      var idx = getColumnIndex(columnId);
      if (idx == null) {
        return;
      }

      var columnDef = columns[idx];
      var $header = $headers.children().eq(idx);
      if ($header) {
        if (title !== undefined) {
          columns[idx].name = title;
        }
        if (toolTip !== undefined) {
          columns[idx].toolTip = toolTip;
        }

        trigger(self.onBeforeHeaderCellDestroy, {
          "node": $header[0],
          "column": columnDef
        });

        $header
            .attr("title", toolTip || "")
            .children().eq(0).html(title);

        trigger(self.onHeaderCellRendered, {
          "node": $header[0],
          "column": columnDef
        });
      }
    }

    function getHeaderRow() {
      return $headerRow[0];
    }

    function getHeaderRowColumn(columnId) {
      var idx = getColumnIndex(columnId);
      var $header = $headerRow.children().eq(idx);
      return $header && $header[0];
    }

    function createColumnHeaders() {
      function hoverBegin() {
        $(this).addClass("ui-state-hover");
      }

      function hoverEnd() {
        $(this).removeClass("ui-state-hover");
      }

      $headers.find(".slick-header-column")
        .each(function() {
          var columnDef = $(this).data("column");
          if (columnDef) {
            trigger(self.onBeforeHeaderCellDestroy, {
              "node": this,
              "column": columnDef
            });
          }
        });
      $headers.empty();
      $headers.width(getHeadersWidth());

      $headerRow.find(".slick-headerrow-column")
        .each(function() {
          var columnDef = $(this).data("column");
          if (columnDef) {
            trigger(self.onBeforeHeaderRowCellDestroy, {
              "node": this,
              "column": columnDef
            });
          }
        });
      $headerRow.empty();

      for (var i = 0; i < columns.length; i++) {
        var m = columns[i];

        var header = $("<div class='ui-state-default slick-header-column' id='" + uid + m.id + "' />")
            .html("<span class='slick-column-name'>" + m.name + "</span>")
            .width(m.width - headerColumnWidthDiff)
            .attr("title", m.toolTip || "")
            .data("column", m)
            .addClass(m.headerCssClass || "")
            .appendTo($headers);

        if (options.enableColumnReorder || m.sortable) {
          header.hover(hoverBegin, hoverEnd);
        }

        if (m.sortable) {
          header.append("<span class='slick-sort-indicator' />");
        }

        trigger(self.onHeaderCellRendered, {
          "node": header[0],
          "column": m
        });

        if (options.showHeaderRow) {
          var headerRowCell = $("<div class='ui-state-default slick-headerrow-column l" + i + " r" + i + "'></div>")
              .data("column", m)
              .appendTo($headerRow);

          trigger(self.onHeaderRowCellRendered, {
            "node": headerRowCell[0],
            "column": m
          });
        }
      }

      setSortColumns(sortColumns);
      setupColumnResize();
      if (options.enableColumnReorder) {
        setupColumnReorder();
      }
    }

    function setupColumnSort() {
      $headers.click(function (e) {
        // temporary workaround for a bug in jQuery 1.7.1 (http://bugs.jquery.com/ticket/11328)
        e.metaKey = e.metaKey || e.ctrlKey;

        if ($(e.target).hasClass("slick-resizable-handle")) {
          return;
        }

        var $col = $(e.target).closest(".slick-header-column");
        if (!$col.length) {
          return;
        }

        var column = $col.data("column");
        if (column.sortable) {
          if (!getEditorLock().commitCurrentEdit()) {
            return;
          }

          var sortOpts = null;
          var i = 0;
          for (; i < sortColumns.length; i++) {
            if (sortColumns[i].columnId == column.id) {
              sortOpts = sortColumns[i];
              sortOpts.sortAsc = !sortOpts.sortAsc;
              break;
            }
          }

          if (e.metaKey && options.multiColumnSort) {
            if (sortOpts) {
              sortColumns.splice(i, 1);
            }
          }
          else {
            if ((!e.shiftKey && !e.metaKey) || !options.multiColumnSort) {
              sortColumns = [];
            }

            if (!sortOpts) {
              sortOpts = { columnId: column.id, sortAsc: column.defaultSortAsc };
              sortColumns.push(sortOpts);
            } else if (sortColumns.length == 0) {
              sortColumns.push(sortOpts);
            }
          }

          setSortColumns(sortColumns);

          if (!options.multiColumnSort) {
            trigger(self.onSort, {
              multiColumnSort: false,
              sortCol: column,
              sortAsc: sortOpts.sortAsc}, e);
          } else {
            trigger(self.onSort, {
              multiColumnSort: true,
              sortCols: $.map(sortColumns, function(col) {
                return {sortCol: columns[getColumnIndex(col.columnId)], sortAsc: col.sortAsc };
              })}, e);
          }
        }
      });
    }

    function setupColumnReorder() {
      $headers.sortable("destroy");
      $headers.sortable({
        containment: "parent",
        axis: "x",
        cursor: "default",
        tolerance: "intersection",
        helper: "clone",
        placeholder: "slick-sortable-placeholder ui-state-default slick-header-column",
        forcePlaceholderSize: true,
        start: function (e, ui) {
          $(ui.helper).addClass("slick-header-column-active");
        },
        beforeStop: function (e, ui) {
          $(ui.helper).removeClass("slick-header-column-active");
        },
        stop: function (e) {
          if (!getEditorLock().commitCurrentEdit()) {
            $(this).sortable("cancel");
            return;
          }

          var reorderedIds = $headers.sortable("toArray");
          var reorderedColumns = [];
          for (var i = 0; i < reorderedIds.length; i++) {
            reorderedColumns.push(columns[getColumnIndex(reorderedIds[i].replace(uid, ""))]);
          }
          setColumns(reorderedColumns);

          trigger(self.onColumnsReordered, {});
          e.stopPropagation();
          setupColumnResize();
        }
      });
    }

    function setupColumnResize() {
      var $col, j, c, pageX, columnElements, minPageX, maxPageX, firstResizable, lastResizable;
      columnElements = $headers.children();
      columnElements.find(".slick-resizable-handle").remove();
      columnElements.each(function (i, e) {
        if (columns[i].resizable) {
          if (firstResizable === undefined) {
            firstResizable = i;
          }
          lastResizable = i;
        }
      });
      if (firstResizable === undefined) {
        return;
      }
      columnElements.each(function (i, e) {
        if (i < firstResizable || (options.forceFitColumns && i >= lastResizable)) {
          return;
        }
        $col = $(e);
        $("<div class='slick-resizable-handle' />")
            .appendTo(e)
            .bind("dragstart", function (e, dd) {
              if (!getEditorLock().commitCurrentEdit()) {
                return false;
              }
              pageX = e.pageX;
              $(this).parent().addClass("slick-header-column-active");
              var shrinkLeewayOnRight = null, stretchLeewayOnRight = null;
              // lock each column's width option to current width
              columnElements.each(function (i, e) {
                columns[i].previousWidth = $(e).outerWidth();
              });
              if (options.forceFitColumns) {
                shrinkLeewayOnRight = 0;
                stretchLeewayOnRight = 0;
                // colums on right affect maxPageX/minPageX
                for (j = i + 1; j < columnElements.length; j++) {
                  c = columns[j];
                  if (c.resizable) {
                    if (stretchLeewayOnRight !== null) {
                      if (c.maxWidth) {
                        stretchLeewayOnRight += c.maxWidth - c.previousWidth;
                      } else {
                        stretchLeewayOnRight = null;
                      }
                    }
                    shrinkLeewayOnRight += c.previousWidth - Math.max(c.minWidth || 0, absoluteColumnMinWidth);
                  }
                }
              }
              var shrinkLeewayOnLeft = 0, stretchLeewayOnLeft = 0;
              for (j = 0; j <= i; j++) {
                // columns on left only affect minPageX
                c = columns[j];
                if (c.resizable) {
                  if (stretchLeewayOnLeft !== null) {
                    if (c.maxWidth) {
                      stretchLeewayOnLeft += c.maxWidth - c.previousWidth;
                    } else {
                      stretchLeewayOnLeft = null;
                    }
                  }
                  shrinkLeewayOnLeft += c.previousWidth - Math.max(c.minWidth || 0, absoluteColumnMinWidth);
                }
              }
              if (shrinkLeewayOnRight === null) {
                shrinkLeewayOnRight = 100000;
              }
              if (shrinkLeewayOnLeft === null) {
                shrinkLeewayOnLeft = 100000;
              }
              if (stretchLeewayOnRight === null) {
                stretchLeewayOnRight = 100000;
              }
              if (stretchLeewayOnLeft === null) {
                stretchLeewayOnLeft = 100000;
              }
              maxPageX = pageX + Math.min(shrinkLeewayOnRight, stretchLeewayOnLeft);
              minPageX = pageX - Math.min(shrinkLeewayOnLeft, stretchLeewayOnRight);
            })
            .bind("drag", function (e, dd) {
              var actualMinWidth, d = Math.min(maxPageX, Math.max(minPageX, e.pageX)) - pageX, x;
              if (d < 0) { // shrink column
                x = d;
                for (j = i; j >= 0; j--) {
                  c = columns[j];
                  if (c.resizable) {
                    actualMinWidth = Math.max(c.minWidth || 0, absoluteColumnMinWidth);
                    if (x && c.previousWidth + x < actualMinWidth) {
                      x += c.previousWidth - actualMinWidth;
                      c.width = actualMinWidth;
                    } else {
                      c.width = c.previousWidth + x;
                      x = 0;
                    }
                  }
                }

                if (options.forceFitColumns) {
                  x = -d;
                  for (j = i + 1; j < columnElements.length; j++) {
                    c = columns[j];
                    if (c.resizable) {
                      if (x && c.maxWidth && (c.maxWidth - c.previousWidth < x)) {
                        x -= c.maxWidth - c.previousWidth;
                        c.width = c.maxWidth;
                      } else {
                        c.width = c.previousWidth + x;
                        x = 0;
                      }
                    }
                  }
                }
              } else { // stretch column
                x = d;
                for (j = i; j >= 0; j--) {
                  c = columns[j];
                  if (c.resizable) {
                    if (x && c.maxWidth && (c.maxWidth - c.previousWidth < x)) {
                      x -= c.maxWidth - c.previousWidth;
                      c.width = c.maxWidth;
                    } else {
                      c.width = c.previousWidth + x;
                      x = 0;
                    }
                  }
                }

                if (options.forceFitColumns) {
                  x = -d;
                  for (j = i + 1; j < columnElements.length; j++) {
                    c = columns[j];
                    if (c.resizable) {
                      actualMinWidth = Math.max(c.minWidth || 0, absoluteColumnMinWidth);
                      if (x && c.previousWidth + x < actualMinWidth) {
                        x += c.previousWidth - actualMinWidth;
                        c.width = actualMinWidth;
                      } else {
                        c.width = c.previousWidth + x;
                        x = 0;
                      }
                    }
                  }
                }
              }
              applyColumnHeaderWidths();
              if (options.syncColumnCellResize) {
                applyColumnWidths();
              }
            })
            .bind("dragend", function (e, dd) {
              var newWidth;
              $(this).parent().removeClass("slick-header-column-active");
              for (j = 0; j < columnElements.length; j++) {
                c = columns[j];
                newWidth = $(columnElements[j]).outerWidth();

                if (c.previousWidth !== newWidth && c.rerenderOnResize) {
                  invalidateAllRows();
                }
              }
              updateCanvasWidth(true);
              render();
              trigger(self.onColumnsResized, {});
            });
      });
    }

    function getVBoxDelta($el) {
      var p = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"];
      var delta = 0;
      $.each(p, function (n, val) {
        delta += parseFloat($el.css(val)) || 0;
      });
      return delta;
    }

    function measureCellPaddingAndBorder() {
      var el;
      var h = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"];
      var v = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"];

      el = $("<div class='ui-state-default slick-header-column' style='visibility:hidden'>-</div>").appendTo($headers);
      headerColumnWidthDiff = headerColumnHeightDiff = 0;
      $.each(h, function (n, val) {
        headerColumnWidthDiff += parseFloat(el.css(val)) || 0;
      });
      $.each(v, function (n, val) {
        headerColumnHeightDiff += parseFloat(el.css(val)) || 0;
      });
      el.remove();

      var r = $("<div class='slick-row' />").appendTo($canvas);
      el = $("<div class='slick-cell' id='' style='visibility:hidden'>-</div>").appendTo(r);
      cellWidthDiff = cellHeightDiff = 0;
      $.each(h, function (n, val) {
        cellWidthDiff += parseFloat(el.css(val)) || 0;
      });
      $.each(v, function (n, val) {
        cellHeightDiff += parseFloat(el.css(val)) || 0;
      });
      r.remove();

      absoluteColumnMinWidth = Math.max(headerColumnWidthDiff, cellWidthDiff);
    }

    function createCssRules() {
      $style = $("<style type='text/css' rel='stylesheet' />").appendTo($("head"));
      var rowHeight = (options.rowHeight - cellHeightDiff);
      var rules = [
        "." + uid + " .slick-header-column { left: 1000px; }",
        "." + uid + " .slick-top-panel { height:" + options.topPanelHeight + "px; }",
        "." + uid + " .slick-headerrow-columns { height:" + options.headerRowHeight + "px; }",
        "." + uid + " .slick-cell { height:" + rowHeight + "px; }",
        "." + uid + " .slick-row { height:" + options.rowHeight + "px; }"
      ];

      for (var i = 0; i < columns.length; i++) {
        rules.push("." + uid + " .l" + i + " { }");
        rules.push("." + uid + " .r" + i + " { }");
      }

      if ($style[0].styleSheet) { // IE
        $style[0].styleSheet.cssText = rules.join(" ");
      } else {
        $style[0].appendChild(document.createTextNode(rules.join(" ")));
      }
    }

    function getColumnCssRules(idx) {
      if (!stylesheet) {
        var sheets = document.styleSheets;
        for (var i = 0; i < sheets.length; i++) {
          if ((sheets[i].ownerNode || sheets[i].owningElement) == $style[0]) {
            stylesheet = sheets[i];
            break;
          }
        }

        if (!stylesheet) {
          throw new Error("Cannot find stylesheet.");
        }

        // find and cache column CSS rules
        columnCssRulesL = [];
        columnCssRulesR = [];
        var cssRules = (stylesheet.cssRules || stylesheet.rules);
        var matches, columnIdx;
        for (var i = 0; i < cssRules.length; i++) {
          var selector = cssRules[i].selectorText;
          if (matches = /\.l\d+/.exec(selector)) {
            columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
            columnCssRulesL[columnIdx] = cssRules[i];
          } else if (matches = /\.r\d+/.exec(selector)) {
            columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
            columnCssRulesR[columnIdx] = cssRules[i];
          }
        }
      }

      return {
        "left": columnCssRulesL[idx],
        "right": columnCssRulesR[idx]
      };
    }

    function removeCssRules() {
      $style.remove();
      stylesheet = null;
    }

    function destroy() {
      getEditorLock().cancelCurrentEdit();

      trigger(self.onBeforeDestroy, {});

      var i = plugins.length;
      while(i--) {
        unregisterPlugin(plugins[i]);
      }

      if (options.enableColumnReorder && $headers.sortable) {
        $headers.sortable("destroy");
      }

      unbindAncestorScrollEvents();
      $container.unbind(".slickgrid");
      removeCssRules();

      $canvas.unbind("draginit dragstart dragend drag");
      $container.empty().removeClass(uid);
    }


    //////////////////////////////////////////////////////////////////////////////////////////////
    // General

    function trigger(evt, args, e) {
      e = e || new Slick.EventData();
      args = args || {};
      args.grid = self;
      return evt.notify(args, e, self);
    }

    function getEditorLock() {
      return options.editorLock;
    }

    function getEditController() {
      return editController;
    }

    function getColumnIndex(id) {
      return columnsById[id];
    }

    function autosizeColumns() {
      var i, c,
          widths = [],
          shrinkLeeway = 0,
          total = 0,
          prevTotal,
          availWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;

      for (i = 0; i < columns.length; i++) {
        c = columns[i];
        widths.push(c.width);
        total += c.width;
        if (c.resizable) {
          shrinkLeeway += c.width - Math.max(c.minWidth, absoluteColumnMinWidth);
        }
      }

      // shrink
      prevTotal = total;
      while (total > availWidth && shrinkLeeway) {
        var shrinkProportion = (total - availWidth) / shrinkLeeway;
        for (i = 0; i < columns.length && total > availWidth; i++) {
          c = columns[i];
          var width = widths[i];
          if (!c.resizable || width <= c.minWidth || width <= absoluteColumnMinWidth) {
            continue;
          }
          var absMinWidth = Math.max(c.minWidth, absoluteColumnMinWidth);
          var shrinkSize = Math.floor(shrinkProportion * (width - absMinWidth)) || 1;
          shrinkSize = Math.min(shrinkSize, width - absMinWidth);
          total -= shrinkSize;
          shrinkLeeway -= shrinkSize;
          widths[i] -= shrinkSize;
        }
        if (prevTotal == total) {  // avoid infinite loop
          break;
        }
        prevTotal = total;
      }

      // grow
      prevTotal = total;
      while (total < availWidth) {
        var growProportion = availWidth / total;
        for (i = 0; i < columns.length && total < availWidth; i++) {
          c = columns[i];
          if (!c.resizable || c.maxWidth <= c.width) {
            continue;
          }
          var growSize = Math.min(Math.floor(growProportion * c.width) - c.width, (c.maxWidth - c.width) || 1000000) || 1;
          total += growSize;
          widths[i] += growSize;
        }
        if (prevTotal == total) {  // avoid infinite loop
          break;
        }
        prevTotal = total;
      }

      var reRender = false;
      for (i = 0; i < columns.length; i++) {
        if (columns[i].rerenderOnResize && columns[i].width != widths[i]) {
          reRender = true;
        }
        columns[i].width = widths[i];
      }

      applyColumnHeaderWidths();
      updateCanvasWidth(true);
      if (reRender) {
        invalidateAllRows();
        render();
      }
    }

    function applyColumnHeaderWidths() {
      if (!initialized) { return; }
      var h;
      for (var i = 0, headers = $headers.children(), ii = headers.length; i < ii; i++) {
        h = $(headers[i]);
        if (h.width() !== columns[i].width - headerColumnWidthDiff) {
          h.width(columns[i].width - headerColumnWidthDiff);
        }
      }

      updateColumnCaches();
    }

    function applyColumnWidths() {
      var x = 0, w, rule;
      for (var i = 0; i < columns.length; i++) {
        w = columns[i].width;

        rule = getColumnCssRules(i);
        rule.left.style.left = x + "px";
        rule.right.style.right = (canvasWidth - x - w) + "px";

        x += columns[i].width;
      }
    }

    function setSortColumn(columnId, ascending) {
      setSortColumns([{ columnId: columnId, sortAsc: ascending}]);
    }

    function setSortColumns(cols) {
      sortColumns = cols;

      var headerColumnEls = $headers.children();
      headerColumnEls
          .removeClass("slick-header-column-sorted")
          .find(".slick-sort-indicator")
              .removeClass("slick-sort-indicator-asc slick-sort-indicator-desc");

      $.each(sortColumns, function(i, col) {
        if (col.sortAsc == null) {
          col.sortAsc = true;
        }
        var columnIndex = getColumnIndex(col.columnId);
        if (columnIndex != null) {
          headerColumnEls.eq(columnIndex)
              .addClass("slick-header-column-sorted")
              .find(".slick-sort-indicator")
                  .addClass(col.sortAsc ? "slick-sort-indicator-asc" : "slick-sort-indicator-desc");
        }
      });
    }

    function getSortColumns() {
      return sortColumns;
    }

    function handleSelectedRangesChanged(e, ranges) {
      selectedRows = [];
      var hash = {};
      for (var i = 0; i < ranges.length; i++) {
        for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
          if (!hash[j]) {  // prevent duplicates
            selectedRows.push(j);
            hash[j] = {};
          }
          for (var k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
            if (canCellBeSelected(j, k)) {
              hash[j][columns[k].id] = options.selectedCellCssClass;
            }
          }
        }
      }

      setCellCssStyles(options.selectedCellCssClass, hash);

      trigger(self.onSelectedRowsChanged, {rows: getSelectedRows()}, e);
    }

    function getColumns() {
      return columns;
    }

    function updateColumnCaches() {
      // Pre-calculate cell boundaries.
      columnPosLeft = [];
      columnPosRight = [];
      var x = 0;
      for (var i = 0, ii = columns.length; i < ii; i++) {
        columnPosLeft[i] = x;
        columnPosRight[i] = x + columns[i].width;
        x += columns[i].width;
      }
    }

    function setColumns(columnDefinitions) {
      columns = columnDefinitions;

      columnsById = {};
      for (var i = 0; i < columns.length; i++) {
        var m = columns[i] = $.extend({}, columnDefaults, columns[i]);
        columnsById[m.id] = i;
        if (m.minWidth && m.width < m.minWidth) {
          m.width = m.minWidth;
        }
        if (m.maxWidth && m.width > m.maxWidth) {
          m.width = m.maxWidth;
        }
      }

      updateColumnCaches();

      if (initialized) {
        invalidateAllRows();
        createColumnHeaders();
        removeCssRules();
        createCssRules();
        resizeCanvas();
        applyColumnWidths();
        handleScroll();
      }
    }

    function getOptions() {
      return options;
    }

    function setOptions(args) {
      if (!getEditorLock().commitCurrentEdit()) {
        return;
      }

      makeActiveCellNormal();

      if (options.enableAddRow !== args.enableAddRow) {
        invalidateRow(getDataLength());
      }

      options = $.extend(options, args);
      validateAndEnforceOptions();

      $viewport.css("overflow-y", options.autoHeight ? "hidden" : "auto");
      render();
    }

    function validateAndEnforceOptions() {
      if (options.autoHeight) {
        options.leaveSpaceForNewRows = false;
      }
    }

    function setData(newData, scrollToTop) {
      data = newData;
      invalidateAllRows();
      updateRowCount();
      if (scrollToTop) {
        scrollTo(0);
      }
    }

    function getData() {
      return data;
    }

    function getDataLength() {
      if (data.getLength) {
        return data.getLength();
      } else {
        return data.length;
      }
    }

    function getDataItem(i) {
      if (data.getItem) {
        return data.getItem(i);
      } else {
        return data[i];
      }
    }

    function getTopPanel() {
      return $topPanel[0];
    }

    function setTopPanelVisibility(visible) {
      if (options.showTopPanel != visible) {
        options.showTopPanel = visible;
        if (visible) {
          $topPanelScroller.slideDown("fast", resizeCanvas);
        } else {
          $topPanelScroller.slideUp("fast", resizeCanvas);
        }
      }
    }

    function setHeaderRowVisibility(visible) {
      if (options.showHeaderRow != visible) {
        options.showHeaderRow = visible;
        if (visible) {
          $headerRowScroller.slideDown("fast", resizeCanvas);
        } else {
          $headerRowScroller.slideUp("fast", resizeCanvas);
        }
      }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Rendering / Scrolling

    function scrollTo(y) {
      y = Math.max(y, 0);
      y = Math.min(y, th - viewportH + (viewportHasHScroll ? scrollbarDimensions.height : 0));

      var oldOffset = offset;

      page = Math.min(n - 1, Math.floor(y / ph));
      offset = Math.round(page * cj);
      var newScrollTop = y - offset;

      if (offset != oldOffset) {
        var range = getVisibleRange(newScrollTop);
        cleanupRows(range);
        updateRowPositions();
      }

      if (prevScrollTop != newScrollTop) {
        vScrollDir = (prevScrollTop + oldOffset < newScrollTop + offset) ? 1 : -1;
        $viewport[0].scrollTop = (lastRenderedScrollTop = scrollTop = prevScrollTop = newScrollTop);

        trigger(self.onViewportChanged, {});
      }
    }

    function defaultFormatter(row, cell, value, columnDef, dataContext) {
      if (value == null) {
        return "";
      } else {
        return value.toString().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      }
    }

    function getFormatter(row, column) {
      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);

      // look up by id, then index
      var columnOverrides = rowMetadata &&
          rowMetadata.columns &&
          (rowMetadata.columns[column.id] || rowMetadata.columns[getColumnIndex(column.id)]);

      return (columnOverrides && columnOverrides.formatter) ||
          (rowMetadata && rowMetadata.formatter) ||
          column.formatter ||
          (options.formatterFactory && options.formatterFactory.getFormatter(column)) ||
          options.defaultFormatter;
    }

    function getEditor(row, cell) {
      var column = columns[cell];
      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
      var columnMetadata = rowMetadata && rowMetadata.columns;

      if (columnMetadata && columnMetadata[column.id] && columnMetadata[column.id].editor !== undefined) {
        return columnMetadata[column.id].editor;
      }
      if (columnMetadata && columnMetadata[cell] && columnMetadata[cell].editor !== undefined) {
        return columnMetadata[cell].editor;
      }

      return column.editor || (options.editorFactory && options.editorFactory.getEditor(column));
    }

    function getDataItemValueForColumn(item, columnDef) {
      if (options.dataItemColumnValueExtractor) {
        return options.dataItemColumnValueExtractor(item, columnDef);
      }
      return item[columnDef.field];
    }

    function appendRowHtml(stringArray, row, range) {
      var d = getDataItem(row);
      var dataLoading = row < getDataLength() && !d;
      var rowCss = "slick-row" +
          (dataLoading ? " loading" : "") +
          (row === activeRow ? " active" : "") +
          (row % 2 == 1 ? " odd" : " even");

      var metadata = data.getItemMetadata && data.getItemMetadata(row);

      if (metadata && metadata.cssClasses) {
        rowCss += " " + metadata.cssClasses;
      }

      stringArray.push("<div class='ui-widget-content " + rowCss + "' style='top:" + (options.rowHeight * row - offset) + "px'>");

      var colspan, m;
      for (var i = 0, ii = columns.length; i < ii; i++) {
        m = columns[i];
        colspan = 1;
        if (metadata && metadata.columns) {
          var columnData = metadata.columns[m.id] || metadata.columns[i];
          colspan = (columnData && columnData.colspan) || 1;
          if (colspan === "*") {
            colspan = ii - i;
          }
        }

        // Do not render cells outside of the viewport.
        if (columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx) {
          if (columnPosLeft[i] > range.rightPx) {
            // All columns to the right are outside the range.
            break;
          }

          appendCellHtml(stringArray, row, i, colspan);
        }

        if (colspan > 1) {
          i += (colspan - 1);
        }
      }

      stringArray.push("</div>");
    }

    function appendCellHtml(stringArray, row, cell, colspan) {
      var m = columns[cell];
      var d = getDataItem(row);
      var cellCss = "slick-cell l" + cell + " r" + Math.min(columns.length - 1, cell + colspan - 1) +
          (m.cssClass ? " " + m.cssClass : "");
      if (row === activeRow && cell === activeCell) {
        cellCss += (" active");
      }

      // TODO:  merge them together in the setter
      for (var key in cellCssClasses) {
        if (cellCssClasses[key][row] && cellCssClasses[key][row][m.id]) {
          cellCss += (" " + cellCssClasses[key][row][m.id]);
        }
      }

      stringArray.push("<div class='" + cellCss + "'>");

      // if there is a corresponding row (if not, this is the Add New row or this data hasn't been loaded yet)
      if (d) {
        var value = getDataItemValueForColumn(d, m);
        stringArray.push(getFormatter(row, m)(row, cell, value, m, d));
      }

      stringArray.push("</div>");

      rowsCache[row].cellRenderQueue.push(cell);
      rowsCache[row].cellColSpans[cell] = colspan;
    }


    function cleanupRows(rangeToKeep) {
      for (var i in rowsCache) {
        if (((i = parseInt(i, 10)) !== activeRow) && (i < rangeToKeep.top || i > rangeToKeep.bottom)) {
          removeRowFromCache(i);
        }
      }
    }

    function invalidate() {
      updateRowCount();
      invalidateAllRows();
      render();
    }

    function invalidateAllRows() {
      if (currentEditor) {
        makeActiveCellNormal();
      }
      for (var row in rowsCache) {
        removeRowFromCache(row);
      }
    }

    function removeRowFromCache(row) {
      var cacheEntry = rowsCache[row];
      if (!cacheEntry) {
        return;
      }
      $canvas[0].removeChild(cacheEntry.rowNode);
      delete rowsCache[row];
      delete postProcessedRows[row];
      renderedRows--;
      counter_rows_removed++;
    }

    function invalidateRows(rows) {
      var i, rl;
      if (!rows || !rows.length) {
        return;
      }
      vScrollDir = 0;
      for (i = 0, rl = rows.length; i < rl; i++) {
        if (currentEditor && activeRow === rows[i]) {
          makeActiveCellNormal();
        }
        if (rowsCache[rows[i]]) {
          removeRowFromCache(rows[i]);
        }
      }
    }

    function invalidateRow(row) {
      invalidateRows([row]);
    }

    function updateCell(row, cell) {
      var cellNode = getCellNode(row, cell);
      if (!cellNode) {
        return;
      }

      var m = columns[cell], d = getDataItem(row);
      if (currentEditor && activeRow === row && activeCell === cell) {
        currentEditor.loadValue(d);
      } else {
        cellNode.innerHTML = d ? getFormatter(row, m)(row, cell, getDataItemValueForColumn(d, m), m, d) : "";
        invalidatePostProcessingResults(row);
      }
    }

    function updateRow(row) {
      var cacheEntry = rowsCache[row];
      if (!cacheEntry) {
        return;
      }

      ensureCellNodesInRowsCache(row);

      for (var columnIdx in cacheEntry.cellNodesByColumnIdx) {
        if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIdx)) {
          continue;
        }

        columnIdx = columnIdx | 0;
        var m = columns[columnIdx],
            d = getDataItem(row),
            node = cacheEntry.cellNodesByColumnIdx[columnIdx];

        if (row === activeRow && columnIdx === activeCell && currentEditor) {
          currentEditor.loadValue(d);
        } else if (d) {
          node.innerHTML = getFormatter(row, m)(row, columnIdx, getDataItemValueForColumn(d, m), m, d);
        } else {
          node.innerHTML = "";
        }
      }

      invalidatePostProcessingResults(row);
    }

    function getViewportHeight() {
      return parseFloat($.css($container[0], "height", true)) -
          parseFloat($.css($container[0], "paddingTop", true)) -
          parseFloat($.css($container[0], "paddingBottom", true)) -
          parseFloat($.css($headerScroller[0], "height")) - getVBoxDelta($headerScroller) -
          (options.showTopPanel ? options.topPanelHeight + getVBoxDelta($topPanelScroller) : 0) -
          (options.showHeaderRow ? options.headerRowHeight + getVBoxDelta($headerRowScroller) : 0);
    }

    function resizeCanvas() {
      if (!initialized) { return; }
      if (options.autoHeight) {
        viewportH = options.rowHeight * (getDataLength() + (options.enableAddRow ? 1 : 0));
      } else {
        viewportH = getViewportHeight();
      }

      numVisibleRows = Math.ceil(viewportH / options.rowHeight);
      viewportW = parseFloat($.css($container[0], "width", true));
      if (!options.autoHeight) {
        $viewport.height(viewportH);
      }

      if (options.forceFitColumns) {
        autosizeColumns();
      }

      updateRowCount();
      handleScroll();
      render();
    }

    function updateRowCount() {
      if (!initialized) { return; }
      numberOfRows = getDataLength() +
          (options.enableAddRow ? 1 : 0) +
          (options.leaveSpaceForNewRows ? numVisibleRows - 1 : 0);

      var oldViewportHasVScroll = viewportHasVScroll;
      // with autoHeight, we do not need to accommodate the vertical scroll bar
      viewportHasVScroll = !options.autoHeight && (numberOfRows * options.rowHeight > viewportH);

      // remove the rows that are now outside of the data range
      // this helps avoid redundant calls to .removeRow() when the size of the data decreased by thousands of rows
      var l = options.enableAddRow ? getDataLength() : getDataLength() - 1;
      for (var i in rowsCache) {
        if (i >= l) {
          removeRowFromCache(i);
        }
      }

      if (activeCellNode && activeRow > l) {
        resetActiveCell();
      }

      var oldH = h;
      th = Math.max(options.rowHeight * numberOfRows, viewportH - scrollbarDimensions.height);
      if (th < maxSupportedCssHeight) {
        // just one page
        h = ph = th;
        n = 1;
        cj = 0;
      } else {
        // break into pages
        h = maxSupportedCssHeight;
        ph = h / 100;
        n = Math.floor(th / ph);
        cj = (th - h) / (n - 1);
      }

      if (h !== oldH) {
        $canvas.css("height", h);
        scrollTop = $viewport[0].scrollTop;
      }

      var oldScrollTopInRange = (scrollTop + offset <= th - viewportH);

      if (th == 0 || scrollTop == 0) {
        page = offset = 0;
      } else if (oldScrollTopInRange) {
        // maintain virtual position
        scrollTo(scrollTop + offset);
      } else {
        // scroll to bottom
        scrollTo(th - viewportH);
      }

      if (h != oldH && options.autoHeight) {
        resizeCanvas();
      }

      if (options.forceFitColumns && oldViewportHasVScroll != viewportHasVScroll) {
        autosizeColumns();
      }
      updateCanvasWidth(false);
    }

    function getVisibleRange(viewportTop, viewportLeft) {
      if (viewportTop == null) {
        viewportTop = scrollTop;
      }
      if (viewportLeft == null) {
        viewportLeft = scrollLeft;
      }

      return {
        top: Math.floor((viewportTop + offset) / options.rowHeight),
        bottom: Math.ceil((viewportTop + offset + viewportH) / options.rowHeight),
        leftPx: viewportLeft,
        rightPx: viewportLeft + viewportW
      };
    }

    function getRenderedRange(viewportTop, viewportLeft) {
      var range = getVisibleRange(viewportTop, viewportLeft);
      var buffer = Math.round(viewportH / options.rowHeight);
      var minBuffer = 3;

      if (vScrollDir == -1) {
        range.top -= buffer;
        range.bottom += minBuffer;
      } else if (vScrollDir == 1) {
        range.top -= minBuffer;
        range.bottom += buffer;
      } else {
        range.top -= minBuffer;
        range.bottom += minBuffer;
      }

      range.top = Math.max(0, range.top);
      range.bottom = Math.min(options.enableAddRow ? getDataLength() : getDataLength() - 1, range.bottom);

      range.leftPx -= viewportW;
      range.rightPx += viewportW;

      range.leftPx = Math.max(0, range.leftPx);
      range.rightPx = Math.min(canvasWidth, range.rightPx);

      return range;
    }

    function ensureCellNodesInRowsCache(row) {
      var cacheEntry = rowsCache[row];
      if (cacheEntry) {
        if (cacheEntry.cellRenderQueue.length) {
          var lastChild = cacheEntry.rowNode.lastChild;
          while (cacheEntry.cellRenderQueue.length) {
            var columnIdx = cacheEntry.cellRenderQueue.pop();
            cacheEntry.cellNodesByColumnIdx[columnIdx] = lastChild;
            lastChild = lastChild.previousSibling;
          }
        }
      }
    }

    function cleanUpCells(range, row) {
      var totalCellsRemoved = 0;
      var cacheEntry = rowsCache[row];

      // Remove cells outside the range.
      var cellsToRemove = [];
      for (var i in cacheEntry.cellNodesByColumnIdx) {
        // I really hate it when people mess with Array.prototype.
        if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(i)) {
          continue;
        }

        // This is a string, so it needs to be cast back to a number.
        i = i | 0;

        var colspan = cacheEntry.cellColSpans[i];
        if (columnPosLeft[i] > range.rightPx ||
          columnPosRight[Math.min(columns.length - 1, i + colspan - 1)] < range.leftPx) {
          if (!(row == activeRow && i == activeCell)) {
            cellsToRemove.push(i);
          }
        }
      }

      var cellToRemove;
      while ((cellToRemove = cellsToRemove.pop()) != null) {
        cacheEntry.rowNode.removeChild(cacheEntry.cellNodesByColumnIdx[cellToRemove]);
        delete cacheEntry.cellColSpans[cellToRemove];
        delete cacheEntry.cellNodesByColumnIdx[cellToRemove];
        if (postProcessedRows[row]) {
          delete postProcessedRows[row][cellToRemove];
        }
        totalCellsRemoved++;
      }
    }

    function cleanUpAndRenderCells(range) {
      var cacheEntry;
      var stringArray = [];
      var processedRows = [];
      var cellsAdded;
      var totalCellsAdded = 0;
      var colspan;

      for (var row = range.top; row <= range.bottom; row++) {
        cacheEntry = rowsCache[row];
        if (!cacheEntry) {
          continue;
        }

        // cellRenderQueue populated in renderRows() needs to be cleared first
        ensureCellNodesInRowsCache(row);

        cleanUpCells(range, row);

        // Render missing cells.
        cellsAdded = 0;

        var metadata = data.getItemMetadata && data.getItemMetadata(row);
        metadata = metadata && metadata.columns;

        // TODO:  shorten this loop (index? heuristics? binary search?)
        for (var i = 0, ii = columns.length; i < ii; i++) {
          // Cells to the right are outside the range.
          if (columnPosLeft[i] > range.rightPx) {
            break;
          }

          // Already rendered.
          if ((colspan = cacheEntry.cellColSpans[i]) != null) {
            i += (colspan > 1 ? colspan - 1 : 0);
            continue;
          }

          colspan = 1;
          if (metadata) {
            var columnData = metadata[columns[i].id] || metadata[i];
            colspan = (columnData && columnData.colspan) || 1;
            if (colspan === "*") {
              colspan = ii - i;
            }
          }

          if (columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx) {
            appendCellHtml(stringArray, row, i, colspan);
            cellsAdded++;
          }

          i += (colspan > 1 ? colspan - 1 : 0);
        }

        if (cellsAdded) {
          totalCellsAdded += cellsAdded;
          processedRows.push(row);
        }
      }

      if (!stringArray.length) {
        return;
      }

      var x = document.createElement("div");
      x.innerHTML = stringArray.join("");

      var processedRow;
      var node;
      while ((processedRow = processedRows.pop()) != null) {
        cacheEntry = rowsCache[processedRow];
        var columnIdx;
        while ((columnIdx = cacheEntry.cellRenderQueue.pop()) != null) {
          node = x.lastChild;
          cacheEntry.rowNode.appendChild(node);
          cacheEntry.cellNodesByColumnIdx[columnIdx] = node;
        }
      }
    }

    function renderRows(range) {
      var parentNode = $canvas[0],
          stringArray = [],
          rows = [],
          needToReselectCell = false;

      for (var i = range.top; i <= range.bottom; i++) {
        if (rowsCache[i]) {
          continue;
        }
        renderedRows++;
        rows.push(i);

        // Create an entry right away so that appendRowHtml() can
        // start populatating it.
        rowsCache[i] = {
          "rowNode": null,

          // ColSpans of rendered cells (by column idx).
          // Can also be used for checking whether a cell has been rendered.
          "cellColSpans": [],

          // Cell nodes (by column idx).  Lazy-populated by ensureCellNodesInRowsCache().
          "cellNodesByColumnIdx": [],

          // Column indices of cell nodes that have been rendered, but not yet indexed in
          // cellNodesByColumnIdx.  These are in the same order as cell nodes added at the
          // end of the row.
          "cellRenderQueue": []
        };

        appendRowHtml(stringArray, i, range);
        if (activeCellNode && activeRow === i) {
          needToReselectCell = true;
        }
        counter_rows_rendered++;
      }

      if (!rows.length) { return; }

      var x = document.createElement("div");
      x.innerHTML = stringArray.join("");

      for (var i = 0, ii = rows.length; i < ii; i++) {
        rowsCache[rows[i]].rowNode = parentNode.appendChild(x.firstChild);
      }

      if (needToReselectCell) {
        activeCellNode = getCellNode(activeRow, activeCell);
      }
    }

    function startPostProcessing() {
      if (!options.enableAsyncPostRender) {
        return;
      }
      clearTimeout(h_postrender);
      h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
    }

    function invalidatePostProcessingResults(row) {
      delete postProcessedRows[row];
      postProcessFromRow = Math.min(postProcessFromRow, row);
      postProcessToRow = Math.max(postProcessToRow, row);
      startPostProcessing();
    }

    function updateRowPositions() {
      for (var row in rowsCache) {
        rowsCache[row].rowNode.style.top = (row * options.rowHeight - offset) + "px";
      }
    }

    function render() {
      if (!initialized) { return; }
      var visible = getVisibleRange();
      var rendered = getRenderedRange();

      // remove rows no longer in the viewport
      cleanupRows(rendered);

      // add new rows & missing cells in existing rows
      if (lastRenderedScrollLeft != scrollLeft) {
        cleanUpAndRenderCells(rendered);
      }

      // render missing rows
      renderRows(rendered);

      postProcessFromRow = visible.top;
      postProcessToRow = Math.min(options.enableAddRow ? getDataLength() : getDataLength() - 1, visible.bottom);
      startPostProcessing();

      lastRenderedScrollTop = scrollTop;
      lastRenderedScrollLeft = scrollLeft;
      h_render = null;
    }

    function handleHeaderRowScroll() {
      var scrollLeft = $headerRowScroller[0].scrollLeft;
      if (scrollLeft != $viewport[0].scrollLeft) {
        $viewport[0].scrollLeft = scrollLeft;
      }
    }

    function handleScroll() {
      scrollTop = $viewport[0].scrollTop;
      scrollLeft = $viewport[0].scrollLeft;
      var vScrollDist = Math.abs(scrollTop - prevScrollTop);
      var hScrollDist = Math.abs(scrollLeft - prevScrollLeft);

      if (hScrollDist) {
        prevScrollLeft = scrollLeft;
        $headerScroller[0].scrollLeft = scrollLeft;
        $topPanelScroller[0].scrollLeft = scrollLeft;
        $headerRowScroller[0].scrollLeft = scrollLeft;
      }

      if (vScrollDist) {
        vScrollDir = prevScrollTop < scrollTop ? 1 : -1;
        prevScrollTop = scrollTop;

        // switch virtual pages if needed
        if (vScrollDist < viewportH) {
          scrollTo(scrollTop + offset);
        } else {
          var oldOffset = offset;
          if (h == viewportH) {
            page = 0;
          } else {
            page = Math.min(n - 1, Math.floor(scrollTop * ((th - viewportH) / (h - viewportH)) * (1 / ph)));
          }
          offset = Math.round(page * cj);
          if (oldOffset != offset) {
            invalidateAllRows();
          }
        }
      }

      if (hScrollDist || vScrollDist) {
        if (h_render) {
          clearTimeout(h_render);
        }

        if (Math.abs(lastRenderedScrollTop - scrollTop) > 20 ||
            Math.abs(lastRenderedScrollLeft - scrollLeft) > 20) {
          if (options.forceSyncScrolling || (
              Math.abs(lastRenderedScrollTop - scrollTop) < viewportH &&
              Math.abs(lastRenderedScrollLeft - scrollLeft) < viewportW)) {
            render();
          } else {
            h_render = setTimeout(render, 50);
          }

          trigger(self.onViewportChanged, {});
        }
      }

      trigger(self.onScroll, {scrollLeft: scrollLeft, scrollTop: scrollTop});
    }

    function asyncPostProcessRows() {
      while (postProcessFromRow <= postProcessToRow) {
        var row = (vScrollDir >= 0) ? postProcessFromRow++ : postProcessToRow--;
        var cacheEntry = rowsCache[row];
        if (!cacheEntry || row >= getDataLength()) {
          continue;
        }

        if (!postProcessedRows[row]) {
          postProcessedRows[row] = {};
        }

        ensureCellNodesInRowsCache(row);
        for (var columnIdx in cacheEntry.cellNodesByColumnIdx) {
          if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIdx)) {
            continue;
          }

          columnIdx = columnIdx | 0;

          var m = columns[columnIdx];
          if (m.asyncPostRender && !postProcessedRows[row][columnIdx]) {
            var node = cacheEntry.cellNodesByColumnIdx[columnIdx];
            if (node) {
              m.asyncPostRender(node, postProcessFromRow, getDataItem(row), m);
            }
            postProcessedRows[row][columnIdx] = true;
          }
        }

        h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
        return;
      }
    }

    function updateCellCssStylesOnRenderedRows(addedHash, removedHash) {
      var node, columnId, addedRowHash, removedRowHash;
      for (var row in rowsCache) {
        removedRowHash = removedHash && removedHash[row];
        addedRowHash = addedHash && addedHash[row];

        if (removedRowHash) {
          for (columnId in removedRowHash) {
            if (!addedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) {
              node = getCellNode(row, getColumnIndex(columnId));
              if (node) {
                $(node).removeClass(removedRowHash[columnId]);
              }
            }
          }
        }

        if (addedRowHash) {
          for (columnId in addedRowHash) {
            if (!removedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) {
              node = getCellNode(row, getColumnIndex(columnId));
              if (node) {
                $(node).addClass(addedRowHash[columnId]);
              }
            }
          }
        }
      }
    }

    function addCellCssStyles(key, hash) {
      if (cellCssClasses[key]) {
        throw "addCellCssStyles: cell CSS hash with key '" + key + "' already exists.";
      }

      cellCssClasses[key] = hash;
      updateCellCssStylesOnRenderedRows(hash, null);

      trigger(self.onCellCssStylesChanged, { "key": key, "hash": hash });
    }

    function removeCellCssStyles(key) {
      if (!cellCssClasses[key]) {
        return;
      }

      updateCellCssStylesOnRenderedRows(null, cellCssClasses[key]);
      delete cellCssClasses[key];

      trigger(self.onCellCssStylesChanged, { "key": key, "hash": null });
    }

    function setCellCssStyles(key, hash) {
      var prevHash = cellCssClasses[key];

      cellCssClasses[key] = hash;
      updateCellCssStylesOnRenderedRows(hash, prevHash);

      trigger(self.onCellCssStylesChanged, { "key": key, "hash": hash });
    }

    function getCellCssStyles(key) {
      return cellCssClasses[key];
    }

    function flashCell(row, cell, speed) {
      speed = speed || 100;
      if (rowsCache[row]) {
        var $cell = $(getCellNode(row, cell));

        function toggleCellClass(times) {
          if (!times) {
            return;
          }
          setTimeout(function () {
                $cell.queue(function () {
                  $cell.toggleClass(options.cellFlashingCssClass).dequeue();
                  toggleCellClass(times - 1);
                });
              },
              speed);
        }

        toggleCellClass(4);
      }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Interactivity

    function handleDragInit(e, dd) {
      var cell = getCellFromEvent(e);
      if (!cell || !cellExists(cell.row, cell.cell)) {
        return false;
      }

      retval = trigger(self.onDragInit, dd, e);
      if (e.isImmediatePropagationStopped()) {
        return retval;
      }

      // if nobody claims to be handling drag'n'drop by stopping immediate propagation,
      // cancel out of it
      return false;
    }

    function handleDragStart(e, dd) {
      var cell = getCellFromEvent(e);
      if (!cell || !cellExists(cell.row, cell.cell)) {
        return false;
      }

      var retval = trigger(self.onDragStart, dd, e);
      if (e.isImmediatePropagationStopped()) {
        return retval;
      }

      return false;
    }

    function handleDrag(e, dd) {
      return trigger(self.onDrag, dd, e);
    }

    function handleDragEnd(e, dd) {
      trigger(self.onDragEnd, dd, e);
    }

    function handleKeyDown(e) {
      trigger(self.onKeyDown, {row: activeRow, cell: activeCell}, e);
      var handled = e.isImmediatePropagationStopped();

      if (!handled) {
        if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
          if (e.which == 27) {
            if (!getEditorLock().isActive()) {
              return; // no editing mode to cancel, allow bubbling and default processing (exit without cancelling the event)
            }
            cancelEditAndSetFocus();
          } else if (e.which == 37) {
            navigateLeft();
          } else if (e.which == 39) {
            navigateRight();
          } else if (e.which == 38) {
            navigateUp();
          } else if (e.which == 40) {
            navigateDown();
          } else if (e.which == 9) {
            navigateNext();
          } else if (e.which == 13) {
            if (options.editable) {
              if (currentEditor) {
                // adding new row
                if (activeRow === getDataLength()) {
                  navigateDown();
                }
                else {
                  commitEditAndSetFocus();
                }
              } else {
                if (getEditorLock().commitCurrentEdit()) {
                  makeActiveCellEditable();
                }
              }
            }
          } else {
            return;
          }
        } else if (e.which == 9 && e.shiftKey && !e.ctrlKey && !e.altKey) {
          navigatePrev();
        } else {
          return;
        }
      }

      // the event has been handled so don't let parent element (bubbling/propagation) or browser (default) handle it
      e.stopPropagation();
      e.preventDefault();
      try {
        e.originalEvent.keyCode = 0; // prevent default behaviour for special keys in IE browsers (F3, F5, etc.)
      }
        // ignore exceptions - setting the original event's keycode throws access denied exception for "Ctrl"
        // (hitting control key only, nothing else), "Shift" (maybe others)
      catch (error) {
      }
    }

    function handleClick(e) {
      if (!currentEditor) {
        // if this click resulted in some cell child node getting focus,
        // don't steal it back - keyboard events will still bubble up
        if (e.target != document.activeElement) {
          setFocus();
        }
      }

      var cell = getCellFromEvent(e);
      if (!cell || (currentEditor !== null && activeRow == cell.row && activeCell == cell.cell)) {
        return;
      }

      trigger(self.onClick, {row: cell.row, cell: cell.cell}, e);
      if (e.isImmediatePropagationStopped()) {
        return;
      }

      if ((activeCell != cell.cell || activeRow != cell.row) && canCellBeActive(cell.row, cell.cell)) {
        if (!getEditorLock().isActive() || getEditorLock().commitCurrentEdit()) {
          scrollRowIntoView(cell.row, false);
          setActiveCellInternal(getCellNode(cell.row, cell.cell), (cell.row === getDataLength()) || options.autoEdit);
        }
      }
    }

    function handleContextMenu(e) {
      var $cell = $(e.target).closest(".slick-cell", $canvas);
      if ($cell.length === 0) {
        return;
      }

      // are we editing this cell?
      if (activeCellNode === $cell[0] && currentEditor !== null) {
        return;
      }

      trigger(self.onContextMenu, {}, e);
    }

    function handleDblClick(e) {
      var cell = getCellFromEvent(e);
      if (!cell || (currentEditor !== null && activeRow == cell.row && activeCell == cell.cell)) {
        return;
      }

      trigger(self.onDblClick, {row: cell.row, cell: cell.cell}, e);
      if (e.isImmediatePropagationStopped()) {
        return;
      }

      if (options.editable) {
        gotoCell(cell.row, cell.cell, true);
      }
    }

    function handleHeaderMouseEnter(e) {
      trigger(self.onHeaderMouseEnter, {
        "column": $(this).data("column")
      }, e);
    }

    function handleHeaderMouseLeave(e) {
      trigger(self.onHeaderMouseLeave, {
        "column": $(this).data("column")
      }, e);
    }

    function handleHeaderContextMenu(e) {
      var $header = $(e.target).closest(".slick-header-column", ".slick-header-columns");
      var column = $header && $header.data("column");
      trigger(self.onHeaderContextMenu, {column: column}, e);
    }

    function handleHeaderClick(e) {
      var $header = $(e.target).closest(".slick-header-column", ".slick-header-columns");
      var column = $header && $header.data("column");
      if (column) {
        trigger(self.onHeaderClick, {column: column}, e);
      }
    }

    function handleMouseEnter(e) {
      trigger(self.onMouseEnter, {}, e);
    }

    function handleMouseLeave(e) {
      trigger(self.onMouseLeave, {}, e);
    }

    function cellExists(row, cell) {
      return !(row < 0 || row >= getDataLength() || cell < 0 || cell >= columns.length);
    }

    function getCellFromPoint(x, y) {
      var row = Math.floor((y + offset) / options.rowHeight);
      var cell = 0;

      var w = 0;
      for (var i = 0; i < columns.length && w < x; i++) {
        w += columns[i].width;
        cell++;
      }

      if (cell < 0) {
        cell = 0;
      }

      return {row: row, cell: cell - 1};
    }

    function getCellFromNode(cellNode) {
      // read column number from .l<columnNumber> CSS class
      var cls = /l\d+/.exec(cellNode.className);
      if (!cls) {
        throw "getCellFromNode: cannot get cell - " + cellNode.className;
      }
      return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
    }

    function getRowFromNode(rowNode) {
      for (var row in rowsCache) {
        if (rowsCache[row].rowNode === rowNode) {
          return row | 0;
        }
      }

      return null;
    }

    function getCellFromEvent(e) {
      var $cell = $(e.target).closest(".slick-cell", $canvas);
      if (!$cell.length) {
        return null;
      }

      var row = getRowFromNode($cell[0].parentNode);
      var cell = getCellFromNode($cell[0]);

      if (row == null || cell == null) {
        return null;
      } else {
        return {
          "row": row,
          "cell": cell
        };
      }
    }

    function getCellNodeBox(row, cell) {
      if (!cellExists(row, cell)) {
        return null;
      }

      var y1 = row * options.rowHeight - offset;
      var y2 = y1 + options.rowHeight - 1;
      var x1 = 0;
      for (var i = 0; i < cell; i++) {
        x1 += columns[i].width;
      }
      var x2 = x1 + columns[cell].width;

      return {
        top: y1,
        left: x1,
        bottom: y2,
        right: x2
      };
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Cell switching

    function resetActiveCell() {
      setActiveCellInternal(null, false);
    }

    function setFocus() {
      $focusSink[0].focus();
    }

    function scrollCellIntoView(row, cell) {
      var colspan = getColspan(row, cell);
      var left = columnPosLeft[cell],
        right = columnPosRight[cell + (colspan > 1 ? colspan - 1 : 0)],
        scrollRight = scrollLeft + viewportW;

      if (left < scrollLeft) {
        $viewport.scrollLeft(left);
        handleScroll();
        render();
      } else if (right > scrollRight) {
        $viewport.scrollLeft(Math.min(left, right - $viewport[0].clientWidth));
        handleScroll();
        render();
      }
    }

    function setActiveCellInternal(newCell, editMode) {
      if (activeCellNode !== null) {
        makeActiveCellNormal();
        $(activeCellNode).removeClass("active");
        if (rowsCache[activeRow]) {
          $(rowsCache[activeRow].rowNode).removeClass("active");
        }
      }

      var activeCellChanged = (activeCellNode !== newCell);
      activeCellNode = newCell;

      if (activeCellNode != null) {
        activeRow = getRowFromNode(activeCellNode.parentNode);
        activeCell = activePosX = getCellFromNode(activeCellNode);

        $(activeCellNode).addClass("active");
        $(rowsCache[activeRow].rowNode).addClass("active");

        if (options.editable && editMode && isCellPotentiallyEditable(activeRow, activeCell)) {
          clearTimeout(h_editorLoader);

          if (options.asyncEditorLoading) {
            h_editorLoader = setTimeout(function () {
              makeActiveCellEditable();
            }, options.asyncEditorLoadDelay);
          } else {
            makeActiveCellEditable();
          }
        }
      } else {
        activeRow = activeCell = null;
      }

      if (activeCellChanged) {
        trigger(self.onActiveCellChanged, getActiveCell());
      }
    }

    function clearTextSelection() {
      if (document.selection && document.selection.empty) {
        document.selection.empty();
      } else if (window.getSelection) {
        var sel = window.getSelection();
        if (sel && sel.removeAllRanges) {
          sel.removeAllRanges();
        }
      }
    }

    function isCellPotentiallyEditable(row, cell) {
      // is the data for this row loaded?
      if (row < getDataLength() && !getDataItem(row)) {
        return false;
      }

      // are we in the Add New row?  can we create new from this cell?
      if (columns[cell].cannotTriggerInsert && row >= getDataLength()) {
        return false;
      }

      // does this cell have an editor?
      if (!getEditor(row, cell)) {
        return false;
      }

      return true;
    }

    function makeActiveCellNormal() {
      if (!currentEditor) {
        return;
      }
      trigger(self.onBeforeCellEditorDestroy, {editor: currentEditor});
      currentEditor.destroy();
      currentEditor = null;

      if (activeCellNode) {
        var d = getDataItem(activeRow);
        $(activeCellNode).removeClass("editable invalid");
        if (d) {
          var column = columns[activeCell];
          var formatter = getFormatter(activeRow, column);
          activeCellNode.innerHTML = formatter(activeRow, activeCell, getDataItemValueForColumn(d, column), column, getDataItem(activeRow));
          invalidatePostProcessingResults(activeRow);
        }
      }

      // if there previously was text selected on a page (such as selected text in the edit cell just removed),
      // IE can't set focus to anything else correctly
      if ($.browser.msie) {
        clearTextSelection();
      }

      getEditorLock().deactivate(editController);
    }

    function makeActiveCellEditable(editor) {
      if (!activeCellNode) {
        return;
      }
      if (!options.editable) {
        throw "Grid : makeActiveCellEditable : should never get called when options.editable is false";
      }

      // cancel pending async call if there is one
      clearTimeout(h_editorLoader);

      if (!isCellPotentiallyEditable(activeRow, activeCell)) {
        return;
      }

      var columnDef = columns[activeCell];
      var item = getDataItem(activeRow);

      if (trigger(self.onBeforeEditCell, {row: activeRow, cell: activeCell, item: item, column: columnDef}) === false) {
        setFocus();
        return;
      }

      getEditorLock().activate(editController);
      $(activeCellNode).addClass("editable");

      // don't clear the cell if a custom editor is passed through
      if (!editor) {
        activeCellNode.innerHTML = "";
      }

      currentEditor = new (editor || getEditor(activeRow, activeCell))({
        grid: self,
        gridPosition: absBox($container[0]),
        position: absBox(activeCellNode),
        container: activeCellNode,
        column: columnDef,
        item: item || {},
        commitChanges: commitEditAndSetFocus,
        cancelChanges: cancelEditAndSetFocus
      });

      if (item) {
        currentEditor.loadValue(item);
      }

      serializedEditorValue = currentEditor.serializeValue();

      if (currentEditor.position) {
        handleActiveCellPositionChange();
      }
    }

    function commitEditAndSetFocus() {
      // if the commit fails, it would do so due to a validation error
      // if so, do not steal the focus from the editor
      if (getEditorLock().commitCurrentEdit()) {
        setFocus();
        if (options.autoEdit) {
          navigateDown();
        }
      }
    }

    function cancelEditAndSetFocus() {
      if (getEditorLock().cancelCurrentEdit()) {
        setFocus();
      }
    }

    function absBox(elem) {
      var box = {
        top: elem.offsetTop,
        left: elem.offsetLeft,
        bottom: 0,
        right: 0,
        width: $(elem).outerWidth(),
        height: $(elem).outerHeight(),
        visible: true};
      box.bottom = box.top + box.height;
      box.right = box.left + box.width;

      // walk up the tree
      var offsetParent = elem.offsetParent;
      while ((elem = elem.parentNode) != document.body) {
        if (box.visible && elem.scrollHeight != elem.offsetHeight && $(elem).css("overflowY") != "visible") {
          box.visible = box.bottom > elem.scrollTop && box.top < elem.scrollTop + elem.clientHeight;
        }

        if (box.visible && elem.scrollWidth != elem.offsetWidth && $(elem).css("overflowX") != "visible") {
          box.visible = box.right > elem.scrollLeft && box.left < elem.scrollLeft + elem.clientWidth;
        }

        box.left -= elem.scrollLeft;
        box.top -= elem.scrollTop;

        if (elem === offsetParent) {
          box.left += elem.offsetLeft;
          box.top += elem.offsetTop;
          offsetParent = elem.offsetParent;
        }

        box.bottom = box.top + box.height;
        box.right = box.left + box.width;
      }

      return box;
    }

    function getActiveCellPosition() {
      return absBox(activeCellNode);
    }

    function getGridPosition() {
      return absBox($container[0])
    }

    function handleActiveCellPositionChange() {
      if (!activeCellNode) {
        return;
      }

      trigger(self.onActiveCellPositionChanged, {});

      if (currentEditor) {
        var cellBox = getActiveCellPosition();
        if (currentEditor.show && currentEditor.hide) {
          if (!cellBox.visible) {
            currentEditor.hide();
          } else {
            currentEditor.show();
          }
        }

        if (currentEditor.position) {
          currentEditor.position(cellBox);
        }
      }
    }

    function getCellEditor() {
      return currentEditor;
    }

    function getActiveCell() {
      if (!activeCellNode) {
        return null;
      } else {
        return {row: activeRow, cell: activeCell};
      }
    }

    function getActiveCellNode() {
      return activeCellNode;
    }

    function scrollRowIntoView(row, doPaging) {
      var rowAtTop = row * options.rowHeight;
      var rowAtBottom = (row + 1) * options.rowHeight - viewportH + (viewportHasHScroll ? scrollbarDimensions.height : 0);

      // need to page down?
      if ((row + 1) * options.rowHeight > scrollTop + viewportH + offset) {
        scrollTo(doPaging ? rowAtTop : rowAtBottom);
        render();
      }
      // or page up?
      else if (row * options.rowHeight < scrollTop + offset) {
        scrollTo(doPaging ? rowAtBottom : rowAtTop);
        render();
      }
    }

    function scrollRowToTop(row) {
      scrollTo(row * options.rowHeight);
      render();
    }

    function getColspan(row, cell) {
      var metadata = data.getItemMetadata && data.getItemMetadata(row);
      if (!metadata || !metadata.columns) {
        return 1;
      }

      var columnData = metadata.columns[columns[cell].id] || metadata.columns[cell];
      var colspan = (columnData && columnData.colspan);
      if (colspan === "*") {
        colspan = columns.length - cell;
      } else {
        colspan = colspan || 1;
      }

      return colspan;
    }

    function findFirstFocusableCell(row) {
      var cell = 0;
      while (cell < columns.length) {
        if (canCellBeActive(row, cell)) {
          return cell;
        }
        cell += getColspan(row, cell);
      }
      return null;
    }

    function findLastFocusableCell(row) {
      var cell = 0;
      var lastFocusableCell = null;
      while (cell < columns.length) {
        if (canCellBeActive(row, cell)) {
          lastFocusableCell = cell;
        }
        cell += getColspan(row, cell);
      }
      return lastFocusableCell;
    }

    function gotoRight(row, cell, posX) {
      if (cell >= columns.length) {
        return null;
      }

      do {
        cell += getColspan(row, cell);
      }
      while (cell < columns.length && !canCellBeActive(row, cell));

      if (cell < columns.length) {
        return {
          "row": row,
          "cell": cell,
          "posX": cell
        };
      }
      return null;
    }

    function gotoLeft(row, cell, posX) {
      if (cell <= 0) {
        return null;
      }

      var firstFocusableCell = findFirstFocusableCell(row);
      if (firstFocusableCell === null || firstFocusableCell >= cell) {
        return null;
      }

      var prev = {
        "row": row,
        "cell": firstFocusableCell,
        "posX": firstFocusableCell
      };
      var pos;
      while (true) {
        pos = gotoRight(prev.row, prev.cell, prev.posX);
        if (!pos) {
          return null;
        }
        if (pos.cell >= cell) {
          return prev;
        }
        prev = pos;
      }
    }

    function gotoDown(row, cell, posX) {
      var prevCell;
      while (true) {
        if (++row >= getDataLength() + (options.enableAddRow ? 1 : 0)) {
          return null;
        }

        prevCell = cell = 0;
        while (cell <= posX) {
          prevCell = cell;
          cell += getColspan(row, cell);
        }

        if (canCellBeActive(row, prevCell)) {
          return {
            "row": row,
            "cell": prevCell,
            "posX": posX
          };
        }
      }
    }

    function gotoUp(row, cell, posX) {
      var prevCell;
      while (true) {
        if (--row < 0) {
          return null;
        }

        prevCell = cell = 0;
        while (cell <= posX) {
          prevCell = cell;
          cell += getColspan(row, cell);
        }

        if (canCellBeActive(row, prevCell)) {
          return {
            "row": row,
            "cell": prevCell,
            "posX": posX
          };
        }
      }
    }

    function gotoNext(row, cell, posX) {
      var pos = gotoRight(row, cell, posX);
      if (pos) {
        return pos;
      }

      var firstFocusableCell = null;
      while (++row < getDataLength() + (options.enableAddRow ? 1 : 0)) {
        firstFocusableCell = findFirstFocusableCell(row);
        if (firstFocusableCell !== null) {
          return {
            "row": row,
            "cell": firstFocusableCell,
            "posX": firstFocusableCell
          };
        }
      }
      return null;
    }

    function gotoPrev(row, cell, posX) {
      var pos;
      var lastSelectableCell;
      while (!pos) {
        pos = gotoLeft(row, cell, posX);
        if (pos) {
          break;
        }
        if (--row < 0) {
          return null;
        }

        cell = 0;
        lastSelectableCell = findLastFocusableCell(row);
        if (lastSelectableCell !== null) {
          pos = {
            "row": row,
            "cell": lastSelectableCell,
            "posX": lastSelectableCell
          };
        }
      }
      return pos;
    }

    function navigateRight() {
      navigate("right");
    }

    function navigateLeft() {
      navigate("left");
    }

    function navigateDown() {
      navigate("down");
    }

    function navigateUp() {
      navigate("up");
    }

    function navigateNext() {
      navigate("next");
    }

    function navigatePrev() {
      navigate("prev");
    }

    function navigate(dir) {
      if (!activeCellNode || !options.enableCellNavigation) {
        return;
      }
      if (!getEditorLock().commitCurrentEdit()) {
        return;
      }
      setFocus();

      var stepFunctions = {
        "up": gotoUp,
        "down": gotoDown,
        "left": gotoLeft,
        "right": gotoRight,
        "prev": gotoPrev,
        "next": gotoNext
      };
      var stepFn = stepFunctions[dir];
      var pos = stepFn(activeRow, activeCell, activePosX);
      if (pos) {
        var isAddNewRow = (pos.row == getDataLength());
        scrollRowIntoView(pos.row, !isAddNewRow);
        scrollCellIntoView(pos.row, pos.cell);
        setActiveCellInternal(getCellNode(pos.row, pos.cell), isAddNewRow || options.autoEdit);
        activePosX = pos.posX;
      } else {
        setActiveCellInternal(getCellNode(activeRow, activeCell), (activeRow == getDataLength()) || options.autoEdit);
      }
    }

    function getCellNode(row, cell) {
      if (rowsCache[row]) {
        ensureCellNodesInRowsCache(row);
        return rowsCache[row].cellNodesByColumnIdx[cell];
      }
      return null;
    }

    function setActiveCell(row, cell) {
      if (!initialized) { return; }
      if (row > getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
        return;
      }

      if (!options.enableCellNavigation) {
        return;
      }

      scrollRowIntoView(row, false);
      scrollCellIntoView(row, cell);
      setActiveCellInternal(getCellNode(row, cell), false);
    }

    function canCellBeActive(row, cell) {
      if (!options.enableCellNavigation || row >= getDataLength() + (options.enableAddRow ? 1 : 0) ||
          row < 0 || cell >= columns.length || cell < 0) {
        return false;
      }

      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
      if (rowMetadata && typeof rowMetadata.focusable === "boolean") {
        return rowMetadata.focusable;
      }

      var columnMetadata = rowMetadata && rowMetadata.columns;
      if (columnMetadata && columnMetadata[columns[cell].id] && typeof columnMetadata[columns[cell].id].focusable === "boolean") {
        return columnMetadata[columns[cell].id].focusable;
      }
      if (columnMetadata && columnMetadata[cell] && typeof columnMetadata[cell].focusable === "boolean") {
        return columnMetadata[cell].focusable;
      }

      if (typeof columns[cell].focusable === "boolean") {
        return columns[cell].focusable;
      }

      return true;
    }

    function canCellBeSelected(row, cell) {
      if (row >= getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
        return false;
      }

      var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
      if (rowMetadata && typeof rowMetadata.selectable === "boolean") {
        return rowMetadata.selectable;
      }

      var columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[columns[cell].id] || rowMetadata.columns[cell]);
      if (columnMetadata && typeof columnMetadata.selectable === "boolean") {
        return columnMetadata.selectable;
      }

      if (typeof columns[cell].selectable === "boolean") {
        return columns[cell].selectable;
      }

      return true;
    }

    function gotoCell(row, cell, forceEdit) {
      if (!initialized) { return; }
      if (!canCellBeActive(row, cell)) {
        return;
      }

      if (!getEditorLock().commitCurrentEdit()) {
        return;
      }

      scrollRowIntoView(row, false);
      scrollCellIntoView(row, cell);

      var newCell = getCellNode(row, cell);

      // if selecting the 'add new' row, start editing right away
      setActiveCellInternal(newCell, forceEdit || (row === getDataLength()) || options.autoEdit);

      // if no editor was created, set the focus back on the grid
      if (!currentEditor) {
        setFocus();
      }
    }


    //////////////////////////////////////////////////////////////////////////////////////////////
    // IEditor implementation for the editor lock

    function commitCurrentEdit() {
      var item = getDataItem(activeRow);
      var column = columns[activeCell];

      if (currentEditor) {
        if (currentEditor.isValueChanged()) {
          var validationResults = currentEditor.validate();

          if (validationResults.valid) {
            if (activeRow < getDataLength()) {
              var editCommand = {
                row: activeRow,
                cell: activeCell,
                editor: currentEditor,
                serializedValue: currentEditor.serializeValue(),
                prevSerializedValue: serializedEditorValue,
                execute: function () {
                  this.editor.applyValue(item, this.serializedValue);
                  updateRow(this.row);
                },
                undo: function () {
                  this.editor.applyValue(item, this.prevSerializedValue);
                  updateRow(this.row);
                }
              };

              if (options.editCommandHandler) {
                makeActiveCellNormal();
                options.editCommandHandler(item, column, editCommand);
              } else {
                editCommand.execute();
                makeActiveCellNormal();
              }

              trigger(self.onCellChange, {
                row: activeRow,
                cell: activeCell,
                item: item
              });
            } else {
              var newItem = {};
              currentEditor.applyValue(newItem, currentEditor.serializeValue());
              makeActiveCellNormal();
              trigger(self.onAddNewRow, {item: newItem, column: column});
            }

            // check whether the lock has been re-acquired by event handlers
            return !getEditorLock().isActive();
          } else {
            // TODO: remove and put in onValidationError handlers in examples
            $(activeCellNode).addClass("invalid");
            $(activeCellNode).stop(true, true).effect("highlight", {color: "red"}, 300);

            trigger(self.onValidationError, {
              editor: currentEditor,
              cellNode: activeCellNode,
              validationResults: validationResults,
              row: activeRow,
              cell: activeCell,
              column: column
            });

            currentEditor.focus();
            return false;
          }
        }

        makeActiveCellNormal();
      }
      return true;
    }

    function cancelCurrentEdit() {
      makeActiveCellNormal();
      return true;
    }

    function rowsToRanges(rows) {
      var ranges = [];
      var lastCell = columns.length - 1;
      for (var i = 0; i < rows.length; i++) {
        ranges.push(new Slick.Range(rows[i], 0, rows[i], lastCell));
      }
      return ranges;
    }

    function getSelectedRows() {
      if (!selectionModel) {
        throw "Selection model is not set";
      }
      return selectedRows;
    }

    function setSelectedRows(rows) {
      if (!selectionModel) {
        throw "Selection model is not set";
      }
      selectionModel.setSelectedRanges(rowsToRanges(rows));
    }


    //////////////////////////////////////////////////////////////////////////////////////////////
    // Debug

    this.debug = function () {
      var s = "";

      s += ("\n" + "counter_rows_rendered:  " + counter_rows_rendered);
      s += ("\n" + "counter_rows_removed:  " + counter_rows_removed);
      s += ("\n" + "renderedRows:  " + renderedRows);
      s += ("\n" + "numVisibleRows:  " + numVisibleRows);
      s += ("\n" + "maxSupportedCssHeight:  " + maxSupportedCssHeight);
      s += ("\n" + "n(umber of pages):  " + n);
      s += ("\n" + "(current) page:  " + page);
      s += ("\n" + "page height (ph):  " + ph);
      s += ("\n" + "vScrollDir:  " + vScrollDir);

      alert(s);
    };

    // a debug helper to be able to access private members
    this.eval = function (expr) {
      return eval(expr);
    };

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Public API

    $.extend(this, {
      "slickGridVersion": "2.1",

      // Events
      "onScroll": new Slick.Event(),
      "onSort": new Slick.Event(),
      "onHeaderMouseEnter": new Slick.Event(),
      "onHeaderMouseLeave": new Slick.Event(),
      "onHeaderContextMenu": new Slick.Event(),
      "onHeaderClick": new Slick.Event(),
      "onHeaderCellRendered": new Slick.Event(),
      "onBeforeHeaderCellDestroy": new Slick.Event(),
      "onHeaderRowCellRendered": new Slick.Event(),
      "onBeforeHeaderRowCellDestroy": new Slick.Event(),
      "onMouseEnter": new Slick.Event(),
      "onMouseLeave": new Slick.Event(),
      "onClick": new Slick.Event(),
      "onDblClick": new Slick.Event(),
      "onContextMenu": new Slick.Event(),
      "onKeyDown": new Slick.Event(),
      "onAddNewRow": new Slick.Event(),
      "onValidationError": new Slick.Event(),
      "onViewportChanged": new Slick.Event(),
      "onColumnsReordered": new Slick.Event(),
      "onColumnsResized": new Slick.Event(),
      "onCellChange": new Slick.Event(),
      "onBeforeEditCell": new Slick.Event(),
      "onBeforeCellEditorDestroy": new Slick.Event(),
      "onBeforeDestroy": new Slick.Event(),
      "onActiveCellChanged": new Slick.Event(),
      "onActiveCellPositionChanged": new Slick.Event(),
      "onDragInit": new Slick.Event(),
      "onDragStart": new Slick.Event(),
      "onDrag": new Slick.Event(),
      "onDragEnd": new Slick.Event(),
      "onSelectedRowsChanged": new Slick.Event(),
      "onCellCssStylesChanged": new Slick.Event(),

      // Methods
      "registerPlugin": registerPlugin,
      "unregisterPlugin": unregisterPlugin,
      "getColumns": getColumns,
      "setColumns": setColumns,
      "getColumnIndex": getColumnIndex,
      "updateColumnHeader": updateColumnHeader,
      "setSortColumn": setSortColumn,
      "setSortColumns": setSortColumns,
      "getSortColumns": getSortColumns,
      "autosizeColumns": autosizeColumns,
      "getOptions": getOptions,
      "setOptions": setOptions,
      "getData": getData,
      "getDataLength": getDataLength,
      "getDataItem": getDataItem,
      "setData": setData,
      "getSelectionModel": getSelectionModel,
      "setSelectionModel": setSelectionModel,
      "getSelectedRows": getSelectedRows,
      "setSelectedRows": setSelectedRows,

      "render": render,
      "invalidate": invalidate,
      "invalidateRow": invalidateRow,
      "invalidateRows": invalidateRows,
      "invalidateAllRows": invalidateAllRows,
      "updateCell": updateCell,
      "updateRow": updateRow,
      "getViewport": getVisibleRange,
      "getRenderedRange": getRenderedRange,
      "resizeCanvas": resizeCanvas,
      "updateRowCount": updateRowCount,
      "scrollRowIntoView": scrollRowIntoView,
      "scrollRowToTop": scrollRowToTop,
      "scrollCellIntoView": scrollCellIntoView,
      "getCanvasNode": getCanvasNode,
      "focus": setFocus,

      "getCellFromPoint": getCellFromPoint,
      "getCellFromEvent": getCellFromEvent,
      "getActiveCell": getActiveCell,
      "setActiveCell": setActiveCell,
      "getActiveCellNode": getActiveCellNode,
      "getActiveCellPosition": getActiveCellPosition,
      "resetActiveCell": resetActiveCell,
      "editActiveCell": makeActiveCellEditable,
      "getCellEditor": getCellEditor,
      "getCellNode": getCellNode,
      "getCellNodeBox": getCellNodeBox,
      "canCellBeSelected": canCellBeSelected,
      "canCellBeActive": canCellBeActive,
      "navigatePrev": navigatePrev,
      "navigateNext": navigateNext,
      "navigateUp": navigateUp,
      "navigateDown": navigateDown,
      "navigateLeft": navigateLeft,
      "navigateRight": navigateRight,
      "gotoCell": gotoCell,
      "getTopPanel": getTopPanel,
      "setTopPanelVisibility": setTopPanelVisibility,
      "setHeaderRowVisibility": setHeaderRowVisibility,
      "getHeaderRow": getHeaderRow,
      "getHeaderRowColumn": getHeaderRowColumn,
      "getGridPosition": getGridPosition,
      "flashCell": flashCell,
      "addCellCssStyles": addCellCssStyles,
      "setCellCssStyles": setCellCssStyles,
      "removeCellCssStyles": removeCellCssStyles,
      "getCellCssStyles": getCellCssStyles,

      "init": finishInitialization,
      "destroy": destroy,

      // IEditor implementation
      "getEditorLock": getEditorLock,
      "getEditController": getEditController
    });

    init();
  }
}(jQuery));
(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "RowSelectionModel": RowSelectionModel
    }
  });

  function RowSelectionModel(options) {
    var _grid;
    var _ranges = [];
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _inHandler;
    var _options;
    var _defaults = {
      selectActiveRow: true
    };

    function init(grid) {
      _options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      _handler.subscribe(_grid.onActiveCellChanged,
          wrapHandler(handleActiveCellChange));
      _handler.subscribe(_grid.onKeyDown,
          wrapHandler(handleKeyDown));
      _handler.subscribe(_grid.onClick,
          wrapHandler(handleClick));
    }

    function destroy() {
      _handler.unsubscribeAll();
    }

    function wrapHandler(handler) {
      return function () {
        if (!_inHandler) {
          _inHandler = true;
          handler.apply(this, arguments);
          _inHandler = false;
        }
      };
    }

    function rangesToRows(ranges) {
      var rows = [];
      for (var i = 0; i < ranges.length; i++) {
        for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
          rows.push(j);
        }
      }
      return rows;
    }

    function rowsToRanges(rows) {
      var ranges = [];
      var lastCell = _grid.getColumns().length - 1;
      for (var i = 0; i < rows.length; i++) {
        ranges.push(new Slick.Range(rows[i], 0, rows[i], lastCell));
      }
      return ranges;
    }

    function getRowsRange(from, to) {
      var i, rows = [];
      for (i = from; i <= to; i++) {
        rows.push(i);
      }
      for (i = to; i < from; i++) {
        rows.push(i);
      }
      return rows;
    }

    function getSelectedRows() {
      return rangesToRows(_ranges);
    }

    function setSelectedRows(rows) {
      setSelectedRanges(rowsToRanges(rows));
    }

    function setSelectedRanges(ranges) {
      _ranges = ranges;
      _self.onSelectedRangesChanged.notify(_ranges);
    }

    function getSelectedRanges() {
      return _ranges;
    }

    function handleActiveCellChange(e, data) {
      if (_options.selectActiveRow && data.row != null) {
        setSelectedRanges([new Slick.Range(data.row, 0, data.row, _grid.getColumns().length - 1)]);
      }
    }

    function handleKeyDown(e) {
      var activeRow = _grid.getActiveCell();
      if (activeRow && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && (e.which == 38 || e.which == 40)) {
        var selectedRows = getSelectedRows();
        selectedRows.sort(function (x, y) {
          return x - y
        });

        if (!selectedRows.length) {
          selectedRows = [activeRow.row];
        }

        var top = selectedRows[0];
        var bottom = selectedRows[selectedRows.length - 1];
        var active;

        if (e.which == 40) {
          active = activeRow.row < bottom || top == bottom ? ++bottom : ++top;
        } else {
          active = activeRow.row < bottom ? --bottom : --top;
        }

        if (active >= 0 && active < _grid.getDataLength()) {
          _grid.scrollRowIntoView(active);
          _ranges = rowsToRanges(getRowsRange(top, bottom));
          setSelectedRanges(_ranges);
        }

        e.preventDefault();
        e.stopPropagation();
      }
    }

    function handleClick(e) {
      var cell = _grid.getCellFromEvent(e);
      if (!cell || !_grid.canCellBeActive(cell.row, cell.cell)) {
        return false;
      }

      var selection = rangesToRows(_ranges);
      var idx = $.inArray(cell.row, selection);

      if (!e.ctrlKey && !e.shiftKey && !e.metaKey) {
        return false;
      }
      else if (_grid.getOptions().multiSelect) {
        if (idx === -1 && (e.ctrlKey || e.metaKey)) {
          selection.push(cell.row);
          _grid.setActiveCell(cell.row, cell.cell);
        } else if (idx !== -1 && (e.ctrlKey || e.metaKey)) {
          selection = $.grep(selection, function (o, i) {
            return (o !== cell.row);
          });
          _grid.setActiveCell(cell.row, cell.cell);
        } else if (selection.length && e.shiftKey) {
          var last = selection.pop();
          var from = Math.min(cell.row, last);
          var to = Math.max(cell.row, last);
          selection = [];
          for (var i = from; i <= to; i++) {
            if (i !== last) {
              selection.push(i);
            }
          }
          selection.push(last);
          _grid.setActiveCell(cell.row, cell.cell);
        }
      }

      _ranges = rowsToRanges(selection);
      setSelectedRanges(_ranges);
      e.stopImmediatePropagation();

      return true;
    }

    $.extend(this, {
      "getSelectedRows": getSelectedRows,
      "setSelectedRows": setSelectedRows,

      "getSelectedRanges": getSelectedRanges,
      "setSelectedRanges": setSelectedRanges,

      "init": init,
      "destroy": destroy,

      "onSelectedRangesChanged": new Slick.Event()
    });
  }
})(jQuery);