const { src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const imagemin = require("gulp-imagemin");
const sass = require("gulp-sass")(require("sass"));
const pug = require("gulp-pug");
const Fs = require("fs");

// read and parse the json file
const data = JSON.parse(Fs.readFileSync('./data.json'));


// start browsersync server
function browsersync() {
    browserSync.init({
        server: {
            baseDir: "build",
        },
    });
}

// build pug to html
function html() {
    return src("src/index.pug")
        .pipe(
            pug({
                pretty: true,
                locals: data || {},
                
            })
        )
        .pipe(dest("build"))
        .pipe(browserSync.stream());
}

// compile sass and inject into browser sync
function css() {
    return src("src/assets/styles/style.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 2 versions"],
                grid: "autoplace",
            })
        )
        .pipe(cleanCSS())
        .pipe(dest("build/assets/styles"))
        .pipe(browserSync.stream());
}

// build images for browser sync
function images() {
    return src("src/assets/images/**/*")
        .pipe(imagemin())
        .pipe(dest("build/assets/images"))
        .pipe(browserSync.stream());
}

// build fonts assets
function fonts() {
    return src("src/assets/fonts/**/*")
        .pipe(dest("build/assets/fonts"))
        .pipe(browserSync.stream());
}

// clear all build
function clear() {
    return del("build", { force: true });
}

// starts watching scss files for changes
function startWatch() {
    watch("src/**/*.pug", html);
    watch("src/assets/styles/**/*.scss", css);
    watch("src/assets/images/**/*", images);
    watch("src/assets/fonts/**/*", fonts);
}

// build the browser sync series
exports.dev = parallel(browsersync, startWatch, html, fonts, css);
exports.build = series(clear, parallel(html, images, fonts, css));
exports.default = parallel(browsersync, startWatch, html, images, fonts, css);
