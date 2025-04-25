import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Điều chỉnh đường dẫn nếu cần
import api from "../../api/axiosConfig";

import {
  DndContext,
  closestCenter, // Hoặc closestCorners tùy chiến lược phát hiện va chạm
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy, // Chiến lược sắp xếp theo chiều dọc
} from "@dnd-kit/sortable";
import SortableLinkItem from "./SortableLinkItem"; // Import component mới
import toast from "react-hot-toast";

export default function LinkManager() {
  const { authState } = useContext(AuthContext);
  const [links, setLinks] = useState([]); // State chứa mảng các link
  const [isLoading, setIsLoading] = useState(true);

  // State cho form thêm link mới
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false); // Loading khi thêm link

  // State cho việc sửa link
  const [editingLinkId, setEditingLinkId] = useState(null); // Lưu ID của link đang được sửa, null nghĩa là không sửa link nào
  const [editFormData, setEditFormData] = useState({
    title: "",
    url: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false); // Loading khi bấm nút Lưu (sửa)

  // ------- For drag drop func
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Đảm bảo là kéo và thả vào một vị trí hợp lệ và khác vị trí ban đầu
    if (over && active.id !== over.id) {
      // Cập nhật thứ tự trong state links ngay lập tức (Optimistic Update)
      setLinks((currentLinks) => {
        const oldIndex = currentLinks.findIndex(
          (item) => item._id === active.id
        );
        const newIndex = currentLinks.findIndex((item) => item._id === over.id);
        // Dùng hàm arrayMove từ dnd-kit để lấy mảng mới đã sắp xếp
        const newOrderedLinks = arrayMove(currentLinks, oldIndex, newIndex);

        // Lấy mảng các ID theo thứ tự mới để gửi lên API
        const orderedLinkIds = newOrderedLinks.map((link) => link._id);

        // Gọi API để cập nhật thứ tự trên backend (không cần await ở đây vì đã update UI)
        callReorderApi(orderedLinkIds);

        // Trả về mảng đã sắp xếp mới cho state
        return newOrderedLinks;
      });
    }
  };

  // Hàm gọi API reorder (tách riêng cho rõ ràng)
  const callReorderApi = async (orderedLinkIds) => {
    try {
      await api.put("/api/user/links/reorder", { orderedLinkIds });
      toast.success("Đã cập nhật thứ tự link!");
    } catch (err) {
      console.error(
        "Error calling reorder API:",
        err.response ? err.response.data : err.message
      );

      toast.error(
        "Lỗi khi lưu thứ tự link mới. Vui lòng tải lại trang để xem thứ tự đúng."
      );
    }
  };

  // --- Fetch links khi component mount ---
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

  // --- Hàm xử lý thêm link mới ---
  const handleAddLink = async (e) => {
    e.preventDefault();

    if (!newLinkTitle || !newLinkUrl) {
      toast.error("Vui lòng nhập cả Tiêu đề và URL.");
      return;
    }

    setIsAdding(true);

    try {
      const response = await api.post("/api/user/links", {
        title: newLinkTitle,
        url: newLinkUrl,
      });

      // Thêm link mới vào đầu danh sách hiện tại để UI cập nhật ngay
      setLinks((prevLinks) => [response.data, ...prevLinks]);
      setNewLinkTitle(""); // Reset form
      setNewLinkUrl(""); // Reset form

      toast.success("Thêm link thành công!");
    } catch (err) {
      console.error(
        "Error adding link:",
        err.response ? err.response.data : err.message
      );

      toast.error("Thêm link thất bại!");
    } finally {
      setIsAdding(false);
    }
  };

  // --- Hàm xử lý xóa link ---
  const handleDeleteLink = async (linkId) => {
    // Hỏi xác nhận trước khi xóa
    if (!window.confirm("Bạn có chắc chắn muốn xóa link này chứ hẻ?")) {
      return;
    }

    try {
      await api.delete(`/api/user/links/${linkId}`);
      // Xóa link khỏi state để UI cập nhật
      setLinks((prevLinks) => prevLinks.filter((link) => link._id !== linkId));
      // Có thể thêm thông báo thành công
      toast.success("Xóa link thành công!");
    } catch (err) {
      console.err(
        "Error deleteing link:",
        err.response ? err.response.data : err.message
      );
      toast.error(`${err.response?.data?.message || "Lỗi khi xóa link."}`);
    }
  };

  // Hàm được gọi khi nhấn nút "Sửa"
  const handleStartEdit = (link) => {
    setEditingLinkId(link._id);
    setEditFormData({ title: link.title, url: link.url });
  };

  // Hàm được gọi khi nhấn nút "Hủy" trong lúc sửa
  const handleCancelEdit = () => {
    setEditingLinkId(null);
    setEditFormData({ title: "", url: "" });
  };

  // Hàm được gọi khi thay đổi nội dung trong form sửa
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    // Cập nhật state của form sửa dựa vào name của input
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Hàm được gọi khi nhấn nút "Lưu" trong lúc sửa
  const handleUpdateLink = async () => {
    if (!editFormData.title || !editFormData.url) {
      toast.error("Vui lòng nhập cả Tiêu đề và URL.");
      return;
    }

    setIsSavingEdit(true);

    try {
      const response = await api.put(
        `/api/user/links/${editingLinkId}`, // API cập nhật link,
        { title: editFormData.title, url: editFormData.url }
      );
      // Cập nhật lại mảng links trong state với dữ liệu mới nhất từ server
      setLinks((prevLinks) =>
        prevLinks.map(
          (link) => (link._id === editingLinkId ? response.data : link) // Nếu đúng link đang sửa thì thay bằng data mới, không thì giữ nguyên
        )
      );

      handleCancelEdit(); // Thoát khỏi chế độ sửa sau khi lưu thành công
      // Có thể thêm thông báo thành công
      toast.success("Cập nhật link thông công!");
    } catch (err) {
      console.error(
        "Error updating link:",
        err.response ? err.response.data : err.message
      );
      toast.error(`${err.response?.data?.message || "Lỗi khi cập nhật link."}`);
    } finally {
      setIsSavingEdit(false);
    }
  };
  // --- Render ---
  if (isLoading) {
    return (
      <div className="text-center p-4 mt-6">Đang tải danh sách links...</div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Quản lý Links
      </h3>

      {/* --- Form Thêm Link Mới --- */}
      <form
        onSubmit={handleAddLink}
        className="mb-6 p-4 border rounded-md bg-gray-50 space-y-3">
        <h4 className="text-lg font-medium text-gray-700">Thêm Link Mới</h4>

        <div>
          <label
            htmlFor="newLinkTitle"
            className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề
          </label>
          <input
            id="newLinkTitle"
            type="text"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Ví dụ: Blog cá nhân"
            value={newLinkTitle}
            onChange={(e) => setNewLinkTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="newLinkUrl"
            className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            id="newLinkUrl"
            type="url" // Dùng type url để trình duyệt có thể validate cơ bản
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="https://example.com"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isAdding}
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-green-600 hover:bg-green-700 disabled:opacity-50">
          {isAdding ? "Đang thêm..." : "Thêm Link"}
        </button>
      </form>

      {/* --- Danh Sách Links Hiện Có --- */}
      <h4 className="text-lg font-medium text-gray-700 mb-3">
        Danh sách Links
      </h4>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter} // Chiến lược phát hiện va chạm
        onDragEnd={handleDragEnd} // Gắn hàm xử lý khi kéo xong
      >
        <SortableContext
          items={links.map((link) => link._id)} // Cung cấp mảng các ID cho context
          strategy={verticalListSortingStrategy} // Dùng chiến lược sắp xếp dọc
        >
          <ul className="space-y-3">
            {links.map((link) => (
              // Bây giờ dùng SortableLinkItem thay vì li trực tiếp
              <SortableLinkItem
                key={link._id}
                id={link._id} // id phải được truyền vào đây
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
    </div>
  );
}
