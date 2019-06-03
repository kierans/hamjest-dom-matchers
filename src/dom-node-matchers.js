"use strict";

const { assertThat, hasSize } = require("hamjest");

/**
 * @param {Node} root Context node to perform selection on.
 * @param selector XPath selector function
 * @return {Function}
 */
exports.createNodeSelector = function(root, selector) {
  return (xpath) => {
    const nodeList = selector(xpath, root);

    assertThat(xpath, nodeList, hasSize(1));

    return nodeList[0];
  };
};

exports.hasAttributeThat = (matcher) => {
  return {
    matches: (node) => {
      const attrs = node.attributes;

      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs.item(i);

        if (matcher.matches(attr)) {
          return true;
        }
      }

      return false;
    },
    describeTo: (description) => {
      return matcher.describeTo(description);
    },
    describeMismatch: (node, description) => {
      const attrs = node.attributes;
      const map = {};

      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs.item(i);

        map[attr.name] = attr.nodeValue;
      }

      description.append("Attribute map: ");
      description.appendValue(JSON.stringify(map));
    }
  };
};

exports.hasValueThat = (matcher) => {
  return {
    matches: (node) => {
      return matcher.matches(node.nodeValue);
    },
    describeTo: (description) => {
      return matcher.describeTo(description);
    },
    describeMismatch: (node, description) => {
      return matcher.describeMismatch(node.nodeValue, description);
    }
  };
};

exports.isNamespaceDeclaration = (prefix, ns) => {
  return {
    matches: (attr) => {
      return attr.prefix === "xmlns" && attr.localName === prefix && attr.value === ns;
    },
    describeTo: (description) => {
      description.append(`Namespace declaration for xmlns:${prefix}="${ns}"`);
    },
    describeMismatch: (attr, description) => {
      description.append(`Expected xmlns:${prefix}="${ns}" but got xmlns:${attr.localName}="${attr.value}"`);
    }
  };
};


