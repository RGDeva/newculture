import { Navbar } from "@/components/Navbar";
import { MapSection } from "@/components/MapSection";
import { Footer } from "@/components/Footer";

const MapPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-16">
      <MapSection />
    </div>
    <Footer />
  </div>
);

export default MapPage;
