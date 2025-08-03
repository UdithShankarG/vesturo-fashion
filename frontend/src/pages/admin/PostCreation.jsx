import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import { CloudUpload, Add, Delete, Edit } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import usePostStore from "../../store/postStore";
import useCategoryStore from "../../store/categoryStore";
import { compressImage, validateImageFile } from "../../utils/imageCompression";

const PostCreation = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    hashtags: [],
    affiliateLinks: [],
    isPublished: false,
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newHashtag, setNewHashtag] = useState("");
  const [newLink, setNewLink] = useState({ title: "", url: "", price: "" });
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState(-1);

  const { categories, fetchCategories } = useCategoryStore();
  const {
    createPost,
    updatePost,
    fetchPostById,
    currentPost,
    isLoading,
    error,
    clearError,
  } = usePostStore();

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

  // Image upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch categories and post data (if editing)
  useEffect(() => {
    fetchCategories({ active: true });
    if (isEdit && id) {
      fetchPostById(id);
    }
  }, [isEdit, id, fetchCategories, fetchPostById]);

  // Populate form when editing
  useEffect(() => {
    if (isEdit && currentPost) {
      setFormData({
        title: currentPost.title || "",
        description: currentPost.description || "",
        category: currentPost.category?._id || "",
        hashtags: currentPost.hashtags || [],
        affiliateLinks: currentPost.affiliateLinks || [],
        isPublished: currentPost.isPublished || false,
      });

      if (currentPost.images) {
        setImagePreviews(currentPost.images.map((img) => img.url));
      }
    }
  }, [isEdit, currentPost]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) clearError();
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Validate and compress images
      const processedFiles = [];
      const newPreviews = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file
        validateImageFile(file);

        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 50)); // 50% for compression

        // Compress image for better performance
        const compressedFile = await compressImage(file, {
          maxWidth: 1200,
          maxHeight: 1600,
          quality: 0.85,
        });

        console.log(
          `Original: ${(file.size / 1024 / 1024).toFixed(2)}MB → Compressed: ${(
            compressedFile.size /
            1024 /
            1024
          ).toFixed(2)}MB`
        );

        processedFiles.push(compressedFile);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          if (newPreviews.length === files.length) {
            setImagePreviews((prev) => [...prev, ...newPreviews]);
            setUploadProgress(100);
            setTimeout(() => {
              setUploading(false);
              setUploadProgress(0);
            }, 500);
          }
        };
        reader.readAsDataURL(compressedFile);
      }

      setImages((prev) => [...prev, ...processedFiles]);
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      alert(error.message || "Error processing images");
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addHashtag = () => {
    if (newHashtag.trim() && !formData.hashtags.includes(newHashtag.trim())) {
      setFormData((prev) => ({
        ...prev,
        hashtags: [...prev.hashtags, newHashtag.trim()],
      }));
      setNewHashtag("");
    }
  };

  const removeHashtag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleLinkDialogOpen = (index = -1) => {
    if (index >= 0) {
      setNewLink(formData.affiliateLinks[index]);
      setEditingLinkIndex(index);
    } else {
      setNewLink({ title: "", url: "", price: "" });
      setEditingLinkIndex(-1);
    }
    setLinkDialogOpen(true);
  };

  const handleLinkDialogClose = () => {
    setLinkDialogOpen(false);
    setNewLink({ title: "", url: "", price: "" });
    setEditingLinkIndex(-1);
  };

  const saveLinkDialog = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      alert("Title and URL are required");
      return;
    }

    setFormData((prev) => {
      const links = [...prev.affiliateLinks];
      if (editingLinkIndex >= 0) {
        links[editingLinkIndex] = newLink;
      } else {
        links.push(newLink);
      }
      return { ...prev, affiliateLinks: links };
    });

    handleLinkDialogClose();
  };

  const removeLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      affiliateLinks: prev.affiliateLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e, publishStatus = null) => {
    e.preventDefault();

    // Use publishStatus if provided, otherwise use formData.isPublished
    const isPublishing =
      publishStatus !== null ? publishStatus : formData.isPublished;

    // Form submission started

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category
    ) {
      showCustomAlert("Please fill in all required fields", "error");
      return;
    }

    if (!isEdit && images.length === 0) {
      showCustomAlert("Please add at least one image", "error");
      return;
    }

    const postData = new FormData();
    postData.append("title", formData.title);
    postData.append("description", formData.description);
    postData.append("category", formData.category);
    postData.append("hashtags", JSON.stringify(formData.hashtags));
    postData.append("affiliateLinks", JSON.stringify(formData.affiliateLinks));
    postData.append("isPublished", isPublishing);

    // Add images
    images.forEach((image) => {
      postData.append("images", image);
    });

    try {
      let result;
      if (isEdit) {
        result = await updatePost(id, postData);
      } else {
        result = await createPost(postData);
      }

      if (result.success) {
        showCustomAlert(
          isEdit ? "Post updated successfully!" : "Post created successfully!",
          "success"
        );
        setTimeout(
          () => navigate("/udishrav/U-admin/dashboard/all-posts"),
          1000
        );
      } else {
        showCustomAlert(
          `Failed to ${isEdit ? "update" : "create"} post: ${result.error}`,
          "error"
        );
      }
    } catch (error) {
      showCustomAlert(
        `Error ${isEdit ? "updating" : "creating"} post: ${error.message}`,
        "error"
      );
    }
  };

  // Show error alert when error changes
  useEffect(() => {
    if (error) showCustomAlert(error, "error");
  }, [error]);

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: "28px", md: "32px", lg: "36px" },
          fontWeight: 700,
          color: "#FFFFFF",
          fontFamily: '"Poppins", sans-serif',
          letterSpacing: "-0.02em",
          mb: 4,
        }}>
        {isEdit ? "Edit Post" : "Create New Post"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {/* Main Form */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "24px",
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)",
              }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    fontFamily: '"Poppins", sans-serif',
                    letterSpacing: "-0.01em",
                    mb: 3,
                  }}>
                  Post Details
                </Typography>

                <TextField
                  fullWidth
                  label="Post Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  required
                  sx={{ mb: 3 }}
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required>
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Hashtags Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#FFFFFF",
                      mb: 2,
                      fontWeight: 600,
                    }}>
                    Hashtags
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <TextField
                      label="Add hashtag"
                      value={newHashtag}
                      onChange={(e) => setNewHashtag(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addHashtag())
                      }
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={addHashtag}
                      sx={{
                        bgcolor: "#6C5CE7",
                        "&:hover": { bgcolor: "#5A4FCF" },
                      }}>
                      <Add />
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {formData.hashtags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={`#${tag}`}
                        onDelete={() => removeHashtag(tag)}
                        sx={{
                          bgcolor: "#6C5CE7",
                          color: "#FFFFFF",
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Affiliate Links Section */}
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: 600,
                      }}>
                      Affiliate Links
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => handleLinkDialogOpen()}
                      sx={{
                        bgcolor: "#6C5CE7",
                        "&:hover": { bgcolor: "#5A4FCF" },
                      }}>
                      Add Link
                    </Button>
                  </Box>

                  {formData.affiliateLinks.map((link, index) => (
                    <Card
                      key={index}
                      sx={{
                        bgcolor: "#333333",
                        border: "1px solid #444444",
                        mb: 2,
                      }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{ color: "#FFFFFF", mb: 1 }}>
                              {link.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#CCCCCC", mb: 1 }}>
                              {link.url}
                            </Typography>
                            {link.price && (
                              <Typography
                                variant="body2"
                                sx={{ color: "#6BCF7F" }}>
                                {link.price}
                              </Typography>
                            )}
                          </Box>
                          <Box>
                            <IconButton
                              size="small"
                              onClick={() => handleLinkDialogOpen(index)}
                              sx={{ color: "#6C5CE7", mr: 1 }}>
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => removeLink(index)}
                              sx={{ color: "#FF6B6B" }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Image Upload */}
            <Card
              sx={{
                bgcolor: "#1A1A1A",
                border: "1px solid #333333",
                borderRadius: "12px",
                mb: 3,
              }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    mb: 3,
                  }}>
                  Images
                </Typography>

                {/* Drag Drop Area */}
                <Box
                  sx={{
                    border: "2px dashed #444444",
                    borderRadius: "8px",
                    p: 3,
                    textAlign: "center",
                    bgcolor: "#222222",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    mb: 2,
                    "&:hover": {
                      borderColor: "#6C5CE7",
                      bgcolor: "#2A2A2A",
                    },
                  }}
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />

                  <CloudUpload sx={{ fontSize: 48, color: "#666666", mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "#CCCCCC", mb: 1 }}>
                    Drag & Drop or Click to Upload
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#999999" }}>
                    Supports: JPG, PNG, WebP (Max 5 images)
                  </Typography>
                </Box>

                {/* Upload Progress */}
                {uploading && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#CCCCCC", mb: 1 }}>
                      Compressing and uploading images... {uploadProgress}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{
                        backgroundColor: "#333333",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#6C5CE7",
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#FFFFFF", mb: 2 }}>
                      Uploaded Images ({imagePreviews.length}/5)
                    </Typography>
                    <Grid container spacing={1}>
                      {imagePreviews.map((preview, index) => (
                        <Grid item xs={6} key={index}>
                          <Box sx={{ position: "relative" }}>
                            <Box
                              component="img"
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              sx={{
                                width: "100%",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #333333",
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeImage(index)}
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                bgcolor: "rgba(255, 107, 107, 0.8)",
                                color: "#FFFFFF",
                                "&:hover": {
                                  bgcolor: "rgba(255, 107, 107, 1)",
                                },
                              }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Modern Publish Settings */}
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "24px",
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)",
              }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    fontFamily: '"Poppins", sans-serif',
                    letterSpacing: "-0.01em",
                    mb: 3,
                  }}>
                  Publish Settings
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={(e) => {
                      handleSubmit(e, true);
                    }}
                    disabled={isLoading || uploading}
                    sx={{
                      background:
                        "linear-gradient(135deg, #4CAF50 0%, #45A049 100%)",
                      color: "#FFFFFF",
                      py: 2,
                      fontSize: "16px",
                      fontWeight: 700,
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: "16px",
                      textTransform: "none",
                      boxShadow: "0 8px 24px rgba(76, 175, 80, 0.3)",
                      border: "1px solid rgba(76, 175, 80, 0.3)",
                      mb: 2,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #45A049 0%, #388E3C 100%)",
                        boxShadow: "0 12px 32px rgba(76, 175, 80, 0.4)",
                        transform: "translateY(-2px)",
                      },
                      "&:active": {
                        transform: "translateY(-1px)",
                      },
                      "&:disabled": {
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "rgba(255, 255, 255, 0.3)",
                        boxShadow: "none",
                        transform: "none",
                      },
                    }}>
                    {isLoading || uploading ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                          sx={{
                            width: "20px",
                            height: "20px",
                            border: "2px solid rgba(255, 255, 255, 0.3)",
                            borderTop: "2px solid #FFFFFF",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        />
                        {uploading
                          ? "Uploading..."
                          : isEdit
                          ? "Updating..."
                          : "Publishing..."}
                      </Box>
                    ) : (
                      `${isEdit ? "Update & Publish" : "Publish Post"}`
                    )}
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={(e) => {
                      handleSubmit(e, false);
                    }}
                    disabled={isLoading || uploading}
                    sx={{
                      borderColor: "rgba(108, 92, 231, 0.5)",
                      color: "#6C5CE7",
                      py: 2,
                      fontSize: "16px",
                      fontWeight: 600,
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: "16px",
                      textTransform: "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        borderColor: "#6C5CE7",
                        background: "rgba(108, 92, 231, 0.1)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(108, 92, 231, 0.2)",
                      },
                      "&:disabled": {
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        color: "rgba(255, 255, 255, 0.3)",
                      },
                    }}>
                    {isLoading || uploading ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                          sx={{
                            width: "16px",
                            height: "16px",
                            border: "2px solid rgba(108, 92, 231, 0.3)",
                            borderTop: "2px solid #6C5CE7",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        />
                        Saving...
                      </Box>
                    ) : isEdit ? (
                      "Save as Draft"
                    ) : (
                      "Save Draft"
                    )}
                  </Button>
                </Box>

                <Button
                  variant="text"
                  fullWidth
                  onClick={() =>
                    navigate("/udishrav/U-admin/dashboard/all-posts")
                  }
                  sx={{
                    color: "#CCCCCC",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}>
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Affiliate Link Dialog */}
      <Dialog
        open={linkDialogOpen}
        onClose={handleLinkDialogClose}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            background: "rgba(26, 26, 26, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.6)",
          },
        }}>
        <DialogTitle sx={{ color: "#FFFFFF" }}>
          {editingLinkIndex >= 0 ? "Edit Link" : "Add Affiliate Link"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Link Title"
            value={newLink.title}
            onChange={(e) =>
              setNewLink((prev) => ({ ...prev, title: e.target.value }))
            }
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="URL"
            value={newLink.url}
            onChange={(e) =>
              setNewLink((prev) => ({ ...prev, url: e.target.value }))
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Price (optional)"
            value={newLink.price}
            onChange={(e) =>
              setNewLink((prev) => ({ ...prev, price: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLinkDialogClose} sx={{ color: "#CCCCCC" }}>
            Cancel
          </Button>
          <Button
            onClick={saveLinkDialog}
            variant="contained"
            sx={{
              bgcolor: "#6C5CE7",
              "&:hover": { bgcolor: "#5A4FCF" },
            }}>
            {editingLinkIndex >= 0 ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostCreation;
