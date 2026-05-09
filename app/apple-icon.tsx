import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#08080B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M44 16 H22 a8 8 0 0 0 -8 8 v16 a8 8 0 0 0 8 8 h22"
            fill="none"
            stroke="#7BF1B0"
            strokeWidth="4.5"
            strokeLinecap="square"
          />
          <circle cx="29" cy="32" r="2.8" fill="#7BF1B0" />
          <circle cx="37" cy="32" r="2.8" fill="#7BF1B0" />
          <circle cx="45" cy="32" r="2.8" fill="#7BF1B0" />
        </svg>
      </div>
    ),
    size,
  );
}
