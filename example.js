#!/usr/bin/env node

//FIXME: example doesnt work
import pkg from "neo-blessed"
import BaseWidget from "./lib/BaseWidget.js"

const { Screen } = pkg

const screen = new Screen()
screen.key("C-q", () => {
  process.exit()
})
const bw = new BaseWidget()
//bw.content("hello world")
screen.render(bw)
