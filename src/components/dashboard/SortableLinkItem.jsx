import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// Icon cơ bản
import { GripVertical, Save, X, Pencil, Trash2, Loader2 } from "lucide-react";
// Icon cho MXH và loại link (ví dụ)
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Mail,
  Globe,
  Link as LinkIcon,
  Youtube,
  Music,
  MessageSquare, // Thay Tiktok icon nếu có
} from "lucide-react"; // Hoặc từ react-icons

// --- Từ điển Icon (như trên) ---
const platformIconMapping = {
  facebook: <Facebook className="h-5 w-5 text-blue-600" />,
  instagram: <Instagram className="h-5 w-5 text-pink-500" />,
  tiktok: <MessageSquare className="h-5 w-5 text-black" />, // Thay icon Tiktok
  twitter: <Twitter className="h-5 w-5 text-sky-500" />,
  linkedin: <Linkedin className="h-5 w-5 text-blue-700" />,
  github: <Github className="h-5 w-5 text-gray-800" />,
  email: <Mail className="h-5 w-5 text-gray-600" />,
  website: <Globe className="h-5 w-5 text-green-600" />,
  youtube: <Youtube className="h-5 w-5 text-red-600" />,
  spotify: <Music className="h-5 w-5 text-green-500" />,
  other: <LinkIcon className="h-5 w-5 text-gray-500" />,
  default: <LinkIcon className="h-5 w-5 text-gray-400" />,
};

