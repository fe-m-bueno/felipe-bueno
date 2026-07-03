import SectionContainer from "@/components/SectionContainer";
import MouseGradient from "@/components/MouseGradient";
import ScrollNavigator from "@/components/ScrollNavigator";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SectionContainer />
      <MouseGradient />
      <ScrollNavigator />
    </div>
  );
}
