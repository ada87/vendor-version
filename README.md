# Vendor Version Plugin

English | [中文](./README_CN.md)

Vendor Vesion is a plugin for `webpack5`, shows dependencies version info by insert a comment in your compiled code.

Such as:

```javascript
/**  Your Name build at 2022-05-17 14:57:45 ,  version info : {"react":"16.8.0","lodash":"4.17.21"} */
// ... you compiled code here
```

## Install

```bash
npm install --save-dev verdor-version
```

## Usage

edit your `webpack.config.js` file ：

```javascript
const VerdorVersionPlugin = require('verdor-version');

module.exports = {
    ...
    plugins: [new VerdorVersionPlugin()],
}
```

## Options

constructor support a object type param, specify some future of the comment:

| field        | description                                                                                                                                                             | default                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| footer       | `boolean` the comment position, true:foot,false:head                                                                                                                    | false                                                |
| banner       | `string` custom a string in the commment, will show before the version info. <br/>**ATTENTION** this string not safe , not use like "\*\*\/" to block the commont code. | null                                                 |
| dependencies | `string[]` what dependencies version will show on the code.                                                                                                             | use `package.json` -> `dependencies` in your project |
| variable | `string` in webpack production mode, use a variable instead of comment. | "_v_v" |


Demo:

```javascript
const VerdorVersionPlugin = require('verdor-version');

module.exports = {
    ...
    plugins: [new VerdorVersionPlugin({
        banner:'My Name',
        // footer: true,
        dependencies:['lodash','react']

    })],
}
```
