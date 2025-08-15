
import Image from "next/image";
import { Toaster } from "sonner";


export default function AuthLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center md:justify-start hidden lg:block">
          <a href="#" className="flex items-center font-medium">
            <div className="text-primary-foreground flex items-center justify-center rounded-md">
              <Image
                src="/icon.png"
                width={80}
                height={80}
                alt="dompetku"
                className="rounded-full -mr-3"
              />
            </div>
            <span className="text-xl font-semibold">dompetKU</span>
          </a>
        </div>
        <div className="flex-1 p-3 md:p-10 flex flex-col justify-center animate-fade-in">
          <div className="flex items-center justify-center -ml-30 lg:hidden md:mb-3 items-center">
            <Image
                src="/icon.png"
                width={80}
                height={80}
                alt="dompetku"
                className="rounded-full -mr-3"
              />
            <span className="text-xl font-semibold">dompetKU</span>
          </div>
          {children}
        </div>
        <Toaster position="top-right" richColors  />
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/image.png"
          alt="Illustration"
          fill
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      
    </div>
  )
}