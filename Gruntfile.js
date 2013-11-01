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
		yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
	}catch(e){}

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		yeoman: yeomanConfig,
		less: {
			dist: {
				options: {
					paths: ['<%= yeoman.app %>/public/stylesheets'],
					yuicompress: true
				}
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},
		shell: {
			'add' : {
				command: 'git add *'
			},
			'commit': {
				command: 'git commit -a -m "v<%= pkg.version %>"'
			},
			'checkout' : {
				command: 'git checkout deploy'
			},
			'merge': {
				command: 'git merge -s ours master'
			},
			'deploy': {
				command: 'git push heroku deploy'
			},
			'back': {
				command: 'git checkout master'
			}
		},
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
				'<%= yeoman.app %>/scripts/{,*/}*.js'
			]
		},
		concat: {
			dist: {
				files: {
					'<%= yeoman.dist %>/scripts/scripts.js': [
						'.tmp/scripts/{,*/}*.js',
						'<%= yeoman.app %>/scripts/*.js',
						'<%= yeoman.app %>/scripts/controllers/{,*/}*.js',
						'<%= yeoman.app %>/scripts/filters/{,*/}*.js',
						'<%= yeoman.app %>/scripts/directives/{,*/}*.js',
						'<%= yeoman.app %>/scripts/services/{,*/}*.js',
//						'<%= yeoman.app %>/scripts/standalone/{,*/}*.js'
//						'<%= yeoman.app %>/scripts/{,*/}*.js'
					]
				}
			}
		},
		rev: {
			dist: {
				files: {
					src: [
						'<%= yeoman.dist %>/scripts/{,*/}*.js',
						'<%= yeoman.dist %>/stylesheets/{,*/}*.css',
						'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg,ico}',
						'<%= yeoman.dist %>/stylesheets/fonts/*'
					]
				}
			}
		},
		useminPrepare: {
			html: '<%= yeoman.app %>/index.html',
			options: {
				dest: '<%= yeoman.dist %>'
			}
		},
		usemin: {
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/stylesheets/{,*/}*.css'],
			options: {
				dirs : ['<%= yeoman.dist %>']
			}
		},
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/images',
					src: '{,*/}*.{png, jpg, jpeg, ico}',
					dest: '<%= yeoman.dist %>/images'
				}]
			}
		},
		cssmin: {
			// By default, your `index.html` <!-- Usemin Block --> will take care of
			// minification. This option is pre-configured if you do not wish to use
			// Usemin blocks.
			dist: {
			   files: {
			     '<%= yeoman.dist %>/stylesheets/main.css': [
			       '.tmp/stylesheets/{,*/}*.css',
			       '<%= yeoman.app %>/stylesheets/{,*/}*.css'
			     ]
			   }
			}
		},
		htmlmin: {
			dist: {
				options: {
					/*removeCommentsFromCDATA: true,
					 // https://github.com/yeoman/grunt-usemin/issues/44
					 //collapseWhitespace: true,
					 collapseBooleanAttributes: true,
					 removeAttributeQuotes: true,
					 removeRedundantAttributes: true,
					 useShortDoctype: true,
					 removeEmptyAttributes: true,
					 removeOptionalTags: true*/
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>',
					src: '*.html',
					dest: '<%= yeoman.dist %>'
				}]
			}
		},
		// Put files not handled in other tasks here
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'components/**/*',
						'images/{,*/}*.{gif,webp,svg,jpg,ico}',
						'stylesheets/fonts/*',
						'data/**/*'
					]
				}, {
					expand: true,
					cwd: '.tmp/images',
					dest: '<%= yeoman.dist %>/images',
					src: [
						'generated/*'
					]
				}]
			}
		},
		cdnify: {
			dist: {
				html: ['<%= yeoman.dist %>/*.html']
			}
		},
		ngmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.dist %>/scripts',
					src: ['./*.js', 'controllers/{,*/}*.js', 'directives/{,*/}*.js', 'services/{,*/}*.js', 'standalone/{,*/}*.js'],
					dest: '<%= yeoman.dist %>/scripts'
				}]
			}
		},
		uglify: {
			dist: {
				files: {
					'<%= yeoman.dist %>/scripts/scripts.js': [
						'<%= yeoman.dist %>/scripts/scripts.js'
					]
				}
			}
		}
	});

	grunt.registerTask('build', [
		'clean:dist',
		'useminPrepare',
		'less',
		'concat',
		'copy',
		'cdnify',
		'ngmin',
		'cssmin',
		'imagemin',
//		'uglify',
//		'rev',
		'usemin'
	]);

	grunt.registerTask('test', [
		'clean:dist',
		'karma'
	]);

	grunt.registerTask('deploy', [
		'build',
		'shell:add',
		'shell:commit',
		'shell:checkout',
		'shell:merge',
		'shell:back'
	]);

	grunt.registerTask('default', [
		'jshint',
		'test',
		'build'
	])
}