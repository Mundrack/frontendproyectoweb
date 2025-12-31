import api from '../axios.config';
import {
  Company,
  CreateCompanyData,
  Branch,
  CreateBranchData,
  Department,
  CreateDepartmentData,
} from '@/types/company.types';

export const companiesApi = {
  // Companies
  getCompanies: async (): Promise<Company[]> => {
    const response = await api.get('/api/companies/');
    return response.data;
  },

  getCompany: async (id: number): Promise<Company> => {
    const response = await api.get(`/api/companies/${id}/`);
    return response.data;
  },

  createCompany: async (data: CreateCompanyData): Promise<Company> => {
    const response = await api.post('/api/companies/', data);
    return response.data;
  },

  updateCompany: async (id: number, data: CreateCompanyData): Promise<Company> => {
    const response = await api.put(`/api/companies/${id}/`, data);
    return response.data;
  },

  deleteCompany: async (id: number): Promise<void> => {
    await api.delete(`/api/companies/${id}/`);
  },

  // Branches
  getBranches: async (companyId?: number): Promise<Branch[]> => {
    const params = companyId ? { company: companyId } : {};
    const response = await api.get('/api/branches/', { params });
    return response.data;
  },

  getBranch: async (id: number): Promise<Branch> => {
    const response = await api.get(`/api/branches/${id}/`);
    return response.data;
  },

  createBranch: async (data: CreateBranchData): Promise<Branch> => {
    const response = await api.post('/api/branches/', data);
    return response.data;
  },

  updateBranch: async (id: number, data: Partial<CreateBranchData>): Promise<Branch> => {
    const response = await api.patch(`/api/branches/${id}/`, data);
    return response.data;
  },

  deleteBranch: async (id: number): Promise<void> => {
    await api.delete(`/api/branches/${id}/`);
  },

  // Departments
  getDepartments: async (branchId?: number): Promise<Department[]> => {
    const params = branchId ? { branch: branchId } : {};
    const response = await api.get('/api/departments/', { params });
    return response.data;
  },

  getDepartment: async (id: number): Promise<Department> => {
    const response = await api.get(`/api/departments/${id}/`);
    return response.data;
  },

  createDepartment: async (data: CreateDepartmentData): Promise<Department> => {
    const response = await api.post('/api/departments/', data);
    return response.data;
  },

  updateDepartment: async (id: number, data: CreateDepartmentData): Promise<Department> => {
    const response = await api.put(`/api/departments/${id}/`, data);
    return response.data;
  },

  deleteDepartment: async (id: number): Promise<void> => {
    await api.delete(`/api/departments/${id}/`);
  },
};