// --- Hàm lấy Icon (như trên) ---
const getPlatformIcon = (platform, linkType) => {
  if (platform && platform !== "other" && platformIconMapping[platform]) {
    return platformIconMapping[platform];
  }
  if (linkType && platformIconMapping[linkType]) {
    return platformIconMapping[linkType];
  }
  if (platform === "other") {
    return platformIconMapping.other;
  }
  return platformIconMapping.default;
};

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
    transition: transition || "transform 250ms ease",
    // Giảm opacity nhẹ hơn khi kéo, trông mượt hơn
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  // Lấy icon hiển thị
  const displayIcon = getPlatformIcon(link.socialPlatform, link.linkType);

  return (
    <li
      ref={setNodeRef}
      style={style}
      // Dùng shadow nhẹ khi tĩnh, rõ hơn khi kéo, thêm hover background
      className={`flex items-stretch transition duration-150 ease-in-out bg-white rounded-lg ${
        isDragging ? "shadow-xl scale-[1.02]" : "shadow" // Thêm hiệu ứng scale nhẹ khi kéo
      } hover:bg-gray-50 ${
        isEditing ? "ring-2 ring-indigo-400 ring-offset-1" : "" // Ring rõ hơn chút
      }`}>
      {/* Drag Handle - Căn giữa, thêm focus */}
      <span
        className="flex items-center p-3 cursor-grab touch-none text-gray-400 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-l-lg"
        {...attributes}
        {...listeners}
        title="Kéo để sắp xếp" // Thêm title
      >
        <GripVertical className="h-5 w-5" />
      </span>

      {/* Icon Mạng Xã Hội/Loại Link */}
      {/* Bỏ span hiển thị text platform cũ */}
      {/* <span className="flex items-center pl-0 pr-2 text-gray-500">{link.socialPlatform}</span> */}
      <span className="flex items-center pl-0 pr-2 text-gray-500">
        {" "}
        {/* Căn giữa icon */}
        {displayIcon}
      </span>

      {/* Nội dung chính */}
      {/* Tăng padding trái cho cân đối */}
      <div className={`flex-grow min-w-0 py-3 pr-3 pl-2`}>
        {isEditing ? (
          /* --- Chế độ Sửa --- */
          <div className="space-y-3">
            {" "}
            {/* Tăng khoảng cách */}
            {/* Input Title */}
            <input
              name="title"
              type="text"
              // Style input: padding vừa phải, border chuẩn, focus ring mỏng
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
              placeholder="Tiêu đề link"
              value={editFormData.title}
              onChange={handleEditFormChange}
              required
              autoFocus
            />
            {/* Input URL */}
            <input
              name="url"
              type="url"
              className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
              placeholder="https://example.com"
              value={editFormData.url}
              onChange={handleEditFormChange}
              required
            />
            {/* Grid cho Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Select Loại Link */}
              <div>
                <label
                  htmlFor={`edit-type-${link._id}`}
                  // Label rõ hơn
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Loại
                </label>
                <select
                  id={`edit-type-${link._id}`}
                  name="linkType"
                  value={editFormData.linkType || "link"} // Đảm bảo có giá trị mặc định
                  onChange={handleEditFormChange}
                  // Style select đồng bộ
                  className="block w-full pl-3 pr-10 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150">
                  <option value="link">Link đơn giản</option>
                  <option value="youtube">Video YouTube</option>
                  <option value="spotify">Nhúng Spotify</option>
                </select>
              </div>

              {/* Select Nền Tảng */}
              <div>
                <label
                  htmlFor={`edit-social-${link._id}`}
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Nền tảng
                </label>
                <select
                  id={`edit-social-${link._id}`}
                  name="socialPlatform"
                  value={editFormData.socialPlatform || ""} // Đảm bảo có giá trị mặc định
                  onChange={handleEditFormChange}
                  className="block w-full pl-3 pr-10 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150">
                  <option value="">-- Tùy chọn --</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="email">Email (mailto:)</option>
                  <option value="website">Website Cá nhân</option>
                  <option value="other">Khác (Link thường)</option>
                </select>
              </div>
            </div>
            {/* Nút Lưu/Hủy - Căn phải, kích thước lớn hơn */}
            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={handleUpdateLink}
                disabled={isSavingEdit}
                // Nút Lưu: Style primary, kích thước chuẩn hơn, focus styling
                className="inline-flex items-center justify-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out">
                {isSavingEdit ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1.5" />
                )}
                {isSavingEdit ? "Đang lưu..." : "Lưu"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                // Nút Hủy: Style secondary, kích thước tương tự, focus styling
                className="inline-flex items-center justify-center px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 transition duration-150 ease-in-out">
                <X className="w-4 h-4 mr-1.5" />
                Hủy
              </button>
            </div>
          </div>
        ) : (
          /* --- Chế độ Hiển thị --- */
          // Tăng khoảng cách giữa các nút chức năng và thông tin link
          <div className="flex items-center justify-between space-x-3">
            {/* Thông tin link */}
            {/* Bỏ mr-4 vì đã có space-x-3 ở div cha */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {link.title || "Chưa có tiêu đề"}
                {/* Badge - Tinh chỉnh màu sắc và padding */}
                <span
                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    // Dùng font-semibold
                    link.linkType === "youtube"
                      ? "bg-red-100 text-red-700" // Màu chữ đậm hơn
                      : link.linkType === "spotify"
                      ? "bg-green-100 text-red-700"
                      : link.socialPlatform && link.socialPlatform !== "other" // Thêm badge cho MXH
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700" // Badge mặc định
                  }`}>
                  {/* Hiển thị tên đẹp hơn, ưu tiên MXH nếu có */}
                  {link.socialPlatform && link.socialPlatform !== "other"
                    ? link.socialPlatform.charAt(0).toUpperCase() +
                      link.socialPlatform.slice(1) // Tên MXH viết hoa chữ cái đầu
                    : link.linkType === "youtube"
                    ? "Embed"
                    : link.linkType === "spotify"
                    ? "Embed"
                    : "Link"}
                </span>
              </p>
              {/* URL - Style gọn gàng, dễ đọc */}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                // Style URL: nhỏ, nhạt, hover underline, truncate
                className="block text-xs text-gray-500 hover:text-indigo-600 hover:underline truncate mt-0.5"
                title={link.url} // Tooltip cho URL đầy đủ
              >
                {link.url}
              </a>
            </div>
            {/* Nút chức năng (Sửa/Xóa) - Giữ nguyên style icon button */}
            <div className="flex-shrink-0 flex items-center space-x-1">
              <button
                onClick={() => handleStartEdit(link)}
                // Tăng kích thước click area, giữ style hover/focus
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 transition duration-150 ease-in-out"
                aria-label="Sửa link"
                title="Sửa link" // Thêm title
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteLink(link._id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-red-500 transition duration-150 ease-in-out"
                aria-label="Xóa link"
                title="Xóa link" // Thêm title
              >
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
