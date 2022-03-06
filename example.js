#!/usr/bin/env node

/**
 * a bare bones example of using the base widget
 * since the base widget is consumed by the editor widget and main ide
 * it doesnt render itself.
 * All of the code relating the screen is external from base-widget
 */
import pkg from "neo-blessed"
import BaseWidget from "./lib/BaseWidget.js"

const { Screen } = pkg

const screen = new Screen()
screen.key("C-q", () => {
  process.exit()
})
const bw = new BaseWidget()
bw.setContent("hello world")
screen.append(bw)
screen.render()
