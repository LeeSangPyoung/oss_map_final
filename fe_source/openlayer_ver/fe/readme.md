**--- Folder structure project ----**

- components ----> Chứa các components dùng chung cho toàn bộ app
- hooks -----> Chứa các hooks dùng chung cho app
- models ----> Models types dùng chung cho app
- packages ---> Các packages của từng pages.
  4.1 packages/Home/components ---> các components của HomePage
  4.2 packages/Home/constants ----> Các biến common dùng cho HomePage
  4.3 packages/Home/locale ----> đa ngôn ngữ cho Home pages
  4.4 packages/Home/models ----> model type cho HomePage
  4.5 packages/Home/services ---> call api HomePage
  4.6 packages/Home/utils ---> function utils cho HomePage
- routes ----> config react router
- pages ----> Chứa các pages của router
- utils ----> Các function common utils cho app
- store ---> configStore cho global state (redux, zustand,...)

** Yêu cầu**

- Code phải khai báo type rõ ràng.
- Code theo đúng convention, structure, fix hết các lỗi eslint trước khi commit để dễ quản lí, maintain
- Tách hàm thì viết hàm rõ nghĩa, có comment code nếu cảm thấy chưa clear.
