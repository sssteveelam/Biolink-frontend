import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import {
  Loader2,
  AlertTriangle,
  CloudCog,
  Facebook,
  Instagram,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Globe,
  Link as LinkIcon,
  Youtube,
  Music,
  Share,
  Download,
  Clipboard,
} from "lucide-react"; // Import icons
import { AiFillTikTok } from "react-icons/ai";
import getYoutubeVideoId from "../utils/youtubeUtils";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";

function PublicProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Bắt đầu với true để fetch ngay
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isShareSectionVisible, setIsShareSectionVisible] = useState(false);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    document.title = username.toUpperCase();
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

  const currentButtonStyle = profileData?.profile.buttonStyle || "rounded-lg";

  // --- Render Loading ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  // --- Render Error ---
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-6 bg-gray-50">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-6" />{" "}
        <p className="text-2xl md:text-3xl text-red-600 mb-3 font-semibold">
          Oops! Có lỗi xảy ra
        </p>
        <p className="text-lg text-gray-600 mb-8 max-w-md">{error}</p>
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

  // ==========================

  // === XÁC ĐỊNH STYLE NỀN ===
  let backgroundStyle = {};
  const selectedThemeId = profile?.selectedThemeId;
  const themeColor =
    profile?.themeColor && /^#[0-9A-F]{6}$/i.test(profile.themeColor)
      ? profile.themeColor
      : "#ffffff";

  if (selectedThemeId && themeStyles[selectedThemeId]) {
    const themeValue = themeStyles[selectedThemeId];
    if (themeValue.startsWith("url(")) {
      // Là theme ảnh
      backgroundStyle = {
        backgroundImage: themeValue,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundColor: "#f3f4f6",
      };
    } else {
      // Là theme gradient
      backgroundStyle = {
        backgroundImage: themeValue,
        backgroundColor: themeColor,
      };
    }
  } else {
    backgroundStyle = {
      backgroundColor: themeColor,
    };
  }
  // ==========================

  const contrastColor = getContrastColor(
    backgroundStyle.backgroundColor || themeColor
  );

  const userTextColor = profile?.textColor;
  const finalTextColor = userTextColor || contrastColor;

  const bio = profile?.bio || "";
  const displayName = user.name || `@${user.username}`;

  // lọc links
  const socialLinks = links.filter(
    (link) =>
      link.socialPlatform &&
      link.socialPlatform !== "other" &&
      link.socialPlatform !== "website"
  );

  const regularLinks = links.filter(
    (link) =>
      !link.socialPlatform ||
      link.socialPlatform === "other" ||
      link.socialPlatform === "website"
  );
  const websiteLink = links.find((link) => link.socialPlatform === "website");

  /// Handle event click to process clickCount
  const handleLinkClick = async (linkId, linkUrl) => {
    if (!linkId || !linkUrl) return;

    try {
      api.post(`/api/user/links/${linkId}/click`); // Không cần await
    } catch (error) {
      console.error("Failed to track link click:", error); // Log lỗi nhưng không làm gì thêm
    }

    window.open(linkUrl, "_blank", "noopener,noreferrer");
  };

  // ----------------------------------
  const publicProfileUrl = profileData
    ? `${window.location.origin}/${profileData.user.username}`
    : "";

  const copyToClipboard = () => {
    if (!publicProfileUrl) return;
    navigator.clipboard
      .writeText(publicProfileUrl)
      .then(() => {
        setIsCopied(true);
        toast.success("Đã sao chép link!");
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Lỗi sao chép:", err);
        toast.error("Sao chép thất bại!");
      });
  };

  const downloadQRCode = () => {
    const svgElement = qrCodeRef.current?.querySelector("svg");
    const qrUsername = profileData?.user?.username || "profile";
    if (svgElement) {
      try {
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgElement);
        if (!svgString.startsWith("<?xml")) {
          svgString = /*...*/ +svgString;
        }
        const blob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `${qrUsername}-biolink-qr.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
        toast.success("Đang tải mã QR (SVG)...");
      } catch (error) {
        console.error("Lỗi tải QR:", error);
        toast.error("Không thể tải mã QR.");
      }
    } else {
      console.error("Không tìm thấy SVG QR.");
      toast.error("Không thể tải mã QR.");
    }
  };
  // =======================================================

  return (
    <div
      style={backgroundStyle}
      className="min-h-screen py-12 md:py-16 px-4 transition-colors duration-300 ease-in-out">
      <div className="max-w-md mx-auto flex flex-col items-center">
        {/* Avatar */}
        <div className="mb-4">
          {" "}
          {/* Bọc trong div để dễ kiểm soát margin hơn */}
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`${displayName}'s avatar`}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-xl border-4 border-white"
            />
          ) : (
            // Placeholder avatar
            <div
              className="w-24 h-24 md:w-28 md:h-28 rounded-full shadow-xl bg-white/50 border-4 border-white flex items-center justify-center text-5xl font-bold"
              style={{ color: finalTextColor }}>
              {/* Chữ cái đầu, màu tương phản */}
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {/* Tên */}
        <h1
          className="text-2xl md:text-3xl font-bold mb-2 text-center break-words px-2"
          style={{ color: finalTextColor }}>
          {displayName}
        </h1>

        {/* Bio */}
        {bio && (
          <p
            className="text-base md:text-lg text-center mb-4 max-w-lg px-2"
            style={{ color: finalTextColor }}>
            {bio}
          </p>
        )}

        {/* === Nút Share === */}
        <button
          onClick={() => setIsShareSectionVisible(!isShareSectionVisible)}
          className="absolute top-3 right-3 mt-2 mr-2 p-2 rounded-full transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
          style={{
            backgroundColor:
              backgroundStyle === "#ffffff"
                ? "rgba(0, 0, 0, 0.05)"
                : "rgba(255, 255, 255, 0.27)",
            color: finalTextColor,
          }}
          aria-expanded={isShareSectionVisible}
          aria-label={
            isShareSectionVisible ? "Đóng chia sẻ" : "Chia sẻ profile"
          }
          title={isShareSectionVisible ? "Đóng chia sẻ" : "Chia sẻ profile"}>
          <Share size={20} />
        </button>
        {/* ================ */}

        {/* === Section Chia sẻ xổ xuống === */}
        <div
          className={`w-full transition-all duration-500 ease-in-out overflow-hidden rounded-lg
                        ${
                          isShareSectionVisible
                            ? "max-h-[500px] opacity-100 mt-6 mb-6"
                            : "max-h-0 opacity-0"
                        }`} // Thêm margin top/bottom khi hiện
        >
          <div
            className="p-4 space-y-4 rounded-lg border"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(2px)",
            }}>
            <h4
              className="text-center font-semibold text-sm"
              style={{ color: finalTextColor }}>
              Chia sẻ Profile
            </h4>
            {/* QR Code */}
            <div
              className="flex flex-col items-center p-3 bg-white/90 rounded-lg border border-gray-200"
              ref={qrCodeRef}>
              <QRCodeSVG value={publicProfileUrl} size={150} level={"H"} />
              <span className="text-xs text-gray-700 mt-2">
                Quét mã để mở trang
              </span>
            </div>
            {/* Link và nút Copy */}
            <div className="flex items-center space-x-2 bg-white/80 p-2 rounded-md border border-gray-200">
              <LinkIcon className="w-4 h-4 text-indigo-600 flex-shrink-0 ml-1" />
              <input
                type="text"
                readOnly
                value={publicProfileUrl}
                className="flex-grow text-xs p-1 bg-transparent outline-none text-indigo-800 font-medium" // Cho chữ đậm hơn
                onClick={(e) => e.target.select()} // Chọn text khi click input
              />
              <button
                onClick={copyToClipboard}
                className="p-1.5 text-gray-500 hover:text-indigo-700 hover:bg-indigo-100 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 transition flex-shrink-0"
                aria-label="Sao chép link">
                {isCopied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Clipboard className="w-4 h-4" />
                )}
              </button>
            </div>
            {/* Download Button */}
            <button
              onClick={downloadQRCode}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600/90 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
              <Download className="w-4 h-4 mr-2" /> Tải mã QR
            </button>
          </div>
        </div>
        {/* ============================= */}
        {/* Danh sách Links */}
        <div className="w-full max-w-lg flex flex-col items-center space-y-5">
          {/* Khu vực hiển thị Icon Mạng xã hội */}
          {socialLinks.length > 0 && (
            <div className="flex justify-center items-center space-x-5 mb-6 md:mb-8">
              {socialLinks.map((link) => (
                <a
                  key={link._id}
                  href={link.url}
                  title={link.title || link.socialPlatform}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link._id, link.url);
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                  style={{ color: contrastColor }}>
                  <SocialIcon platform={link.socialPlatform} size={28} />{" "}
                  <span className="sr-only">
                    {link.title || link.socialPlatform}
                  </span>{" "}
                </a>
              ))}
            </div>
          )}

          {/* Khu vực hiển thị Link Website */}
          {websiteLink &&
            websiteLink.map((link) => (
              <a
                key={link._id}
                href={link.url}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link._id, link.url);
                }}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center w-full px-6 py-3 mb-4 bg-white bg-opacity-90 backdrop-blur-md text-center text-lg font-semibold text-gray-800 shadow-md hover:scale-105 hover:bg-opacity-100 transform transition duration-200 ease-in-out border border-white/40 ${
                  profile?.buttonStyle || "rounded-lg"
                }`}>
                <Globe size={20} className="mr-2" />
                {websiteLink.title || "Website"}
              </a>
            ))}
          {/* Link thường */}
          <div className="w-full max-w-lg flex flex-col items-center space-y-4">
            {regularLinks.length > 0
              ? regularLinks.map((link) => {
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
                          onClick={(e) => {
                            e.preventDefault(); // Ngăn trình duyệt điều hướng ngay lập tức
                            handleLinkClick(link._id, link.url);
                          }}
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
                          onClick={(e) => {
                            e.preventDefault(); // Ngăn trình duyệt điều hướng ngay lập tức
                            handleLinkClick(link._id, link.url);
                          }}
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
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick(link._id, link.url);
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full px-8 py-5 bg-white bg-opacity-90 backdrop-blur-md text-center text-xl font-semibold text-gray-900 shadow-lg hover:scale-105 hover:bg-opacity-100 transform transition duration-200 ease-in-out border border-white/40 ${currentButtonStyle}`} // Thêm class động vào cuối
                      >
                        {link.title}
                      </a>
                    );
                  }
                })
              : socialLinks.length === 0 &&
                !websiteLink && (
                  <p style={{ color: getContrastColor(themeColor, 0.75) }}>
                    Chưa có link nào.
                  </p>
                )}
          </div>
        </div>
        {/* Footer */}
        <p className="mt-10 text-center text-md text-white">
          Powered by Biolink-Fast
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

// Có thể đặt component này bên trong PublicProfilePage.jsx hoặc tạo file riêng
const SocialIcon = ({ platform, size = 24, className = "" }) => {
  switch (platform) {
    case "facebook":
      return <Facebook size={size} className={className} />;
    case "instagram":
      return <Instagram size={size} className={className} />;
    case "github":
      return <Github size={size} className={className} />;
    case "linkedin":
      return <Linkedin size={size} className={className} />;
    case "twitter":
      return <Twitter size={size} className={className} />;
    case "tiktok":
      return <AiFillTikTok size={size} className={className} />; // Ví dụ dùng tạm icon Music cho TikTok
    case "youtube":
      return <Youtube size={size} className={className} />;
    case "spotify":
      return <Music size={size} className={className} />; // Ví dụ dùng icon Music
    case "email":
      return <Mail size={size} className={className} />;
    // case 'website': return <Globe size={size} className={className} />; // Có thể dùng Globe cho website
    default:
      return <LinkIcon size={size} className={className} />; // Icon mặc định nếu không khớp
  }
};
