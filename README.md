# Markdown Links

## Index

* [1. Introduction](#1-introduction)
* [2. Summary](#2-summary)
* [3. Instructions](#3-instructions)

***

## 1. Introduction

[Markdown](https://en.wikipedia.org/wiki/Markdown) is a lightweight markup 
language very popular among programmers. It is used in many platforms that
manipulate text (GitHub, forums, blogs, etc.) and it's very common to find
files in this format in any repository (the traditional `README.md`, to begin with).

`Markdown` files usually contain _links_ that may be broken, or that might
just not be valid any longer, harming the value of the information there 
presented.

An open source community proposed to Laboratoria to create a tool, using
[Node.js](https://nodejs.org/), that reads and analyse `Markdown` files,
to verify the files which contain links and show some statistics.

![md-links](https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg)

## 2. Summary

In this project, a command line interface (CLI) tool was created, as well as its
library in Javascript.

Staying away from the browser to build a program to be executed through Node.js. 
Learning about processes (`process.env`, `process.argv`, ...), how to interact
with file systems, make http queries, etc.

[Node.js](https://nodejs.org/pt-br/) is an execution environment for JavaScript
built with [Chrome's V8 Javascript engine](https://developers.google.com/v8/). 
It will allow us to run JavaScript in our operational system, baing it in our 
computer or on a server, which opens the gates to allow us to interact with 
systems, files, networks, etc.

Developing your own library is an essential experience to any developer, compelling
you to think about the interface (API) of your _modules_ and how it will be used by
other developers.

## 3. Instructions
### 3.1 Install
To install this API, you should provide your command line the following command:

`npm i @silversantos/md-links`

This library requires a Node.js version that equals or is upper than v18.16.0.

### 3.2 Commands
After installing, you can run it with the folllowing commands:

#### 3.2.1 To read a file or directory

`md-links directory-or-file.md`

With this command, you will receive a list of all the links containing in you file or directory.

![Example with directory](https://github.com/silversantos/SAP009-md-links/blob/main/img/dir.png)

![Example with file.md](https://github.com/silversantos/SAP009-md-links/blob/main/img/dir-text-with-links.png)

#### 3.2.2 To verify which links are valid
Run `md-links directory-or-file.md --validate` to receive the http querie response. It will return you in your command line a list of each link in the directory or file and tell you if the links are ok or not.

![Example --validate](https://github.com/silversantos/SAP009-md-links/blob/main/img/validate.png)

#### 3.2.3 To receive statistics
The command `md-links directory-or-file.md --stats` will provide you statistics of how many links are there in the given directory or file and how many of them are unique.

![Example --stats](https://github.com/silversantos/SAP009-md-links/blob/main/img/stats.png)

If you'd like to verify how many of them are broken, you may run  `md-links directory-or-file.md --validate --stats`

![Example --validate --stats](https://github.com/silversantos/SAP009-md-links/blob/main/img/validate-stats.png)
