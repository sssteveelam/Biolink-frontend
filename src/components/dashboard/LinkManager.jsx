import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableLinkItem from "./SortableLinkItem"; // Giả sử component này đã được style phù hợp
import toast from "react-hot-toast";
import { Plus, Loader2 } from "lucide-react"; // Thêm icon

export default function LinkManager() {
  const { authState } = useContext(AuthContext);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    url: "",
    linkType: "link",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [newLinkType, setNewLinkType] = useState("link");
  // --- Dnd Kit Setup ---
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Cần di chuột 1 chút mới kích hoạt kéo thả
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- Fetch links ---
  useEffect(() => {
    const fetchLinks = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/user/links");
        setLinks(response.data || []);
      } catch (err) {
        console.error(
          "Error fetching links:",
          err.response ? err.response.data : err.message
        );
        toast.error("Lỗi khi tải danh sách links.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinks();
  }, [authState.token]); // Chỉ fetch lại nếu token thay đổi (thường là khi login/logout)

  // --- Handlers ---
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLinks((currentLinks) => {
        const oldIndex = currentLinks.findIndex(
          (item) => item._id === active.id
        );
        const newIndex = currentLinks.findIndex((item) => item._id === over.id);
        const newOrderedLinks = arrayMove(currentLinks, oldIndex, newIndex);
        const orderedLinkIds = newOrderedLinks.map((link) => link._id);
        callReorderApi(orderedLinkIds); // Gọi API nền
        return newOrderedLinks;
      });
    }
  };

  const callReorderApi = async (orderedLinkIds) => {
    try {
      await api.put("/api/user/links/reorder", { orderedLinkIds });
      toast.success("Đã cập nhật thứ tự link!");
    } catch (err) {
      console.error(
        "Error calling reorder API:",
        err.response ? err.response.data : err.message
      );
      toast.error("Lỗi khi lưu thứ tự link mới. Vui lòng tải lại trang.");
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) {
      toast.error("Vui lòng nhập cả Tiêu đề và URL.");
      return;
    }
    // Basic URL validation (optional but recommended)
    try {
      new URL(newLinkUrl); // Check if it's a valid URL structure
    } catch (error) {
      toast.error(
        "URL không hợp lệ. Vui lòng kiểm tra lại (vd: https://example.com)"
      );
      return;
    }

    setIsAdding(true);
    try {
      const response = await api.post("/api/user/links", {
        title: newLinkTitle,
        url: newLinkUrl,
        linkType: newLinkType, // <-- Gửi type đã chọn
      });
      setLinks((prevLinks) => [response.data, ...prevLinks]);
      setNewLinkTitle("");
      setNewLinkUrl("");
      toast.success("Thêm link thành công!");
      setNewLinkType("link"); // <-- Reset type về mặc định
    } catch (err) {
      console.error(
        "Error adding link:",
        err.response ? err.response.data : err.message
      );
      toast.error(err.response?.data?.message || "Thêm link thất bại!");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa link này?")) return;
    try {
      await api.delete(`/api/user/links/${linkId}`);
      setLinks((prevLinks) => prevLinks.filter((link) => link._id !== linkId));
      toast.success("Xóa link thành công!");
    } catch (err) {
      console.error(
        "Error deleting link:",
        err.response ? err.response.data : err.message
      );
      toast.error(err.response?.data?.message || "Lỗi khi xóa link.");
    }
  };

  const handleStartEdit = (link) => {
    setEditingLinkId(link._id);
    setEditFormData({
      title: link.title,
      url: link.url,
      linkType: link.linkType || "link",
    });
  };

  const handleCancelEdit = () => {
    setEditingLinkId(null);
    setEditFormData({ title: "", url: "" });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateLink = async () => {
    if (!editFormData.title || !editFormData.url) {
      toast.error("Vui lòng nhập cả Tiêu đề và URL.");
      return;
    }
    // Basic URL validation
    try {
      new URL(editFormData.url);
    } catch (err) {
      toast.error("URL không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }
    setIsSavingEdit(true);
    try {
      const response = await api.put(`/api/user/links/${editingLinkId}`, {
        title: editFormData.title,
        url: editFormData.url,
        linkType: editFormData.linkType,
      });
      console.log(response);
      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link._id === editingLinkId ? response.data : link
        )
      );
      handleCancelEdit();
      toast.success("Cập nhật link thành công!");
    } catch (err) {
      console.error(
        "Error updating link:",
        err.response ? err.response.data : err.message
      );
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật link.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // --- Render Loading State ---
  if (isLoading) {
    return (
      // Style cho container chính khi loading, giữ nguyên style "glassy"
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/15 p-6 md:p-8 flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="sr-only">Đang tải danh sách links...</span>
      </div>
    );
  }

  // --- Render Main Content ---
  return (
    // Container chính của LinkManager - ĐÃ ÁP DỤNG STYLE "GLASSY" VÀ VIỀN MỜ
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/15">
      {/* Thêm padding bên trong container này */}
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Quản lý Links
        </h3>

        {/* --- Form Thêm Link Mới - Style nhẹ nhàng hơn --- */}
        <form
          onSubmit={handleAddLink}
          // Bỏ nền xám, dùng viền đen mờ, bo góc lớn hơn
          className="mb-8 p-4 border border-black/10 rounded-lg space-y-4">
          <h4 className="text-lg font-medium text-gray-700">Thêm Link Mới</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="newLinkTitle"
                className="block text-sm font-medium text-gray-600 mb-1">
                Tiêu đề
              </label>
              <input
                id="newLinkTitle"
                type="text"
                // Style input nhất quán, focus ring màu tím
                className="block w-full px-3 py-2 border border-gray-300/70 rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder="Ví dụ: Website của tôi"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="newLinkUrl"
                className="block text-sm font-medium text-gray-600 mb-1">
                URL
              </label>
              <input
                id="newLinkUrl"
                type="url"
                className="block w-full px-3 py-2 border border-gray-300/70 rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder="https://example.com"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                required
              />
            </div>
          </div>
          {/* type link */}
          <div>
            <label
              htmlFor="newLinkType"
              className="block text-sm font-medium text-gray-700 mb-1">
              Loại nội dung
            </label>
            <select
              id="newLinkType"
              name="linkType"
              value={newLinkType}
              onChange={(e) => setNewLinkType(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="link">Link đơn giản</option>
              <option value="youtube">Nhúng Video YouTube</option>
              {/* Thêm các option khác sau này nếu muốn */}
            </select>
          </div>

          <button
            type="submit"
            disabled={isAdding}
            // Style nút nhất quán, dùng gradient, chữ trắng
            className="inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out">
            {isAdding ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> // Icon loading nhỏ hơn
            ) : (
              <Plus className="w-5 h-5 mr-1" /> // Icon Plus
            )}
            {isAdding ? "Đang thêm..." : "Thêm Link"}
          </button>
        </form>

        {/* --- Danh Sách Links Hiện Có --- */}
        <h4 className="text-lg font-medium text-gray-700 mb-4">
          Danh sách Links
        </h4>
        {links.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Chưa có link nào. Hãy thêm link đầu tiên của bạn!
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={links.map((link) => link._id)}
              strategy={verticalListSortingStrategy}>
              {/* Container cho danh sách, có thể thêm border nhẹ nếu muốn */}
              <ul className="space-y-3">
                {links.map((link) => (
                  <SortableLinkItem
                    key={link._id}
                    id={link._id}
                    link={link}
                    isEditing={editingLinkId === link._id}
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleUpdateLink={handleUpdateLink}
                    handleCancelEdit={handleCancelEdit}
                    handleStartEdit={handleStartEdit}
                    handleDeleteLink={handleDeleteLink}
                    isSavingEdit={isSavingEdit}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>{" "}
      {/* Kết thúc padding container */}
    </div> // Kết thúc container chính LinkManager
  );
}
