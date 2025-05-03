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

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [buttonStyle, setButtonStyle] = useState("rounded-lg"); // Giá trị khởi tạo nên giống default ở backend

  const predefinedThemes = [
    {
      id: "custom-color-#e0e0e0",
      name: "Màu tùy chọn",
      previewStyle: { backgroundColor: "#e0e0e0" }, // Màu xám nhạt làm preview
    },
    {
      id: "gradient-sunset",
      name: "Hoàng hôn",
      previewStyle: {
        backgroundImage: "linear-gradient(to right, #ff7e5f, #feb47b)",
      },
      // Giá trị thực tế sẽ được lưu ở backend (hoặc frontend tự xử lý dựa trên ID)
      // Ở đây ví dụ lưu cả gradient và màu nền chính (nếu cần fallback)
      value: {
        type: "gradient",
        style: "linear-gradient(to right, #ff7e5f, #feb47b)",
        primaryColor: "#feb47b",
      },
    },
    {
      id: "gradient-ocean",
      name: "Đại dương",
      previewStyle: {
        backgroundImage: "linear-gradient(to right, #00c6ff, #0072ff)",
      },
      value: {
        type: "gradient",
        style: "linear-gradient(to right, #00c6ff, #0072ff)",
        primaryColor: "#0072ff",
      },
    },
    {
      id: "image-forest",
      name: "Rừng xanh",
      // Lưu ý: URL phải bắt đầu bằng / nếu ảnh nằm trong thư mục public
      previewStyle: {
        backgroundImage:
          "url(https://media-hosting.imagekit.io/6b6f6d55318a4eb7/rung_c7171.webp?Expires=1840862218&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=hq27LNVF3LS6EPUtMKHE9DRnl8IBJPONibqlf1JShTqUjY2Iyu7Ms4Zg2CoQNAELkxlgOKNRKC3MR79a4YP6xs8a1dSrVn~rxaUb3sAqAvajRJIoDgvvVrcK~eHx5eWP7AQ2g6tHxsz73vJJh9qWt97TgMeRGSLWeAlPkGMw5Xiq4jssllBl~pXfHI~29N~iNK2Zy22Y22kplNBA3PI7k4wIIEBxWIKbPbTdO1F0Qd1bzEc8cbeSO6tc-sdkvuvGQtwcF1Ii1ayRQqeXtvwOlxHYave9iFZZVZ9bc1lHc1UXXQsU-SWT3ptLQeGkYZ2g9GE9OWe4IPF6U-c9JF9LsA__)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      value: {
        type: "image",
        style:
          "url(https://media-hosting.imagekit.io/6b6f6d55318a4eb7/rung_c7171.webp?Expires=1840862218&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=hq27LNVF3LS6EPUtMKHE9DRnl8IBJPONibqlf1JShTqUjY2Iyu7Ms4Zg2CoQNAELkxlgOKNRKC3MR79a4YP6xs8a1dSrVn~rxaUb3sAqAvajRJIoDgvvVrcK~eHx5eWP7AQ2g6tHxsz73vJJh9qWt97TgMeRGSLWeAlPkGMw5Xiq4jssllBl~pXfHI~29N~iNK2Zy22Y22kplNBA3PI7k4wIIEBxWIKbPbTdO1F0Qd1bzEc8cbeSO6tc-sdkvuvGQtwcF1Ii1ayRQqeXtvwOlxHYave9iFZZVZ9bc1lHc1UXXQsU-SWT3ptLQeGkYZ2g9GE9OWe4IPF6U-c9JF9LsA__)",
        primaryColor: "#228B22",
      }, // Màu fallback
    },
    {
      id: "image-mountain",
      name: "Núi tuyết",
      previewStyle: {
        backgroundImage:
          "url(https://media-hosting.imagekit.io/e4685b3268a147b0/3900141628014723270.webp?Expires=1840862277&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ep4X6Coij27mZoUxciRW6fo05aN4qkpAoTE1tJY8KWse7nfeDD3P38yE74lFVZWbTA264gao2ts02KKh604FxPf4B5TDghAfJ4ULLUnxGEVX6HOHUOLuv4bbuHYxE8LMdwbF5k5hbO5PKHVYFkwHyDrCzRfOv3wEEfAD8ThbX864xPKTspteD7NMUuDNbBndvsnJxOUbB83ijM53RfC8upmEqMos281kB9CQ8aAXfMV2hvUnD7W8SCf6RqA7K7l5x4XfgzFp6umhDh6ntm0jYARcRVa1imdyoSAzJiVmYDZlNDgrQv93rQYK5Ct254PYSz9xBKXj~sd1d-iJX9VuOw__)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      value: {
        type: "image",
        style:
          "url(https://media-hosting.imagekit.io/e4685b3268a147b0/3900141628014723270.webp?Expires=1840862277&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ep4X6Coij27mZoUxciRW6fo05aN4qkpAoTE1tJY8KWse7nfeDD3P38yE74lFVZWbTA264gao2ts02KKh604FxPf4B5TDghAfJ4ULLUnxGEVX6HOHUOLuv4bbuHYxE8LMdwbF5k5hbO5PKHVYFkwHyDrCzRfOv3wEEfAD8ThbX864xPKTspteD7NMUuDNbBndvsnJxOUbB83ijM53RfC8upmEqMos281kB9CQ8aAXfMV2hvUnD7W8SCf6RqA7K7l5x4XfgzFp6umhDh6ntm0jYARcRVa1imdyoSAzJiVmYDZlNDgrQv93rQYK5Ct254PYSz9xBKXj~sd1d-iJX9VuOw__)",
        primaryColor: "#ADD8E6",
      },
    },

    {
      id: "image-hagiang",
      name: "Hà Giang",
      previewStyle: {
        backgroundImage:
          "url(https://media-hosting.imagekit.io/fd8f82dd192941cd/1_nui_doi_tuyet_tac_thien_nhien_hung_vi_giua_cao_nguyen_da_dong_van_367c4971b5.jpg?Expires=1840869727&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=1N9tCMFdAfwk1TGlO0eRLb96fN2Ci-Sp7qPjXLfQ9XAW~-qWC3FIVcJZJXI2TRnClQTnWfsgpofEM17y5e0LvxCH86dcQmHhPEmVBO-oFdDUYrL5LXWhBCgqjMX2L8O4yl2xuyU2MavaPnIkl-E8sE0Lhegw0ABaigPPe0eQDIlAlI8MW~Q-QjsrvBK6CjOPmjk6tkQ1bGAC7l06j-TeA429F4q292IcQjw39NYlva9sofxxWP5elsmyHTOh2mLNdNcgECY82xYGvyor3Ev0JhXwVtc8qJRTA45dqgFylkr6oYUEdrE1P6-3shI~mPxjOpmwfH3ktb7x1PYQo3s2iw__)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      value: {
        type: "image",
        style:
          "url(https://media-hosting.imagekit.io/fd8f82dd192941cd/1_nui_doi_tuyet_tac_thien_nhien_hung_vi_giua_cao_nguyen_da_dong_van_367c4971b5.jpg?Expires=1840869727&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=1N9tCMFdAfwk1TGlO0eRLb96fN2Ci-Sp7qPjXLfQ9XAW~-qWC3FIVcJZJXI2TRnClQTnWfsgpofEM17y5e0LvxCH86dcQmHhPEmVBO-oFdDUYrL5LXWhBCgqjMX2L8O4yl2xuyU2MavaPnIkl-E8sE0Lhegw0ABaigPPe0eQDIlAlI8MW~Q-QjsrvBK6CjOPmjk6tkQ1bGAC7l06j-TeA429F4q292IcQjw39NYlva9sofxxWP5elsmyHTOh2mLNdNcgECY82xYGvyor3Ev0JhXwVtc8qJRTA45dqgFylkr6oYUEdrE1P6-3shI~mPxjOpmwfH3ktb7x1PYQo3s2iw__)",
        primaryColor: "#9fb43d",
      },
    },

    {
      id: "image-maybay",
      name: "Máy bay",
      previewStyle: {
        backgroundImage:
          "url(https://media-hosting.imagekit.io/205f895b8a9a4cc0/A50%20-%20NKVK%2036.jpeg?Expires=1840871485&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=xk8eAahnvkFp9Fsz7rToTI8qP4DEQXS8c41cn1yVDiyUhnn4iBa1msx8w2sVyBODmtJaWd~7jmGKZRmImZ1x1CkYd0YM4Km0eQX3ZU10naov6dlAKYIvQut7bGk1F4AA0GJ1MPBkICLPIHWeBbmYoV-2LtL94-So3s~AY7LPhpqp4lVgVDYnDMlrcfNwgEYheQEk0I3x3kWuUAmGi44oGztOwa3OAB6gMXrDz40LWU~PtYAviCLqSvXRKOge2ajgCYK8tKn2syTcqba2cfOl4MSH2HDv76-dxeP-347tK3xjcdLvWqGNzJJAU1nnCQrKbwtOT89MAFUoLH5hUp-6iA__)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      value: {
        type: "image",
        style:
          "url(https://media-hosting.imagekit.io/205f895b8a9a4cc0/A50%20-%20NKVK%2036.jpeg?Expires=1840871485&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=xk8eAahnvkFp9Fsz7rToTI8qP4DEQXS8c41cn1yVDiyUhnn4iBa1msx8w2sVyBODmtJaWd~7jmGKZRmImZ1x1CkYd0YM4Km0eQX3ZU10naov6dlAKYIvQut7bGk1F4AA0GJ1MPBkICLPIHWeBbmYoV-2LtL94-So3s~AY7LPhpqp4lVgVDYnDMlrcfNwgEYheQEk0I3x3kWuUAmGi44oGztOwa3OAB6gMXrDz40LWU~PtYAviCLqSvXRKOge2ajgCYK8tKn2syTcqba2cfOl4MSH2HDv76-dxeP-347tK3xjcdLvWqGNzJJAU1nnCQrKbwtOT89MAFUoLH5hUp-6iA__)",
        primaryColor: "#9fb43d",
      },
    },

    {
      id: "image-neon",
      name: "Neon",
      previewStyle: {
        backgroundImage:
          "url(https://media-hosting.imagekit.io/4018b30587f04a41/neon.jpg?Expires=1840861666&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ZOf6HQsDsjUX~AvD~KOXNM2DoatVfWFes0F0hTQCBeRgomtSJzy0Vrk~ErG79Pkn5tBURgAn44z6YDT6Q3Gxx6C71Kql1HO5Sw3mYpghjIVxhF91L0AKnA6f0WrfMh6zvUI88tQEfbmJRfEN5yyDNdnv~Ep1Hq0cYN70zKMYCf5dcCNtkucY6LYM26dZNgXQZFOUJWSxvxwTB367qNkwuQct060~kfGuuTHrIsUprRZL8xVIQoFNagJphnCx1lgZZ2XoTJ56d3f7ZWcJR~BM3MtiVWHvZgjovmiPs0~n5JkLenXVBgHBPGC0BlYxhWBqzG~lPzxHbOi23zVbxHZLlQ__)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      value: {
        type: "image",
        style:
          "url(https://media-hosting.imagekit.io/4018b30587f04a41/neon.jpg?Expires=1840861666&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ZOf6HQsDsjUX~AvD~KOXNM2DoatVfWFes0F0hTQCBeRgomtSJzy0Vrk~ErG79Pkn5tBURgAn44z6YDT6Q3Gxx6C71Kql1HO5Sw3mYpghjIVxhF91L0AKnA6f0WrfMh6zvUI88tQEfbmJRfEN5yyDNdnv~Ep1Hq0cYN70zKMYCf5dcCNtkucY6LYM26dZNgXQZFOUJWSxvxwTB367qNkwuQct060~kfGuuTHrIsUprRZL8xVIQoFNagJphnCx1lgZZ2XoTJ56d3f7ZWcJR~BM3MtiVWHvZgjovmiPs0~n5JkLenXVBgHBPGC0BlYxhWBqzG~lPzxHbOi23zVbxHZLlQ__)",
        primaryColor: "#9fb43d",
      },
    },

    {
      id: "image-glassmorphism",
      name: "Glassmorphism",
      previewStyle: {
        backgroundImage:
          "url(https://media-hosting.imagekit.io/930e08babf864061/glassmorphism.jpg?Expires=1840861666&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=as1TZwpJp4Sn82w8D5vR-5a-wAQkq6UVVIUa~SOMM16V5eFnR5-lQVPCiTA87i7veKT1ZpNRCG2v2o-DMnbc12L2UTfos9TfWRkaSJvI6TGTGIGgY-fP0LVZDWXID5YnI0Xy~FbC-bPXcybycMNW-WDsjzTtHXHCmqH3aUX2v6bvFyAlen~9ubZ-pOkLDXNrEeIBV-5YaHp9VTtwNnhIfGuLJ0G0DwpgQgSCd-tfAtqDNyRFDiTZvVuNppYgGMavR3XMSw550wyIEiLmJLZTzOP6--~3JeXZan7gSZb3P1E1Nj0kwh0t7vQOpb5mll2ISWMATTwOkYo8YQc~E2O0BQ__)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      value: {
        type: "image",
        style:
          "url(https://media-hosting.imagekit.io/930e08babf864061/glassmorphism.jpg?Expires=1840861666&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=as1TZwpJp4Sn82w8D5vR-5a-wAQkq6UVVIUa~SOMM16V5eFnR5-lQVPCiTA87i7veKT1ZpNRCG2v2o-DMnbc12L2UTfos9TfWRkaSJvI6TGTGIGgY-fP0LVZDWXID5YnI0Xy~FbC-bPXcybycMNW-WDsjzTtHXHCmqH3aUX2v6bvFyAlen~9ubZ-pOkLDXNrEeIBV-5YaHp9VTtwNnhIfGuLJ0G0DwpgQgSCd-tfAtqDNyRFDiTZvVuNppYgGMavR3XMSw550wyIEiLmJLZTzOP6--~3JeXZan7gSZb3P1E1Nj0kwh0t7vQOpb5mll2ISWMATTwOkYo8YQc~E2O0BQ__)",
        primaryColor: "#9fb43d",
      },
    },

    {
      id: "image-strawberry",
      name: "Strawberry",
      previewStyle: {
        backgroundImage:
          "url(https://media-hosting.imagekit.io/613bb3c130e84155/strawberry.png?Expires=1840861666&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=2cMe-LS~6NzgFh-Pa62ZWgqrZalHgzpLAdIBu~ohgMYoGcEmt5k4oAh6Uwcw8rh8558yDC1Q9bhB8SEdMUnZykieJ5yu2IDCA9US~ERmFdDMrSq938QfvcvOybbr2tgk4Z9B5z1oPRMr8O~fWM2sR~pEnneQAEhiCDTyMolChyeI2dVCAivYHBOE7NgRI5f-o~63NEx9rfqS3TxT-FZVWrPRJajJpp-nIc9k8Lu2yJjfmcKXNJn-BNsJP3dspbZyHKEgVStv1PC0DzNZPi4SUWGJhTbsKA~8e1N-HiLBdJkbtqr8EK9v3KlRTM15LyFnso8uYWbcu0UAlnCCbKb0Xw__)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      value: {
        type: "image",
        style:
          "url(https://media-hosting.imagekit.io/613bb3c130e84155/strawberry.png?Expires=1840861666&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=2cMe-LS~6NzgFh-Pa62ZWgqrZalHgzpLAdIBu~ohgMYoGcEmt5k4oAh6Uwcw8rh8558yDC1Q9bhB8SEdMUnZykieJ5yu2IDCA9US~ERmFdDMrSq938QfvcvOybbr2tgk4Z9B5z1oPRMr8O~fWM2sR~pEnneQAEhiCDTyMolChyeI2dVCAivYHBOE7NgRI5f-o~63NEx9rfqS3TxT-FZVWrPRJajJpp-nIc9k8Lu2yJjfmcKXNJn-BNsJP3dspbZyHKEgVStv1PC0DzNZPi4SUWGJhTbsKA~8e1N-HiLBdJkbtqr8EK9v3KlRTM15LyFnso8uYWbcu0UAlnCCbKb0Xw__)",
        primaryColor: "#9fb43d",
      },
    },

    {
      id: "image-sky",
      name: "Sky",
      previewStyle: {
        backgroundImage:
          "url(https://media-hosting.imagekit.io/85762aca4db54c93/Blue%20and%20Green%20Illustrated%20Nature%20Desktop%20Wallpaper.png?Expires=1840872063&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=yxIRfdGZL9Xmzp~fxC-ZkpgzGrYPPL0n7VsrSioQFA2U2t5SGwrTX4bHAKJ7NDA-m18Mqmet9or6DisAEAJq8mwPAwbuRnZcVR5r8-GWyEtOx~EWDNPVsKKn5T2D9ld1bWtEZliJGqmk78Qk7xNpJ3qGa2t-qgcFeSxmrCh6gSo9Dg-EvI7KiDhBbz~qht3pJzQppfOm6TKOM-i5XnJSh4V5zCJDtvLChieT1~yu5eRn~ymoMP-FYP6A4-m~r2ehbBjuV95E2fYJjYb6fm2sj3yRIECvxWGBzu9-sh5ORqrlRQwnxl~TKakH5Nr897FCTXjJR9YubviB~KCYxAtK~Q__)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      value: {
        type: "image",
        style:
          "url(https://media-hosting.imagekit.io/85762aca4db54c93/Blue%20and%20Green%20Illustrated%20Nature%20Desktop%20Wallpaper.png?Expires=1840872063&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=yxIRfdGZL9Xmzp~fxC-ZkpgzGrYPPL0n7VsrSioQFA2U2t5SGwrTX4bHAKJ7NDA-m18Mqmet9or6DisAEAJq8mwPAwbuRnZcVR5r8-GWyEtOx~EWDNPVsKKn5T2D9ld1bWtEZliJGqmk78Qk7xNpJ3qGa2t-qgcFeSxmrCh6gSo9Dg-EvI7KiDhBbz~qht3pJzQppfOm6TKOM-i5XnJSh4V5zCJDtvLChieT1~yu5eRn~ymoMP-FYP6A4-m~r2ehbBjuV95E2fYJjYb6fm2sj3yRIECvxWGBzu9-sh5ORqrlRQwnxl~TKakH5Nr897FCTXjJR9YubviB~KCYxAtK~Q__)",
        primaryColor: "#9fb43d",
      },
    },

    {
      id: "image-driver",
      name: "Driver",
      previewStyle: {
        backgroundImage:
          "url(https://media-hosting.imagekit.io/56df0180de9e48c9/Blue%20and%20White%20Simple%20Nature%20Flower%20Water%20Quotes%20Desktop%20Wallpaper.png?Expires=1840872063&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Fa7U~yo~ITbO7vybD9MJSM5QVkXZZO04uYGRQLjufSkY8k13fkKrI-aAYpaX0hzzezsq5QKx85Mc1TlzY9S5fchQIvmF~~OrsYO-1g4WVizf5XytC1myJZbXbT0XSXFAcHOl6pW06XFVwWLV8grhILB~eJkM4ZQ25sxwj6IiBOUz25a3DSPgc8oNf65p01oUVTvxdUBN5EumkCpUfGz8783-4KJgvFpAD0b6UHu0PptT3y6exqzGlMr7r8DO9CMl5~ubbP~qnyl2DbfEhhvQEafLxm55iWXpT4z06twwuIydwYlJyo~1xRtCFt6MVuVuYBVGzwWE2l1CwThBCDQU~Q__)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      value: {
        type: "image",
        style:
          "url(https://media-hosting.imagekit.io/56df0180de9e48c9/Blue%20and%20White%20Simple%20Nature%20Flower%20Water%20Quotes%20Desktop%20Wallpaper.png?Expires=1840872063&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Fa7U~yo~ITbO7vybD9MJSM5QVkXZZO04uYGRQLjufSkY8k13fkKrI-aAYpaX0hzzezsq5QKx85Mc1TlzY9S5fchQIvmF~~OrsYO-1g4WVizf5XytC1myJZbXbT0XSXFAcHOl6pW06XFVwWLV8grhILB~eJkM4ZQ25sxwj6IiBOUz25a3DSPgc8oNf65p01oUVTvxdUBN5EumkCpUfGz8783-4KJgvFpAD0b6UHu0PptT3y6exqzGlMr7r8DO9CMl5~ubbP~qnyl2DbfEhhvQEafLxm55iWXpT4z06twwuIydwYlJyo~1xRtCFt6MVuVuYBVGzwWE2l1CwThBCDQU~Q__)",
        primaryColor: "#9fb43d",
      },
    },

    {
      id: "image-cat",
      name: "Cat",
      previewStyle: {
        backgroundImage:
          "url(https://media-hosting.imagekit.io/f5e9bf77cdc548be/Green%20Orange%20Illustrated%20Cat%20Desktop%20Wallpaper.png?Expires=1840872063&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=GAIvnUQYvkbL5fPZR1MT1LcJGB-lHYxjX332hfgUUafncOy8SiRG-VAV~7AiBeevXMSFBVbvT5BBmoucBlQ15i67HzNPWbU6XJRswFOrrD5oKcRXBSBJayb5YmwFdKvj-j~hI-ga-zwi9IVJEZRttB7nsn7BU3EdEf~9HHmjxq277yxJOl63KaV~xN9HmZQ53Z0IHJg0lur7j7gZ18bIacl9iaNeAG1yTEO0zjkT-2~g3qQgyWgHJAkcwXxUGFQf47Pwlmg6r61xlOJDLF8rny~McBqycfzURsjKXIpI-oapLcN2BP3o-5NeT82vBz4NHNnTkcVJIb6Mcy~TMC3JTA__)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      value: {
        type: "image",
        style:
          "url(https://media-hosting.imagekit.io/f5e9bf77cdc548be/Green%20Orange%20Illustrated%20Cat%20Desktop%20Wallpaper.png?Expires=1840872063&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=GAIvnUQYvkbL5fPZR1MT1LcJGB-lHYxjX332hfgUUafncOy8SiRG-VAV~7AiBeevXMSFBVbvT5BBmoucBlQ15i67HzNPWbU6XJRswFOrrD5oKcRXBSBJayb5YmwFdKvj-j~hI-ga-zwi9IVJEZRttB7nsn7BU3EdEf~9HHmjxq277yxJOl63KaV~xN9HmZQ53Z0IHJg0lur7j7gZ18bIacl9iaNeAG1yTEO0zjkT-2~g3qQgyWgHJAkcwXxUGFQf47Pwlmg6r61xlOJDLF8rny~McBqycfzURsjKXIpI-oapLcN2BP3o-5NeT82vBz4NHNnTkcVJIb6Mcy~TMC3JTA__)",
        primaryColor: "#9fb43d",
      },
    },

    {
      id: "image-Home",
      name: "Home",
      previewStyle: {
        backgroundImage:
          "url(https://media-hosting.imagekit.io/bf8a6ed53cdd434c/Yellow%20and%20Pink%20Colorful%20Boy%20Sleeping%20In%20The%20Room%20anime%20Desktop%20Wallpaper.png?Expires=1840872063&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=hQ6d5PNzXCYdrWss220VB42JT1jXyFaPOqkSoKV7sxvpQTquKskqMpsMpv5~vvQYAZIzMDzeQssduHEAQ69r-KcemvbtdflUt00YThesvj4fAovaslcrrWeU7tp0ry8TfKV4d-gzfLY8FeqFpm42JtVQCbL-GgrTHQOgKgqlayQaPUMU0ci2JeJzOLE-3YlSqbo2B9lnz7aGCeWqNTmRb3J7GD9MuD6JSMmRG5RHZnZlWDfhx9010oGaK6DrVvsal7NLrCv0MOWUE7ERZjMQ4B5lhUWJ~~k65QiYrzNwgYacsdKCCO-i5t4wF5uJgy6ene-W4Y0F3uMitEOyzCcKsA__)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      },
      value: {
        type: "image",
        style:
          "url(https://media-hosting.imagekit.io/bf8a6ed53cdd434c/Yellow%20and%20Pink%20Colorful%20Boy%20Sleeping%20In%20The%20Room%20anime%20Desktop%20Wallpaper.png?Expires=1840872063&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=hQ6d5PNzXCYdrWss220VB42JT1jXyFaPOqkSoKV7sxvpQTquKskqMpsMpv5~vvQYAZIzMDzeQssduHEAQ69r-KcemvbtdflUt00YThesvj4fAovaslcrrWeU7tp0ry8TfKV4d-gzfLY8FeqFpm42JtVQCbL-GgrTHQOgKgqlayQaPUMU0ci2JeJzOLE-3YlSqbo2B9lnz7aGCeWqNTmRb3J7GD9MuD6JSMmRG5RHZnZlWDfhx9010oGaK6DrVvsal7NLrCv0MOWUE7ERZjMQ4B5lhUWJ~~k65QiYrzNwgYacsdKCCO-i5t4wF5uJgy6ene-W4Y0F3uMitEOyzCcKsA__)",
        primaryColor: "#9fb43d",
      },
    },
    // Thêm các theme khác của bạn vào đây
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
        } else {
          setBio("");
          setThemeColor("#ffffff");
          setButtonStyle("rounded-lg"); // Reset về default nếu không có profile
          setSelectedThemeId(null);
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
          {/* username */}

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
