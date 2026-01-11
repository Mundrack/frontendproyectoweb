export interface Team {
  id: number;
  name: string;
  department?: number;
  department_detail?: {
    id: number;
    name: string;
    branch_name: string;
  };
  department_name?: string;
  branch_name?: string;
  company_name?: string;
  team_type: 'gerente_general' | 'manager_equipo' | 'miembro_equipo';
  team_type_display: string;
  leader?: number | null;
  leader_detail?: {
    id: number;
    name: string;
    email: string;
  } | null;
  leader_name?: string;
  description?: string;
  is_active: boolean;
  members_detail?: TeamMember[];
  member_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id: number;
  team: number;
  user: number;
  user_name: string;
  user_email: string;
  role: 'leader' | 'member';
  role_display: string;
  assigned_at: string;
}

export interface CreateTeamData {
  name: string;
  department: number;
  team_type: 'gerente_general' | 'manager_equipo' | 'miembro_equipo';
  leader?: number;
  description: string;
  is_active: boolean;
}

export interface TeamStats {
  team_id: number;
  team_name: string;
  team_type: string;
  members_count: number;
  leaders_count: number;
  audits: {
    total: number;
    completed: number;
    in_progress: number;
  };
  is_active: boolean;
}

export interface OrganizationHierarchy {
  company_id: number;
  company_name: string;
  branches: Array<{
    branch_id: number;
    branch_name: string;
    departments: Array<{
      department_id: number;
      department_name: string;
      teams: Array<{
        team_id: number;
        team_name: string;
        team_type: string;
        team_type_display: string;
        leader: {
          id: number;
          name: string;
          email: string;
        } | null;
        members: TeamMember[];
      }>;
    }>;
  }>;
}
