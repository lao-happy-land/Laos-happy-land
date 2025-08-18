"use client";

import { useState, useEffect, useCallback } from 'react';
import { propertyService, type Property, type PropertySearchQuery, type CreatePropertyRequest, type UpdatePropertyRequest } from '@/share/service/property.service';

export const useProperty = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch all properties with optional query
  const fetchProperties = useCallback(async (query?: PropertySearchQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchQuery = {
        ...query,
        take: limit,
        skip: (page - 1) * limit,
      };
      
      const response = await propertyService.getAll(searchQuery);
      setProperties(response.data);
      setTotal(response.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách tin đăng';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit, page]);

  // Fetch a single property by ID
  const fetchProperty = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const property = await propertyService.getById(id);
      setCurrentProperty(property);
      return property;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin tin đăng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new property
  const createProperty = async (data: CreatePropertyRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate data before sending
      const validationErrors = propertyService.validatePropertyData(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }
      
      const newProperty = await propertyService.create(data);
      
      // Add to current properties list if we're on first page
      if (page === 1) {
        setProperties(prev => [newProperty, ...prev]);
        setTotal(prev => prev + 1);
      }
      
      return newProperty;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo tin đăng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a property
  const updateProperty = async (id: string, data: UpdatePropertyRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate data before sending
      const validationErrors = propertyService.validatePropertyData(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }
      
      const updatedProperty = await propertyService.update(id, data);
      
      // Update in current properties list
      setProperties(prev => 
        prev.map(prop => prop.id === id ? updatedProperty : prop)
      );
      
      // Update current property if it's the same
      if (currentProperty?.id === id) {
        setCurrentProperty(updatedProperty);
      }
      
      return updatedProperty;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật tin đăng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a property
  const deleteProperty = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await propertyService.delete(id);
      
      // Remove from current properties list
      setProperties(prev => prev.filter(prop => prop.id !== id));
      setTotal(prev => prev - 1);
      
      // Clear current property if it's the same
      if (currentProperty?.id === id) {
        setCurrentProperty(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa tin đăng';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset error
  const clearError = () => {
    setError(null);
  };

  // Reset all data
  const reset = () => {
    setProperties([]);
    setCurrentProperty(null);
    setError(null);
    setTotal(0);
    setPage(1);
  };

  // Pagination controls
  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  const setItemsPerPage = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  // Auto fetch when page or limit changes
  useEffect(() => {
    // Only auto-fetch if we have properties (meaning fetchProperties was called at least once)
    if (properties.length > 0 || page > 1) {
      void fetchProperties();
    }
  }, [page, limit, properties.length, fetchProperties]);

  return {
    // Data
    properties,
    currentProperty,
    total,
    page,
    limit,
    
    // State
    loading,
    error,
    
    // Actions
    fetchProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    clearError,
    reset,
    
    // Pagination
    goToPage,
    setItemsPerPage,
    
    // Computed values
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
    
    // Utility functions from service
    formatPrice: (price?: number) => propertyService.formatPrice(price),
    formatArea: (area?: number) => propertyService.formatArea(area),
    getPropertyTypeLabel: (type: string) => propertyService.getPropertyTypeLabel(type),
    validatePropertyData: (data: CreatePropertyRequest | UpdatePropertyRequest) => propertyService.validatePropertyData(data),
  };
};

export default useProperty;
