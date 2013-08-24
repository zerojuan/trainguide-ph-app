'use strict';

var mountFolder = function(connect, dir){
	return connect.static(require('path').resolve(dir));
}

module.exports = function(grunt){
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	var yeomanConfig = {
		app : 'public',
		dist : 'dist'
	}

	try{
		yeomanConfig.app = require('./components.json').appPath || yeomanConfig.app;
	}catch(e){}

	grunt.initConfig({
		yeoman: yeomanConfig,
		clean: {
			dist: {
				files : [{
					dot: true,
					src: [
						'.tmp',
						'<%= yeoman.dist %>/',
						'!<%= yeoman.dist %>/.git*'
					]
				}]
			},
			server: '.tmp'
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/scripts/{,&/}*.js'
			]
		}
	})
}