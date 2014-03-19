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
			_actions:null,
			_config:null,
			_recordActions:null,
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
					this.undelegateEvents();
					this.delegateEvents();
					for(var i in this._actions){
						var action = this._actions[i];
						var method = action["action"];
						if (!_.isFunction(method)) method = this[action["action"]];
						if (!method) continue;
						var action = this._actions[i];
						var eventName = action['event'], selector = action['className'];
						method = _.bind(method, this);
						eventName += '.delegateEvents' + this.cid;
						if (selector === '') {
							this.$el.on(eventName, method);
						} else {
							this.$el.on(eventName, selector, method);
						}
					}
					for (var rac in this._recordActions){
						var recordAction = this._recordActions[rac];
						var className;
						switch(recordAction["name"]){
							case "delete":
							{
								className = ".btn-record-delete";
								break;
							}
							case "detail":
							{
								className = ".btn-record-detail";
								break;
							}
							case "edit":
							{
								className = ".btn-record-edit";
								break;
							}
						}
						var method = recordAction["action"];
						if (!_.isFunction(method)) method = this[action["action"]];
						if (!method) continue;
						var action = this._actions[i];
						var eventName = recordAction['event'], selector = className;
						method = _.bind(method, this);
						eventName += '.delegateEvents' + this.cid;
						if (selector === '') {
							this.$el.on(eventName, method);
						} else {
							this.$el.on(eventName, selector, method);
						}
					}
				}
				return this;
			},
			_renderNoPermissionView:function(){
				//render 403 page
			},
			_renderDataGridConfig:function(){
				var columns = [];
				var self = this;
				var columnConfig = this._getColumnsConfig();
				for (var i in columnConfig){
					var column = columnConfig[i];
					if(self._canDisplayColumn(column)){
						var field = {};
						if(column['field']){
							field.name = column['field'];
						}
						if(column['displayName']){
							field.label = column['displayName'];
						}
						if(column['className']){
							field.className = column['className'];
						}
						var type = column['className'];
						switch(type){
							case "link":
							{

								field.cell = BackGrid.UriCell.extend({
									render: function () {
										this.$el.empty();
										var rawValue = this.model.get("_id");
										var formattedValue = this.formatter.fromRaw(rawValue, this.model);
										this.$el.append($("<a>", {
											tabIndex: -1,
											href: "#!/backend/"+self.app+column['url'].split(":")[0]+rawValue,
											title: ""
										}).text(this.model.get("name")));
										this.delegateEvents();
										return this;
									}
								});
								break;
							}
							case "recordActions":
							{
								if(self._recordActions.length > 0){
									field.cell = BackGrid.UriCell.extend({
										render:function(){
											this.$el.empty();
											var model = this.model;
											var value = model.get("_id");
											var html = "<div class='tooltip-area'>";
											for (var rac in self._recordActions){
												var recordAction = self._recordActions[rac];
												if(openbiz.session.me.hasPermission(recordAction['permission']))
												{
													var className;
													switch(recordAction["name"]){
														case "delete":
														{
															className = "btn-record-delete";
															break;
														}
														case "detail":
														{
															className = "btn-record-detail";
															break;
														}
														case "edit":
														{
															className = "btn-record-edit";
															break;
														}
													}
													html = html + "<a href='#' record-id='{{ id }}' class='btn btn-default"+ className+"'>"+recordAction["displayName"]+"</a>"
												}
											}
											html = html + "</div>";
											this.$el.html( _.template(
												html,
												{id:value},
												{interpolate: /\{\{(.+?)\}\}/g}) );
											this.delegateEvents();
											return this;
										}
									});
								}
								break;
							}
							default:{
								field.cell = "String";
								break;
							}
						}
					}
					columns.push(field);
				}

				if(this._getFilterConfig()){
					var filter = new Backgrid.Extension.ServerSideFilter({
						collection: this.collection,
						name: "query",
						placeholder: ""
					});
					$(this.el).find('.data-grid').append(filter.render().el);
				}

				var grid = new Backgrid.Grid({
					columns:columns,
					collection: this.collection,
					className: 'backgrid table table-striped table-bordered text-center',
					emptyText: 'emptyText '
				})
				$(this.el).find('.data-grid').append(grid.render().el);

				if(this._getPaginatorConfig()){
					var paginator = new Backgrid.Extension.Paginator({
						windowSize: 10,
						slideScale: 0.5,
						goBackFirstOnSort: true,
						collection: this.collection,
						className:'pagination'
					});
					$(this.el).find('.data-grid').append(paginator.render().el);
				}

				//pull data from server now
				this.collection.fetch();
			},
			_canDisplayView:function(){

			},
			_canDisplayColumn:function(column){
				if(column['permission'])
					return openbiz.session.me.hasPermission(column['permission']);
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