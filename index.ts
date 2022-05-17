import { Compilation, Compiler } from 'webpack/types'
import { ConcatSource } from "webpack-sources";

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

    constructor(options?: VerdorVersionPluginOpts) {

        if (typeof options == 'object') {
            if (options.footer) {
                this.footer = true;
            }
        }
        let dependencies = [];
        if (typeof options == 'object' && typeof options.dependencies == 'object' && Array.isArray(options.dependencies)) {
            dependencies = options.dependencies;
        } else {
            try {
                let pkg = require('./package.json');
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
        let pkgs: any = {};

        for (let dep of dependencies) {
            pkgs[dep] = 'unknown';
            try {
                let pkg = require(`./node_modules/${dep}/package.json`);
                if (pkg.hasOwnProperty('version')) {
                    pkgs[dep] = pkg.version
                }
            } catch {
                console.warn(`${PluginName} : Can not read package : ${dep}`);
            }
        }

        let comments = ['/** '];
        if (typeof options == 'object' && options.banner) {
            comments.push(options.banner);
        }
        comments.push(' ');
        const date = new Date();
        comments.push(`build at ${date.getFullYear()}-${fixNum(date.getMonth() + 1)}-${fixNum(date.getDate())} ${fixNum(date.getHours())}:${fixNum(date.getMinutes())}:${fixNum(date.getSeconds())} , `)
        comments.push(` version info : ${JSON.stringify(pkgs)}`);
        comments.push(' */');
        this.comment = comments.join('');
    }



    apply(compiler: Compiler) {
        const cache = new WeakMap();
        compiler.hooks.compilation.tap(PluginName, (compilation: Compilation) => compilation.hooks.processAssets.tap({ name: PluginName, stage: -100 }, () => {
            if (this.comment == '') {
                return;
            }
            for (const chunk of compilation.chunks) {
                if (!chunk.canBeInitial()) {
                    continue;
                }
                for (const file of chunk.files) {
                    console.log(file);
                    compilation.updateAsset(file, old => {
                        let cached = cache.get(old);
                        if (!cached) {
                            const source = this.footer ? new ConcatSource(old, "\n", this.comment) : new ConcatSource(this.comment, "\n", old);
                            cache.set(old, { source, comment: this.comment });
                            return source;
                        }
                        return cached.source;
                    });
                }
            }
        }))

    }
}

