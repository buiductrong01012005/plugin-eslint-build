/**
 * @fileoverview An ESLint plugin to enforce method grouping conventions.
 * @author Bùi Đức Trọng
 */
"use strict";

module.exports = {
    rules: {
        'enforce-group-declaration': require('./rules/enforce-group-declaration'),
        'enforce-group-contiguity': require('./rules/enforce-group-contiguity'),
    },
};