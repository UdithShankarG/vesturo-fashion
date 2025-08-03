import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import useAuthStore from "./authStore";

const usePostStore = create((set, get) => ({
  // State
  posts: [],
  featuredPosts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    category: null,
    search: "",
    featured: null,
    published: true,
  },

  // Actions
  setPosts: (posts) => set({ posts }),

  setFeaturedPosts: (featuredPosts) => set({ featuredPosts }),

  setCurrentPost: (post) => set({ currentPost: post }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setPagination: (pagination) => set({ pagination }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  // Fetch posts with filters
  fetchPosts: async (params = {}) => {
    set({ isLoading: true, error: null });

    try {
      const { filters } = get();
      const queryParams = new URLSearchParams({
        page: params.page || filters.page || 1,
        limit: params.limit || 10,
        published:
          params.published !== undefined ? params.published : filters.published,
        ...(params.category && { category: params.category }),
        ...(params.search && { search: params.search }),
        ...(params.featured !== undefined && { featured: params.featured }),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortOrder && { sortOrder: params.sortOrder }),
      });

      const response = await fetch(`/api/vesturo/post?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch posts");
      }

      set({
        posts: params.page === 1 ? data.posts : [...get().posts, ...data.posts],
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

  // Fetch featured posts
  fetchFeaturedPosts: async (limit = 6) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/vesturo/post/featured?limit=${limit}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch featured posts");
      }

      set({
        featuredPosts: data.posts,
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

  // Fetch single post by ID (for admin editing)
  fetchPostById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      const response = await fetch(`/api/vesturo/post/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch post");
      }

      set({
        currentPost: data.post,
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

  // Fetch single post
  fetchPost: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/vesturo/post/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch post");
      }

      set({
        currentPost: data.post,
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

  // Fetch post by slug
  fetchPostBySlug: async (slug) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/vesturo/post/slug/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch post");
      }

      set({
        currentPost: data.post,
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

  // Create post (Admin only)
  createPost: async (formData) => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      const response = await fetch("/api/vesturo/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // formData is already FormData from PostCreation
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      // Add new post to the list
      const { posts } = get();
      set({
        posts: [data.post, ...posts],
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

  // Update post (Admin only)
  updatePost: async (id, postData) => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const response = await fetch(`/api/vesturo/post/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: postData, // postData is already FormData
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update post");
      }

      // Update post in the list
      const { posts } = get();
      const updatedPosts = posts.map((post) =>
        post._id === id ? data.post : post
      );

      set({
        posts: updatedPosts,
        currentPost: data.post,
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

  // Like post
  likePost: async (id) => {
    try {
      const response = await fetch(`/api/vesturo/post/${id}/like`, {
        method: "PUT",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to like post");
      }

      // Update post in current post if it matches
      const { currentPost } = get();
      if (currentPost && currentPost._id === id) {
        set({
          currentPost: { ...currentPost, likes: data.likes },
        });
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Share post
  sharePost: async (id) => {
    try {
      const response = await fetch(`/api/vesturo/post/${id}/share`, {
        method: "PUT",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to share post");
      }

      // Update post in current post if it matches
      const { currentPost } = get();
      if (currentPost && currentPost._id === id) {
        set({
          currentPost: { ...currentPost, shares: data.shares },
        });
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reset posts (for new searches)
  resetPosts: () =>
    set({ posts: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } }),

  clearError: () => set({ error: null }),

  clearCurrentPost: () => set({ currentPost: null }),
}));

export default usePostStore;
