import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Component này sẽ đại diện cho một dòng link có thể kéo thả
function SortableLinkItem({
  id, // ID của link, bắt buộc cho dnd-kit
  link, // Dữ liệu của link (title, url)
  isEditing, // Có đang ở chế độ sửa không?
  editFormData, // Dữ liệu form sửa
  handleEditFormChange, // Hàm xử lý thay đổi form sửa
  handleUpdateLink, // Hàm lưu khi sửa
  handleCancelEdit, // Hàm hủy khi sửa
  handleStartEdit, // Hàm bắt đầu sửa
  handleDeleteLink, // Hàm xóa link
  isSavingEdit, // Có đang lưu edit không?
}) {
  const {
    attributes, // Các thuộc tính cần gắn vào element để kéo được
    listeners, // Các trình nghe sự kiện cần gắn vào element hoặc drag handle
    setNodeRef, // Ref để gắn vào element chính
    transform, // Style transform để di chuyển element khi kéo
    transition, // Style transition cho hiệu ứng mượt mà
    isDragging, // Biến boolean cho biết item có đang bị kéo không
  } = useSortable({ id }); // Hook chính của dnd-kit/sortable

  // Style để áp dụng cho việc di chuyển và hiệu ứng
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Làm mờ item khi đang kéo
    zIndex: isDragging ? 10 : "auto", // Đảm bảo item đang kéo nổi lên trên
    // touchAction: 'none', // Có thể cần cho thiết bị cảm ứng
  };

  return (
    // Gắn ref, style và các attributes, listeners vào thẻ li
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="p-3 border rounded-md bg-white shadow-sm touch-none flex items-center space-x-2">
      {/* Có thể thêm icon Drag Handle ở đây và chỉ gắn listeners vào nó */}
      <span
        className="cursor-grab text-gray-400 hover:text-gray-600"
        {...listeners}>
        {" "}
        {/* Gắn listener vào đây để kéo cả dòng */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </span>

      {/* Phần còn lại của nội dung item (giống như trong LinkManager trước đây) */}
      <div className="flex-grow min-w-0">
        {isEditing ? (
          /* --- Chế độ Sửa --- */
          <div className="space-y-2">
            {/* Input Title */}
            <input
              name="title"
              type="text"
              className="block w-full px-2 py-1 border border-gray-300 rounded-md sm:text-sm"
              value={editFormData.title}
              onChange={handleEditFormChange}
              required
            />
            {/* Input URL */}
            <input
              name="url"
              type="url"
              className="block w-full px-2 py-1 border border-gray-300 rounded-md sm:text-sm"
              value={editFormData.url}
              onChange={handleEditFormChange}
              required
            />
            {/* Nút Lưu/Hủy */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleUpdateLink}
                disabled={isSavingEdit}
                className="...">
                {isSavingEdit ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Đang lưu...</span>
                  </div>
                ) : (
                  "Lưu"
                )}
              </button>
              <button type="button" onClick={handleCancelEdit} className="...">
                Hủy
              </button>
            </div>
            {/* Hiển thị lỗi edit nếu có */}
          </div>
        ) : (
          /* --- Chế độ Hiển thị --- */
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-4">
              <p className="text-sm font-medium text-gray-900 truncate">
                {link.title}
              </p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="...">
                {link.url}
              </a>
            </div>
            <div className="flex-shrink-0 space-x-2">
              <button onClick={() => handleStartEdit(link)} className="...">
                Sửa
              </button>
              <button
                onClick={() => handleDeleteLink(link._id)}
                className="...">
                Xóa
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
export default SortableLinkItem;
