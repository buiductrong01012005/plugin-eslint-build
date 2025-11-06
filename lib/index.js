/**
 * @fileoverview An ESLint plugin to enforce method grouping conventions.
 * @author Your Name
 */
"use strict";

// Tải tất cả các quy tắc từ thư mục rules
module.exports = {
    rules: {
        'enforce-group-declaration': require('./rules/enforce-group-declaration'),
        'enforce-group-contiguity': require('./rules/enforce-group-contiguity'),
    },
};