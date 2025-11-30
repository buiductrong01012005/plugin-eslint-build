/**
 * @fileoverview Enforce that class methods belonging to the same group are contiguous.
 * @author Bui Duc Trong
 */
"use strict";

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Enforce that class methods belonging to the same group are contiguous",
            category: "Best Practices",
            recommended: false,
        },
        fixable: null,
        schema: [],
        messages: {
            groupNotContiguous: "Nhóm '{{groupName}}' không liền mạch. Phương thức '{{methodName}}' nên được di chuyển đến cạnh các phương thức khác cùng nhóm.",
        },
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        /**
         * Lấy tên nhóm từ JSDoc comment của một node.
         * @param {ASTNode} node Node cần kiểm tra.
         * @returns {string|null} Tên nhóm hoặc null nếu không tìm thấy.
         */
        function getGroupName(node) {
            const jsdocComment = sourceCode.getJSDocComment(node);
            if (!jsdocComment) {
                return null;
            }
            const match = jsdocComment.value.match(/@group-of\s+([^\s*]+)/);
            return match ? match[1] : null;
        }

        return {
            ClassBody(node) {
                let lastGroupName = null;
                const seenGroups = new Set();

                for (const member of node.body) {
                    if (member.type !== 'MethodDefinition' || member.kind === 'constructor') {
                        continue;
                    }

                    const currentGroupName = getGroupName(member);

                    if (!currentGroupName) {
                        continue;
                    }

                    if (currentGroupName !== lastGroupName) {
                        if (seenGroups.has(currentGroupName)) {
                            context.report({
                                node: member.key,
                                messageId: "groupNotContiguous",
                                data: {
                                    groupName: currentGroupName,
                                    methodName: member.key.name,
                                },
                            });
                        }
                        seenGroups.add(currentGroupName);
                    }

                    lastGroupName = currentGroupName;
                }
            },
        };
    },
};