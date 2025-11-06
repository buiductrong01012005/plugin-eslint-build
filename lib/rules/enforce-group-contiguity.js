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
            // Kiểm tra toàn bộ class một lượt
            ClassBody(node) {
                let lastGroupName = null;
                const seenGroups = new Set();

                // Duyệt qua tất cả các thành viên trong class (các phương thức)
                for (const member of node.body) {
                    // Chỉ áp dụng cho các phương thức, bỏ qua constructor và các thuộc tính
                    if (member.type !== 'MethodDefinition' || member.kind === 'constructor') {
                        continue;
                    }

                    const currentGroupName = getGroupName(member);

                    // Nếu phương thức không có nhóm, bỏ qua (quy tắc declare sẽ bắt lỗi này)
                    if (!currentGroupName) {
                        continue;
                    }

                    // Nếu nhóm hiện tại khác nhóm trước đó
                    if (currentGroupName !== lastGroupName) {
                        // Kiểm tra xem đã từng thấy nhóm này trước đây chưa
                        if (seenGroups.has(currentGroupName)) {
                            // Nếu trùng -> Báo lỗi
                            context.report({
                                node: member.key,
                                messageId: "groupNotContiguous",
                                data: {
                                    groupName: currentGroupName,
                                    methodName: member.key.name,
                                },
                            });
                        }
                        // Thêm nhóm mới vào danh sách đã thấy
                        seenGroups.add(currentGroupName);
                    }

                    // Cập nhật nhóm cuối cùng đã thấy
                    lastGroupName = currentGroupName;
                }
            },
        };
    },
};