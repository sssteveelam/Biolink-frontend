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
            {/* link type */}
            <div>
              {/* Thêm mục chọn type */}
              <label
                htmlFor={`edit-type-${link._id}`}
                className="text-xs font-medium text-gray-600">
                Loại
              </label>
              <select
                id={`edit-type-${link._id}`}
                name="linkType" // Quan trọng: name khớp key trong editFormData
                value={editFormData.linkType}
                onChange={handleEditFormChange} // Dùng chung hàm change
                className="block w-full mt-1 pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="link">Link đơn giản</option>
                <option value="youtube">Nhúng Video YouTube</option>
                <option value="spotify">Nhúng Spotify</option>
              </select>
            </div>
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
            <div className="flex-1 min-w-0 mr-4">
              <p className="text-sm font-medium text-gray-900 truncate">
                {link.title}
                {/* Thêm hiển thị loại link bằng badge nhỏ */}
                <span
                  className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    link.linkType === "youtube"
                      ? "bg-red-100 text-red-800" // Giữ nguyên cho Youtube
                      : link.linkType === "spotify"
                      ? "bg-green-100 text-green-800" // Thêm màu xanh lá cho Spotify
                      : "bg-blue-100 text-blue-800" // Mặc định cho 'link' hoặc không có type
                  }`}>
                  {/* Hiển thị tên đẹp hơn */}
                  {link.linkType === "youtube"
                    ? "YouTube"
                    : link.linkType === "spotify"
                    ? "Spotify"
                    : "Link"}
                </span>
              </p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="...">
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
