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
| footer       | `boolean` 信息位置：true : 代码下面, 默认生成在编译后的代码上面                                 | false                                            |
| banner       | `string` 自定义字串，拼在信息前面<br/>**说明：** 没有安全判断，不要传 `*/` 之类的字段阻断注释！ | null                                             |
| dependencies | `string[]` 指需要生成版本信息的依赖名称，传入一个数组                                           | 从当前项目 `package.json` 的 dependencies 中获取 |
| variable     | `string` 在 production 模式中, 使用一个变量展示信息.                                            | "\_v_v"                                          |

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
