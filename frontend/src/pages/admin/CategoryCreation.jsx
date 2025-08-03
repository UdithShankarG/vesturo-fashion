import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  Edit,
  Add,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import useCategoryStore from "../../store/categoryStore";
import useAuthStore from "../../store/authStore";
import { compressImage, validateImageFile } from "../../utils/imageCompression";

const CategoryCreation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sortOrder: 0,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { token } = useAuthStore();
  const {
    categories,
    currentCategory,
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    isLoading,
    error,
    clearError,
  } = useCategoryStore();

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

  // Fetch categories and current category if editing
  useEffect(() => {
    fetchCategories({ active: false }); // Get all categories including inactive
    if (isEdit && id) {
      fetchCategory(id);
    }
  }, [fetchCategories, fetchCategory, isEdit, id]);

  // Populate form when editing
  useEffect(() => {
    if (isEdit && currentCategory) {
      setFormData({
        name: currentCategory.name || "",
        description: currentCategory.description || "",
        sortOrder: currentCategory.sortOrder || 0,
      });
      setImagePreview(currentCategory.image || "");
    }
  }, [isEdit, currentCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sortOrder" ? parseInt(value) || 0 : value,
    }));
    if (error) clearError();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setUploadProgress(0);

      try {
        // Validate file
        validateImageFile(file);

        setUploadProgress(25);

        // Compress image for better performance
        const compressedFile = await compressImage(file, {
          maxWidth: 800,
          maxHeight: 1200,
          quality: 0.85,
        });

        console.log(
          `Category Image - Original: ${(file.size / 1024 / 1024).toFixed(
            2
          )}MB → Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(
            2
          )}MB`
        );

        setUploadProgress(75);
        setSelectedImage(compressedFile);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
          setUploadProgress(100);
          setTimeout(() => {
            setUploading(false);
            setUploadProgress(0);
          }, 500);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        setUploading(false);
        setUploadProgress(0);
        alert(error.message || "Error processing image");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showCustomAlert("Category name is required", "error");
      return;
    }

    if (!isEdit && !selectedImage) {
      showCustomAlert("Category image is required", "error");
      return;
    }

    const categoryData = {
      ...formData,
      ...(selectedImage && { image: selectedImage }),
    };

    let result;
    if (isEdit) {
      result = await updateCategory(id, categoryData, token);
    } else {
      result = await createCategory(categoryData, token);
    }

    if (result.success) {
      showCustomAlert(
        `Category ${isEdit ? "updated" : "created"} successfully!`,
        "success"
      );
      if (!isEdit) {
        // Reset form for new category
        setFormData({ name: "", description: "", sortOrder: 0 });
        setSelectedImage(null);
        setImagePreview("");
      }
      // Refresh categories list
      fetchCategories({ active: false });
    }
  };

  const handleEdit = (category) => {
    navigate(`/admin/categories/edit/${category._id}`);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      const result = await deleteCategory(categoryToDelete._id, token);
      if (result.success) {
        alert("Category deleted successfully!");
        fetchCategories({ active: false });
      }
    }
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
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
          mb: 4,
          fontFamily: '"Poppins", sans-serif',
          letterSpacing: "-0.02em",
        }}>
        {isEdit ? "Edit Category" : "Category Creation"}
      </Typography>

      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
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
                  mb: 3,
                  fontFamily: '"Poppins", sans-serif',
                  letterSpacing: "-0.01em",
                }}>
                Category Details
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                {/* Category Name Field */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "rgba(255, 255, 255, 0.8)",
                      mb: 1.5,
                      fontFamily: '"Poppins", sans-serif',
                    }}>
                    Category Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter category name"
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
                </Box>

                {/* Description Field */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "rgba(255, 255, 255, 0.8)",
                      mb: 1.5,
                      fontFamily: '"Poppins", sans-serif',
                    }}>
                    Description
                  </Typography>
                  <TextField
                    fullWidth
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    placeholder="Enter category description"
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
                </Box>

                {/* Sort Order Field */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "rgba(255, 255, 255, 0.8)",
                      mb: 1.5,
                      fontFamily: '"Poppins", sans-serif',
                    }}>
                    Sort Order
                  </Typography>
                  <TextField
                    fullWidth
                    name="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    placeholder="Enter sort order"
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
                </Box>

                {/* Image Upload Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#FFFFFF",
                      mb: 2,
                      fontWeight: 600,
                    }}>
                    Category Image
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
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />

                    {imagePreview ? (
                      <Box>
                        <Box
                          component="img"
                          src={imagePreview}
                          alt="Preview"
                          sx={{
                            width: "100%",
                            maxWidth: "200px",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            mb: 2,
                          }}
                        />
                        <Typography variant="body2" sx={{ color: "#CCCCCC" }}>
                          Click to change image
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <CloudUpload
                          sx={{ fontSize: 48, color: "#666666", mb: 2 }}
                        />
                        <Typography
                          variant="h6"
                          sx={{ color: "#CCCCCC", mb: 1 }}>
                          Drag & Drop or Click to Upload
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#999999" }}>
                          Supports: JPG, PNG, WebP (Max 5MB)
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Upload Progress */}
                  {uploading && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#CCCCCC", mb: 1 }}>
                        Compressing image... {uploadProgress}%
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
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading || uploading}
                  sx={{
                    background:
                      "linear-gradient(135deg, #6C5CE7 0%, #5A4FCF 100%)",
                    color: "#FFFFFF",
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
                      background:
                        "linear-gradient(135deg, #5A4FCF 0%, #4C3BCF 100%)",
                      boxShadow: "0 12px 32px rgba(108, 92, 231, 0.4)",
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                        : "Creating..."}
                    </Box>
                  ) : (
                    `${isEdit ? "Update" : "Create"} Category`
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Categories List Section */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "24px",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}>
                  All Categories
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate("/admin/categories/create")}
                  sx={{
                    bgcolor: "#6C5CE7",
                    color: "#FFFFFF",
                    "&:hover": {
                      bgcolor: "#5A4FCF",
                    },
                  }}>
                  New Category
                </Button>
              </Box>

              <TableContainer
                component={Paper}
                sx={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontFamily: '"Poppins", sans-serif',
                          background: "rgba(255, 255, 255, 0.05)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                          fontSize: "14px",
                        }}>
                        Image
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontFamily: '"Poppins", sans-serif',
                          background: "rgba(255, 255, 255, 0.05)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                          fontSize: "14px",
                        }}>
                        Name
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontFamily: '"Poppins", sans-serif',
                          background: "rgba(255, 255, 255, 0.05)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                          fontSize: "14px",
                        }}>
                        Posts
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontFamily: '"Poppins", sans-serif',
                          background: "rgba(255, 255, 255, 0.05)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                          fontSize: "14px",
                        }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell>
                          <Box
                            component="img"
                            src={category.image}
                            alt={category.name}
                            sx={{
                              width: 40,
                              height: 40,
                              objectFit: "cover",
                              borderRadius: "4px",
                              bgcolor: "#333333",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "#FFFFFF" }}>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}>
                              {category.name}
                            </Typography>
                            {category.description && (
                              <Typography
                                variant="caption"
                                sx={{ color: "#CCCCCC" }}>
                                {category.description.substring(0, 50)}...
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: "#CCCCCC" }}>
                          {category.postCount || 0}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(category)}
                              sx={{
                                color: "#6C5CE7",
                                "&:hover": {
                                  bgcolor: "rgba(108, 92, 231, 0.1)",
                                },
                              }}>
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(category)}
                              sx={{
                                color: "#FF6B6B",
                                "&:hover": {
                                  bgcolor: "rgba(255, 107, 107, 0.1)",
                                },
                              }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {categories.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <ImageIcon sx={{ fontSize: 64, color: "#666666", mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "#CCCCCC", mb: 1 }}>
                    No categories yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#999999" }}>
                    Create your first category to get started
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          Delete Category
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              fontFamily: '"Poppins", sans-serif',
              fontSize: "16px",
            }}>
            Are you sure you want to delete "{categoryToDelete?.name}"? This
            action cannot be undone.
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
};

export default CategoryCreation;
