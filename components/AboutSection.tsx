import About from './About';
import Resume from './Resume';

export default function AboutMe() {
  return (
    <div className="relative w-full px-4 lg:px-32 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <About />
        </div>
        <div>
          <Resume />
        </div>
      </div>
    </div>
  );
}
