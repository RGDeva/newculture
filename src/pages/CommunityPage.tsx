import { Navbar } from "@/components/Navbar";
import { CommunitySection } from "@/components/CommunitySection";
import { JoinSection } from "@/components/JoinSection";
import { Footer } from "@/components/Footer";

const CommunityPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-16">
      <CommunitySection />
      <JoinSection />
    </div>
    <Footer />
  </div>
);

export default CommunityPage;
