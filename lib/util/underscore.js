var _ = require('underscore');

_.templateSettings = {
	evaluate    : /\{%([\s\S]+?)%\}/g,
	interpolate : /\{\{([\s\S]+?)\}\}/g,
	escape      : /\{-([\s\S]+?)\}/g
};

module.exports = _ ;