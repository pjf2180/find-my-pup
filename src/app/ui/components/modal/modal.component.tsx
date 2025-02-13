import { ReactNode } from "react"

export default function Modal({ isOpen,children }: { isOpen: boolean, children: ReactNode }) {
  return (
    isOpen && (
      <div className="z-20 fixed top-0 left-0 right-0 flex items-center justify-center min-h-screen bg-gray-400 bg-opacity-90">
        <div className="bg-white p-6 rounded-2xl shadow-xl container min-h-[70vh]">
         {children}
          </div>
        </div>
    )
  );
}
