import { create } from "zustand";

const useCategoryStore = create((set, get) => ({
  // State
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  // Actions
  setCategories: (categories) => set({ categories }),

  setCurrentCategory: (category) => set({ currentCategory: category }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setPagination: (pagination) => set({ pagination }),

  // Fetch all categories
  fetchCategories: async (params = {}) => {
    set({ isLoading: true, error: null });

    try {
      const queryParams = new URLSearchParams({
        active: params.active !== undefined ? params.active : true,
        page: params.page || 1,
        limit: params.limit || 20,
      });

      const response = await fetch(`/api/vesturo/category?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      set({
        categories: data.categories,
        pagination: data.pagination,
        isLoading: false,
        error: null,
      });

      return { success: true, data };
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch single category
  fetchCategory: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/vesturo/category/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch category");
      }

      set({
        currentCategory: data.category,
        isLoading: false,
        error: null,
      });

      return { success: true, data };
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch single category by slug
  fetchCategoryBySlug: async (slug) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/vesturo/category/slug/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch category");
      }

      set({
        currentCategory: data.category,
        isLoading: false,
        error: null,
      });

      return { success: true, data };
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  // Create category (Admin only)
  createCategory: async (categoryData, token) => {
    set({ isLoading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("name", categoryData.name);
      if (categoryData.description) {
        formData.append("description", categoryData.description);
      }
      if (categoryData.sortOrder !== undefined) {
        formData.append("sortOrder", categoryData.sortOrder);
      }
      if (categoryData.image) {
        formData.append("image", categoryData.image);
      }

      const response = await fetch("/api/vesturo/category", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      // Add new category to the list
      const { categories } = get();
      set({
        categories: [data.category, ...categories],
        isLoading: false,
        error: null,
      });

      return { success: true, data };
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  // Update category (Admin only)
  updateCategory: async (id, categoryData, token) => {
    set({ isLoading: true, error: null });

    try {
      const formData = new FormData();
      if (categoryData.name) formData.append("name", categoryData.name);
      if (categoryData.description !== undefined) {
        formData.append("description", categoryData.description);
      }
      if (categoryData.sortOrder !== undefined) {
        formData.append("sortOrder", categoryData.sortOrder);
      }
      if (categoryData.isActive !== undefined) {
        formData.append("isActive", categoryData.isActive);
      }
      if (categoryData.image) {
        formData.append("image", categoryData.image);
      }

      const response = await fetch(`/api/vesturo/category/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update category");
      }

      // Update category in the list
      const { categories } = get();
      const updatedCategories = categories.map((cat) =>
        cat._id === id ? data.category : cat
      );

      set({
        categories: updatedCategories,
        currentCategory: data.category,
        isLoading: false,
        error: null,
      });

      return { success: true, data };
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  // Delete category (Admin only)
  deleteCategory: async (id, token) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/vesturo/category/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category");
      }

      // Remove category from the list
      const { categories } = get();
      const filteredCategories = categories.filter((cat) => cat._id !== id);

      set({
        categories: filteredCategories,
        currentCategory: null,
        isLoading: false,
        error: null,
      });

      return { success: true, data };
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  clearError: () => set({ error: null }),

  clearCurrentCategory: () => set({ currentCategory: null }),
}));

export default useCategoryStore;
