import { Compilation, Compiler } from 'webpack/types'
import { ConcatSource } from "webpack-sources";
import { resolve } from 'path';
import { Compilation as c } from 'webpack';
const PluginName = 'VerdorVersionPlugin';

/**
 * Plugin Options
*/
type VerdorVersionPluginOpts = {
    /**
     * the position of comment. 
     * default on the head of code.
     * use `footer:false`  to set tail of code.
    */
    footer?: boolean;
    /**
     * what dependencies version will show on the code.
     * default use package.json -> dependencies
     * 
     * to specify use a string array, 
     * like :`dependencies: ['lodash', 'react']`
    */
    dependencies?: string[],
    /**
     * if specify a banner string, 
     * it will show before the version info.
     * 
     * ATTENTION :
     * this string not safe , not use like  "**\/" to block the commont code.
    */
    banner?: string;
    /**
     * variable name.
     * in production mode , webpack will clean all comments;
     * so , user a variable store the version info
     * default : _v_v
    */
    variable?: string;
}


const fixNum = num => {
    if (num >= 10) {
        return num;
    }
    return `0${num}`;
}

export = class {


    footer = false;
    comment = '';
    variable = '_v_v';
    version: any = {};

    constructor(options?: VerdorVersionPluginOpts) {
        let projectRoot = __dirname;
        let idx = projectRoot.indexOf('node_modules');
        if (idx >= 0) {
            projectRoot = projectRoot.substring(0, idx);
        }
        if (typeof options == 'object' && options.footer) {
            this.footer = true;
        }
        if (typeof options == 'object' && typeof options.variable == 'string') {
            this.variable = options.variable;
        }

        let dependencies = [];
        if (typeof options == 'object' && typeof options.dependencies == 'object' && Array.isArray(options.dependencies)) {
            dependencies = options.dependencies;
        } else {
            try {
                let pkg = require(resolve(projectRoot, './package.json'));
                if (typeof pkg.dependencies == 'object') {
                    dependencies = Object.keys(pkg.dependencies);
                }
            } catch {
                console.warn('can not read package');
            }
        }
        if (dependencies.length == 0) {
            return;
        }

        for (let dep of dependencies) {
            this.version[dep] = 'unknown';
            try {
                let pkg = require(resolve(projectRoot, `./node_modules/${dep}/package.json`));
                if (pkg.hasOwnProperty('version')) {
                    this.version[dep] = pkg.version
                }
            } catch {
                console.warn(`${PluginName} : Can not read package : ${dep}`);
            }
        }

        let comments = [];
        if (typeof options == 'object' && options.banner) {
            comments.push(options.banner);
        }
        const date = new Date();
        comments.push(`build at ${date.getFullYear()}-${fixNum(date.getMonth() + 1)}-${fixNum(date.getDate())} ${fixNum(date.getHours())}:${fixNum(date.getMinutes())}:${fixNum(date.getSeconds())}`)


        this.comment = comments.join('');
    }



    apply(compiler: Compiler) {

        const cache = new WeakMap();
        let isPro = compiler.options.mode == 'production';
        let comment = '';
        if (isPro) {
            comment = `;let ${this.variable}=${JSON.stringify({ b: this.comment, v: this.version })};`
        } else {
            comment = `/** ${this.comment} , version info: ${JSON.stringify(this.version)}*/`
        }

        compiler.hooks.compilation.tap(
            PluginName,
            (compilation: Compilation) => compilation.hooks.processAssets.tap({ name: PluginName, stage: c.PROCESS_ASSETS_STAGE_ADDITIONAL }, () => {

                for (const chunk of compilation.chunks) {
                    if (!chunk.canBeInitial()) continue;
                    for (const file of chunk.files) {
                        compilation.updateAsset(file, old => {
                            let cached = cache.get(old);
                            if (!cached || cached.comment !== comment) {
                                const source = this.footer ? new ConcatSource(old, "\n", comment) : new ConcatSource(comment, "\n", old);
                                cache.set(old, { source, comment });
                                return source;
                            }
                            return cached.source;
                        });
                    }
                }
            }));


    }
}

