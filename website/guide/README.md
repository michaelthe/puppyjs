---
title: Introduction
---

# Introduction

PuppyJS is a framework agnostic E2E (end-to-end) testing and mocking tool for front end developers.
Puppy depends on [Jest](http://jestjs.io/) for tests and [Puppeteer](https://github.com/GoogleChrome/puppeteer) 
for the testing environment so if you know these tools then you already know 80% of Puppy.

Puppy also lets you mock HTTP APIs and web socket events so you can 
develop your application until the backend is ready as well as
run your E2E tests against the same mock API and socket events you used for development.  

## How it works

Puppy creates four servers with three of the four on the **same** port. It supports both HTTP and Web sockets for mocking and it supports serving static files as well. 
However, to avoid conflicts with Puppy internal routes, there is also an internal server which Puppy will proxy requests made by the tool. 

For example Puppy handles a `/register` route  for dynamically registering HTTP responses. **This means that if your app
was using a `/register` for registering users, it wouldn't work.** Instead of namespacing the Puppy's specific routes, 
we chose to have an internal server handle that which automatically choses a free port in the 65000+ range and saves it in a `.puppy` folder in the current directory.

`.puppy` folder is used for directory specific settings by Puppy. For now it only saves the current internal server port. **Remember** to exclude this folder from `.gitignore`.