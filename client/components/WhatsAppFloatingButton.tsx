import React from "react";

const WHATSAPP_NUMBER = "919829271900"; // India number, no +
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function WhatsAppFloatingButton() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
      className="fixed z-50 bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center w-14 h-14 transition-colors group"
      style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.18)" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="32"
        height="32"
        fill="currentColor"
        className=""
      >
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.393L4 29l7.824-2.205C13.41 27.597 14.686 28 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.18 0-2.332-.205-3.418-.607l-.244-.09-4.646 1.31 1.32-4.527-.158-.234C7.205 19.332 7 18.18 7 17c0-4.963 4.037-9 9-9s9 4.037 9 9-4.037 9-9 9zm5.09-6.26c-.278-.139-1.646-.812-1.9-.904-.254-.093-.439-.139-.625.139-.186.278-.719.904-.881 1.09-.163.186-.325.209-.603.07-.278-.139-1.175-.433-2.24-1.38-.828-.738-1.387-1.65-1.55-1.928-.163-.278-.017-.428.123-.567.127-.126.278-.326.417-.489.139-.163.186-.278.278-.463.093-.186.047-.349-.023-.488-.07-.139-.625-1.508-.857-2.064-.226-.543-.456-.47-.625-.479l-.53-.009c-.163 0-.428.06-.653.279-.225.22-.86.84-.86 2.048 0 1.208.88 2.377 1.002 2.543.123.163 1.73 2.646 4.19 3.604.586.202 1.043.322 1.4.412.588.15 1.124.129 1.548.078.472-.056 1.446-.591 1.65-1.162.204-.57.204-1.058.143-1.162-.06-.104-.225-.163-.472-.278z"/>
      </svg>
      <span className="sr-only">Chat with us on WhatsApp</span>
    </a>
  );
}
