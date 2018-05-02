var config = {
    dir:        'ltr',
    root:       './',//<%= config.root %>
    src:        '**/*', //<%= config.src %>
    srcs:       '**/**/*', //<%= config.srcs %>
    dev:        'development', //<%= config.dev %>
    pro:        'production', //<%= config.pro %>
    dist:       'dist', //<%= config.dist %>
    assets:     'www',//<%= config.assets %>
    video :     'MP4,SWF,WEBM,ogg,mpg,avi,wmv,mov,rm,flv,ram,mpeg', //<%= config.video %>
    audio :     'mid,midi,wma,aac,wav,ogg,wmv,mp3,rm,ram', //<%= config.audio %>
    fonts:      'ttf,otf,woff,woff2,eot,svg', //<%= config.fonts %>
    images:     'png,jpg,gif,svg', //<%= config.images %>
    js_name:    'scripts',
    banner:     ' /*!\n' +
                ' * <%= pkg.name %>\n' +
                ' * <%= pkg.title %>\n' +
                ' * <%= pkg.url %>\n' +
                ' * @author <%= pkg.author %>\n' +
                ' * @version <%= pkg.version %>\n' +
                ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
                ' */\n',
     jsfiles:   './www/js/**/*.js'
};



//   package.json
//<%= pkg.version %>
//<%= pkg.author %>
//<%= pkg.name %>
//<%= grunt.template.today("yyyy") %>
//<%= pkg.copyright %>
//<%= pkg.title %>
//<%= pkg.description %>
//<%= pkg.url %>
//<%= pkg.license %>

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        config: config,
        pkg: grunt.file.readJSON('package.json'),
        /*------------------------------------------------------------*/
         sass: {
             assets: {
                options: {
                    style: 'compressed', //Output: nested, compact, compressed, expanded.
                    noCache: false,
                    update: true,
                    cacheLocation: '<%= config.root %>cach/sass/'

                },
                files: [{
                    expand: true,
                    cwd: '<%= config.root %>/sass/',
                    src: ['<%= config.src %>.scss'],
                    dest: '<%= config.assets %>/css/',
                    ext: '.css'
        }]
             }
        },
         /*------------------------------------------------------------*/
           svgmin: {
               assets: {
                options: {
                    plugins: [
                        {removeViewBox: false},
                        {removeUselessStrokeAndFill: false },
                        {removeEmptyAttrs: true }
                    ]
                },
                files: [{
                    expand: true,
                    cwd: './<%= config.assets %>/img',
                    src: ['<%= config.src %>.svg'],
                    dest: '<%= config.assets %>/img/',
                  }]
            }
        },  uglify: {
                options: {
                  mangle: false
                },
                my_target: {
                  files: {
                    '<%= config.assets %>/js/cashier-app.min.js': ['<%= config.root %>/js/cashier-app.js']
                  }
                }
              },

         /*------------------------------------------------------------*/

         /*------------------------------------------------------------*/
           watch: {

               options: {
                         dateFormat: function(time) {

        grunt.log.writeln('----| Waiting for more changes |----');
    },
                   livereload: true,
                    },
               configFiles: {
                        files: [ 'Gruntfile.js' ],
                        options: {
                          reload: true
                        }
                      },
                scripts: {
                    files: ['<%= config.root %>/js/<%= config.src %>.js'],
                    tasks: ['uglify'],
                    options: {
                        spawn: false,
                    },
                },
                css: {
                    files: ['<%= config.root %>/sass/<%= config.src %>.scss'],
                    tasks: ['sass:assets'],
                    options: {
                        spawn: false,
                        livereload: true
                    },
                },
//                images: {
//                    files: ['<%= config.assets %>/images/<%= config.src %>.{png,jpg,gif}'],
//                    tasks: ['imagemin:assets'],
//                    options: {
//                        spawn: false,
//                        livereload: true
//                    }
//                },
               svg :{
                    files: ['<%= config.assets %>/img/<%= config.src %>.svg'],
                    tasks: ['svgmin:assets'],
                    options: {
                        spawn: false,
                        livereload: true
                    }
               }
            }
  /*------------------------------------------------------------*/
    }); // grunt.initConfig End
    grunt.registerTask('default', ['sass','svgmin']);


}
