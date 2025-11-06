/**
 * @fileoverview Tests for enforce-group-declaration rule.
 * @author Bui Duc Trong
 */
"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/enforce-group-declaration");

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 2015 },
});

ruleTester.run("enforce-group-declaration", rule, {
    // Các trường hợp hợp lệ
    valid: [
        {
            code: `
        class MyClass {
          constructor() {}
        }
      `,
        },
        {
            code: `
        class MyClass {
          /**
           * @group-of my-feature
           */
          myMethod() {}
        }
      `,
        },
        {
            code: `
          class MyClass {
            // Đây không phải là JSDoc block
            myMethod() {}
          }
        `,
            // Trường hợp này sẽ bị lỗi, chúng ta sẽ thêm nó vào invalid
        },
    ],

    // Các trường hợp không hợp lệ
    invalid: [
        {
            code: `
        class MyClass {
          myMethod() {}
        }
      `,
            errors: [
                {
                    message: "Phương thức 'myMethod' phải có một thẻ JSDoc @group-of.",
                    type: "Identifier",
                },
            ],
        },
        {
            code: `
        class MyClass {
          /**
           * Một comment JSDoc nhưng không có thẻ group
           */
          anotherMethod() {}
        }
      `,
            errors: [
                {
                    message: "Phương thức 'anotherMethod' phải có một thẻ JSDoc @group-of.",
                },
            ],
        },
    ],
});