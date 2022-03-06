import pkgB from "bluebird"
const { delay } = pkgB
import pkg from "neo-blessed"
//import blessed from "neo-blessed"
const { Node, Box } = pkg
const blessed = pkg
import pkgL from "lodash"
const { merge } = pkgL
import Point from "text-buffer/lib/point.js"

import pkgUtil from "slap-util"
const { logger, typeOf, callBase } = pkgUtil
import baseWidgetOpts from "./opts.js"

//BaseWidget.prototype.__proto__ = Box.prototype;

class BaseWidget extends Box {
  constructor(opts) {
    super(opts)
    const self = this

    if (!(self instanceof Node)) return new BaseWidget(opts)

    opts = merge({}, baseWidgetOpts, opts)
    if (!opts.screen) opts.screen = (opts.parent || {}).screen
    if (!opts.parent) opts.parent = opts.screen
    const loggerOpts =
      opts.logger ||
      (opts.parent || {}).options.logger ||
      (opts.screen || {}).options.logger
    if (loggerOpts && !logger.stream) logger(loggerOpts)
    if (self instanceof BaseWidget) Box.call(self, opts) // this should not be called if an element inherits from built-in blessed classes
    self.focusable = opts.focusable

    logger.debug(typeOf(self), `init {${Object.keys(opts).join(",")}}`)
    self.ready = delay(0)
      .then(() => {
        return typeof self._initHandlers === "function"
          ? self._initHandlers()
          : BaseWidget.prototype._initHandlers.call(self)
      })
      .return(self)
      .tap(() => {
        logger.debug(typeOf(self), "ready")
      })
  }
  walkDepthFirst(direction, after, fn) {
    if (arguments.length === 2) fn = after
    let children = this.children.slice()
    if (direction === -1) children.reverse()
    if (after) children = children.slice(children.indexOf(after) + 1)
    return children.some(function (child) {
      return (
        fn.apply(child, arguments) ||
        BaseWidget.prototype.walkDepthFirst.call(child, direction, fn)
      )
    })
  }
  focusFirst(direction, after) {
    return this.walkDepthFirst(direction, after, function () {
      if (this.visible && this.focusable) {
        this.focus()
        return true
      }
    })
  }
  _focusDirection(direction) {
    const self = this
    let descendantParent
    let descendant = self.screen.focused
    while (descendant.hasAncestor(self)) {
      descendantParent = descendant.parent
      if (
        BaseWidget.prototype.focusFirst.call(
          descendantParent,
          direction,
          descendant
        )
      )
        return self
      descendant = descendantParent
    }
    if (!self.focusFirst(direction)) throw new Error("no focusable descendant")
    return self
  }
  focusNext() {
    return this._focusDirection(1)
  }
  focusPrev() {
    return this._focusDirection(-1)
  }
  focus() {
    if (!this.hasFocus()) return Box.prototype.focus.apply(this, arguments)
    return this
  }
  isAttached() {
    return this.hasAncestor(this.screen)
  }
  hasFocus(asChild) {
    const self = this
    const { focused } = self.screen
    return (
      focused.visible &&
      (focused === self ||
        focused.hasAncestor(self) ||
        (asChild && self.hasAncestor(focused)))
    )
  }
  pos() {
    return new Point(this.atop + this.itop, this.aleft + this.ileft)
  }
  size() {
    if (!this.isAttached()) return new Point(0, 0) // hack
    return new Point(this.height - this.iheight, this.width - this.iwidth)
  }
  shrinkWidth() {
    return this.content.length + this.iwidth
  }
  getBindings() {
    return this.options.bindings
  }
  resolveBinding(key, source1, source2, etc) {
    return BaseWidget.resolveBinding.apply(
      this,
      [key, callBase(this, BaseWidget, "getBindings")].concat(
        [].slice.call(arguments, 1)
      )
    )
  }
  _initHandlers() {
    const self = this
    self.on("focus", () => {
      logger.debug("focus", typeOf(self))
      if (!self.focusable) self.focusNext()
    })
    self.on("blur", () => {
      logger.debug("blur", typeOf(self))
    })
    self.on("show", () => {
      self.setFront()
    })
    self.on("element keypress", function (el, ch, key) {
      switch (callBase(this, BaseWidget, "resolveBinding", key)) {
        case "hide":
          self.hide()
          return false
        case "focusNext":
          self.focusNext()
          return false
        case "focusPrev":
          self.focusPrev()
          return false
      }
    })
  }
  static resolveBinding(key, source1, source2, etc) {
    const bindings = merge.apply(null, [{}].concat([].slice.call(arguments, 1)))
    for (const name in bindings) {
      if (bindings.hasOwnProperty(name)) {
        let keyBindings = bindings[name]
        if (!keyBindings) continue
        if (typeof keyBindings === "string") keyBindings = [keyBindings]
        if (
          keyBindings.some((binding) => {
            return binding === key.full || binding === key.sequence
          })
        )
          return name
      }
    }
  }
}
BaseWidget.blessed = blessed

export default BaseWidget
