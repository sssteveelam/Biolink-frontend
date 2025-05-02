import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// Icon cơ bản
import {
  GripVertical,
  Save,
  X,
  Pencil,
  Trash2,
  Loader2,
  Eye,
} from "lucide-react";
// Icon cho MXH và loại link
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
  MessageSquare, // Thay Tiktok icon
} from "lucide-react";

// --- Từ điển Icon ---
const platformIconMapping = {
  facebook: <Facebook className="h-5 w-5 text-blue-600" />,
  instagram: <Instagram className="h-5 w-5 text-pink-500" />,
  tiktok: <MessageSquare className="h-5 w-5 text-black" />,
  twitter: <Twitter className="h-5 w-5 text-sky-500" />,
  linkedin: <Linkedin className="h-5 w-5 text-blue-700" />,
  github: <Github className="h-5 w-5 text-gray-800" />,
  email: <Mail className="h-5 w-5 text-gray-600" />,
  website: <Globe className="h-5 w-5 text-green-600" />,
  youtube: <Youtube className="h-5 w-5 text-red-600" />,
  spotify: <Music className="h-5 w-5 text-green-500" />, // Đổi sang Music cho Spotify
  other: <LinkIcon className="h-5 w-5 text-gray-500" />,
  default: <LinkIcon className="h-5 w-5 text-gray-400" />,
};

