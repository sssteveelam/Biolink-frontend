import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { Save, Loader2, UploadCloud, Check } from "lucide-react"; // Thêm icon Save và Loader2

export default function ProfileSettings() {
  const { authState } = useContext(AuthContext);
  const [bio, setBio] = useState("");
  const [themeColor, setThemeColor] = useState("#ffffff");
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [textColor, setTextColor] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [buttonStyle, setButtonStyle] = useState("rounded-lg"); // Giá trị khởi tạo nên giống default ở backend

  // giữ nguyên themeStyles như bạn đang có
const themeStyles = {
  "custom-color-#e0e0e0": "#e0e0e0",
  "gradient-sunset": "linear-gradient(to right, #ff7e5f, #feb47b)",
  "gradient-ocean": "linear-gradient(to right, #00c6ff, #0072ff)",
  "image-forest":
    "url(https://ik.imagekit.io/pemon1psn/maxresdefault.jpg?updatedAt=1760520744494)",
  "image-mountain":
    "url(https://ik.imagekit.io/pemon1psn/premium_photo-1672115680958-54438df0ab82.jfif?updatedAt=1760521599441)",
  "image-hagiang":
    "url(https://ik.imagekit.io/pemon1psn/the-adventour-road-in-ha-giang-loop.jpg?updatedAt=1760521661516)",
  "image-Home":
    "url(https://ik.imagekit.io/pemon1psn/design-your-dream-home.jpg?updatedAt=1760521698259)",
  "image-cat":
    "url(https://ik.imagekit.io/pemon1psn/thumb-1920-1348497.png?updatedAt=1760521832100)",
  "image-driver":
    "url(https://ik.imagekit.io/pemon1psn/photo-1704340142770-b52988e5b6eb.jfif?updatedAt=1760521897560)",
  "image-sky":
    "url(https://ik.imagekit.io/pemon1psn/photo-1657598339759-fd1432d833f0.jfif?updatedAt=1760521933255)",
  "image-strawberry":
    "url(https://ik.imagekit.io/pemon1psn/photo-1560239659-35501685e108.jfif?updatedAt=1760521970870)",
  "image-glassmorphism":
    "url(https://ik.imagekit.io/pemon1psn/premium_photo-1671308539073-ebf8985a6a11.jfif?updatedAt=1760522013945)",
  "image-neon":
    "url(https://ik.imagekit.io/pemon1psn/realistic-neon-lights-background_23-2148916637.jpg?updatedAt=1760522100634)",
  "image-maybay":
    "url(https://ik.imagekit.io/pemon1psn/Cac-may-bay-thuong-mai.webp?updatedAt=1760522130577)",
};

// NEW: predefinedThemes đã được chuyển link ảnh sang từ themeStyles
const predefinedThemes = [
  {
    id: "custom-color-#e0e0e0",
    name: "Màu tùy chọn",
    previewStyle: { backgroundColor: "#e0e0e0" },
  },
  {
    id: "gradient-sunset",
    name: "Hoàng hôn",
    previewStyle: { backgroundImage: "linear-gradient(to right, #ff7e5f, #feb47b)" },
    value: {
      type: "gradient",
      style: "linear-gradient(to right, #ff7e5f, #feb47b)",
      primaryColor: "#feb47b",
    },
  },
  {
    id: "gradient-ocean",
    name: "Đại dương",
    previewStyle: { backgroundImage: "linear-gradient(to right, #00c6ff, #0072ff)" },
    value: {
      type: "gradient",
      style: "linear-gradient(to right, #00c6ff, #0072ff)",
      primaryColor: "#0072ff",
    },
  },

  // --- IMAGE THEMES (đã dùng link từ themeStyles) ---
  {
    id: "image-forest",
    name: "Rừng xanh",
    previewStyle: {
      backgroundImage: themeStyles["image-forest"],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    value: {
      type: "image",
      style: themeStyles["image-forest"],
      primaryColor: "#228B22",
    },
  },
  {
    id: "image-mountain",
    name: "Núi tuyết",
    previewStyle: {
      backgroundImage: themeStyles["image-mountain"],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    value: {
      type: "image",
      style: themeStyles["image-mountain"],
      primaryColor: "#ADD8E6",
    },
  },
  {
    id: "image-hagiang",
    name: "Hà Giang",
    previewStyle: {
      backgroundImage: themeStyles["image-hagiang"],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    value: {
      type: "image",
      style: themeStyles["image-hagiang"],
      primaryColor: "#9fb43d",
    },
  },
  {
    id: "image-Home",
    name: "Home",
    previewStyle: {
      backgroundImage: themeStyles["image-Home"],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    value: {
      type: "image",
      style: themeStyles["image-Home"],
      primaryColor: "#9fb43d",
    },
  },
  {
    id: "image-cat",
    name: "Cat",
    previewStyle: {
      backgroundImage: themeStyles["image-cat"],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    value: {
      type: "image",
      style: themeStyles["image-cat"],
      primaryColor: "#9fb43d",
    },
  },
  {
    id: "image-driver",
    name: "Driver",
    previewStyle: {
      backgroundImage: themeStyles["image-driver"],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    value: {
      type: "image",
      style: themeStyles["image-driver"],
      primaryColor: "#9fb43d",
    },
  },
  {
    id: "image-sky",
    name: "Sky",
    previewStyle: {
      backgroundImage: themeStyles["image-sky"],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    value: {
      type: "image",
      style: themeStyles["image-sky"],
      primaryColor: "#9fb43d",
    },
  },
  {
    id: "image-strawberry",
    name: "Strawberry",
    previewStyle: {
      backgroundImage: themeStyles["image-strawberry"],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    value: {
      type: "image",
      style: themeStyles["image-strawberry"],
      primaryColor: "#9fb43d",
    },
  },
  {
    id: "image-glassmorphism",
    name: "Glassmorphism",
    previewStyle: {
      backgroundImage: themeStyles["image-glassmorphism"],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    value: {
      type: "image",
      style: themeStyles["image-glassmorphism"],
      primaryColor: "#9fb43d",
    },
  },
  {
    id: "image-neon",
    name: "Neon",
    previewStyle: {
      backgroundImage: themeStyles["image-neon"],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    value: {
      type: "image",
      style: themeStyles["image-neon"],
      primaryColor: "#9fb43d",
    },
  },
  {
    id: "image-maybay",
    name: "Máy bay",
    previewStyle: {
      backgroundImage: themeStyles["image-maybay"],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    value: {
      type: "image",
      style: themeStyles["image-maybay"],
      primaryColor: "#9fb43d",
    },
  },
];

  // --- Fetch profile data ---
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/user/profile/me");
        if (response.data) {
          setBio(response.data.bio || "");
          // Đảm bảo themeColor luôn là một string mã màu hợp lệ
          setThemeColor(
            response.data.themeColor &&
              /^#[0-9A-F]{6}$/i.test(response.data.themeColor)
              ? response.data.themeColor
              : "#ffffff"
          );

          setButtonStyle(response.data.buttonStyle || "rounded-lg"); // Lấy từ API hoặc dùng default
          setSelectedThemeId(
            response.data.selectedThemeId === undefined
              ? null
              : response.data.selectedThemeId
          );
          setTextColor(response.data.textColor || "");
        } else {
          setBio("");
          setThemeColor("#ffffff");
          setButtonStyle("rounded-lg"); // Reset về default nếu không có profile
          setSelectedThemeId(null);
          setTextColor("");
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.log("Profile not found, using default values.");
          setBio("");
          setThemeColor("#ffffff");
          setSelectedThemeId(null);
        } else {
          console.error(
            "Error fetching profile:",
            err.response ? err.response.data : err.message
          );
          toast.error("Lỗi khi tải thông tin profile");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [authState.token]);

  // --- Handle profile update ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await api.put("/api/user/profile/me", {
        bio,
        themeColor,
        buttonStyle,
        selectedThemeId,
        textColor: textColor || null,
      });
      // Cập nhật lại state để đảm bảo đồng bộ sau khi lưu
      setBio(response.data.bio || "");
      setThemeColor(
        response.data.themeColor &&
          /^#[0-9A-F]{6}$/i.test(response.data.themeColor)
          ? response.data.themeColor
          : "#ffffff"
      );
      setButtonStyle(response.data.buttonStyle || "rounded-lg");
      setSelectedThemeId(
        response.data.selectedThemeId === undefined
          ? null
          : response.data.selectedThemeId
      );
      setTextColor(response.data.textColor || ""); // <<< Cập nhật textColor state

      toast.success("Cập nhật profile thành công!");
    } catch (err) {
      console.error(
        "Error updating profile:",
        err.response ? err.response.data : err.message
      );
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle File Change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      // Tạo preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSource(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewSource(null);
      toast.error("Vui lòng chọn một file ảnh hợp lệ.");
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn ảnh trước khi tải lên.");
      return;
    }
    setIsUploading(true);

    // Tạo FormData object
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    // 'avatar' phải khớp với tên field trong `upload.single('avatar')` ở backend

    try {
      // Gọi API backend bằng Axios
      const response = await api.put("/api/user/avatar", formData, {
        headers: {
          // Axios thường tự set Content-Type là multipart/form-data khi bạn gửi FormData
          // nhưng nếu có vấn đề, bạn có thể thử thêm header này:
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message || "Upload avatar thành công!");

      // --- Cập nhật AuthContext ---
      // Cách 1: Nếu API trả về đủ thông tin user mới
      if (response.data.user) {
        // Giả sử bạn có hàm `updateUser` trong AuthContext
        // updateUser(response.data.user);
        // Hoặc gọi lại login nếu cần cập nhật cả token (thường không cần)
        // login(authState.token, response.data.user);

        // ==> Tạm thời, cách đơn giản nhất là reload lại trang để context tự lấy user mới
        window.location.reload(); // Hơi xấu nhưng đảm bảo context được cập nhật
      }

      setSelectedFile(null); // Reset state sau khi upload
      setPreviewSource(null);
    } catch (err) {
      console.error(
        "Avatar Upload Error:",
        err.response ? err.response.data : err.message
      );
      toast.error(err.response?.data?.message || "Upload avatar thất bại.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- Handle Chọn Theme ---
  const handleThemeSelect = (theme) => {
    setSelectedThemeId(theme.id);
    if (theme.id !== null && theme.value?.primaryColor) {
      setThemeColor(theme.value.primaryColor);
    }
    // Nếu bạn muốn màu của color picker không đổi khi chọn theme ảnh/gradient thì bỏ if trên đi
  };

  // --- Render Loading State ---
  if (isLoading) {
    return (
      // Container loading với style glassy
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/15 p-6 md:p-8 flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="sr-only">Đang tải cài đặt profile...</span>
      </div>
    );
  }

  // --- Render Main Content ---
  return (
    // Container chính - ĐÃ ÁP DỤNG STYLE "GLASSY" VÀ VIỀN MỜ
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/15">
      {/* Thêm padding bên trong */}
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Cài đặt Profile
        </h3>
        <form onSubmit={handleProfileUpdate} className="space-y-5">
          {/* Avatar */}
          <div>
            <label
              htmlFor="avatarInput"
              className="block text-sm font-medium text-gray-600 mb-1">
              Ảnh đại diện
            </label>
            {/* Hiển thị ảnh hiện tại (nếu có) */}
            {(authState.user?.avatarUrl || previewSource) && ( // Ưu tiên hiển thị preview nếu có
              <img
                src={previewSource || authState.user.avatarUrl} // Dùng preview hoặc avatarUrl từ context
                alt="Avatar preview"
                className="w-20 h-20 rounded-full object-cover mb-2 border border-gray-300"
              />
            )}
            <input
              type="file"
              id="avatarInput"
              accept="image/*" // Chỉ chấp nhận file ảnh
              onChange={handleFileChange} // Hàm xử lý khi chọn file
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {/* Nút Upload (chỉ hiện khi đã chọn file) */}
            {selectedFile && (
              <button
                type="button" // Quan trọng: không phải submit form profile
                onClick={handleAvatarUpload} // Hàm xử lý upload
                disabled={isUploading}
                className="mt-2 inline-flex items-center justify-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60">
                {isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4 mr-2" /> // Thay icon Upload nếu muốn
                )}
                {isUploading ? "Đang tải lên..." : "Tải lên ảnh này"}
              </button>
            )}
          </div>
          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-600 mb-1">
              Tiểu sử (Bio)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              maxLength="160"
              // Style textarea nhất quán, viền mềm hơn, thêm transition
              className="block w-full px-3 py-2 border border-gray-300/70 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Giới thiệu ngắn về bạn..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {bio.length}/160 ký tự
            </p>{" "}
            {/* Căn phải cho đẹp */}
          </div>
          {/* === THÊM PHẦN CHỌN MÀU CHỮ === */}
          <div>
            <label
              htmlFor="textColorPicker"
              className="block text-sm font-medium text-gray-600 mb-1">
              Màu chữ (Tên, Tiểu sử)
            </label>
            <div className="flex items-center space-x-3">
              <input
                id="textColorPicker"
                name="textColorPicker"
                type="color"
                className="h-10 w-14 p-1 border border-gray-300/70 rounded-md cursor-pointer shadow-sm"
                value={textColor || "#000000"} // Hiển thị màu đen nếu chưa chọn
                onChange={(e) => setTextColor(e.target.value)}
              />
              <input
                id="textColorText"
                name="textColorText"
                type="text"
                className="blockPublicProfilePage w-full px-3 py-2 border border-gray-300/70 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                placeholder="Để trống để dùng màu tự động" // Gợi ý cho người dùng
                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                title="Nhập mã màu dạng #rrggbb hoặc #rgb"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Để trống trường này nếu bạn muốn màu chữ tự động tương phản với
              màu nền.
            </p>
          </div>
          {/* ============================ */}

          {/* Theme Color */}
          <div>
            <label
              htmlFor="themeColor"
              className="block text-sm font-medium text-gray-600 mb-1">
              Màu chủ đề
            </label>
            <div className="flex items-center space-x-3">
              {/* Color Picker */}
              <input
                id="themeColorPicker" // Đổi id để tránh trùng với input text
                name="themeColorPicker"
                type="color"
                // Style viền mềm hơn
                className="h-10 w-14 p-1 border border-gray-300/70 rounded-md cursor-pointer shadow-sm"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
              />
              {/* Text Input for Color Code */}
              <input
                id="themeColorText" // Đổi id
                name="themeColorText"
                type="text"
                // Style input nhất quán, viền mềm hơn, thêm transition
                className="block w-full px-3 py-2 border border-gray-300/70 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)} // Cho phép nhập tay mã màu
                placeholder="#ffffff"
                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" // Pattern để validate mã hex cơ bản
                title="Nhập mã màu dạng #rrggbb hoặc #rgb"
              />
            </div>
          </div>
          {/* Phần chọn kiểu nút */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Kiểu nút link
            </label>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {" "}
              {/* Dùng flex-wrap để xuống dòng nếu không đủ chỗ */}
              {/* Option 1: Bo tròn */}
              <div className="flex items-center">
                <input
                  id="style-rounded-full"
                  name="buttonStyleOption"
                  type="radio"
                  value="rounded-full"
                  checked={buttonStyle === "rounded-full"}
                  onChange={(e) => setButtonStyle(e.target.value)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label
                  htmlFor="style-rounded-full"
                  className="ml-2 block text-sm text-gray-700">
                  Bo tròn
                </label>
              </div>
              {/* Option 2: Bo góc */}
              <div className="flex items-center">
                <input
                  id="style-rounded-lg"
                  name="buttonStyleOption"
                  type="radio"
                  value="rounded-lg"
                  checked={buttonStyle === "rounded-lg"}
                  onChange={(e) => setButtonStyle(e.target.value)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label
                  htmlFor="style-rounded-lg"
                  className="ml-2 block text-sm text-gray-700">
                  Bo góc
                </label>
              </div>
              {/* Option 3: Vuông */}
              <div className="flex items-center">
                <input
                  id="style-rounded-none"
                  name="buttonStyleOption"
                  type="radio"
                  value="rounded-none"
                  checked={buttonStyle === "rounded-none"}
                  onChange={(e) => setButtonStyle(e.target.value)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label
                  htmlFor="style-rounded-none"
                  className="ml-2 block text-sm text-gray-700">
                  Vuông
                </label>
              </div>
            </div>
          </div>

          {/* === PHẦN CHỌN THEME CÓ SẴN === */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Hoặc chọn chủ đề có sẵn
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {predefinedThemes.map((theme) => (
                <div key={theme.id || "custom"} className="text-center">
                  <button
                    type="button" // Quan trọng: không submit form
                    onClick={() => handleThemeSelect(theme)}
                    className={`w-full h-16 rounded-lg border-2 transition duration-150 ease-in-out overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                   ${
                                     selectedThemeId === theme.id
                                       ? "border-indigo-600 ring-2 ring-indigo-400 ring-offset-1"
                                       : "border-gray-300 hover:border-indigo-400"
                                   }`}
                    style={theme.previewStyle} // Áp dụng style preview
                    aria-label={`Chọn theme ${theme.name}`}
                    title={theme.name}>
                    {/* Có thể thêm icon Check khi được chọn */}
                    {selectedThemeId === theme.id && theme.id !== null && (
                      <div className=" bg-black/30 flex items-center justify-center">
                        <Check className="w-6 h-15 text-white" />
                      </div>
                    )}
                  </button>
                  <span className="block text-xs text-gray-600 mt-1 truncate">
                    {theme.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* ================================ */}

          {/* Save Button */}
          <div>
            <button
              type="submit"
              disabled={isSaving}
              // Style nút tương tự các nút khác, dùng gradient, chữ trắng, thêm icon
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out">
              {isSaving ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" /> // Icon Save
              )}
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>{" "}
      {/* Kết thúc padding container */}
    </div> // Kết thúc container chính ProfileSettings
  );
}
