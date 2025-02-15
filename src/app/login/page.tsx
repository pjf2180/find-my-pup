import Image from "next/image";
import { LoginForm } from "./components/login-form.component";
import clsx from "clsx";

export default function LoginPage() {
  return (
    <div className="flex justify-center h-0 min-h-screen bg-[rgba(19,10,33)]">
      <div
        className={clsx(
          "h-full w-full max-w-7xl rounded-lg md:h-fit md:flex md:flex-row-reverse md:mt-[20vh] bg-white  overflow-hidden",
          "shadow-[0_0_69px_14px_rgba(244,200,225,0.4)] "
        )}
      >
        <div className="h-[400px] flex flex-col justify-end overflow-hidden md:h-[600px] w-full md:w-1/2">
          <div
            className="rounded-r-lg"
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              padding: "15px",
            }}
          >
            <Image
              src="/images/hannah-lim-U6nlG0Y5sfs-unsplash.jpg"
              alt="Background"
              layout="fill"
              objectPosition="center 80%"
              objectFit="cover" // Ensures the image fills without distortion
              priority // Loads image faster
            />
          </div>
        </div>

        <div className="p-8 flex flex-col justify-center items-center md:flex-1">
          <div className="max-w-96">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
// hannah-lim-U6nlG0Y5sfs-unsplash.jpg
