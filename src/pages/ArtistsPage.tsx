import { Navbar } from "@/components/Navbar";
import { ArtistsSection } from "@/components/ArtistsSection";
import { Footer } from "@/components/Footer";

const ArtistsPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-16">
      <ArtistsSection />
    </div>
    <Footer />
  </div>
);

export default ArtistsPage;
