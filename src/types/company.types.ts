export interface Company {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  owner: number;
  owner_name?: string;
  owner_email?: string;
  total_branches?: number;
  total_departments?: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateCompanyData {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface Branch {
  id: number;
  company: number;
  company_name?: string;
  name: string;
  address?: string;
  phone?: string;
  manager?: number;
  manager_name?: string;
  is_active: boolean;
  total_departments?: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateBranchData {
  company: number;
  name: string;
  address?: string;
  phone?: string;
  manager?: number;
  is_active?: boolean;
}

export interface Department {
  id: number;
  branch: number;
  branch_name: string;
  company_name: string;
  name: string;
  description: string;
  created_at: string;
}

export interface CreateDepartmentData {
  branch: number;
  name: string;
  description: string;
}
