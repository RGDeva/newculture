import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ToolsSection } from "@/components/ToolsSection";
import { MapSection } from "@/components/MapSection";
import { JoinSection } from "@/components/JoinSection";
import { CommunitySection } from "@/components/CommunitySection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <ToolsSection />
      <MapSection />
      <JoinSection />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Index;
