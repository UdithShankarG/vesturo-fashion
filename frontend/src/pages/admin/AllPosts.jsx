import { useState, useEffect, useCallback, memo } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Menu,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add,
  Search,
  FilterList,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  Favorite,
  Share,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import usePostStore from "../../store/postStore";
import useCategoryStore from "../../store/categoryStore";

const AllPosts = memo(() => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const { categories, fetchCategories } = useCategoryStore();
  const { posts, fetchPosts, resetPosts, isLoading, error } = usePostStore();

  // Custom Alert System
  const showCustomAlert = (message, type = "error") => {
    const existingAlert = document.querySelector("#custom-alert");
    if (existingAlert) existingAlert.remove();

    const alert = document.createElement("div");
    alert.id = "custom-alert";
    alert.style.cssText = `
      position: fixed; top: 24px; right: 24px; z-index: 10001;
      background: ${
        type === "error"
          ? "linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)"
          : "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)"
      };
      color: white; padding: 20px 28px; border-radius: 20px;
      font-family: "Poppins", sans-serif; font-weight: 600; font-size: 15px;
      box-shadow: 0 20px 60px ${
        type === "error"
          ? "rgba(255, 107, 107, 0.4)"
          : "rgba(108, 92, 231, 0.4)"
      }, 0 8px 32px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1);
      animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex; align-items: center; gap: 12px; user-select: none; max-width: 400px;
    `;

    alert.innerHTML = `
      <div style="width: 24px; height: 24px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">
        ${type === "error" ? "⚠️" : "✅"}
      </div>
      <span>${message}</span>
    `;

    if (!document.querySelector("#alert-styles")) {
      const style = document.createElement("style");
      style.id = "alert-styles";
      style.textContent = `
        @keyframes slideInRight { from { transform: translateX(100%) scale(0.8); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0) scale(1); opacity: 1; } to { transform: translateX(100%) scale(0.8); opacity: 0; } }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(alert);
    setTimeout(() => {
      alert.style.animation = "slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      setTimeout(() => alert.parentNode?.removeChild(alert), 400);
    }, 4000);
  };

  const loadPosts = async (pageNum, search = "", category = "") => {
    const result = await fetchPosts({
      page: pageNum,
      limit: 12,
      search: search,
      category: category,
      published: false, // Get all posts for admin
      sortBy: "createdAt",
      sortOrder: -1,
    });

    if (result.success) {
      setHasMore(pageNum < result.data.pagination.pages);
    }
  };

  // Fetch categories and posts
  useEffect(() => {
    fetchCategories({ active: true });
    loadPosts(1, "", "");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    resetPosts();
    setPage(1);
    loadPosts(1, searchQuery, selectedCategory);
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    resetPosts();
    setPage(1);
    loadPosts(1, searchQuery, categoryId);
  };

  const loadMore = () => {
    if (hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPosts(nextPage, searchQuery, selectedCategory);
    }
  };

  const handleMenuOpen = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleEdit = () => {
    if (selectedPost) {
      navigate(`/udishrav/U-admin/dashboard/posts/edit/${selectedPost._id}`);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedPost) {
      window.open(`/post/${selectedPost.slug}`, "_blank");
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setPostToDelete(selectedPost);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      // Delete post logic would go here
      alert("Delete functionality will be implemented");
    }
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Show error alert when error changes
  useEffect(() => {
    if (error) showCustomAlert(error, "error");
  }, [error]);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "28px", md: "32px", lg: "36px" },
            fontWeight: 700,
            color: "#FFFFFF",
            fontFamily: '"Poppins", sans-serif',
            letterSpacing: "-0.02em",
          }}>
          All Posts
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/udishrav/U-admin/dashboard/create-post")}
          sx={{
            background: "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
            color: "#FFFFFF",
            px: 4,
            py: 2,
            fontSize: "16px",
            fontWeight: 700,
            fontFamily: '"Poppins", sans-serif',
            borderRadius: "16px",
            textTransform: "none",
            boxShadow: "0 8px 24px rgba(108, 92, 231, 0.3)",
            border: "1px solid rgba(108, 92, 231, 0.3)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: "linear-gradient(135deg, #5A4FCF 0%, #4C3BCF 100%)",
              boxShadow: "0 12px 32px rgba(108, 92, 231, 0.4)",
              transform: "translateY(-2px)",
            },
          }}>
          Create Post
        </Button>
      </Box>

      {/* Modern Search and Filter */}
      <Box
        sx={{
          mb: 4,
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          p: { xs: 3, md: 4 },
          backdropFilter: "blur(20px)",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Search posts by title, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <Search
                        sx={{ color: "rgba(255, 255, 255, 0.6)", mr: 1 }}
                      />
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    color: "#FFFFFF",
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: "16px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.06)",
                      borderColor: "rgba(255, 255, 255, 0.12)",
                    },
                    "&.Mui-focused": {
                      background: "rgba(255, 255, 255, 0.08)",
                      borderColor: "#6C5CE7",
                      boxShadow: "0 0 0 3px rgba(108, 92, 231, 0.1)",
                    },
                    "& fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "16px 20px",
                    "&::placeholder": {
                      color: "rgba(255, 255, 255, 0.4)",
                      opacity: 1,
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
                  color: "#FFFFFF",
                  px: 4,
                  py: 2,
                  fontSize: "16px",
                  fontWeight: 600,
                  fontFamily: '"Poppins", sans-serif',
                  borderRadius: "16px",
                  textTransform: "none",
                  boxShadow: "0 8px 24px rgba(108, 92, 231, 0.3)",
                  minWidth: "auto",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5A4FCF 0%, #4C3BCF 100%)",
                    boxShadow: "0 12px 32px rgba(108, 92, 231, 0.4)",
                    transform: "translateY(-2px)",
                  },
                }}>
                <Search />
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontFamily: '"Poppins", sans-serif',
                  "&.Mui-focused": {
                    color: "#6C5CE7",
                  },
                }}>
                Filter by Category
              </InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                sx={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  color: "#FFFFFF",
                  fontFamily: '"Poppins", sans-serif',
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.06)",
                    borderColor: "rgba(255, 255, 255, 0.12)",
                  },
                  "&.Mui-focused": {
                    background: "rgba(255, 255, 255, 0.08)",
                    borderColor: "#6C5CE7",
                    boxShadow: "0 0 0 3px rgba(108, 92, 231, 0.1)",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}>
                <MenuItem
                  value=""
                  sx={{
                    color: "#FFFFFF",
                    fontFamily: '"Poppins", sans-serif',
                  }}>
                  All Categories
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem
                    key={category._id}
                    value={category._id}
                    sx={{
                      color: "#FFFFFF",
                      fontFamily: '"Poppins", sans-serif',
                    }}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Posts Grid */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
        {posts.map((post) => (
          <Grid item xs={6} sm={4} md={3} lg={2.4} xl={2} key={post._id}>
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: { xs: "20px", md: "24px" },
                overflow: "hidden",
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                height: {
                  xs: "220px", // Mobile: compact height
                  sm: "260px", // Small tablet
                  md: "300px", // Medium tablet
                  lg: "320px", // Desktop
                  xl: "340px", // Large desktop
                },
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: {
                    xs: "translateY(-4px) scale(1.02)", // Mobile: enhanced hover
                    md: "translateY(-8px) scale(1.03)", // Desktop: more pronounced
                  },
                  boxShadow: {
                    xs: "0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(108, 92, 231, 0.3)",
                    md: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(108, 92, 231, 0.4)",
                  },
                  borderColor: "rgba(108, 92, 231, 0.5)",
                },
              }}>
              {/* Image Section - 90% */}
              <Box
                sx={{
                  position: "relative",
                  height: "90%",
                  overflow: "hidden",
                }}>
                <CardMedia
                  component="img"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    bgcolor: "#333333",
                    transition: "transform 0.3s ease",
                  }}
                  image={post.images?.[0]?.url || "/placeholder-image.jpg"}
                  alt={post.title}
                />

                {/* Modern Status Badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    px: 2,
                    py: 0.5,
                    borderRadius: "16px",
                    background: post.isPublished
                      ? "linear-gradient(135deg, #4CAF50 0%, #45A049 100%)"
                      : "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
                    backdropFilter: "blur(15px)",
                    boxShadow: post.isPublished
                      ? "0 4px 12px rgba(76, 175, 80, 0.3)"
                      : "0 4px 12px rgba(255, 152, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "10px", md: "11px" },
                      fontWeight: 700,
                      color: "#FFFFFF",
                      textTransform: "uppercase",
                      fontFamily: '"Poppins", sans-serif',
                      letterSpacing: "0.5px",
                    }}>
                    {post.isPublished ? "Published" : "Draft"}
                  </Typography>
                </Box>

                {/* Modern Menu Button */}
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, post)}
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    color: "#FFFFFF",
                    background: "rgba(0, 0, 0, 0.7)",
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    width: { xs: 32, md: 36 },
                    height: { xs: 32, md: 36 },
                    borderRadius: "12px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
                      transform: "scale(1.1) rotate(90deg)",
                      boxShadow: "0 4px 12px rgba(108, 92, 231, 0.4)",
                    },
                  }}>
                  <MoreVert sx={{ fontSize: { xs: "16px", md: "18px" } }} />
                </IconButton>
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: "14px", md: "16px" },
                      fontWeight: 700,
                      color: "#FFFFFF",
                      fontFamily: '"Poppins", sans-serif',
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                      mr: 1,
                      letterSpacing: "-0.01em",
                    }}>
                    {post.title}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: { xs: "12px", md: "13px" },
                    mb: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.4,
                  }}>
                  {post.description}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}>
                  <Chip
                    label={post.category?.name || "No Category"}
                    size="small"
                    sx={{
                      background:
                        "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontWeight: 600,
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(108, 92, 231, 0.3)",
                    }}
                  />
                  <Chip
                    label={post.isPublished ? "Published" : "Draft"}
                    size="small"
                    sx={{
                      background: post.isPublished
                        ? "linear-gradient(135deg, #4CAF50 0%, #45A049 100%)"
                        : "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontWeight: 600,
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: "12px",
                      boxShadow: post.isPublished
                        ? "0 2px 8px rgba(76, 175, 80, 0.3)"
                        : "0 2px 8px rgba(255, 152, 0, 0.3)",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                  <Typography variant="caption" sx={{ color: "#999999" }}>
                    {formatDate(post.createdAt)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Favorite sx={{ fontSize: 16, color: "#FF6B6B" }} />
                      <Typography variant="caption" sx={{ color: "#CCCCCC" }}>
                        {post.likes || 0}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Visibility sx={{ fontSize: 16, color: "#6C5CE7" }} />
                      <Typography variant="caption" sx={{ color: "#CCCCCC" }}>
                        {post.views || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Loading Indicator */}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            mt: 4,
            gap: 2,
          }}>
          <CircularProgress
            size={40}
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
          <Typography
            sx={{
              color: "#CCCCCC",
              fontSize: "14px",
              opacity: 0.8,
            }}>
            Loading more posts...
          </Typography>
        </Box>
      )}

      {/* Load More Button */}
      {!isLoading && hasMore && posts.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="outlined"
            onClick={loadMore}
            sx={{
              borderColor: "#6C5CE7",
              color: "#6C5CE7",
              px: 4,
              py: 1.5,
              "&:hover": {
                borderColor: "#5A4FCF",
                backgroundColor: "rgba(108, 92, 231, 0.1)",
              },
            }}>
            Load More Posts
          </Button>
        </Box>
      )}

      {/* No Posts Message */}
      {!isLoading && posts.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" sx={{ color: "#CCCCCC", mb: 2 }}>
            No posts found
          </Typography>
          <Typography variant="body2" sx={{ color: "#AAAAAA", mb: 3 }}>
            {searchQuery || selectedCategory
              ? "Try adjusting your search or filters"
              : "Create your first post to get started"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/udishrav/U-admin/dashboard/create-post")}
            sx={{
              bgcolor: "#6C5CE7",
              color: "#FFFFFF",
              "&:hover": {
                bgcolor: "#5A4FCF",
              },
            }}>
            Create Post
          </Button>
        </Box>
      )}

      {/* Post Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          "& .MuiPaper-root": {
            background: "rgba(26, 26, 26, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          },
        }}>
        <MenuItem
          onClick={handleView}
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            fontFamily: '"Poppins", sans-serif',
            py: 1.5,
            px: 2,
            "&:hover": {
              background: "rgba(255, 255, 255, 0.05)",
              color: "#FFFFFF",
            },
          }}>
          <Visibility sx={{ mr: 1.5, fontSize: 18, color: "#4CAF50" }} />
          View Post
        </MenuItem>
        <MenuItem
          onClick={handleEdit}
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            fontFamily: '"Poppins", sans-serif',
            py: 1.5,
            px: 2,
            "&:hover": {
              background: "rgba(255, 255, 255, 0.05)",
              color: "#FFFFFF",
            },
          }}>
          <Edit sx={{ mr: 1.5, fontSize: 18, color: "#6C5CE7" }} />
          Edit Post
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            color: "#FF6B6B",
            fontFamily: '"Poppins", sans-serif',
            py: 1.5,
            px: 2,
            "&:hover": {
              background: "rgba(255, 107, 107, 0.1)",
              color: "#FF5252",
            },
          }}>
          <Delete sx={{ mr: 1.5, fontSize: 18 }} />
          Delete Post
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        sx={{
          "& .MuiDialog-paper": {
            background: "rgba(26, 26, 26, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.6)",
          },
        }}>
        <DialogTitle
          sx={{
            color: "#FFFFFF",
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700,
            fontSize: "20px",
          }}>
          Delete Post
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              fontFamily: '"Poppins", sans-serif',
              fontSize: "16px",
            }}>
            Are you sure you want to delete "{postToDelete?.title}"? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 500,
              px: 3,
              py: 1.5,
              borderRadius: "12px",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.05)",
                color: "#FFFFFF",
              },
            }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)",
              color: "#FFFFFF",
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(255, 107, 107, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #FF5252 0%, #FF4444 100%)",
                boxShadow: "0 12px 32px rgba(255, 107, 107, 0.4)",
                transform: "translateY(-1px)",
              },
            }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default AllPosts;
