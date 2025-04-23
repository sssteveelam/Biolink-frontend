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
                {isSavingEdit ? "Đang lưu..." : "Lưu"}
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
