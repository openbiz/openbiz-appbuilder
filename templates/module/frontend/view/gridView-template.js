"use strict";
define(['',''],
	function(templateData,dataCollection){
		return openbiz.View.extend({
			app: 'xxx',
			module:'xx',
			name: 'xxx',
			el: '#main',
			collection:null,
			_columnsConfig:null,
			_filterConfig:null,
			_paginatorConfig:null,
			_config:null,
			initialize:function(){
				openbiz.View.prototype.initialize.call(this);
				this.template = _.template(templateData);
				this.collection = new dataCollection();
			},
			render:function(){
				$(this.el).html(this.template(this.locale));
				$(window).off('resize');
				openbiz.ui.update($(this.el));
				// if has no permission
				{
					this._renderNoPermissionView();
				}
				//else  has permission
				{
					this._renderDataGridConfig();
				}
				return this;
			},
			_renderNoPermissionView:function(){

			},
			_renderDataGridConfig:function(){
				var columns = [];
				var self = this;
				var columnConfig = this._getColumnsConfig();
				for (var i in columnConfig){
					var column = columnConfig[i];
					if(self._canDisplayColumn(column)){
						
					}
				}

				//init the data grid
				var grid = new Backgrid.Grid({
					columns:columns,
					collection: this.collection,
					className: 'backgrid table table-striped table-bordered text-center',
					emptyText: 'emptyText '
				})
				$(this.el).find('.data-grid').append(grid.render().el);

				//init the paginator
				var paginator = new Backgrid.Extension.Paginator({
					windowSize: 10,
					slideScale: 0.5,
					goBackFirstOnSort: true,
					collection: this.collection,
					className:'pagination'
				});
				$(this.el).find('.data-grid').append(paginator.render().el);

				//pull data from server now
				this.collection.fetch();
			},
			_canDisplayView:function(){

			},
			_canDisplayColumn:function(column){
				return true;
			},
			_getColumnsConfig:function(){
				return this._columnsConfig;
			},
			_getFilterConfig:function(){
				return this._filterConfig;
			},
			_getPaginatorConfig:function(){
				return this._paginatorConfig;
			},
			showRecordAddView:function(event){
				event.preventDefault();
			},
			showRecordEidtView:function(event){
				event.preventDefault();
			},
			showRecordDeleteConfirm:function(event){
				event.preventDefault();
			}
		});
	});