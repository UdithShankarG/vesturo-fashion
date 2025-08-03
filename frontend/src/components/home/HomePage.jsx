import { useEffect, useCallback, memo } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useCategoryStore from "../../store/categoryStore";

// Import separated components
import Header from "./Header";
import HeroSection from "./HeroSection";
import FeaturedOutfits from "./FeaturedOutfits";
import SupportSection from "./SupportSection";
import ThankYouSection from "./ThankYouSection";
import Footer from "./Footer";

const HomePage = memo(() => {
  const navigate = useNavigate();
  const {
    categories,
    fetchCategories,
    isLoading: categoriesLoading,
  } = useCategoryStore();

  useEffect(() => {
    fetchCategories({ active: true, limit: 12 });
  }, [fetchCategories]);

  const handleInstagramClick = useCallback(() => {
    window.open("https://instagram.com/_vesturo", "_blank");
  }, []);

  const handleCategoryClick = useCallback(
    (slug) => {
      navigate(`/category/${slug}`);
    },
    [navigate]
  );

  return (
    <Box
      sx={{
        bgcolor: "#000000",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
        overflowX: "hidden", // Prevent horizontal scroll
      }}>
      {/* Header Section */}
      <Header onInstagramClick={handleInstagramClick} />

      {/* Hero Section */}
      <HeroSection onInstagramClick={handleInstagramClick} />

      {/* Featured Outfits Section */}
      <FeaturedOutfits
        categories={categories}
        categoriesLoading={categoriesLoading}
        onCategoryClick={handleCategoryClick}
      />

      {/* Support Section */}
      <SupportSection onInstagramClick={handleInstagramClick} />

      {/* Thank You Section */}
      <ThankYouSection />

      {/* Footer Section */}
      <Footer />
    </Box>
  );
});

export default HomePage;