// --- Hàm lấy Icon ---
const getPlatformIcon = (platform, linkType) => {
  // Ưu tiên socialPlatform
  if (platform && platform !== "other" && platformIconMapping[platform]) {
    return platformIconMapping[platform];
  }
  // Sau đó mới đến linkType (cho Youtube/Spotify nếu không có socialPlatform)
  if (linkType && platformIconMapping[linkType]) {
    return platformIconMapping[linkType];
  }
  // Trường hợp platform là 'other'
  if (platform === "other") {
    return platformIconMapping.other;
  }
  // Mặc định
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
    transition: transition || "transform 250ms ease, box-shadow 150ms ease", // Thêm transition cho shadow
    opacity: isDragging ? 0.65 : 1, // Điều chỉnh opacity
    zIndex: isDragging ? 50 : "auto", // Tăng zIndex khi kéo để nổi bật hẳn
  };

  // Lấy icon hiển thị
  const displayIcon = getPlatformIcon(link.socialPlatform, link.linkType);
  // Định dạng số lượt click
  const clickCountDisplay = link.clickCount != null ? link.clickCount : 0;

  return (
    <li
      ref={setNodeRef}
      style={style}
      // Thêm group để điều khiển hover cho các nút con
      // Thêm border nhẹ thay vì shadow đậm khi tĩnh, shadow rõ khi kéo/hover
      className={`group flex items-stretch transition-all duration-150 ease-in-out bg-white rounded-lg border border-gray-200/80 hover:border-gray-300 ${
        isDragging
          ? "shadow-xl scale-[1.02] border-indigo-300"
          : "hover:shadow-md" // Shadow nhẹ khi hover, rõ khi kéo
      } ${
        isEditing
          ? "ring-2 ring-indigo-400 ring-offset-1 border-transparent"
          : "" // Bỏ border khi đang edit để ring đẹp hơn
      }`}>
      {/* === CỘT 1: Kéo thả và Icon === */}
      <div
        className={`flex items-center flex-shrink-0 ${
          isEditing ? "pr-2" : "pr-3"
        }`}>
        {" "}
        {/* Giảm padding phải khi edit */}
        {/* Drag Handle */}
        {/* Không hiển thị nút kéo khi đang sửa */}
        {!isEditing && (
          <span
            className="flex items-center p-3 cursor-grab touch-none text-gray-400 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-l-lg"
            {...attributes}
            {...listeners}
            title="Kéo để sắp xếp">
            <GripVertical className="h-5 w-5" />
          </span>
        )}
        {/* Icon Nền tảng/Loại Link */}
        <span
          className={`flex items-center ${
            isEditing ? "pl-3" : ""
          } text-gray-500`}
          title={link.socialPlatform || link.linkType || "Link"}>
          {" "}
          {/* Thêm title cho icon */}
          {displayIcon}
        </span>
      </div>

      {/* === CỘT 2: Nội dung chính (Title, URL, Form Edit) === */}
      <div className="flex-grow min-w-0 flex flex-col justify-center py-2.5 pl-1 pr-3">
        {" "}
        {/* Dùng flex-col và justify-center để căn giữa dọc */}
        {isEditing ? (
          /* --- Chế độ Sửa --- */
          <div className="space-y-3 w-full">
            {" "}
            {/* Đảm bảo form chiếm đủ chiều rộng */}
            {/* Input Title */}
            <input
              name="title"
              type="text"
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
                  className="block text-xs font-medium text-gray-600 mb-1">
                  Kiểu hiển thị
                </label>
                <select
                  id={`edit-type-${link._id}`}
                  name="linkType"
                  value={editFormData.linkType || "link"}
                  onChange={handleEditFormChange}
                  className="block w-full pl-3 pr-10 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150">
                  <option value="link">Chỉ Link</option>
                  <option value="youtube">Nhúng YouTube</option>
                  <option value="spotify">Nhúng Spotify</option>
                </select>
              </div>
              {/* Select Nền Tảng */}
              <div>
                <label
                  htmlFor={`edit-social-${link._id}`}
                  className="block text-xs font-medium text-gray-600 mb-1">
                  Icon Nền tảng
                </label>
                <select
                  id={`edit-social-${link._id}`}
                  name="socialPlatform"
                  value={editFormData.socialPlatform || ""}
                  onChange={handleEditFormChange}
                  className="block w-full pl-3 pr-10 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150">
                  <option value="">-- Chọn Icon --</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="email">Email</option>
                  <option value="website">Website</option>
                  <option value="other">Link Thường</option>
                </select>
              </div>
            </div>
            {/* Nút Lưu/Hủy */}
            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={handleUpdateLink}
                disabled={isSavingEdit}
                className="inline-flex items-center justify-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out">
                {isSavingEdit ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1.5" />
                )}{" "}
                {isSavingEdit ? "Đang lưu..." : "Lưu"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center justify-center px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 transition duration-150 ease-in-out">
                <X className="w-4 h-4 mr-1.5" /> Hủy
              </button>
            </div>
          </div>
        ) : (
          /* --- Chế độ Hiển thị --- */
          <>
            {/* Dòng Title và Click Count */}
            <div className="flex items-center justify-between ">
              {" "}
              {/* Căn Title trái, Count phải */}
              <p className="text-sm font-medium text-gray-900 truncate pr-2">
                {" "}
                {/* Thêm padding phải để tránh chạm Count */}
                {link.title || "Chưa có tiêu đề"}
              </p>
            </div>

            {/* URL - Luôn hiển thị */}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-gray-500 hover:text-indigo-600 hover:underline truncate mt-0.5"
              title={link.url}>
              {link.url}
            </a>
          </>
        )}
      </div>

      {/* === CỘT 3: Nút chức năng (Chỉ hiển thị khi không Edit) === */}
      {!isEditing && (
        <div className="flex-shrink-0 flex items-center pl-1 pr-2">
          {" "}
          {/* Điều chỉnh padding */}
          {/* Các nút này chỉ hiện khi hover vào LI (dùng class 'group' ở thẻ li) */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
            {/* Click Count - Chỉ hiển thị nếu lớn hơn 0 hoặc khi đang hover */}
            <span
              className={`flex items-center flex-shrink-0 text-xs text-indigo-600 font-medium transition-opacity duration-150 ${
                clickCountDisplay > 0
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
              title="Số lượt click">
              <Eye size={22} className="mr-1 text-3xl" />
              {clickCountDisplay}
            </span>

            <button
              onClick={() => handleStartEdit(link)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 transition duration-150 ease-in-out"
              aria-label="Sửa link"
              title="Sửa link">
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteLink(link._id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-red-500 transition duration-150 ease-in-out"
              aria-label="Xóa link"
              title="Xóa link">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export default SortableLinkItem;
