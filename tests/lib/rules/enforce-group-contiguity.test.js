/**
 * @fileoverview Tests for enforce-group-contiguity rule.
 * @author Bui Duc Trong
 */
"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/enforce-group-contiguity");

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 2015 },
});

ruleTester.run("enforce-group-contiguity", rule, {
    // Các trường hợp hợp lệ
    valid: [
        // Một nhóm duy nhất
        {
            code: `
        class MyClass {
          /** @group-of group-A */
          methodA1() {}
          /** @group-of group-A */
          methodA2() {}
        }
      `,
        },
        // Nhiều nhóm liền kề
        {
            code: `
        class MyClass {
          /** @group-of group-A */
          methodA1() {}
          /** @group-of group-A */
          methodA2() {}
          /** @group-of group-B */
          methodB1() {}
        }
      `,
        },
        // Các phương thức không có group tag được bỏ qua
        {
            code: `
        class MyClass {
          /** @group-of group-A */
          methodA1() {}

          noGroupMethod() {} // Bỏ qua

          /** @group-of group-A */
          methodA2() {}
        }
      `,
        },
    ],

    // Các trường hợp không hợp lệ
    invalid: [
        {
            code: `
        class MyClass {
          /** @group-of group-A */
          methodA1() {}

          /** @group-of group-B */
          methodB1() {}

          /** @group-of group-A */
          methodA2() {} // Lỗi ở đây
        }
      `,
            errors: [
                {
                    message: "Nhóm 'group-A' không liền mạch. Phương thức 'methodA2' nên được di chuyển đến cạnh các phương thức khác cùng nhóm.",
                    type: "Identifier",
                },
            ],
        },
        {
            code: `
          class MyClass {
            /** @group-of group-A */
            methodA1() {}
            /** @group-of group-B */
            methodB1() {}
            /** @group-of group-C */
            methodC1() {}
            /** @group-of group-B */
            methodB2() {} // Lỗi ở đây
          }
        `,
            errors: [
                {
                    message: "Nhóm 'group-B' không liền mạch. Phương thức 'methodB2' nên được di chuyển đến cạnh các phương thức khác cùng nhóm.",
                },
            ],
        },
    ],
});