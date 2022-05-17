# Vendor Version Plugin

English | [中文](./README_CN.md)

Vendor Vesion is a plugin for `webpack5`, shows dependencies version info by insert a comment in your code.

## Install

```bash
npm install --save-dev verdor-version
```

## Usage

```javascript
// webpack.config.js
const VerdorVersionPlugin = require('verdor-version');

module.exports = {
    ...
    plugins: [new VerdorVersionPlugin()],
}
```

## Options

constructor support a object type param, specify some future of the comment:

| field        | description                                                                                                                                                             | default                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| footer       | `boolean` the comment position, true:foot,false:head                                                                                                                    | false                                            |
| banner       | `string` custom a string in the commment, will show before the version info. <br/>**ATTENTION** this string not safe , not use like "\*\*\/" to block the commont code. | null                                             |
| dependencies | `string[]` what dependencies version will show on the code.                                                                                                             | 从当前项目 `package.json` 的 dependencies 中获取 |

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
