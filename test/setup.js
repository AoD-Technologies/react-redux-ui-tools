import { jsdom } from 'jsdom'
import 'raf/polyfill'

global.document = jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView
global.navigator = global.window.navigator
