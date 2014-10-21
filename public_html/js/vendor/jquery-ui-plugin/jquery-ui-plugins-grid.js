/*
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
})(jQuery);