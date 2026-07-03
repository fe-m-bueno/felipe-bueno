import SectionContainer from "@/components/SectionContainer";
import MouseGradient from "@/components/MouseGradient";
import ScrollNavigator from "@/components/ScrollNavigator";

export default function Home() {
  return (
    <div className="relative isolate min-h-screen">
      <MouseGradient />
      <div className="relative z-10">
        <SectionContainer />
      </div>
      <ScrollNavigator />
    </div>
  );
}
