import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Instagram,
  ArrowBack,
  Share as ShareIcon,
  Favorite,
  FavoriteBorder,
  Visibility,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import usePostStore from "../../store/postStore";

// Helper function to get brand-specific SVG icons
const getBrandIcon = (brand) => {
  const brandName = brand?.toUpperCase();

  switch (brandName) {
    case "AMAZON":
      return (
        <Box
          sx={{
            width: "20px",
            height: "20px",
            background: "linear-gradient(135deg, #FF9900 0%, #FF7700 100%)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
            color: "#FFFFFF",
          }}>
          A
        </Box>
      );
    case "FLIPKART":
      return (
        <Box
          sx={{
            width: "20px",
            height: "20px",
            background: "linear-gradient(135deg, #047BD6 0%, #0056B3 100%)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
            color: "#FFFFFF",
          }}>
          F
        </Box>
      );
    case "MYNTRA":
      return (
        <Box
          sx={{
            width: "20px",
            height: "20px",
            background: "linear-gradient(135deg, #FF3F6C 0%, #E91E63 100%)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
            color: "#FFFFFF",
          }}>
          M
        </Box>
      );
    case "AJIO":
      return (
        <Box
          sx={{
            width: "20px",
            height: "20px",
            background: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
            color: "#FFFFFF",
          }}>
          A
        </Box>
      );
    case "NYKAA":
      return (
        <Box
          sx={{
            width: "20px",
            height: "20px",
            background: "linear-gradient(135deg, #FC2779 0%, #E91E63 100%)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
            color: "#FFFFFF",
          }}>
          N
        </Box>
      );
    default:
      return (
        <Box
          sx={{
            width: "20px",
            height: "20px",
            background: "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
            color: "#FFFFFF",
          }}>
          🛍️
        </Box>
      );
  }
};

const PostDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(0);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const {
    currentPost,
    fetchPostBySlug,
    likePost,
    sharePost,
    isLoading,
    error,
  } = usePostStore();

  useEffect(() => {
    if (slug) {
      // Only fetch if we don't have the current post or if it's a different slug
      if (!currentPost || currentPost.slug !== slug) {
        setHasAttemptedFetch(true);
        fetchPostBySlug(slug);
      } else if (currentPost && currentPost.slug === slug) {
        setHasAttemptedFetch(true);
      }
    }
  }, [slug, fetchPostBySlug, currentPost]);

  // Initialize likes when post loads
  useEffect(() => {
    if (currentPost) {
      setLocalLikes(currentPost.likes || 0);
    }
  }, [currentPost]);

  const handleInstagramClick = () => {
    window.open("https://instagram.com/_vesturo", "_blank");
  };

  const handleLike = async () => {
    if (!currentPost) return;

    try {
      const wasLiked = isLiked;
      setIsLiked(!wasLiked);
      setLocalLikes((prev) => (wasLiked ? prev - 1 : prev + 1));

      // Call backend to update likes
      await likePost(currentPost._id);
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked);
      setLocalLikes(currentPost.likes || 0);
      console.error("Error liking post:", error);
    }
  };

  const handleBackToCategory = () => {
    // Navigate back to the category where user came from
    if (currentPost?.category?.slug) {
      navigate(`/category/${currentPost.category.slug}`, { replace: false });
    } else {
      // Fallback to home if no category
      navigate("/", { replace: false });
    }
  };

  const handleShare = async () => {
    if (!currentPost) return;

    try {
      console.log("Share button clicked for post:", currentPost.title);

      // Update share count in backend
      try {
        await sharePost(currentPost._id);
      } catch (apiError) {
        console.log("API share update failed:", apiError);
      }

      // Create share URL and data
      const shareUrl = `${window.location.origin}/post/${currentPost.slug}`;
      const shareData = {
        title: `${currentPost.title} - VESTURO`,
        text: `Discover this amazing outfit on VESTURO: ${currentPost.title}`,
        url: shareUrl,
      };

      // Show custom share modal for all devices
      showCustomShareModal(currentPost, shareUrl, shareData);
    } catch (error) {
      console.error("Error in share function:", error);
      showShareErrorNotification();
    }
  };

  const showCustomShareModal = (post, shareUrl, shareData) => {
    // Create modal overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(20px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
      padding: 20px;
    `;

    // Create modal content
    const modal = document.createElement("div");
    modal.style.cssText = `
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(25, 25, 25, 0.98) 100%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 28px;
      padding: 40px 32px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      font-family: "Poppins", sans-serif;
      animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(40px);
      position: relative;
      overflow: hidden;
    `;

    // Add subtle animated background pattern
    const bgPattern = document.createElement("div");
    bgPattern.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 20% 20%, rgba(108, 92, 231, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(108, 92, 231, 0.05) 0%, transparent 50%),
                  radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
      animation: bgFloat 8s ease-in-out infinite;
      pointer-events: none;
    `;
    modal.appendChild(bgPattern);

    // Detect device type for appropriate sharing options
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const isTablet =
      /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;

    modal.innerHTML = `
      <!-- Header Section -->
      <div style="margin-bottom: 32px; text-align: center;">
        <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; box-shadow: 0 8px 32px rgba(108, 92, 231, 0.3);">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="white"/>
          </svg>
        </div>
        <h3 style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 0 0 8px 0; font-family: 'Poppins', sans-serif; letter-spacing: -0.02em;">Share This Look</h3>
        <p style="color: rgba(255, 255, 255, 0.6); font-size: 14px; margin: 0; font-family: 'Poppins', sans-serif; font-weight: 400; line-height: 1.4; max-width: 280px; margin: 0 auto;">${
          post.title
        }</p>
      </div>

      <!-- Share Options Grid -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;">
        ${
          isMobile || isTablet
            ? `
          <!-- WhatsApp -->
          <button class="share-btn" data-action="whatsapp" style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; border: none; border-radius: 20px; padding: 20px 16px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3); font-family: 'Poppins', sans-serif; position: relative; overflow: hidden;">
            <div style="position: relative; z-index: 2;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 8px;">
                <path d="M20.5 3.6C18.8 1.9 16.6 1 14.2 1C9.3 1 5.4 4.9 5.4 9.8C5.4 11.4 5.8 13 6.6 14.4L5.3 19L10 17.7C11.4 18.4 12.8 18.8 14.2 18.8C19.1 18.8 23 14.9 23 10C23 7.6 22.1 5.4 20.5 3.6ZM14.2 17.2C12.9 17.2 11.7 16.8 10.6 16.1L10.4 16L7.7 16.7L8.4 14.1L8.3 13.9C7.5 12.7 7.1 11.3 7.1 9.8C7.1 5.8 10.2 2.7 14.2 2.7C16.1 2.7 17.9 3.4 19.2 4.7C20.5 6 21.2 7.8 21.2 9.7C21.3 13.8 18.2 17.2 14.2 17.2Z" fill="white"/>
              </svg>
              <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.02em;">WhatsApp</div>
            </div>
          </button>

          <!-- Telegram -->
          <button class="share-btn" data-action="telegram" style="background: linear-gradient(135deg, #0088CC 0%, #005577 100%); color: white; border: none; border-radius: 20px; padding: 20px 16px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 20px rgba(0, 136, 204, 0.3); font-family: 'Poppins', sans-serif; position: relative; overflow: hidden;">
            <div style="position: relative; z-index: 2;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 8px;">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 13.95 10.7 14 10.49C14.01 10.46 14.01 10.42 13.99 10.38C13.97 10.34 13.94 10.31 13.9 10.31C13.85 10.31 13.8 10.33 13.76 10.36C13.65 10.43 11.9 11.67 8.53 14.13C8.05 14.46 7.62 14.62 7.23 14.61C6.8 14.6 5.97 14.37 5.34 14.18C4.58 13.95 3.97 13.82 4.03 13.4C4.06 13.18 4.38 12.96 4.99 12.74C8.71 11.2 11.26 10.2 12.64 9.72C16.18 8.35 16.89 8.12 17.33 8.12C17.42 8.12 17.62 8.14 17.75 8.24C17.85 8.32 17.88 8.43 17.9 8.5C17.88 8.43 17.91 8.66 16.64 8.8Z" fill="white"/>
              </svg>
              <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.02em;">Telegram</div>
            </div>
          </button>

          <!-- SMS -->
          <button class="share-btn" data-action="sms" style="background: linear-gradient(135deg, #34C759 0%, #28A745 100%); color: white; border: none; border-radius: 20px; padding: 20px 16px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 20px rgba(52, 199, 89, 0.3); font-family: 'Poppins', sans-serif; position: relative; overflow: hidden;">
            <div style="position: relative; z-index: 2;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 8px;">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16ZM7 9H17V11H7V9ZM7 12H15V14H7V12ZM7 6H17V8H7V6Z" fill="white"/>
              </svg>
              <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.02em;">Messages</div>
            </div>
          </button>
        `
            : ""
        }

        <!-- Twitter -->
        <button class="share-btn" data-action="twitter" style="background: linear-gradient(135deg, #1DA1F2 0%, #0D8BD9 100%); color: white; border: none; border-radius: 20px; padding: 20px 16px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 20px rgba(29, 161, 242, 0.3); font-family: 'Poppins', sans-serif; position: relative; overflow: hidden;">
          <div style="position: relative; z-index: 2;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 8px;">
              <path d="M23.953 4.57C23.069 4.947 22.124 5.213 21.129 5.348C22.143 4.734 22.923 3.769 23.292 2.625C22.341 3.193 21.287 3.593 20.165 3.805C19.269 2.847 17.99 2.248 16.574 2.248C13.857 2.248 11.654 4.451 11.654 7.168C11.654 7.538 11.699 7.897 11.781 8.242C7.691 8.049 4.066 6.13 1.64 3.161C1.213 3.884 0.974 4.734 0.974 5.644C0.974 7.367 1.844 8.899 3.162 9.795C2.355 9.769 1.596 9.554 0.934 9.191V9.251C0.934 11.647 2.627 13.637 4.902 14.082C4.488 14.197 4.055 14.259 3.609 14.259C3.297 14.259 2.994 14.229 2.697 14.173C3.316 16.123 5.134 17.538 7.29 17.58C5.604 18.881 3.482 19.656 1.175 19.656C0.777 19.656 0.385 19.635 0 19.594C2.179 20.969 4.767 21.752 7.548 21.752C16.563 21.752 21.502 14.337 21.502 7.724C21.502 7.52 21.498 7.318 21.489 7.117C22.456 6.415 23.293 5.544 23.953 4.57Z" fill="white"/>
            </svg>
            <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.02em;">Twitter</div>
          </div>
        </button>

        <!-- Facebook -->
        <button class="share-btn" data-action="facebook" style="background: linear-gradient(135deg, #1877F2 0%, #0C63D4 100%); color: white; border: none; border-radius: 20px; padding: 20px 16px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 20px rgba(24, 119, 242, 0.3); font-family: 'Poppins', sans-serif; position: relative; overflow: hidden;">
          <div style="position: relative; z-index: 2;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 8px;">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24V15.564H7.078V12.073H10.125V9.405C10.125 6.348 11.917 4.688 14.658 4.688C15.97 4.688 17.344 4.922 17.344 4.922V7.875H15.83C14.34 7.875 13.875 8.8 13.875 9.75V12.073H17.203L16.671 15.564H13.875V24C19.612 23.094 24 18.1 24 12.073Z" fill="white"/>
            </svg>
            <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.02em;">Facebook</div>
          </div>
        </button>

        <!-- Copy Link -->
        <button class="share-btn" data-action="copy" style="background: linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%); color: white; border: none; border-radius: 20px; padding: 20px 16px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 20px rgba(108, 92, 231, 0.3); font-family: 'Poppins', sans-serif; position: relative; overflow: hidden;">
          <div style="position: relative; z-index: 2;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 8px;">
              <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="white"/>
            </svg>
            <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.02em;">Copy Link</div>
          </div>
        </button>
      </div>

      <!-- Close Button -->
      <button class="close-btn" style="background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 16px 24px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); width: 100%; font-family: 'Poppins', sans-serif; backdrop-filter: blur(10px);">
        Cancel
      </button>
    `;

    overlay.appendChild(modal);
    addShareAnimationStyles();
    document.body.appendChild(overlay);

    // Add event listeners
    const shareButtons = modal.querySelectorAll(".share-btn");
    shareButtons.forEach((btn) => {
      // Add shimmer effect
      btn.style.position = "relative";
      btn.style.overflow = "hidden";

      // Create shimmer element
      const shimmer = document.createElement("div");
      shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.6s ease;
        pointer-events: none;
      `;
      btn.appendChild(shimmer);

      btn.addEventListener("click", (e) => {
        const action = e.currentTarget.getAttribute("data-action");

        // Add click animation
        btn.style.transform = "scale(0.95)";
        setTimeout(() => {
          btn.style.transform = "scale(1.05)";
          setTimeout(() => {
            btn.style.transform = "scale(1)";
          }, 100);
        }, 100);

        handleShareAction(action, shareUrl, shareData);
        closeModal();
      });

      // Enhanced hover effects
      btn.addEventListener("mouseenter", () => {
        btn.style.transform = "scale(1.08) translateY(-2px)";
        btn.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.4)";
        shimmer.style.left = "100%";
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "scale(1) translateY(0)";
        btn.style.boxShadow =
          btn.getAttribute("data-action") === "whatsapp"
            ? "0 4px 20px rgba(37, 211, 102, 0.3)"
            : btn.getAttribute("data-action") === "telegram"
            ? "0 4px 20px rgba(0, 136, 204, 0.3)"
            : btn.getAttribute("data-action") === "sms"
            ? "0 4px 20px rgba(52, 199, 89, 0.3)"
            : btn.getAttribute("data-action") === "twitter"
            ? "0 4px 20px rgba(29, 161, 242, 0.3)"
            : btn.getAttribute("data-action") === "facebook"
            ? "0 4px 20px rgba(24, 119, 242, 0.3)"
            : "0 4px 20px rgba(108, 92, 231, 0.3)";
        shimmer.style.left = "-100%";
      });
    });

    // Close button functionality
    const closeBtn = modal.querySelector(".close-btn");
    closeBtn.addEventListener("click", closeModal);
    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.background = "rgba(255, 255, 255, 0.1)";
      closeBtn.style.color = "rgba(255, 255, 255, 0.9)";
      closeBtn.style.borderColor = "rgba(255, 255, 255, 0.2)";
    });
    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.background = "rgba(255, 255, 255, 0.05)";
      closeBtn.style.color = "rgba(255, 255, 255, 0.7)";
      closeBtn.style.borderColor = "rgba(255, 255, 255, 0.1)";
    });

    // Close on overlay click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });

    // Close modal function
    function closeModal() {
      overlay.style.animation = "fadeOut 0.3s ease-out";
      modal.style.animation = "slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    }
  };

  const handleShareAction = (action, shareUrl, shareData) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareData.text);

    switch (action) {
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
          "_blank"
        );
        break;
      case "telegram":
        window.open(
          `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
          "_blank"
        );
        break;
      case "sms":
        window.open(`sms:?body=${encodedText}%20${encodedUrl}`, "_blank");
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            showShareSuccessNotification();
          })
          .catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            showShareSuccessNotification();
          });
        break;
    }
  };

  const showShareSuccessNotification = () => {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%);
      color: white;
      padding: 20px 28px;
      border-radius: 20px;
      font-family: "Poppins", sans-serif;
      font-weight: 600;
      font-size: 15px;
      box-shadow: 0 20px 60px rgba(108, 92, 231, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3);
      z-index: 10001;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 12px;
      user-select: none;
    `;

    notification.innerHTML = `
      <div style="
        width: 24px;
        height: 24px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      ">✨</div>
      <span>Link copied to clipboard!</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation =
        "slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 400);
    }, 3000);
  };

  const showShareErrorNotification = () => {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%);
      color: white;
      padding: 20px 28px;
      border-radius: 20px;
      font-family: "Poppins", sans-serif;
      font-weight: 600;
      font-size: 15px;
      box-shadow: 0 20px 60px rgba(255, 107, 107, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3);
      z-index: 10001;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 12px;
      user-select: none;
    `;

    notification.innerHTML = `
      <div style="
        width: 24px;
        height: 24px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      ">⚠️</div>
      <span>Share failed. Please try again.</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation =
        "slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 400);
    }, 3000);
  };

  const addShareAnimationStyles = () => {
    if (document.querySelector("#share-modal-styles")) return;

    const style = document.createElement("style");
    style.id = "share-modal-styles";
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }

      @keyframes slideUp {
        from {
          transform: translateY(50px) scale(0.9);
          opacity: 0;
        }
        to {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }

      @keyframes slideDown {
        from {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        to {
          transform: translateY(50px) scale(0.9);
          opacity: 0;
        }
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%) scale(0.8);
          opacity: 0;
        }
        to {
          transform: translateX(0) scale(1);
          opacity: 1;
        }
      }

      @keyframes slideOutRight {
        from {
          transform: translateX(0) scale(1);
          opacity: 1;
        }
        to {
          transform: translateX(100%) scale(0.8);
          opacity: 0;
        }
      }

      @keyframes bgFloat {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-10px) rotate(1deg);
        }
      }
    `;
    document.head.appendChild(style);
  };

  // Image navigation functions removed as we're using Swiper autoplay

  // Show loading only if we're actually loading and haven't attempted fetch yet, or if we're loading after an attempt
  if (isLoading || (!currentPost && !hasAttemptedFetch)) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 4,
          position: "relative",
          overflow: "hidden",
        }}>
        {/* Animated background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(108, 92, 231, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(108, 92, 231, 0.05) 0%, transparent 50%)",
            animation: "bgFloat 8s ease-in-out infinite",
            "@keyframes bgFloat": {
              "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
              "25%": { transform: "translate(5px, -5px) rotate(1deg)" },
              "50%": { transform: "translate(-3px, 3px) rotate(-0.5deg)" },
              "75%": { transform: "translate(-5px, -3px) rotate(0.5deg)" },
            },
          }}
        />

        {/* Loading content */}
        <Box sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px auto",
              boxShadow: "0 8px 32px rgba(108, 92, 231, 0.3)",
              animation: "pulse 2s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)", opacity: 1 },
                "50%": { transform: "scale(1.05)", opacity: 0.8 },
              },
            }}>
            <CircularProgress size={32} sx={{ color: "#FFFFFF" }} />
          </Box>

          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: { xs: "24px", md: "28px" },
              fontWeight: 700,
              mb: 2,
              fontFamily: '"Poppins", sans-serif',
              letterSpacing: "-0.02em",
            }}>
            Loading Style Details
          </Typography>

          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: { xs: "14px", md: "16px" },
              fontWeight: 400,
              maxWidth: "300px",
              lineHeight: 1.5,
            }}>
            Preparing your fashion inspiration...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Show error only if we have an error AND we've attempted to fetch
  if ((error || !currentPost) && hasAttemptedFetch && !isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          position: "relative",
          overflow: "hidden",
        }}>
        {/* Animated background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 30%, rgba(231, 76, 60, 0.1) 0%, transparent 50%)",
            animation: "bgFloat 8s ease-in-out infinite",
          }}
        />

        <Box sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px auto",
              boxShadow: "0 8px 32px rgba(231, 76, 60, 0.3)",
            }}>
            <Typography sx={{ fontSize: "32px" }}>😔</Typography>
          </Box>

          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: { xs: "28px", md: "32px" },
              fontWeight: 700,
              mb: 2,
              fontFamily: '"Poppins", sans-serif',
              letterSpacing: "-0.02em",
            }}>
            Style Not Found
          </Typography>

          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: { xs: "14px", md: "16px" },
              mb: 4,
              maxWidth: "400px",
              lineHeight: 1.5,
            }}>
            The fashion piece you're looking for seems to have walked off the
            runway. Let's get you back to discovering amazing styles.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
              background: "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "16px",
              px: 4,
              py: 1.5,
              borderRadius: "12px",
              textTransform: "none",
              boxShadow: "0 8px 32px rgba(108, 92, 231, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #5A4FCF 0%, #4C3BCF 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(108, 92, 231, 0.4)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
            Back to Home
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "#000000",
        minHeight: "100vh",
        position: "relative",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
      }}>
      {/* Ultra-Modern Minimalistic Header */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(0, 0, 0, 0.98)",
          backdropFilter: "blur(40px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          zIndex: 1100,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(108, 92, 231, 0.02) 50%, transparent 100%)",
            pointerEvents: "none",
          },
        }}>
        <Toolbar
          sx={{
            px: { xs: "20px", sm: "32px", md: "48px" },
            py: { xs: "12px", md: "16px" },
            minHeight: { xs: "60px", md: "68px" },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 2,
          }}>
          {/* Left Section - Back & Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: "16px", md: "20px" },
            }}>
            <IconButton
              onClick={handleBackToCategory}
              sx={{
                color: "#FFFFFF",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                width: { xs: "40px", md: "44px" },
                height: { xs: "40px", md: "44px" },
                borderRadius: "14px",
                backdropFilter: "blur(20px)",
                "&:hover": {
                  backgroundColor: "rgba(108, 92, 231, 0.1)",
                  borderColor: "rgba(108, 92, 231, 0.2)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 25px rgba(108, 92, 231, 0.15)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}>
              <ArrowBack sx={{ fontSize: { xs: "20px", md: "22px" } }} />
            </IconButton>

            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: "22px", md: "26px" },
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                fontFamily: '"Poppins", sans-serif',
                background:
                  "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              VESTURO
            </Typography>
          </Box>

          {/* Right Section - Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: "12px", md: "16px" },
            }}>
            <IconButton
              onClick={handleInstagramClick}
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                width: { xs: "40px", md: "44px" },
                height: { xs: "40px", md: "44px" },
                borderRadius: "14px",
                backdropFilter: "blur(20px)",
                "&:hover": {
                  color: "#E1306C",
                  backgroundColor: "rgba(225, 48, 108, 0.08)",
                  borderColor: "rgba(225, 48, 108, 0.2)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 25px rgba(225, 48, 108, 0.15)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}>
              <Instagram sx={{ fontSize: { xs: "20px", md: "22px" } }} />
            </IconButton>

            <Button
              onClick={handleShare}
              sx={{
                background: "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
                color: "#FFFFFF",
                px: { xs: "20px", md: "28px" },
                py: { xs: "10px", md: "12px" },
                borderRadius: "16px",
                fontSize: { xs: "14px", md: "15px" },
                fontWeight: 600,
                textTransform: "none",
                fontFamily: '"Poppins", sans-serif',
                boxShadow: "0 8px 32px rgba(108, 92, 231, 0.25)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5A4FCF 0%, #4C3BCF 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 40px rgba(108, 92, 231, 0.35)",
                },
                "&:active": {
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1,
              }}>
              <ShareIcon sx={{ fontSize: "18px" }} />
              Share
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Ultra-Modern Main Content Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: { xs: "32px", md: "48px", lg: "64px" },
          px: { xs: "20px", sm: "32px", md: "48px", lg: "64px" },
          pt: { xs: "120px", md: "140px" },
          pb: { xs: "40px", md: "60px" },
          maxWidth: "1600px",
          mx: "auto",
          position: "relative",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
          WebkitTouchCallout: "none",
          WebkitTapHighlightColor: "transparent",
        }}>
        {/* Subtle background elements */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(108, 92, 231, 0.03) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: "150px",
            height: "150px",
            background:
              "radial-gradient(circle, rgba(108, 92, 231, 0.02) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(30px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Left Column - Image Carousel */}
        <Box
          sx={{
            width: { xs: "100%", lg: "520px" },
            height: { xs: "70vh", sm: "75vh", md: "80vh", lg: "85vh" },
            maxHeight: { xs: "600px", md: "750px" },
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}>
          {/* Ultra-Modern Swiper Image Carousel */}
          {currentPost.images && currentPost.images.length > 0 ? (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "24px",
                overflow: "hidden",
                position: "relative",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                WebkitTouchCallout: "none",
                WebkitTapHighlightColor: "transparent",
              }}>
              <Swiper
                modules={[Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={currentPost.images.length > 1}
                autoplay={
                  currentPost.images.length > 1
                    ? {
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }
                    : false
                }
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "24px",
                }}>
                {currentPost.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        background:
                          "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
                      }}>
                      <Box
                        component="img"
                        src={image.url || "/api/placeholder/500/700"}
                        alt={`${currentPost.title} - ${index + 1}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          transition:
                            "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "scale(1.02)",
                          },
                          userSelect: "none",
                          WebkitUserSelect: "none",
                          MozUserSelect: "none",
                          msUserSelect: "none",
                          WebkitTouchCallout: "none",
                          WebkitTapHighlightColor: "transparent",
                          pointerEvents: "none",
                        }}
                      />

                      {/* Image overlay gradient */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "30%",
                          background:
                            "linear-gradient(transparent 0%, rgba(0, 0, 0, 0.1) 100%)",
                          pointerEvents: "none",
                        }}
                      />

                      {/* Image counter */}
                      {currentPost.images.length > 1 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            background: "rgba(0, 0, 0, 0.6)",
                            backdropFilter: "blur(20px)",
                            color: "#FFFFFF",
                            px: 2,
                            py: 1,
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}>
                          {index + 1} / {currentPost.images.length}
                        </Box>
                      )}
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          ) : (
            // Ultra-Modern Fallback single image
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "24px",
                overflow: "hidden",
                position: "relative",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}>
              <Box
                component="img"
                src="/api/placeholder/500/700"
                alt={currentPost.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              />

              {/* Image overlay gradient */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "30%",
                  background:
                    "linear-gradient(transparent 0%, rgba(0, 0, 0, 0.1) 100%)",
                  pointerEvents: "none",
                }}
              />
            </Box>
          )}
        </Box>

        {/* Right Column - Ultra-Modern Post Details */}
        <Box
          sx={{
            flex: 1,
            maxWidth: { xs: "100%", lg: "650px" },
            position: "relative",
            zIndex: 1,
          }}>
          {/* Modern Post Title */}
          <Typography
            sx={{
              fontSize: { xs: "32px", sm: "40px", md: "48px", lg: "52px" },
              fontWeight: 800,
              color: "#FFFFFF",
              mb: { xs: "20px", md: "24px" },
              lineHeight: { xs: 1.1, md: 1.05 },
              letterSpacing: "-0.03em",
              fontFamily: '"Poppins", sans-serif',
              background:
                "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0.8) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}>
            {currentPost.title || "Untitled Style"}
          </Typography>

          {/* Modern Description */}
          <Typography
            sx={{
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 1.6,
              mb: { xs: "32px", md: "40px" },
              fontFamily: '"Poppins", sans-serif',
              maxWidth: "90%",
            }}>
            {currentPost.description ||
              "Discover curated styles that express your identity and inspire confidence. From everyday essentials to iconic fashion statements that define modern elegance."}
          </Typography>

          {/* Ultra-Modern Stats Cards */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: "12px", md: "16px" },
              mb: { xs: "32px", md: "40px" },
              flexWrap: "wrap",
            }}>
            {/* Views Card */}
            <Box
              sx={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                px: { xs: "16px", md: "20px" },
                py: { xs: "12px", md: "14px" },
                backdropFilter: "blur(20px)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  transform: "translateY(-1px)",
                },
              }}>
              <Visibility
                sx={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.6)" }}
              />
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: 600,
                }}>
                {currentPost.views || 0}
              </Typography>
            </Box>

            {/* Likes Card */}
            <Box
              onClick={handleLike}
              sx={{
                background: isLiked
                  ? "linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%)"
                  : "rgba(255, 255, 255, 0.03)",
                border: isLiked
                  ? "1px solid rgba(255, 107, 107, 0.2)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                px: { xs: "16px", md: "20px" },
                py: { xs: "12px", md: "14px" },
                backdropFilter: "blur(20px)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: isLiked
                    ? "linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 107, 107, 0.08) 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                  borderColor: isLiked
                    ? "rgba(255, 107, 107, 0.3)"
                    : "rgba(255, 255, 255, 0.12)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}>
              {isLiked ? (
                <Favorite sx={{ fontSize: "18px", color: "#FF6B6B" }} />
              ) : (
                <FavoriteBorder
                  sx={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.6)" }}
                />
              )}
              <Typography
                sx={{
                  fontSize: "14px",
                  color: isLiked ? "#FF6B6B" : "rgba(255, 255, 255, 0.8)",
                  fontWeight: 600,
                }}>
                {localLikes}
              </Typography>
            </Box>

            {/* Shares Card */}
            <Box
              sx={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                px: { xs: "16px", md: "20px" },
                py: { xs: "12px", md: "14px" },
                backdropFilter: "blur(20px)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  transform: "translateY(-1px)",
                },
              }}>
              <ShareIcon
                sx={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.6)" }}
              />
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: 600,
                }}>
                {currentPost.shares || 0}
              </Typography>
            </Box>
          </Box>

          {/* Modern Hashtags Section */}
          <Box sx={{ mb: { xs: "40px", md: "48px" } }}>
            <Typography
              sx={{
                fontSize: { xs: "16px", md: "18px" },
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.9)",
                mb: { xs: "16px", md: "20px" },
                fontFamily: '"Poppins", sans-serif',
              }}>
              Style Tags
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: { xs: "12px", md: "16px" },
                flexWrap: "wrap",
                alignItems: "center",
              }}>
              {/* Dynamic Hashtags from Backend */}
              {currentPost.hashtags && currentPost.hashtags.length > 0 ? (
                (() => {
                  let hashtagsArray = currentPost.hashtags;
                  if (typeof currentPost.hashtags === "string") {
                    try {
                      hashtagsArray = JSON.parse(currentPost.hashtags);
                    } catch {
                      hashtagsArray = currentPost.hashtags
                        .split(",")
                        .map((tag) => tag.trim());
                    }
                  }

                  return Array.isArray(hashtagsArray)
                    ? hashtagsArray.slice(0, 4).map((hashtag, index) => (
                        <Box
                          key={index}
                          sx={{
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: "16px",
                            px: { xs: "16px", md: "20px" },
                            py: { xs: "8px", md: "10px" },
                            backdropFilter: "blur(20px)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            cursor: "pointer",
                            "&:hover": {
                              background: "rgba(108, 92, 231, 0.1)",
                              borderColor: "rgba(108, 92, 231, 0.2)",
                              transform: "translateY(-1px)",
                            },
                          }}>
                          <Typography
                            sx={{
                              fontSize: { xs: "13px", md: "14px" },
                              fontWeight: 500,
                              color: "rgba(255, 255, 255, 0.8)",
                              fontFamily: '"Poppins", sans-serif',
                            }}>
                            #{hashtag.replace(/["[\]\\]/g, "").trim()}
                          </Typography>
                        </Box>
                      ))
                    : null;
                })()
              ) : (
                // Default modern hashtags
                <>
                  {["fashion", "style", "outfit", "trendy"].map(
                    (tag, index) => (
                      <Box
                        key={index}
                        sx={{
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          borderRadius: "16px",
                          px: { xs: "16px", md: "20px" },
                          py: { xs: "8px", md: "10px" },
                          backdropFilter: "blur(20px)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          cursor: "pointer",
                          "&:hover": {
                            background: "rgba(108, 92, 231, 0.1)",
                            borderColor: "rgba(108, 92, 231, 0.2)",
                            transform: "translateY(-1px)",
                          },
                        }}>
                        <Typography
                          sx={{
                            fontSize: { xs: "13px", md: "14px" },
                            fontWeight: 500,
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: '"Poppins", sans-serif',
                          }}>
                          #{tag}
                        </Typography>
                      </Box>
                    )
                  )}
                </>
              )}
            </Box>
          </Box>

          {/* Ultra-Modern Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: "16px", md: "20px" },
              mb: { xs: "48px", md: "56px" },
              flexWrap: "wrap",
            }}>
            {/* Like Button */}
            <Box
              onClick={handleLike}
              sx={{
                background: isLiked
                  ? "linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 107, 107, 0.08) 100%)"
                  : "rgba(255, 255, 255, 0.04)",
                border: isLiked
                  ? "1px solid rgba(255, 107, 107, 0.2)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                px: { xs: "20px", md: "24px" },
                py: { xs: "12px", md: "14px" },
                backdropFilter: "blur(20px)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: isLiked
                    ? "linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 107, 107, 0.12) 100%)"
                    : "rgba(255, 255, 255, 0.08)",
                  borderColor: isLiked
                    ? "rgba(255, 107, 107, 0.3)"
                    : "rgba(255, 255, 255, 0.15)",
                  transform: "translateY(-2px)",
                  boxShadow: isLiked
                    ? "0 8px 32px rgba(255, 107, 107, 0.2)"
                    : "0 8px 32px rgba(255, 255, 255, 0.1)",
                },
                "&:active": {
                  transform: "translateY(-1px)",
                },
              }}>
              {isLiked ? (
                <Favorite sx={{ fontSize: "20px", color: "#FF6B6B" }} />
              ) : (
                <FavoriteBorder
                  sx={{ fontSize: "20px", color: "rgba(255, 255, 255, 0.7)" }}
                />
              )}
              <Typography
                sx={{
                  fontSize: { xs: "14px", md: "15px" },
                  fontWeight: 600,
                  color: isLiked ? "#FF6B6B" : "rgba(255, 255, 255, 0.8)",
                  fontFamily: '"Poppins", sans-serif',
                }}>
                {isLiked ? "Liked" : "Like"}
              </Typography>
            </Box>

            {/* Share Button */}
            <Box
              onClick={handleShare}
              sx={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                px: { xs: "20px", md: "24px" },
                py: { xs: "12px", md: "14px" },
                backdropFilter: "blur(20px)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "rgba(108, 92, 231, 0.1)",
                  borderColor: "rgba(108, 92, 231, 0.2)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 32px rgba(108, 92, 231, 0.15)",
                },
                "&:active": {
                  transform: "translateY(-1px)",
                },
              }}>
              <ShareIcon
                sx={{ fontSize: "20px", color: "rgba(255, 255, 255, 0.7)" }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "14px", md: "15px" },
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.8)",
                  fontFamily: '"Poppins", sans-serif',
                }}>
                Share
              </Typography>
            </Box>
          </Box>

          {/* Modern Outfit Links Section */}
          {currentPost.affiliateLinks &&
            currentPost.affiliateLinks.length > 0 && (
              <Box sx={{ mb: { xs: "60px", md: "80px" } }}>
                <Typography
                  sx={{
                    fontSize: { xs: "24px", md: "28px" },
                    fontWeight: 700,
                    color: "#FFFFFF",
                    mb: { xs: "8px", md: "12px" },
                    fontFamily: '"Poppins", sans-serif',
                    letterSpacing: "-0.02em",
                  }}>
                  Shop This Look
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: "14px", md: "16px" },
                    fontWeight: 400,
                    color: "rgba(255, 255, 255, 0.6)",
                    mb: { xs: "24px", md: "32px" },
                    fontFamily: '"Poppins", sans-serif',
                  }}>
                  Available at trusted retailers
                </Typography>

                {/* Modern Brand Icons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: "16px", md: "20px" },
                    mb: { xs: "32px", md: "40px" },
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}>
                  {/* Show actual affiliate link brands or default e-commerce brands */}
                  {currentPost.affiliateLinks &&
                  currentPost.affiliateLinks.length > 0
                    ? [
                        ...new Set(
                          currentPost.affiliateLinks.map((link) => link.brand)
                        ),
                      ]
                        .slice(0, 4)
                        .map((brand, index) => (
                          <Box
                            key={index}
                            sx={{
                              background: "rgba(255, 255, 255, 0.04)",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              borderRadius: "16px",
                              px: { xs: "16px", md: "20px" },
                              py: { xs: "12px", md: "14px" },
                              backdropFilter: "blur(20px)",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              cursor: "pointer",
                              "&:hover": {
                                background: "rgba(255, 255, 255, 0.08)",
                                borderColor: "rgba(255, 255, 255, 0.15)",
                                transform: "translateY(-1px)",
                                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                              },
                            }}>
                            {getBrandIcon(brand)}
                            <Typography
                              sx={{
                                fontSize: { xs: "12px", md: "13px" },
                                fontWeight: 600,
                                color: "rgba(255, 255, 255, 0.8)",
                                fontFamily: '"Poppins", sans-serif',
                              }}>
                              {brand?.toUpperCase() || "STORE"}
                            </Typography>
                          </Box>
                        ))
                    : // Default modern brand cards with SVG icons
                      [
                        { name: "AMAZON", color: "#FF9900" },
                        { name: "FLIPKART", color: "#047BD6" },
                        { name: "MYNTRA", color: "#FF3F6C" },
                        { name: "AJIO", color: "#D4AF37" },
                      ].map((brand, index) => (
                        <Box
                          key={index}
                          sx={{
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: "16px",
                            px: { xs: "16px", md: "20px" },
                            py: { xs: "12px", md: "14px" },
                            backdropFilter: "blur(20px)",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            cursor: "pointer",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.08)",
                              borderColor: "rgba(255, 255, 255, 0.15)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                            },
                          }}>
                          {getBrandIcon(brand.name)}
                          <Typography
                            sx={{
                              fontSize: { xs: "12px", md: "13px" },
                              fontWeight: 600,
                              color: "rgba(255, 255, 255, 0.8)",
                              fontFamily: '"Poppins", sans-serif',
                            }}>
                            {brand.name}
                          </Typography>
                        </Box>
                      ))}
                </Box>

                {/* Modern Shop Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: "16px", md: "20px" },
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}>
                  {currentPost.affiliateLinks &&
                  currentPost.affiliateLinks.length > 0 ? (
                    currentPost.affiliateLinks
                      .slice(0, 2)
                      .map((link, index) => (
                        <Box
                          key={index}
                          onClick={() => window.open(link.url, "_blank")}
                          sx={{
                            background:
                              "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
                            border: "1px solid rgba(108, 92, 231, 0.3)",
                            borderRadius: "20px",
                            px: { xs: "24px", md: "32px" },
                            py: { xs: "14px", md: "16px" },
                            backdropFilter: "blur(20px)",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            cursor: "pointer",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #5A4FCF 0%, #4C3BCF 100%)",
                              borderColor: "rgba(108, 92, 231, 0.5)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 40px rgba(108, 92, 231, 0.3)",
                            },
                            "&:active": {
                              transform: "translateY(-1px)",
                            },
                          }}>
                          <Box
                            sx={{
                              width: "24px",
                              height: "24px",
                              background: "rgba(255, 255, 255, 0.2)",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                            }}>
                            🛒
                          </Box>
                          <Typography
                            sx={{
                              fontSize: { xs: "14px", md: "16px" },
                              fontWeight: 600,
                              color: "#FFFFFF",
                              fontFamily: '"Poppins", sans-serif',
                              textTransform: "none",
                            }}>
                            {link.productName ||
                              link.title ||
                              `Shop at ${link.brand}` ||
                              "Shop Now"}
                          </Typography>
                        </Box>
                      ))
                  ) : (
                    // Default modern shop button
                    <Box
                      sx={{
                        background:
                          "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
                        border: "1px solid rgba(108, 92, 231, 0.3)",
                        borderRadius: "20px",
                        px: { xs: "24px", md: "32px" },
                        py: { xs: "14px", md: "16px" },
                        backdropFilter: "blur(20px)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #5A4FCF 0%, #4C3BCF 100%)",
                          borderColor: "rgba(108, 92, 231, 0.5)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 40px rgba(108, 92, 231, 0.3)",
                        },
                        "&:active": {
                          transform: "translateY(-1px)",
                        },
                      }}>
                      <Box
                        sx={{
                          width: "24px",
                          height: "24px",
                          background: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}>
                        ✨
                      </Box>
                      <Typography
                        sx={{
                          fontSize: { xs: "14px", md: "16px" },
                          fontWeight: 600,
                          color: "#FFFFFF",
                          fontFamily: '"Poppins", sans-serif',
                          textTransform: "none",
                        }}>
                        Explore Similar Styles
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
        </Box>
      </Box>
    </Box>
  );
};

export default PostDetailsPage;
