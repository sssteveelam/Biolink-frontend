import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { Loader2, AlertTriangle, CloudCog } from "lucide-react"; // Import icons
import getYoutubeVideoId from "../utils/youtubeUtils";

function PublicProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Bắt đầu với true để fetch ngay
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!username) {
        setIsLoading(false);
        setError("Không có username trong địa chỉ URL.");
        return;
      }

      setIsLoading(true);
      setError(null);
      setProfileData(null); // Reset data trước khi fetch mới

      try {
        const response = await api.get(
          `/api/profiles/${username.toLowerCase()}`
        );
        setProfileData(response.data);
      } catch (err) {
        console.error(
          "Error fetching public profile:",
          err.response ? err.response.data : err.message
        );
        if (err.response && err.response.status === 404) {
          setError(`Không tìm thấy người dùng "${username}".`);
        } else {
          setError("Lỗi khi tải trang profile. Vui lòng thử lại.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicProfile();
  }, [username]);

  // Lấy kiểu nút từ profile, nếu không có thì dùng kiểu default
  const currentButtonStyle = profileData?.profile.buttonStyle || "rounded-lg";
  console.log(profileData);

  // --- Render Loading ---
  if (isLoading) {
    return (
      // Spinner đẹp hơn, căn giữa màn hình
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        {" "}
        {/* Thêm nền tạm thời khi loading */}
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  // --- Render Error ---
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-6 bg-gray-50">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-6" />{" "}
        {/* Icon lỗi */}
        <p className="text-2xl md:text-3xl text-red-600 mb-3 font-semibold">
          Oops! Có lỗi xảy ra
        </p>
        <p className="text-lg text-gray-600 mb-8 max-w-md">{error}</p>
        {/* Có thể thêm nút quay lại hoặc làm mới */}
        <button
          onClick={() => window.location.reload()} // Nút làm mới trang đơn giản
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-base font-medium transition duration-150 ease-in-out">
          Thử lại
        </button>
      </div>
    );
  }

  // --- Render Profile Data ---
  if (!profileData || !profileData.user) {
    // Trường hợp hiếm gặp: API trả về 200 nhưng data rỗng
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-6 bg-gray-50">
        <AlertTriangle className="w-16 h-16 text-yellow-400 mb-6" />
        <p className="text-2xl md:text-3xl text-gray-700 mb-3 font-semibold">
          Không tìm thấy dữ liệu
        </p>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Không có dữ liệu profile để hiển thị cho người dùng này.
        </p>
      </div>
    );
  }

  const { user, profile, links } = profileData;
  // Đảm bảo themeColor hợp lệ, nếu không dùng màu xám nhạt làm fallback
  const themeColor =
    profile?.themeColor && /^#[0-9A-F]{6}$/i.test(profile.themeColor)
      ? profile.themeColor
      : "#F3F4F6"; // Màu xám nhạt Tailwind (bg-gray-100)
  const bio = profile?.bio || "";
  const displayName = user.name || `@${user.username}`;

  // Tính màu chữ tương phản (nên dùng helper function)
  const contrastColor = getContrastColor(themeColor);
  const subtleContrastColor = getContrastColor(themeColor, 0.8); // Màu chữ phụ, mờ hơn

  return (
    // Container chính với màu nền động và padding
    <div
      style={{ backgroundColor: themeColor }}
      className="min-h-screen py-12 md:py-16 px-4 transition-colors duration-300 ease-in-out">
      <div className="max-w-md mx-auto flex flex-col items-center">
        {/* Giảm max-width cho vừa màn hình điện thoại */}
        {/* Avatar */}
        <div className="mb-4">
          {" "}
          {/* Bọc trong div để dễ kiểm soát margin hơn */}
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`${displayName}'s avatar`}
              // Bo tròn hoàn hảo, kích thước lớn hơn, viền trắng dày hơn, đổ bóng đẹp
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-xl border-4 border-white"
            />
          ) : (
            // Placeholder avatar
            <div
              className="w-24 h-24 md:w-28 md:h-28 rounded-full shadow-xl bg-white/50 border-4 border-white flex items-center justify-center text-5xl font-bold"
              style={{ color: contrastColor }}>
              {/* Chữ cái đầu, màu tương phản */}
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {/* Tên */}
        <h1
          className="text-2xl md:text-3xl font-bold mb-2 text-center break-words px-2" // Giảm kích thước chữ, thêm padding ngang nhỏ
          style={{ color: contrastColor }}>
          {displayName}
        </h1>
        {/* Bio */}
        {bio && (
          <p
            className="text-base md:text-lg text-center mb-8 max-w-lg px-2" // Giảm mb, thêm padding ngang
            style={{ color: subtleContrastColor }}>
            {bio}
          </p>
        )}
        {/* Danh sách Links */}
        <div className="w-full max-w-lg flex flex-col items-center space-y-5">
          {links && links.length > 0 ? (
            links.map((link) => {
              // --- Kiểm tra loại link ---
              if (link.linkType === "youtube") {
                const videoId = getYoutubeVideoId(link.url); // Lấy ID video
                if (videoId) {
                  // Nếu lấy được ID, render iframe
                  return (
                    // Responsive YouTube Embed Container
                    <div
                      key={link._id}
                      className="w-full aspect-video overflow-hidden rounded-xl shadow-lg border border-gray-300/50">
                      {/* aspect-video của Tailwind giúp giữ tỷ lệ 16:9 */}
                      <iframe
                        className="w-full h-full" // Đảm bảo iframe chiếm hết container
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={link.title || "YouTube video player"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin" // Thêm referrerPolicy
                        allowFullScreen></iframe>
                    </div>
                  );
                } else {
                  // Nếu URL không đúng định dạng Youtube, có thể hiện link thường kèm thông báo
                  console.warn(
                    `Invalid YouTube URL for link ${link._id}: ${link.url}`
                  );
                  return (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full px-8 py-5 bg-white bg-opacity-90 backdrop-blur-md text-center text-xl font-semibold text-gray-900 shadow-lg hover:scale-105 hover:bg-opacity-100 transform transition duration-200 ease-in-out border border-white/40 ${currentButtonStyle}`} // Thêm class động vào cuối
                    >
                      {link.title} (URL YouTube không hợp lệ)
                    </a>
                  );
                }
              } else if (link.linkType === "spotify") {
                // Kiểm tra lại URL có vẻ hợp lệ không (tùy chọn)
                const isSpotifyEmbedUrl = link.url.startsWith(
                  "https://open.spotify.com/embed/"
                );

                if (isSpotifyEmbedUrl) {
                  return (
                    <div
                      key={link._id}
                      className="w-full h-full aspect-square md:aspect-video overflow-hidden rounded-xl shadow-lg border border-gray-300/50">
                      <iframe
                        className="w-full min-h-88" // Đảm bảo iframe chiếm hết container
                        src={link.url} // <-- SỬ DỤNG URL COPY TỪ SPOTIFY
                        allowFullScreen=""
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title={link.title || "Spotify Embed"}></iframe>
                    </div>
                  );
                } else {
                  // Xử lý nếu URL không đúng định dạng Spotify embed
                  console.warn(
                    `Invalid Spotify Embed URL for link ${link._id}: ${link.url}`
                  );
                  return (
                    <a
                      key={link._id}
                      href={link.url} // Vẫn dùng URL đã lưu, có thể nó là link share
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full px-8 py-5 bg-white bg-opacity-90 backdrop-blur-md text-center text-xl font-semibold text-gray-900 shadow-lg hover:scale-105 hover:bg-opacity-100 transform transition duration-200 ease-in-out border border-white/40 ${currentButtonStyle}`} // Thêm class động vào cuối
                    >
                      {link.title} (Link Spotify - Không nhúng được)
                    </a>
                  );
                }
              } else {
                return (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full px-8 py-5 bg-white bg-opacity-90 backdrop-blur-md text-center text-xl font-semibold text-gray-900 shadow-lg hover:scale-105 hover:bg-opacity-100 transform transition duration-200 ease-in-out border border-white/40 ${currentButtonStyle}`} // Thêm class động vào cuối
                  >
                    {link.title}
                  </a>
                );
              }
              // --- Kết thúc kiểm tra loại link ---
            })
          ) : (
            <p
              className="text-lg"
              style={{ color: getContrastColor(themeColor, 0.75) }}>
              Người dùng này chưa thêm link nào.
            </p>
          )}
        </div>
        {/* Footer */}
        <p
          className="mt-10 text-center text-xs"
          style={{ color: getContrastColor(themeColor, 0.6) }}>
          Powered by MyBiolink {/* Thay bằng tên ứng dụng của bạn */}
        </p>
      </div>
    </div>
  );
}
export default PublicProfilePage;

// Helper function (giữ nguyên hoặc cải tiến nếu cần)
function getContrastColor(hexcolor, opacity = 1) {
  try {
    if (!hexcolor || typeof hexcolor !== "string")
      return `rgba(0, 0, 0, ${opacity})`; // Đen nếu không có màu
    hexcolor = hexcolor.replace("#", "");
    if (hexcolor.length === 3)
      hexcolor = hexcolor
        .split("")
        .map((char) => char + char)
        .join("");
    if (hexcolor.length !== 6) return `rgba(0, 0, 0, ${opacity})`;

    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    // Ngưỡng 150 có vẻ cân bằng hơn cho nhiều màu sắc
    const color = yiq >= 150 ? "0, 0, 0" : "255, 255, 255";
    return `rgba(${color}, ${opacity})`;
  } catch (e) {
    console.error("Error calculating contrast color:", e);
    return `rgba(0, 0, 0, ${opacity})`;
  }
}
