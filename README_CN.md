# Vendor Version Plugin

[English](./README.md) | 中文

Vendor Vesion 是一个 `Webpack5` 插件，可以在编译后的代码上插入一段注释，用于记录当前依赖第三方库的版本号信息。

例如：

```javascript
/**  build at 2022-05-17 14:57:45 ,  version info : {"react":"16.8.0","lodash":"4.17.21"} */
// ... 你的代码
```

## 安装

```bash
npm install --save-dev verdor-version
```

## 使用

在 `webpack.config.js` 里面加入：

```javascript
const VerdorVersionPlugin = require('verdor-version');

module.exports = {
    ...
    plugins: [new VerdorVersionPlugin()],
}
```

## 参数

构造方法支持传入一个对象作为参数，用于设定注释信息的一些特性：

| 名称         | 说明                                                                                            | 默认                                             |
| ------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| footer       | boolean 注释是否生成在代码的尾部,默认生成在头部                                                 | false                                            |
| banner       | string 在注释前加入一些自定义字串<br/>**说明：** 没有安全判断，不要传 `*/` 之类的字段阻断注释！ | null                                             |
| dependencies | string[] 指定生成哪些依赖的版本号信息，传入一个数组                                             | 从当前项目 `package.json` 的 dependencies 中获取 |

示例：

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
