const jsdom = require("jsdom");
const { JSDOM } = jsdom;
import "raf/polyfill";

const dom = new JSDOM("<!doctype html><html><body></body></html>");
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;
