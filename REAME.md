# eslint-plugin-grouping (Bản phát triển)

**Lưu ý:** Plugin này đang trong giai đoạn phát triển và chưa được phát hành chính thức trên NPM. Hướng dẫn dưới đây dành cho việc cài đặt và thử nghiệm plugin cục bộ.

---

Một plugin ESLint giúp thực thi các quy ước nhóm các phương thức trong class lại với nhau dựa trên chức năng hoặc thực thể mà chúng tác động. Điều này giúp tăng cường tính gắn kết (cohesion) và khả năng đọc hiểu code.

## Tại sao cần plugin này?

Trong các class lớn, các phương thức liên quan đến cùng một tính năng hoặc một phần dữ liệu có thể bị nằm rải rác, gây khó khăn cho việc debug và bảo trì. Plugin này buộc các lập trình viên phải:
1.  Phân loại từng phương thức vào một "nhóm" logic.
2.  Đặt tất cả các phương thức của cùng một nhóm ở cạnh nhau.

## Hướng dẫn Sử dụng cho Phát triển Cục bộ

Để sử dụng plugin này trong một dự án khác trên máy của bạn, hãy làm theo các bước sau sử dụng `npm link`.

### Bước 1: Chuẩn bị Plugin

1.  Clone repository này về máy của bạn.
2.  Mở terminal tại thư mục gốc của plugin (`eslint-plugin-grouping`) và chạy lệnh sau để đăng ký plugin này trên máy cục bộ của bạn.
    ```bash
    npm install
    npm link
    ```
    Lệnh `npm link` tạo một liên kết tượng trưng (symbolic link) toàn cục đến thư mục plugin của bạn.

### Bước 2: Áp dụng vào Dự án của bạn

1.  Mở terminal tại thư mục gốc của dự án mà bạn muốn **áp dụng** plugin này vào.
2.  Chạy lệnh sau để liên kết dự án của bạn đến bản plugin cục bộ:
    ```bash
    npm link eslint-plugin-grouping
    ```
    Lệnh này sẽ tạo một thư mục `eslint-plugin-grouping` bên trong `node_modules` của dự án, nhưng thực chất nó chỉ trỏ đến nơi bạn đã lưu mã nguồn của plugin.

    **Lợi ích:** Mọi thay đổi bạn thực hiện trong mã nguồn của plugin sẽ được phản ánh ngay lập tức trong dự án mà không cần cài đặt lại.

### Bước 3: Cấu hình ESLint

Sau khi đã liên kết thành công, hãy cập nhật file `.eslintrc` của dự án để ESLint nhận diện và sử dụng các quy tắc.

```json
{
  "plugins": [
    "grouping"
  ],
  "rules": {
    "grouping/enforce-group-declaration": "error",
    "grouping/enforce-group-contiguity": "error"
  }
}
```

Bây giờ, khi bạn chạy ESLint trong dự án, nó sẽ sử dụng các quy tắc từ bản plugin cục bộ của bạn.

## Phát triển Plugin

Nếu bạn muốn đóng góp hoặc sửa đổi plugin:

*   **Chạy tests**: Để đảm bảo mọi thứ hoạt động chính xác sau khi thay đổi, hãy chạy bộ kiểm thử:
    ```bash
    npm test
    ```

## Các quy tắc

*(Phần này giữ nguyên vì nó mô tả chức năng của các quy tắc)*

### `grouping/enforce-group-declaration`

Quy tắc này bắt buộc mọi phương thức trong class (trừ `constructor`) phải có một thẻ JSDoc `@group-of` để xác định nó thuộc về nhóm nào.

**Ví dụ về code không hợp lệ:**
```javascript
class MyClass {
    // LỖI: Thiếu thẻ @group-of
    myMethod() {
        // ...
    }
}
```

**Ví dụ về code hợp lệ:**
```javascript
class MyClass {
    /**
     * @group-of my-feature
     */
    myMethod() {
        // ...
    }
}
```

### `grouping/enforce-group-contiguity`

Quy tắc này đảm bảo rằng tất cả các phương thức thuộc cùng một nhóm phải nằm liền kề nhau.

**Ví dụ về code không hợp lệ:**```javascript
class MyClass {
    /** @group-of group-A */
    methodA1() {}
    /** @group-of group-B */
    methodB1() {}
    /** @group-of group-A */
    // LỖI: Nhóm 'group-A' không liền mạch.
    methodA2() {}
}
```

**Ví dụ về code hợp lệ:**
```javascript
class MyClass {
    /** @group-of group-A */
    methodA1() {}
    /** @group-of group-A */
    methodA2() {}
    /** @group-of group-B */
    methodB1() {}
}
```

## License

ISC
