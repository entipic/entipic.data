/*eslint no-underscore-dangle:0*/
'use strict';

const utils = require('./utils');
const _ = utils._;
const url = require('url');

exports.normalizeEntity = function(data) {
	data = _.pick(data, 'name', 'uniqueName', 'id', 'type', 'pictureId', 'country', 'pictureHost', 'description', 'wikiName', 'wikiId', 'refIP', 'refHost', 'popularity', 'createdAt', 'types', 'props', 'pictures', 'lang');

	data.id = data.id || utils.shortid();
	data.uniqueName = utils.uniqueName(data.uniqueName || data.name).replace(/\s/g, '-');

	data._id = data.id;
	delete data.id;

	if (data.description) {
		data.description = data.description.substr(0, 400);
	}

	data.pictures = data.pictures || [];
	if (data.pictureId) {
		data.pictures.push(data.pictureId);
	}
	data.pictures = _.uniq(data.pictures);
	data.pictures = data.pictures.filter(pid => {
		return pid && pid.length;
	});

	data = utils.clearObject(data);
	return data;
};

exports.normalizeUniqueName = function(data) {
	data = _.pick(data, 'name', 'entityId', 'pictureId', 'country', 'lang', 'wikiId', 'wikiName', 'status', 'popularity', 'createdAt');

	data.uniqueName = utils.uniqueName(data.name);

	data.locale = utils.locale(data.lang, data.country);

	data.name = utils.standardText(data.name, data.lang);

	data._id = utils.uniqueNameId(data.uniqueName, data.lang, data.country);

	data = utils.clearObject(data);
	return data;
};

exports.uniqueNameId = utils.uniqueNameId;
exports.uniqueName = utils.uniqueName;
exports.locale = utils.locale;

exports.normalizePicture = function(data) {
	data = _.pick(data, 'url', 'host', 'dHash', 'createdAt');
	data._id = exports.pictureId(data);
	data.host = data.host || url.parse(data.url).host.replace(/^www\./, '');

	data = utils.clearObject(data);
	return data;
};

exports.normalizeUnknownName = function(data) {
	data = _.pick(data, 'name', 'country', 'lang', 'ip', 'host', 'status');
	data.name = data.name.replace(/[_\s]/g, ' ').replace(/ {2,}/g, ' ').trim();
	data.uniqueName = utils.uniqueName(data.name);
	data.lang = data.lang.toLowerCase();
	data.locale = utils.locale(data.lang, data.country);
	data._id = utils.md5([data.locale, data.uniqueName].join('|'));

	data = utils.clearObject(data);
	return data;
};

exports.pictureId = function(picture) {
	return utils.md5(picture.dHash);
};
