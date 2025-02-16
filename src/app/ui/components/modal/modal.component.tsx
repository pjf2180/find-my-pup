import { ReactNode, useEffect } from "react";

export default function Modal({
  isOpen,
  children,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);
  return (
    isOpen && (
      <>
        <div
          className="z-20 fixed top-0 left-0 right-0 flex items-center justify-center min-h-screen bg-gray-400 bg-opacity-90"
          onClick={() => {
            onClose();
          }}
        ></div>
        <div
          className="z-30 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white overflow-hidden rounded-2xl shadow-xl container h-[700px]"
        >
          {children}
        </div>
      </>
    )
  );
}
