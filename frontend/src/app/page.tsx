import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen relative">
      <Image
        src="/main.png"
        alt="Background"
        fill
        className="object-cover object-bottom-left"
        priority
        quality={100}
      />
    </div>
  );
}
