// src/components/dashboard/ShareProfileCard.jsx
import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { QRCodeSVG } from "qrcode.react";
// Bỏ Popover, Transition, Fragment nếu đã import
import {
  Link as LinkIcon,
  Clipboard,
  Check,
  Share2,
  Download,
  ChevronDown, // <<< Thêm icon này
  ChevronUp, // <<< Thêm icon này
} from "lucide-react";
import toast from "react-hot-toast";

function ShareProfileCard() {
  const { authState } = useContext(AuthContext);
  const [isCopied, setIsCopied] = useState(false);
  const [isShareSectionVisible, setIsShareSectionVisible] = useState(false); // <<< State mới
  const qrCodeRef = useRef(null);
  const [publicProfileUrl, setPublicProfileUrl] = useState("");

  useEffect(() => {
    // ... (useEffect giữ nguyên) ...
    if (authState.user?.username) {
      const url = `${window.location.origin}/${authState.user.username}`;
      setPublicProfileUrl(url);
    }
  }, [authState.user]);

  const copyToClipboard = (textToCopy) => {
    if (!textToCopy) return;
    navigator.clipboard
      .writeText(textToCopy)
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
    // ... (downloadQRCode giữ nguyên) ...
    const svgElement = qrCodeRef.current?.querySelector("svg");
    if (svgElement) {
      try {
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgElement);
        if (!svgString.startsWith("<?xml")) {
          svgString = '<?xml version="1.0" standalone="no"?>\r\n' + svgString;
        }
        const blob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `${authState.user.username}-biolink-qr.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
        toast.success("Đang tải mã QR (SVG)...");
      } catch (error) {
        console.error("Lỗi khi tạo hoặc tải SVG QR:", error);
        toast.error("Không thể tải mã QR.");
      }
    } else {
      console.error("Không tìm thấy phần tử SVG QR code để tải.");
      toast.error("Không thể tải mã QR.");
    }
  };

  // --- Loading state giữ nguyên ---
  if (!authState.user || !publicProfileUrl) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/15 p-6 md:p-8 animate-pulse">
        <div className="h-6 bg-gray-300/50 rounded w-3/4 mb-4"></div>
        <div className="h-10 bg-gray-200/60 rounded-lg"></div>
      </div>
    );
  }

  return (
    // Card chính
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/15 p-6 md:p-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Link Biolink của bạn
      </h3>

      {/* Phần Link và nút cơ bản */}
      <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-100/70 p-3 rounded-lg border border-gray-200/80 relative">
        <LinkIcon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
        <a
          href={publicProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-indigo-700 hover:text-indigo-900 truncate flex-grow min-w-0 pr-20 sm:pr-24"
          title={publicProfileUrl}>
          {publicProfileUrl}
        </a>
        {/* Các nút */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {/* Nút Copy */}
          <button
            onClick={() => copyToClipboard(publicProfileUrl)}
            className="p-2 text-gray-500 hover:text-indigo-700 hover:bg-indigo-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition flex-shrink-0"
            aria-label="Sao chép link"
            title="Sao chép link">
            {isCopied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Clipboard className="w-4 h-4" />
            )}
          </button>
          {/* === Nút Mở/Đóng Section Share === */}
          <button
            onClick={() => setIsShareSectionVisible(!isShareSectionVisible)} // <<< Đảo state khi click
            className={`p-2 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition flex-shrink-0
                        ${
                          isShareSectionVisible
                            ? "bg-blue-100 text-blue-700"
                            : "hover:text-blue-700 hover:bg-blue-100"
                        }`}
            aria-expanded={isShareSectionVisible}
            aria-label={isShareSectionVisible ? "Ẩn chia sẻ" : "Hiện chia sẻ"}
            title={isShareSectionVisible ? "Ẩn chia sẻ" : "Chia sẻ"}>
            {/* Đổi Icon dựa vào state */}
            {isShareSectionVisible ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* === Section Chia Sẻ (Xổ xuống) === */}
      <div
        // Class transition cho max-height và opacity
        className={`transition-all duration-500 ease-in-out overflow-hidden
                    ${
                      isShareSectionVisible
                        ? "max-h-[500px] opacity-100 mt-4 pt-5 border-t border-gray-200"
                        : "max-h-0 opacity-0"
                    }`}
        // Thêm mt-4, pt-5, border-t khi hiện ra
      >
        {/* Không cần thêm background hay shadow ở đây vì nó nằm trong card chính rồi */}
        {/* Bỏ bớt padding/margin nếu không cần thiết */}
        <div>
          <h4 className="text-base  font-semibold mb-4 text-left text-gray-800">
            Chia sẻ Profile của bạn
          </h4>
          {/* Layout chia cột cho QR và Buttons */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Cột QR Code */}
            <div
              className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm flex-shrink-0 mx-auto sm:mx-0" // Thêm bg-white, shadow, căn giữa trên mobile
              ref={qrCodeRef}>
              <QRCodeSVG
                value={publicProfileUrl}
                size={150} // Có thể chỉnh lại kích thước
                level={"H"}
                includeMargin={true}
              />
              <span className="text-xs text-gray-600 mt-2">
                Quét mã QR để mở
              </span>
            </div>
            {/* Cột Buttons */}
            <div className="space-y-3 w-full flex-grow">
              <button
                onClick={() => {
                  copyToClipboard(publicProfileUrl);
                }}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition" // Tăng padding py
              >
                <Clipboard className="w-5 h-5 mr-2" /> Sao chép Link Profile
              </button>
              <button
                onClick={downloadQRCode}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition" // Tăng padding py
              >
                <Download className="w-5 h-5 mr-2" /> Tải xuống Mã QR (SVG)
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* === Kết thúc Section Chia Sẻ === */}
    </div> // Kết thúc card chính
  );
}

export default ShareProfileCard;
