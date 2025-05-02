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
import SortableLinkItem from "./SortableLinkItem"; // Đảm bảo component này đã đẹp nha
import toast from "react-hot-toast";
import { Plus, Loader2, Inbox, Link as LinkIconLucide } from "lucide-react"; // Thêm icon Link nếu cần

export default function LinkManager() {
  const { authState } = useContext(AuthContext);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkType, setNewLinkType] = useState("link");
  const [newSocialPlatform, setNewSocialPlatform] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    url: "",
    linkType: "link",
    socialPlatform: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // --- Dnd Kit Setup ---
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
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
  }, [authState.token]);

  // --- Handlers (giữ nguyên logic) ---
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLinks((currentLinks) => {
        const oldIndex = currentLinks.findIndex(
          (item) => item._id === active.id
        );
        const newIndex = currentLinks.findIndex((item) => item._id === over.id);
        if (oldIndex === -1 || newIndex === -1) return currentLinks; // Safety check

        const newOrderedLinks = arrayMove(currentLinks, oldIndex, newIndex);
        // Cập nhật lại trường 'order' (hoặc chỉ gửi ID) cho API
        const orderedLinkIds = newOrderedLinks.map((link) => link._id);
        callReorderApi(orderedLinkIds); // Gọi API nền
        return newOrderedLinks;
      });
    }
  };

  const callReorderApi = async (orderedLinkIds) => {
    try {
      await api.put("/api/user/links/reorder", { orderedLinkIds });
      // Không cần toast success ở đây để tránh làm phiền, chỉ báo lỗi nếu có
    } catch (err) {
      console.error(
        "Error calling reorder API:",
        err.response ? err.response.data : err.message
      );
      toast.error("Lỗi khi lưu thứ tự link mới. Thứ tự có thể không đúng.");
      // Cân nhắc fetch lại links để đảm bảo đồng bộ
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) {
      toast.error("Vui lòng nhập Tiêu đề và URL.", { duration: 2000 });
      return;
    }
    try {
      new URL(newLinkUrl);
    } catch (error) {
      toast.error("URL không hợp lệ. (vd: https://...)", { duration: 2500 });
      return;
    }

    setIsAdding(true);
    try {
      const response = await api.post("/api/user/links", {
        title: newLinkTitle,
        url: newLinkUrl,
        linkType: newLinkType,
        socialPlatform: newSocialPlatform || null, // Gửi null nếu rỗng
      });
      // Thêm vào *cuối* danh sách thay vì đầu để giữ thứ tự tự nhiên hơn
      setLinks((prevLinks) => [...prevLinks, response.data]);
      setNewLinkTitle("");
      setNewLinkUrl("");
      setNewLinkType("link");
      setNewSocialPlatform("");
      toast.success("Thêm link thành công!");
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
    // Sử dụng modal confirm thay vì window.confirm để đẹp hơn (nếu có thư viện modal)
    if (!window.confirm("Xác nhận xóa link này?")) return;

    // Optimistic UI: Xóa khỏi state trước khi gọi API
    const originalLinks = [...links];
    setLinks((prevLinks) => prevLinks.filter((link) => link._id !== linkId));
    toast.loading("Đang xóa link...", { id: "delete-toast" }); // Thông báo đang xóa

    try {
      await api.delete(`/api/user/links/${linkId}`);
      toast.success("Xóa link thành công!", { id: "delete-toast" });
    } catch (err) {
      console.error(
        "Error deleting link:",
        err.response ? err.response.data : err.message
      );
      toast.error(err.response?.data?.message || "Lỗi khi xóa link.", {
        id: "delete-toast",
      });
      // Rollback nếu lỗi
      setLinks(originalLinks);
    }
  };

  const handleStartEdit = (link) => {
    setEditingLinkId(link._id);
    setEditFormData({
      title: link.title,
      url: link.url,
      linkType: link.linkType || "link",
      socialPlatform: link.socialPlatform || "",
    });
    // Scroll tới item đang edit nếu danh sách dài (cần thêm logic)
  };

  const handleCancelEdit = () => {
    setEditingLinkId(null);
    // Không cần reset form data ở đây vì nó sẽ được set lại khi bắt đầu edit link khác
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateLink = async () => {
    if (!editFormData.title || !editFormData.url) {
      toast.error("Tiêu đề và URL không được để trống.");
      return;
    }
    try {
      new URL(editFormData.url);
    } catch (err) {
      toast.error("URL không hợp lệ.");
      return;
    }
    setIsSavingEdit(true);
    try {
      const response = await api.put(`/api/user/links/${editingLinkId}`, {
        title: editFormData.title,
        url: editFormData.url,
        linkType: editFormData.linkType,
        socialPlatform: editFormData.socialPlatform || null,
      });
      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link._id === editingLinkId ? response.data : link
        )
      );
      handleCancelEdit(); // Thoát chế độ edit
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
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-8 flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <span className="sr-only">Đang tải dữ liệu links...</span>
      </div>
    );
  }

  // --- Render Main Content ---
  return (
    // Container chính - Giữ nguyên style glassy
    <div className="bg-white/85 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20">
      <div className="p-6 md:p-8 space-y-8">
        {" "}
        {/* Thêm space-y tổng thể */}
        {/* Tiêu đề chính */}
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Quản lý Liên kết
        </h2>
        {/* === KHU VỰC THÊM LINK MỚI (CARD) === */}
        <div className="bg-gradient-to-br from-gray-50/70 to-indigo-50/30 p-6 rounded-lg shadow border border-gray-200/60">
          {/* Tiêu đề cho khu vực thêm mới */}
          <h3 className="text-lg font-semibold mb-5 text-gray-800 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-indigo-600" />{" "}
            {/* Icon tiêu đề */}
            Thêm liên kết mới
          </h3>

          <form onSubmit={handleAddLink} className="space-y-4">
            {/* Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              {/* Input Title */}
              <div>
                <label
                  htmlFor="newLinkTitle"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  id="newLinkTitle"
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                  placeholder="VD: Trang Facebook cá nhân"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  required
                />
              </div>

              {/* Input URL */}
              <div>
                <label
                  htmlFor="newLinkUrl"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  id="newLinkUrl"
                  type="url"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                  placeholder="https://example.com"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  required
                />
              </div>

              {/* Select Loại Nội Dung */}
              <div>
                {/* Đổi label thành "Hiển thị" cho ngắn gọn */}
                <label
                  htmlFor="newLinkType"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Kiểu hiển thị
                </label>
                <select
                  id="newLinkType"
                  name="linkType"
                  value={newLinkType}
                  onChange={(e) => setNewLinkType(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150">
                  <option value="link">Chỉ hiển thị Link</option>
                  <option value="youtube">Nhúng Video YouTube</option>
                  <option value="spotify">Nhúng Nhạc Spotify</option>
                </select>
              </div>

              {/* Select Nền Tảng MXH */}
              <div>
                <label
                  htmlFor="newSocialPlatform"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Icon Nền tảng (Tùy chọn)
                </label>
                <select
                  id="newSocialPlatform"
                  name="socialPlatform"
                  value={newSocialPlatform}
                  onChange={(e) => setNewSocialPlatform(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150">
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
                  {/* Có thể thêm Youtube/Spotify ở đây nếu muốn chọn icon thủ công */}
                </select>
              </div>
            </div>

            {/* Nút Thêm Link */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isAdding}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out">
                {isAdding ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5 mr-1 -ml-1" />
                )}
                {isAdding ? "Đang thêm..." : "Thêm Link"}
              </button>
            </div>
          </form>
        </div>
        {/* === KẾT THÚC KHU VỰC THÊM LINK MỚI === */}
        {/* === KHU VỰC DANH SÁCH LINKS === */}
        {/* Bỏ <hr>, dùng khoảng cách tự nhiên từ space-y-8 của div cha */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Danh sách Liên kết ({links.length})
          </h3>
          {links.length === 0 ? (
            // Trạng thái rỗng
            <div className="text-center py-12 px-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50">
              <Inbox
                className="mx-auto h-12 w-12 text-gray-400"
                strokeWidth={1.5}
              />
              <h4 className="mt-2 text-base font-semibold text-gray-800">
                Chưa có liên kết nào
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                Hãy thêm liên kết đầu tiên của bạn ở khu vực trên.
              </p>
            </div>
          ) : (
            // Danh sách
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={links.map((link) => link._id)}
                strategy={verticalListSortingStrategy}>
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
                      isSavingEdit={isSavingEdit && editingLinkId === link._id}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </div>
        {/* === KẾT THÚC KHU VỰC DANH SÁCH LINKS === */}
      </div>{" "}
      {/* Kết thúc padding container */}
    </div> // Kết thúc container chính
  );
}
