import { Category } from '@/generated/prisma';
import axiosInstance from '@/lib/axios';

export interface CreateCategoryParams {
  name: string;
}

export interface UpdateCategoryParams {
  id: string;
  name: string;
}

export interface SetDefaultCategoryParams {
  categoryId: string;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await axiosInstance.get('/categories');
    return response.data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch categories');
  }
}

export async function getDefaultCategory(): Promise<Category> {
  try {
    const response = await axiosInstance.get('/user/default-category');
    return response.data.defaultCategory;
  } catch (error) {
    console.error('Error fetching default category:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch default category');
  }
}

export async function createCategory(params: CreateCategoryParams): Promise<Category> {
  try {
    const response = await axiosInstance.post('/categories', params);
    return response.data.category;
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create category');
  }
}

export async function updateCategory({ id, name }: UpdateCategoryParams): Promise<Category> {
  try {
    const response = await axiosInstance.put(`/categories/${id}`, { name });
    return response.data.category;
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update category');
  }
}

export async function deleteCategory(id: string): Promise<{ id: string; success: boolean }> {
  try {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return { id, ...response.data };
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete category');
  }
}

export async function setDefaultCategory(
  params: SetDefaultCategoryParams,
): Promise<{ defaultCategory: Category }> {
  try {
    const response = await axiosInstance.put('/user/default-category', params);
    return response.data;
  } catch (error) {
    console.error('Error setting default category:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to set default category');
  }
}
