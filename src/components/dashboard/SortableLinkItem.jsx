import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Save, X, Pencil, Trash2, Loader2 } from "lucide-react"; // Import icons cần thiết

function SortableLinkItem({
  id,
  link,
  isEditing,
  editFormData,
  handleEditFormChange,
  handleUpdateLink,
  handleCancelEdit,
  handleStartEdit,
  handleDeleteLink,
  isSavingEdit,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms ease", // Thêm transition mặc định nếu chưa có
    opacity: isDragging ? 0.7 : 1, // Giảm opacity hơn chút khi kéo
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      // Bỏ border, shadow, dùng bg-white và hover nhẹ, bo góc
      className={`bg-white rounded-lg flex items-center transition duration-150 ease-in-out ${
        isDragging ? "shadow-lg" : "shadow-sm"
      } ${isEditing ? "ring-2 ring-indigo-300 ring-offset-1" : ""}`} // Thêm ring khi đang sửa
    >
      {/* Drag Handle - Dùng icon GripVertical */}
      <span
        className="p-3 cursor-grab touch-none text-gray-400 hover:text-gray-600"
        {...attributes} // Gắn attributes vào đây để không bị conflict với các nút khác
        {...listeners}>
        <GripVertical className="h-5 w-5" />
      </span>

      {/* Nội dung chính (padding nội bộ) */}
      <div
        className={`flex-grow min-w-0 py-3 pr-3 ${
          isEditing ? "pl-1" : "pl-1"
        }`}>
        {" "}
        {/* Điều chỉnh padding nội bộ */}
        {isEditing ? (
          /* --- Chế độ Sửa --- */
          <div className="space-y-2">
            {/* Input Title */}
            <input
              name="title"
              type="text"
              // Style input nhất quán, viền mềm hơn, padding nhỏ hơn cho vừa list item
              className="block w-full px-2.5 py-1.5 border border-gray-300/70 rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              placeholder="Tiêu đề link"
              value={editFormData.title}
              onChange={handleEditFormChange}
              required
              autoFocus // Tự động focus vào input title khi bắt đầu sửa
            />
            {/* Input URL */}
            <input
              name="url"
              type="url"
              className="block w-full px-2.5 py-1.5 border border-gray-300/70 rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              placeholder="https://example.com"
              value={editFormData.url}
              onChange={handleEditFormChange}
              required
            />
            {/* Nút Lưu/Hủy */}
            <div className="flex items-center space-x-2 pt-1">
              {" "}
              {/* Thêm pt-1 để tạo khoảng cách */}
              <button
                type="button" // Quan trọng: type="button" để không submit form cha nếu có
                onClick={handleUpdateLink}
                disabled={isSavingEdit}
                // Nút Lưu: Style primary, kích thước nhỏ hơn
                className="inline-flex items-center justify-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out">
                {isSavingEdit ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                {isSavingEdit ? "Lưu..." : "Lưu"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                // Nút Hủy: Style secondary/ghost, kích thước nhỏ hơn
                className="inline-flex items-center justify-center px-3 py-1 border border-gray-300/70 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition duration-150 ease-in-out">
                <X className="w-4 h-4 mr-1" /> {/* Icon Hủy (X) */}
                Hủy
              </button>
            </div>
          </div>
        ) : (
          /* --- Chế độ Hiển thị --- */
          <div className="flex items-center justify-between space-x-2">
            {/* Thông tin link */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {link.title}
              </p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                // Style link URL: màu xám, nhỏ hơn, truncate
                className="text-xs text-gray-500 truncate block hover:text-indigo-600 transition duration-150 ease-in-out"
                title={link.url} // Thêm title để xem full URL khi hover
              >
                {link.url}
              </a>
            </div>
            {/* Nút chức năng (Sửa/Xóa) */}
            <div className="flex-shrink-0 flex items-center space-x-1">
              {" "}
              {/* Giảm space-x */}
              {/* Nút Sửa - Dùng icon */}
              <button
                onClick={() => handleStartEdit(link)}
                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition duration-150 ease-in-out"
                aria-label="Sửa link">
                <Pencil className="w-4 h-4" />
              </button>
              {/* Nút Xóa - Dùng icon */}
              <button
                onClick={() => handleDeleteLink(link._id)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition duration-150 ease-in-out"
                aria-label="Xóa link">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
export default SortableLinkItem;
