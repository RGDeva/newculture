import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ArtistsSection } from "@/components/ArtistsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { MapSection } from "@/components/MapSection";
import { JoinSection } from "@/components/JoinSection";
import { CommunitySection } from "@/components/CommunitySection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ArtistsSection />
      <ServicesSection />
      <MapSection />
      <JoinSection />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Index;
