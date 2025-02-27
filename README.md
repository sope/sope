# Sope Project

## Introduction

Sope is a pure ESM composite package project that includes practical utility libraries.

- jsonai: A JSON-related utility library that solves the issue of large number errors when parsing JSON.
- markv: Inspired by `react-markdown`, it is a Vue 3 version of the markdown rendering & parsing tool library, implemented with `unified`, `remark`, `rehype`, and `vue`.
- vjit: A practical utility library that includes:
  - `disposeable`: Disposable objects.
  - `event`: CustomEvent for event communication.
  - `logger`: Beautiful browser console logs.
  - `stream`: `streamToAsyncIterable` tool method for converting streams to async iterators.
  - `ipc`: Implements browser-side `ipc` communication using event communication, `Request`, and `Response` standard mechanisms (serve, fetch).