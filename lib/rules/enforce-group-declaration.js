/**
 * @fileoverview Enforce that every class method has a @group-of JSDoc tag.
 * @author Bui Duc Trong
 */
"use strict";

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Enforce that every class method has a @group-of JSDoc tag",
            category: "Best Practices",
            recommended: false,
        },
        fixable: null,
        schema: [],
        messages: {
            missingGroup: "Phương thức '{{methodName}}' phải có một thẻ JSDoc @group-of.",
        },
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        /**
         * Kiểm tra một node có thẻ JSDoc @group-of hay không.
         * @param {ASTNode} node Node cần kiểm tra.
         * @returns {boolean} True nếu có thẻ, false nếu không.
         */
        function hasGroupTag(node) {
            const jsdocComment = sourceCode.getJSDocComment(node);
            if (!jsdocComment) {
                return false;
            }
            return jsdocComment.value.includes('@group-of');
        }

        return {
            MethodDefinition(node) {
                if (node.kind === 'constructor') {
                    return;
                }

                if (!hasGroupTag(node)) {
                    context.report({
                        node: node.key,
                        messageId: "missingGroup",
                        data: {
                            methodName: node.key.name,
                        },
                    });
                }
            },
        };
    },
};