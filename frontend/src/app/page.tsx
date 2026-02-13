import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen relative">
      <Image
        src="/Главная2.png"
        alt="Background"
        fill
        className="object-cover"
        priority
        quality={85}
      />
    </div>
  );
}
