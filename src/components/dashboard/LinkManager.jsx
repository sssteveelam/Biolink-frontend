import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // Điều chỉnh đường dẫn nếu cần

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

export default function LinkManager() {
  const { authState } = useContext(AuthContext);
  const [links, setLinks] = useState([]); // State chứa mảng các link
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho form thêm link mới
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false); // Loading khi thêm link
  const [addError, setAddError] = useState(""); // Lỗi riêng cho form add

  // State cho việc sửa link
  const [editingLinkId, setEditingLinkId] = useState(null); // Lưu ID của link đang được sửa, null nghĩa là không sửa link nào
  const [editFormData, setEditFormData] = useState({
    title: "",
    url: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false); // Loading khi bấm nút Lưu (sửa)
  const [editError, setEditError] = useState(""); // Lỗi riêng cho form sửa

  // --- Helper function tạo config ---
  const createAuthConfig = () => {
    if (!authState.token) return null;
    return { headers: { Authorization: `Bearer ${authState.token}` } };
  };

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
    const config = createAuthConfig();
    // if (!config) return;
    try {
      await axios.put(
        "http://localhost:3001/api/user/links/reorder",
        { orderedLinkIds },
        config
      );
      console.log("Links reordered successfully on backend.");
      // Có thể thêm thông báo thành công tự ẩn đi
      // setSuccessMessage("Đã cập nhật thứ tự link!");
      // setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error(
        "Error calling reorder API:",
        err.response ? err.response.data : err.message
      );
      setError(
        "Lỗi khi lưu thứ tự link mới. Vui lòng tải lại trang để xem thứ tự đúng."
      );
      // TODO: Lý tưởng nhất là phải rollback lại state links về trạng thái trước khi kéo thả nếu API lỗi
      // Hoặc đơn giản là fetch lại toàn bộ links từ đầu
    }
  };

  // --- Fetch links khi component mount ---
  useEffect(() => {
    const fetchLinks = async () => {
      const config = createAuthConfig();
      if (!config) {
        setError("Authentication token not found.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "http://localhost:3001/api/user/links",
          config
        );

        setLinks(response.data || []); // Set links hoặc mảng rỗng
      } catch (err) {
        console.error(
          "Error fetching links:",
          err.response ? err.response.data : err.message
        );
        setError("Lỗi khi tải danh sách links.");
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
      setAddError("Vui lòng nhập cả Tiêu đề và URL.");
      return;
    }

    const config = createAuthConfig();
    if (!config) return;

    setIsAdding(true);
    setAddError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/user/links",
        { title: newLinkTitle, url: newLinkUrl },
        config
      );

      // Thêm link mới vào đầu danh sách hiện tại để UI cập nhật ngay
      setLinks((prevLinks) => [response.data, ...prevLinks]);
      setNewLinkTitle(""); // Reset form
      setNewLinkUrl(""); // Reset form
      // Có thể thêm thông báo thành công nếu muốn
    } catch (err) {
      console.error(
        "Error adding link:",
        err.response ? err.response.data : err.message
      );
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

    const config = createAuthConfig();
    if (!config) return;

    // Có thể set trạng thái loading riêng cho việc xóa nếu muốn

    try {
      await axios.delete(
        `http://localhost:3001/api/user/links/${linkId}`,
        config
      );
      // Xóa link khỏi state để UI cập nhật
      setLinks((prevLinks) => prevLinks.filter((link) => link._id !== linkId));
      // Có thể thêm thông báo thành công
    } catch (err) {
      console.err(
        "Error deleteing link:",
        err.response ? err.response.data : err.message
      );
      setError(err.response?.data?.message || "Lỗi khi xóa link."); // Hiển thị lỗi chung
    }
  };

  // Hàm được gọi khi nhấn nút "Sửa"
  const handleStartEdit = (link) => {
    setEditingLinkId(link._id);
    setEditFormData({ title: link.title, url: link.url });
    setError(""); // Xóa lỗi chung (nếu có)
    setAddError(""); // Xóa lỗi form add (nếu có)
    setEditError(""); // Xóa lỗi form edit cũ (nếu có)
  };

  // Hàm được gọi khi nhấn nút "Hủy" trong lúc sửa
  const handleCancelEdit = () => {
    setEditingLinkId(null);
    setEditFormData({ title: "", url: "" });
    setEditError("");
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
      setEditError("Vui lòng nhập cả Tiêu đề và URL.");
      return;
    }
    const config = createAuthConfig();
    if (!config || !editingLinkId) return; // Cần có token và link ID đang sửa

    setIsSavingEdit(true);
    setEditError("");

    try {
      const response = await axios.put(
        `http://localhost:3001/api/user/links/${editingLinkId}`, // API cập nhật link,
        { title: editFormData.title, url: editFormData.url },
        config
      );
      // Cập nhật lại mảng links trong state với dữ liệu mới nhất từ server
      setLinks((prevLinks) =>
        prevLinks.map(
          (link) => (link._id === editingLinkId ? response.data : link) // Nếu đúng link đang sửa thì thay bằng data mới, không thì giữ nguyên
        )
      );

      handleCancelEdit(); // Thoát khỏi chế độ sửa sau khi lưu thành công
      // Có thể thêm thông báo thành công
    } catch (err) {
      console.error(
        "Error updating link:",
        err.response ? err.response.data : err.message
      );
      setEditError(err.response?.data?.message || "Lỗi khi cập nhật link.");
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
        {addError && <p className="text-sm text-red-600">{addError}</p>}
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
      {error && (
        <p className="text-sm text-red-600 bg-red-100 p-2 rounded mb-3">
          {error}
        </p>
      )}
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
