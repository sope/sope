# Sope 项目

[[English](README.md)] | [[简体中文](README_cn.md)]

## 简介

Sope 是一个纯 esm 的组合包项目，包含了实用的工具库。

- jsonai: json 相关的工具库, 解决解析 json 时大数值错误的问题
- markv: 灵感来自于 `react-markdown`, 是 vue 3 版本的 markdown 渲染 & 解析工具库, `unified` 、`remark`、`rehype`、`vue` 实现
- vjit: 实用工具库，包含:
  - `disposeable`: 可释放的对象
  - `event`: CustomEvent 事件通讯
  - `logger`: 漂亮的浏览器控制台日志
  - `stream`: `streamToAsyncIterable` 流转异步迭代器工具方法
  - `ipc`: 采用事件通讯、`Request`、`Respose` 标准机制实现浏览器端端 `ipc` 通讯 (serve, fetch)
