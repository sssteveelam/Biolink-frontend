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
      "url(https://media-hosting.imagekit.io/6b6f6d55318a4eb7/rung_c7171.webp?Expires=1840862218&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=hq27LNVF3LS6EPUtMKHE9DRnl8IBJPONibqlf1JShTqUjY2Iyu7Ms4Zg2CoQNAELkxlgOKNRKC3MR79a4YP6xs8a1dSrVn~rxaUb3sAqAvajRJIoDgvvVrcK~eHx5eWP7AQ2g6tHxsz73vJJh9qWt97TgMeRGSLWeAlPkGMw5Xiq4jssllBl~pXfHI~29N~iNK2Zy22Y22kplNBA3PI7k4wIIEBxWIKbPbTdO1F0Qd1bzEc8cbeSO6tc-sdkvuvGQtwcF1Ii1ayRQqeXtvwOlxHYave9iFZZVZ9bc1lHc1UXXQsU-SWT3ptLQeGkYZ2g9GE9OWe4IPF6U-c9JF9LsA__)",
    "image-mountain":
      "url(https://media-hosting.imagekit.io/e4685b3268a147b0/3900141628014723270.webp?Expires=1840862277&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ep4X6Coij27mZoUxciRW6fo05aN4qkpAoTE1tJY8KWse7nfeDD3P38yE74lFVZWbTA264gao2ts02KKh604FxPf4B5TDghAfJ4ULLUnxGEVX6HOHUOLuv4bbuHYxE8LMdwbF5k5hbO5PKHVYFkwHyDrCzRfOv3wEEfAD8ThbX864xPKTspteD7NMUuDNbBndvsnJxOUbB83ijM53RfC8upmEqMos281kB9CQ8aAXfMV2hvUnD7W8SCf6RqA7K7l5x4XfgzFp6umhDh6ntm0jYARcRVa1imdyoSAzJiVmYDZlNDgrQv93rQYK5Ct254PYSz9xBKXj~sd1d-iJX9VuOw__)",
    "image-hagiang":
      "url(https://media-hosting.imagekit.io/fd8f82dd192941cd/1_nui_doi_tuyet_tac_thien_nhien_hung_vi_giua_cao_nguyen_da_dong_van_367c4971b5.jpg?Expires=1840869727&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=1N9tCMFdAfwk1TGlO0eRLb96fN2Ci-Sp7qPjXLfQ9XAW~-qWC3FIVcJZJXI2TRnClQTnWfsgpofEM17y5e0LvxCH86dcQmHhPEmVBO-oFdDUYrL5LXWhBCgqjMX2L8O4yl2xuyU2MavaPnIkl-E8sE0Lhegw0ABaigPPe0eQDIlAlI8MW~Q-QjsrvBK6CjOPmjk6tkQ1bGAC7l06j-TeA429F4q292IcQjw39NYlva9sofxxWP5elsmyHTOh2mLNdNcgECY82xYGvyor3Ev0JhXwVtc8qJRTA45dqgFylkr6oYUEdrE1P6-3shI~mPxjOpmwfH3ktb7x1PYQo3s2iw__)",
    "image-Home":
      "url(https://media-hosting.imagekit.io/bf8a6ed53cdd434c/Yellow%20and%20Pink%20Colorful%20Boy%20Sleeping%20In%20The%20Room%20anime%20Desktop%20Wallpaper.png?Expires=1840872063&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=hQ6d5PNzXCYdrWss220VB42JT1jXyFaPOqkSoKV7sxvpQTquKskqMpsMpv5~vvQYAZIzMDzeQssduHEAQ69r-KcemvbtdflUt00YThesvj4fAovaslcrrWeU7tp0ry8TfKV4d-gzfLY8FeqFpm42JtVQCbL-GgrTHQOgKgqlayQaPUMU0ci2JeJzOLE-3YlSqbo2B9lnz7aGCeWqNTmRb3J7GD9MuD6JSMmRG5RHZnZlWDfhx9010oGaK6DrVvsal7NLrCv0MOWUE7ERZjMQ4B5lhUWJ~~k65QiYrzNwgYacsdKCCO-i5t4wF5uJgy6ene-W4Y0F3uMitEOyzCcKsA__)",
    "image-cat":
      "url(https://media-hosting.imagekit.io/f5e9bf77cdc548be/Green%20Orange%20Illustrated%20Cat%20Desktop%20Wallpaper.png?Expires=1840872063&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=GAIvnUQYvkbL5fPZR1MT1LcJGB-lHYxjX332hfgUUafncOy8SiRG-VAV~7AiBeevXMSFBVbvT5BBmoucBlQ15i67HzNPWbU6XJRswFOrrD5oKcRXBSBJayb5YmwFdKvj-j~hI-ga-zwi9IVJEZRttB7nsn7BU3EdEf~9HHmjxq277yxJOl63KaV~xN9HmZQ53Z0IHJg0lur7j7gZ18bIacl9iaNeAG1yTEO0zjkT-2~g3qQgyWgHJAkcwXxUGFQf47Pwlmg6r61xlOJDLF8rny~McBqycfzURsjKXIpI-oapLcN2BP3o-5NeT82vBz4NHNnTkcVJIb6Mcy~TMC3JTA__)",
    "image-driver":
      "url(https://media-hosting.imagekit.io/56df0180de9e48c9/Blue%20and%20White%20Simple%20Nature%20Flower%20Water%20Quotes%20Desktop%20Wallpaper.png?Expires=1840872063&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Fa7U~yo~ITbO7vybD9MJSM5QVkXZZO04uYGRQLjufSkY8k13fkKrI-aAYpaX0hzzezsq5QKx85Mc1TlzY9S5fchQIvmF~~OrsYO-1g4WVizf5XytC1myJZbXbT0XSXFAcHOl6pW06XFVwWLV8grhILB~eJkM4ZQ25sxwj6IiBOUz25a3DSPgc8oNf65p01oUVTvxdUBN5EumkCpUfGz8783-4KJgvFpAD0b6UHu0PptT3y6exqzGlMr7r8DO9CMl5~ubbP~qnyl2DbfEhhvQEafLxm55iWXpT4z06twwuIydwYlJyo~1xRtCFt6MVuVuYBVGzwWE2l1CwThBCDQU~Q__)",
    "image-sky":
      "url(https://media-hosting.imagekit.io/85762aca4db54c93/Blue%20and%20Green%20Illustrated%20Nature%20Desktop%20Wallpaper.png?Expires=1840872063&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=yxIRfdGZL9Xmzp~fxC-ZkpgzGrYPPL0n7VsrSioQFA2U2t5SGwrTX4bHAKJ7NDA-m18Mqmet9or6DisAEAJq8mwPAwbuRnZcVR5r8-GWyEtOx~EWDNPVsKKn5T2D9ld1bWtEZliJGqmk78Qk7xNpJ3qGa2t-qgcFeSxmrCh6gSo9Dg-EvI7KiDhBbz~qht3pJzQppfOm6TKOM-i5XnJSh4V5zCJDtvLChieT1~yu5eRn~ymoMP-FYP6A4-m~r2ehbBjuV95E2fYJjYb6fm2sj3yRIECvxWGBzu9-sh5ORqrlRQwnxl~TKakH5Nr897FCTXjJR9YubviB~KCYxAtK~Q__)",
    "image-strawberry":
      "url(https://media-hosting.imagekit.io/613bb3c130e84155/strawberry.png?Expires=1840861666&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=2cMe-LS~6NzgFh-Pa62ZWgqrZalHgzpLAdIBu~ohgMYoGcEmt5k4oAh6Uwcw8rh8558yDC1Q9bhB8SEdMUnZykieJ5yu2IDCA9US~ERmFdDMrSq938QfvcvOybbr2tgk4Z9B5z1oPRMr8O~fWM2sR~pEnneQAEhiCDTyMolChyeI2dVCAivYHBOE7NgRI5f-o~63NEx9rfqS3TxT-FZVWrPRJajJpp-nIc9k8Lu2yJjfmcKXNJn-BNsJP3dspbZyHKEgVStv1PC0DzNZPi4SUWGJhTbsKA~8e1N-HiLBdJkbtqr8EK9v3KlRTM15LyFnso8uYWbcu0UAlnCCbKb0Xw__)",
    "image-glassmorphism":
      "url(https://media-hosting.imagekit.io/930e08babf864061/glassmorphism.jpg?Expires=1840861666&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=as1TZwpJp4Sn82w8D5vR-5a-wAQkq6UVVIUa~SOMM16V5eFnR5-lQVPCiTA87i7veKT1ZpNRCG2v2o-DMnbc12L2UTfos9TfWRkaSJvI6TGTGIGgY-fP0LVZDWXID5YnI0Xy~FbC-bPXcybycMNW-WDsjzTtHXHCmqH3aUX2v6bvFyAlen~9ubZ-pOkLDXNrEeIBV-5YaHp9VTtwNnhIfGuLJ0G0DwpgQgSCd-tfAtqDNyRFDiTZvVuNppYgGMavR3XMSw550wyIEiLmJLZTzOP6--~3JeXZan7gSZb3P1E1Nj0kwh0t7vQOpb5mll2ISWMATTwOkYo8YQc~E2O0BQ__)",
    "image-neon":
      "url(https://media-hosting.imagekit.io/4018b30587f04a41/neon.jpg?Expires=1840861666&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ZOf6HQsDsjUX~AvD~KOXNM2DoatVfWFes0F0hTQCBeRgomtSJzy0Vrk~ErG79Pkn5tBURgAn44z6YDT6Q3Gxx6C71Kql1HO5Sw3mYpghjIVxhF91L0AKnA6f0WrfMh6zvUI88tQEfbmJRfEN5yyDNdnv~Ep1Hq0cYN70zKMYCf5dcCNtkucY6LYM26dZNgXQZFOUJWSxvxwTB367qNkwuQct060~kfGuuTHrIsUprRZL8xVIQoFNagJphnCx1lgZZ2XoTJ56d3f7ZWcJR~BM3MtiVWHvZgjovmiPs0~n5JkLenXVBgHBPGC0BlYxhWBqzG~lPzxHbOi23zVbxHZLlQ__)",
    "image-maybay":
      "url(https://media-hosting.imagekit.io/205f895b8a9a4cc0/A50%20-%20NKVK%2036.jpeg?Expires=1840871485&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=xk8eAahnvkFp9Fsz7rToTI8qP4DEQXS8c41cn1yVDiyUhnn4iBa1msx8w2sVyBODmtJaWd~7jmGKZRmImZ1x1CkYd0YM4Km0eQX3ZU10naov6dlAKYIvQut7bGk1F4AA0GJ1MPBkICLPIHWeBbmYoV-2LtL94-So3s~AY7LPhpqp4lVgVDYnDMlrcfNwgEYheQEk0I3x3kWuUAmGi44oGztOwa3OAB6gMXrDz40LWU~PtYAviCLqSvXRKOge2ajgCYK8tKn2syTcqba2cfOl4MSH2HDv76-dxeP-347tK3xjcdLvWqGNzJJAU1nnCQrKbwtOT89MAFUoLH5hUp-6iA__)",
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
