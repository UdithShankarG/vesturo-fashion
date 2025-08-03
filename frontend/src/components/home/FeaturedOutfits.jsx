import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from "@mui/material";
import { ArrowForward, Visibility } from "@mui/icons-material";

const FeaturedOutfits = ({
  categories,
  categoriesLoading,
  onCategoryClick,
}) => {
  // Only show skeleton on initial load, not when categories are empty
  const shouldShowSkeleton = categoriesLoading && categories.length === 0;
  const hasCategories = categories && categories.length > 0;

  return (
    <Box
      data-section="featured"
      sx={{
        position: "relative",
        mt: { xs: "120px", md: "150px" },
        px: { xs: "24px", md: "48px" },
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
      }}>
      {/* Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-50px",
          right: "20%",
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(108, 92, 231, 0.06) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Section Header */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          mb: { xs: "32px", md: "48px" },
          textAlign: "center",
        }}>
        <Typography
          sx={{
            fontSize: { xs: "32px", md: "48px" },
            fontWeight: 700,
            color: "#FFFFFF",
            mb: { xs: "12px", md: "16px" },
            fontFamily: '"Poppins", sans-serif',
            letterSpacing: "-0.01em",
            background:
              "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
          Featured Collections
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "16px", md: "18px" },
            fontWeight: 300,
            color: "rgba(255, 255, 255, 0.7)",
            maxWidth: "500px",
            mx: "auto",
            fontFamily: '"Poppins", sans-serif',
            letterSpacing: "0.01em",
          }}>
          Discover our carefully curated outfit collections
        </Typography>
      </Box>

      {/* Collections Grid */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          gap: { xs: "20px", md: "24px" },
          overflowX: "auto",
          pb: { xs: "24px", md: "32px" },
          minHeight: { xs: "320px", sm: "380px", md: "420px" },
          width: "100%",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(108, 92, 231, 0.6)",
            borderRadius: "8px",
            "&:hover": {
              background: "rgba(108, 92, 231, 0.8)",
            },
          },
        }}>
        {shouldShowSkeleton ? (
          // Modern loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                minWidth: { xs: "280px", sm: "320px", md: "360px" },
                maxWidth: { xs: "280px", sm: "320px", md: "360px" },
                background: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                flexShrink: 0,
                overflow: "hidden",
                position: "relative",
              }}>
              {/* Image skeleton */}
              <Box
                sx={{
                  aspectRatio: "4/5",
                  minHeight: { xs: "220px", sm: "260px", md: "290px" },
                  background:
                    "linear-gradient(135deg, rgba(108, 92, 231, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
                    animation: "shimmer 2s infinite",
                  },
                  "@keyframes shimmer": {
                    "0%": { left: "-100%" },
                    "100%": { left: "100%" },
                  },
                }}
              />
              {/* Content skeleton */}
              <Box sx={{ p: { xs: "16px", md: "20px" } }}>
                <Box
                  sx={{
                    height: "24px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    mb: "12px",
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
                      animation: "shimmer 2s infinite 0.5s",
                    },
                  }}
                />
                <Box
                  sx={{
                    height: "16px",
                    width: "60%",
                    background: "rgba(255, 255, 255, 0.08)",
                    borderRadius: "6px",
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
                      animation: "shimmer 2s infinite 1s",
                    },
                  }}
                />
              </Box>
            </Box>
          ))
        ) : hasCategories ? (
          categories.slice(0, 12).map((category) => (
            <Card
              key={category._id}
              onClick={() => onCategoryClick(category.slug)}
              sx={{
                minWidth: { xs: "280px", sm: "320px", md: "360px" },
                maxWidth: { xs: "280px", sm: "320px", md: "360px" },
                background: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                cursor: "pointer",
                flexShrink: 0,
                overflow: "hidden",
                position: "relative",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: "0 20px 60px rgba(108, 92, 231, 0.3)",
                  borderColor: "rgba(108, 92, 231, 0.4)",
                  background: "rgba(255, 255, 255, 0.05)",
                  "& .category-overlay": {
                    opacity: 1,
                  },
                  "& .category-image": {
                    transform: "scale(1.1)",
                  },
                  "& .category-title": {
                    color: "#6C5CE7",
                  },
                },
              }}>
              {/* Image Container */}
              <Box sx={{ position: "relative", overflow: "hidden" }}>
                <CardMedia
                  component="img"
                  className="category-image"
                  sx={{
                    aspectRatio: "4/5",
                    minHeight: { xs: "220px", sm: "260px", md: "290px" },
                    objectFit: "cover",
                    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  image={category.image || "/api/placeholder/360/450"}
                  alt={category.name}
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <Box
                  className="category-overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(135deg, rgba(108, 92, 231, 0.2) 0%, rgba(0, 0, 0, 0.3) 100%)",
                    opacity: 0,
                    transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <IconButton
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      color: "#6C5CE7",
                      width: "56px",
                      height: "56px",
                      "&:hover": {
                        backgroundColor: "#FFFFFF",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}>
                    <ArrowForward />
                  </IconButton>
                </Box>
              </Box>

              {/* Content */}
              <CardContent
                sx={{
                  p: { xs: "16px", md: "20px" },
                  "&:last-child": { pb: { xs: "16px", md: "20px" } },
                }}>
                <Typography
                  className="category-title"
                  sx={{
                    fontSize: { xs: "18px", md: "20px" },
                    fontWeight: 600,
                    color: "#FFFFFF",
                    textAlign: "center",
                    lineHeight: 1.3,
                    fontFamily: '"Poppins", sans-serif',
                    letterSpacing: "0.01em",
                    transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}>
                  {category.name}
                </Typography>

                {/* Optional: Add post count if available */}
                {category.postCount && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      mt: "8px",
                    }}>
                    <Visibility
                      sx={{
                        fontSize: "14px",
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.6)",
                        fontFamily: '"Poppins", sans-serif',
                      }}>
                      {category.postCount} items
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          // Modern empty state
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              minHeight: { xs: "320px", sm: "380px", md: "420px" },
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.02)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              p: { xs: "32px", md: "48px" },
            }}>
            <Box
              sx={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(108, 92, 231, 0.2) 0%, rgba(108, 92, 231, 0.1) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: "24px",
              }}>
              <Visibility
                sx={{ fontSize: "32px", color: "rgba(255, 255, 255, 0.6)" }}
              />
            </Box>

            <Typography
              sx={{
                fontSize: { xs: "18px", md: "20px" },
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.8)",
                mb: "8px",
                fontFamily: '"Poppins", sans-serif',
              }}>
              No Collections Yet
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "14px", md: "16px" },
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: '"Poppins", sans-serif',
                maxWidth: "300px",
              }}>
              Featured collections will appear here once they're available
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FeaturedOutfits;
