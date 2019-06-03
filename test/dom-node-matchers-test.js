"use strict";

const fs = require("fs");
const path = require("path");

const DOMParser = require("xmldom").DOMParser;
const should = require("mocha-should");
const xpath = require("xpath");

const { assertThat, is } = require("hamjest");

const { createNodeSelector, hasAttributeThat, hasValueThat, isNamespaceDeclaration } =
		require("../src/dom-node-matchers");

const PREFIX = "urn";
const NS = "urn:org:quasar:hamjest";
const select = xpath.useNamespaces({
	[PREFIX]: NS
});

describe("hamjest DOM matchers", function() {
	const xml = fs.readFileSync(path.join(__dirname, "heroes.xml"), { encoding: "utf8" });
	const parser = new DOMParser();
	const dom = parser.parseFromString(xml);
	const node = createNodeSelector(dom, select);

	should("find out secret identify of Batman", function() {
		assertThat(node("//urn:realName[../urn:codeName='Batman']/text()"), hasValueThat(is("Bruce Wayne")));
	});

	should("find out where Batman lives", function() {
		assertThat(node("//urn:hero[urn:realName[text()='Bruce Wayne']]/@address"), hasValueThat(is("Wayne Manor")));
	});

	should("determine namespace declaration", function() {
		assertThat(node("/urn:heroes"), hasAttributeThat(isNamespaceDeclaration(PREFIX, NS)));
	});
});
