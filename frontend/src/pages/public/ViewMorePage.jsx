import { useState, useEffect, useCallback, memo } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CardMedia,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Instagram,
  ArrowBack,
  KeyboardArrowUp,
  Share as ShareIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as ViewIcon,
  ShoppingBag as ShopIcon,
  PhotoLibrary as PhotoIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import useCategoryStore from "../../store/categoryStore";
import usePostStore from "../../store/postStore";
import "swiper/css";

// Custom Swiper styles for better touch experience
const swiperStyles = `
  .swiper-container {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: pan-x pan-y;
  }

  .swiper-container .swiper-slide {
    transition: transform 0.3s ease;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .swiper-container .swiper-slide-active {
    z-index: 1;
  }

  .swiper-container:active {
    cursor: grabbing;
  }

  .swiper-container .swiper-wrapper {
    touch-action: pan-x pan-y;
  }

  .swiper-container img {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-drag: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = swiperStyles;
  document.head.appendChild(styleSheet);
}

const ViewMorePage = memo(() => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrollLoading, setIsScrollLoading] = useState(false);

  const {
    currentCategory,
    fetchCategoryBySlug,
    isLoading: categoryLoading,
    error: categoryError,
  } = useCategoryStore();
  const {
    posts,
    fetchPosts,
    isLoading: postsLoading,
    resetPosts,
    likePost,
    sharePost,
  } = usePostStore();

  // Fetch category and posts with caching
  useEffect(() => {
    if (slug) {
      // Only fetch if we don't have the current category or if it's a different slug
      if (!currentCategory || currentCategory.slug !== slug) {
        fetchCategoryBySlug(slug);
      }
    }
  }, [slug, fetchCategoryBySlug, currentCategory]);

  // Load posts function - moved before handleInfiniteScroll to fix dependency order
  const loadPosts = useCallback(
    async (page = 1, search = "") => {
      if (!currentCategory) return;

      const isFirstPage = page === 1;
      if (!isFirstPage) setIsLoadingMore(true);

      try {
        const result = await fetchPosts({
          category: currentCategory._id,
          page,
          limit: 12,
          search,
        });

        if (result && result.posts) {
          setCurrentPage(page);
          setHasMore(result.hasMore || false);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
        setHasMore(false);
      } finally {
        if (!isFirstPage) setIsLoadingMore(false);
      }
    },
    [currentCategory, fetchPosts]
  );

  // Infinite scroll implementation
  const handleInfiniteScroll = useCallback(() => {
    if (hasMore && !isLoadingMore && !postsLoading && !isScrollLoading) {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Load more when user is 500px from bottom (optimized for fast loading)
      const threshold = 500;
      const isNearBottom =
        scrollTop + windowHeight >= documentHeight - threshold;

      if (isNearBottom) {
        setIsScrollLoading(true);
        const nextPage = currentPage + 1;
        loadPosts(nextPage, searchQuery);
        setTimeout(() => setIsScrollLoading(false), 800); // Prevent rapid firing
      }
    }
  }, [
    hasMore,
    isLoadingMore,
    postsLoading,
    isScrollLoading,
    currentPage,
    searchQuery,
    loadPosts,
  ]);

  // Scroll functionality (scroll to top + infinite scroll)
  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 400);

      // Throttle infinite scroll for optimal performance
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        handleInfiniteScroll();
      }, 100); // 100ms throttle for super fast performance
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [handleInfiniteScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (currentCategory) {
      // Only reset and reload if we don't have posts or if search query changed
      if (posts.length === 0 || searchQuery !== "") {
        resetPosts();
        setCurrentPage(1);
        setHasMore(true);
        loadPosts(1, searchQuery);
      }
    }
  }, [currentCategory, searchQuery, loadPosts, resetPosts, posts.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (currentCategory) {
      resetPosts();
      setCurrentPage(1);
      setHasMore(true);
      loadPosts(1, searchQuery);
    }
  };

  const handlePostClick = (postSlug) => {
    navigate(`/post/${postSlug}`);
  };

  const handleInstagramClick = () => {
    window.open("https://instagram.com/_vesturo", "_blank");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleLikePost = async (postId) => {
    try {
      // Use store method if available, otherwise call API directly
      if (likePost) {
        await likePost(postId);
        console.log("Post like toggled successfully");
      } else {
        // Fallback: Call the like API endpoint directly
        const response = await fetch(`/api/vesturo/post/${postId}/like`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Post like toggled successfully:", result);
          // Reload posts to get updated counts
          loadPosts(currentPage, searchQuery);
        } else {
          console.error("Failed to toggle like");
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSharePost = async (post) => {
    try {
      console.log("Share button clicked for post:", post.title);

      // Update share count in backend
      try {
        if (sharePost) {
          await sharePost(post._id);
        } else {
          const response = await fetch(`/api/vesturo/post/${post._id}/share`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            console.log("Share count updated");
            loadPosts(currentPage, searchQuery);
          }
        }
      } catch (apiError) {
        console.log("API share update failed:", apiError);
      }

      // Create share URL and data
      const shareUrl = `${window.location.origin}/post/${post.slug}`;
      const shareData = {
        title: `${post.title} - VESTURO`,
        text: `Discover this amazing outfit on VESTURO: ${post.title}`,
        url: shareUrl,
      };

      // Show custom share modal for all devices
      showCustomShareModal(post, shareUrl, shareData);
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
                <path d="M17.472 14.382C17.352 14.382 17.233 14.382 17.114 14.382C16.504 14.382 15.894 14.382 15.284 14.382C14.674 14.382 14.064 14.382 13.454 14.382C12.844 14.382 12.234 14.382 11.624 14.382C11.014 14.382 10.404 14.382 9.794 14.382C9.184 14.382 8.574 14.382 7.964 14.382C7.354 14.382 6.744 14.382 6.134 14.382C5.524 14.382 4.914 14.382 4.304 14.382C3.694 14.382 3.084 14.382 2.474 14.382C1.864 14.382 1.254 14.382 0.644 14.382C0.034 14.382 -0.576 14.382 -1.186 14.382" stroke="white" stroke-width="2" stroke-linecap="round"/>
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
        btn.style.filter = "brightness(1.1)";

        // Trigger shimmer effect
        shimmer.style.left = "100%";
        setTimeout(() => {
          shimmer.style.left = "-100%";
        }, 600);
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
        btn.style.filter = "brightness(1)";
      });

      // Touch effects for mobile
      btn.addEventListener("touchstart", () => {
        btn.style.transform = "scale(0.95)";
      });

      btn.addEventListener("touchend", () => {
        btn.style.transform = "scale(1)";
      });
    });

    const closeBtn = modal.querySelector(".close-btn");
    closeBtn.addEventListener("click", closeModal);
    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.background = "rgba(255, 255, 255, 0.2)";
      closeBtn.style.color = "#FFFFFF";
    });
    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.background = "rgba(255, 255, 255, 0.1)";
      closeBtn.style.color = "rgba(255, 255, 255, 0.8)";
    });

    // Close on overlay click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    function closeModal() {
      overlay.style.animation = "fadeOut 0.3s ease-in";
      modal.style.animation = "slideDown 0.3s ease-in";
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
      padding: 16px 24px;
      border-radius: 12px;
      font-family: "Poppins", sans-serif;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 8px 32px rgba(108, 92, 231, 0.3);
      z-index: 10001;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = "✨ Link copied to clipboard!";

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 2000);
  };

  const showShareErrorNotification = () => {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-family: "Poppins", sans-serif;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 8px 32px rgba(231, 76, 60, 0.3);
      z-index: 10001;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = "❌ Share failed. Please try again.";

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const addShareAnimationStyles = () => {
    if (!document.querySelector("#share-animation-styles")) {
      const style = document.createElement("style");
      style.id = "share-animation-styles";
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(30px); opacity: 0; }
        }
        @keyframes bgFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(5px, -5px) rotate(1deg); }
          50% { transform: translate(-3px, 3px) rotate(-0.5deg); }
          75% { transform: translate(-5px, -3px) rotate(0.5deg); }
        }
      `;
      document.head.appendChild(style);
    }
  };

  // Combined loading state for better UX
  if (categoryLoading || (postsLoading && posts.length === 0)) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 3,
        }}>
        <CircularProgress
          size={50}
          sx={{
            color: "#6C5CE7",
            "@keyframes pulse": {
              "0%": { opacity: 1 },
              "50%": { opacity: 0.6 },
              "100%": { opacity: 1 },
            },
            animation: "pulse 2s infinite",
          }}
        />
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: "20px",
              fontWeight: 600,
              mb: 1,
            }}>
            Preparing Your Fashion Feed
          </Typography>
          <Typography
            sx={{
              color: "#CCCCCC",
              fontSize: "14px",
              opacity: 0.8,
            }}>
            Loading the latest trends just for you...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (categoryError || !currentCategory) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}>
        <Typography sx={{ color: "#FFFFFF", mb: 2, fontSize: "18px" }}>
          {categoryError || `Category "${slug}" not found`}
        </Typography>
        <Typography sx={{ color: "#CCCCCC", mb: 3, fontSize: "14px" }}>
          The category you're looking for might not exist or might be inactive.
        </Typography>
        <Button
          onClick={handleBackToHome}
          sx={{
            color: "#FFFFFF",
            backgroundColor: "#6C5CE7",
            px: 3,
            py: 1,
            borderRadius: "25px",
            "&:hover": {
              backgroundColor: "#5A4FCF",
            },
          }}>
          Return to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "#000000",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        touchAction: "pan-y",
      }}>
      {/* Background Elements */}
      <Box
        sx={{
          position: "fixed",
          top: "10%",
          right: "5%",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(108, 92, 231, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "fixed",
          bottom: "20%",
          left: "10%",
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

      {/* Modern Glass Header */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          zIndex: 1100,
        }}>
        <Toolbar
          sx={{
            px: { xs: "24px", md: "48px" },
            py: { xs: "12px", md: "16px" },
            minHeight: { xs: "64px", md: "72px" },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          {/* Left Section - Back & Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: "16px", md: "20px" },
            }}>
            <IconButton
              onClick={handleBackToHome}
              sx={{
                color: "#FFFFFF",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                width: { xs: "40px", md: "44px" },
                height: { xs: "40px", md: "44px" },
                borderRadius: "14px",
                "&:hover": {
                  backgroundColor: "rgba(108, 92, 231, 0.2)",
                  borderColor: "rgba(108, 92, 231, 0.4)",
                  transform: "translateY(-2px)",
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
                letterSpacing: "-0.01em",
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
              href="https://instagram.com/_vesturo"
              target="_blank"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                width: { xs: "40px", md: "44px" },
                height: { xs: "40px", md: "44px" },
                borderRadius: "14px",
                "&:hover": {
                  color: "#E1306C",
                  backgroundColor: "rgba(225, 48, 108, 0.15)",
                  borderColor: "rgba(225, 48, 108, 0.3)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}>
              <Instagram sx={{ fontSize: { xs: "20px", md: "22px" } }} />
            </IconButton>

            <Button
              variant="contained"
              onClick={handleInstagramClick}
              sx={{
                bgcolor: "#6C5CE7",
                color: "#FFFFFF",
                px: { xs: "20px", md: "28px" },
                py: { xs: "10px", md: "12px" },
                borderRadius: "16px",
                fontSize: { xs: "14px", md: "16px" },
                fontWeight: 600,
                textTransform: "none",
                fontFamily: '"Poppins", sans-serif',
                boxShadow: "0 8px 32px rgba(108, 92, 231, 0.4)",
                border: "1px solid rgba(108, 92, 231, 0.3)",
                backdropFilter: "blur(20px)",
                "&:hover": {
                  bgcolor: "#5A4FCF",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 40px rgba(108, 92, 231, 0.5)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: { xs: "none", sm: "flex" },
              }}>
              Follow
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Modern Content Header */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: "24px", md: "48px" },
          pt: { xs: "120px", md: "140px" },
          pb: { xs: "32px", md: "48px" },
        }}>
        {/* Category Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: "32px", md: "48px" },
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
            {currentCategory?.name || "Collection"}
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
            {currentCategory?.description || "Explore our curated collection"}
          </Typography>
        </Box>

        {/* Modern Search Bar */}
        <Box
          sx={{
            maxWidth: "600px",
            mx: "auto",
            mb: { xs: "40px", md: "60px" },
          }}>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              position: "relative",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                borderColor: "rgba(108, 92, 231, 0.3)",
                background: "rgba(255, 255, 255, 0.08)",
              },
              "&:focus-within": {
                borderColor: "rgba(108, 92, 231, 0.5)",
                background: "rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(108, 92, 231, 0.2)",
              },
            }}>
            <TextField
              fullWidth
              placeholder="Search outfits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  border: "none",
                  borderRadius: "20px",
                  color: "#FFFFFF",
                  fontSize: { xs: "16px", md: "18px" },
                  fontFamily: '"Poppins", sans-serif',
                  pl: { xs: "20px", md: "24px" },
                  pr: { xs: "60px", md: "70px" },
                  py: { xs: "16px", md: "20px" },
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: 0,
                  "&::placeholder": {
                    color: "rgba(255, 255, 255, 0.5)",
                    opacity: 1,
                  },
                },
              }}
            />

            <IconButton
              type="submit"
              sx={{
                position: "absolute",
                right: { xs: "8px", md: "12px" },
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "#6C5CE7",
                color: "#FFFFFF",
                width: { xs: "40px", md: "44px" },
                height: { xs: "40px", md: "44px" },
                "&:hover": {
                  backgroundColor: "#5A4FCF",
                  transform: "translateY(-50%) scale(1.05)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}>
              <ViewIcon sx={{ fontSize: { xs: "20px", md: "22px" } }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Modern Posts Grid */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: "24px", md: "48px" },
          pb: { xs: "80px", md: "120px" },
        }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            },
            gap: { xs: "20px", md: "24px" },
            maxWidth: "1400px",
            mx: "auto",
            touchAction: "pan-y",
          }}>
          {/* Modern Post Cards */}
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Box
                key={post._id}
                onClick={() => handlePostClick(post.slug)}
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.02)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                  WebkitTouchCallout: "none",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "pan-y manipulation",
                }}>
                {/* Image Container with Swiper */}
                <Box sx={{ position: "relative", overflow: "hidden" }}>
                  <Swiper
                    modules={[Autoplay]}
                    autoplay={
                      post.images && post.images.length > 1
                        ? {
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                          }
                        : false
                    }
                    loop={post.images && post.images.length > 1}
                    speed={400}
                    allowTouchMove={true}
                    grabCursor={true}
                    touchRatio={1}
                    threshold={5}
                    resistance={true}
                    resistanceRatio={0.85}
                    touchStartPreventDefault={false}
                    touchMoveStopPropagation={false}
                    simulateTouch={true}
                    touchEventsTarget="container"
                    navigation={false}
                    pagination={false}
                    scrollbar={false}
                    keyboard={false}
                    mousewheel={false}
                    preventClicks={false}
                    preventClicksPropagation={false}
                    watchSlidesProgress={true}
                    watchOverflow={true}
                    style={{
                      width: "100%",
                      aspectRatio: "4/5",
                      minHeight: "280px",
                      borderRadius: "inherit",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                      MozUserSelect: "none",
                      msUserSelect: "none",
                      WebkitTouchCallout: "none",
                      WebkitTapHighlightColor: "transparent",
                      touchAction: "pan-x pan-y",
                    }}
                    className="swiper-container"
                    onSwiper={(swiper) => {
                      console.log("Swiper initialized:", swiper);
                    }}
                    onSlideChange={(swiper) => {
                      console.log("Slide changed to:", swiper.activeIndex);
                    }}
                    onTouchStart={() => {
                      console.log("Touch start on swiper");
                    }}
                    onTouchMove={() => {
                      console.log("Touch move on swiper");
                    }}>
                    {post.images && post.images.length > 0 ? (
                      post.images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <CardMedia
                            component="img"
                            className="post-image"
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              userSelect: "none",
                              WebkitUserSelect: "none",
                              MozUserSelect: "none",
                              msUserSelect: "none",
                              WebkitUserDrag: "none",
                              WebkitTouchCallout: "none",
                              WebkitTapHighlightColor: "transparent",
                            }}
                            image={image.url || "/api/placeholder/360/450"}
                            alt={`${post.title} - Image ${index + 1}`}
                            loading="lazy"
                            draggable={false}
                          />
                        </SwiperSlide>
                      ))
                    ) : (
                      <SwiperSlide>
                        <CardMedia
                          component="img"
                          className="post-image"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            MozUserSelect: "none",
                            msUserSelect: "none",
                            WebkitUserDrag: "none",
                            WebkitTouchCallout: "none",
                            WebkitTapHighlightColor: "transparent",
                          }}
                          image="/api/placeholder/360/450"
                          alt={post.title}
                          loading="lazy"
                          draggable={false}
                        />
                      </SwiperSlide>
                    )}
                  </Swiper>

                  {/* Image Count Badge */}
                  {post.images && post.images.length > 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        backdropFilter: "blur(8px)",
                        color: "#FFFFFF",
                        px: "8px",
                        py: "4px",
                        borderRadius: "16px",
                        fontSize: "10px",
                        fontWeight: 600,
                        gap: "4px",
                        zIndex: 2,
                      }}>
                      <PhotoIcon sx={{ fontSize: "12px" }} />
                      {post.images.length}
                    </Box>
                  )}
                </Box>

                {/* Content */}
                <Box
                  sx={{
                    p: { xs: "16px", md: "20px" },
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                  }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "16px", md: "18px" },
                      fontWeight: 600,
                      color: "#FFFFFF",
                      mb: "8px",
                      lineHeight: 1.3,
                      fontFamily: '"Poppins", sans-serif',
                      letterSpacing: "0.01em",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                      MozUserSelect: "none",
                      msUserSelect: "none",
                    }}>
                    {post.title}
                  </Typography>

                  {/* Post Stats */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: "12px",
                    }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}>
                      {/* Views - Display Only */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 6px",
                          borderRadius: "8px",
                          userSelect: "none",
                          WebkitUserSelect: "none",
                          MozUserSelect: "none",
                          msUserSelect: "none",
                        }}>
                        <ViewIcon
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
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            MozUserSelect: "none",
                            msUserSelect: "none",
                          }}>
                          {post.views || 0}
                        </Typography>
                      </Box>

                      {/* Likes - Clickable */}
                      <Box
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLikePost(post._id);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                        }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          cursor: "pointer",
                          padding: "6px 8px",
                          borderRadius: "12px",
                          transition: "all 0.2s ease",
                          userSelect: "none",
                          WebkitUserSelect: "none",
                          MozUserSelect: "none",
                          msUserSelect: "none",
                          WebkitTouchCallout: "none",
                          WebkitTapHighlightColor: "transparent",
                          "&:hover": {
                            backgroundColor: "rgba(231, 76, 60, 0.1)",
                            transform: "scale(1.05)",
                            "& .MuiSvgIcon-root": {
                              color: "#E74C3C",
                            },
                            "& .MuiTypography-root": {
                              color: "#E74C3C",
                            },
                          },
                          "&:active": {
                            transform: "scale(0.95)",
                          },
                        }}>
                        <FavoriteBorderIcon
                          sx={{
                            fontSize: "14px",
                            color: "rgba(255, 255, 255, 0.6)",
                            transition: "color 0.2s ease",
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "rgba(255, 255, 255, 0.6)",
                            fontFamily: '"Poppins", sans-serif',
                            transition: "color 0.2s ease",
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            MozUserSelect: "none",
                            msUserSelect: "none",
                          }}>
                          {post.likes || 0}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Share Button - Clickable */}
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSharePost(post);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                      }}
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        width: "36px",
                        height: "36px",
                        transition: "all 0.2s ease",
                        userSelect: "none",
                        WebkitUserSelect: "none",
                        MozUserSelect: "none",
                        msUserSelect: "none",
                        WebkitTouchCallout: "none",
                        WebkitTapHighlightColor: "transparent",
                        "&:hover": {
                          color: "#6C5CE7",
                          backgroundColor: "rgba(108, 92, 231, 0.1)",
                          transform: "scale(1.1)",
                        },
                        "&:active": {
                          transform: "scale(0.9)",
                        },
                      }}>
                      <ShareIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            // Modern Empty State
            <Box
              sx={{
                gridColumn: "1 / -1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
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
                <PhotoIcon
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
                No Outfits Found
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "14px", md: "16px" },
                  color: "rgba(255, 255, 255, 0.6)",
                  fontFamily: '"Poppins", sans-serif',
                  maxWidth: "300px",
                }}>
                Try adjusting your search or explore other categories
              </Typography>
            </Box>
          )}
        </Box>

        {/* Loading More Indicator */}
        {isLoadingMore && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: { xs: "32px", md: "48px" },
            }}>
            <CircularProgress
              size={40}
              sx={{
                color: "#6C5CE7",
              }}
            />
          </Box>
        )}
      </Box>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: { xs: "24px", md: "32px" },
            right: { xs: "24px", md: "32px" },
            backgroundColor: "#6C5CE7",
            color: "#FFFFFF",
            width: { xs: "56px", md: "64px" },
            height: { xs: "56px", md: "64px" },
            boxShadow: "0 8px 32px rgba(108, 92, 231, 0.4)",
            border: "1px solid rgba(108, 92, 231, 0.3)",
            backdropFilter: "blur(20px)",
            zIndex: 1000,
            "&:hover": {
              backgroundColor: "#5A4FCF",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 40px rgba(108, 92, 231, 0.5)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
          <KeyboardArrowUp sx={{ fontSize: { xs: "24px", md: "28px" } }} />
        </IconButton>
      )}
    </Box>
  );
});

export default ViewMorePage;
