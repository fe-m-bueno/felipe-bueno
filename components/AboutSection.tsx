import About from "./About";
import Resume from "./Resume";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function AboutMe() {
  return (
    <div className="relative w-screen lg:px-32 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <About />
        </div>
        <div>
          <Resume />
        </div>
      </div>
      <Link
        href="#landing"
        className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-8 z-10 cursor-pointer transition-all duration-100 hover:scale-110 active:scale-105 bg-white/85 backdrop-blur rounded-full p-2 border border-gray-200 "
      >
        <ArrowLeft className="w-6 h-6 text-black" />
      </Link>
      <Link
        href="#projects"
        className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-8 z-10 cursor-pointer transition-all duration-100 hover:scale-110 active:scale-105 bg-white/85 backdrop-blur rounded-full p-2 border border-gray-200 "
      >
        <ArrowRight className="w-6 h-6 text-black" />
      </Link>
    </div>
  );
}
