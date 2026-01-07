import api from '../axios.config';
import {
  Team,
  CreateTeamData,
  TeamMember,
  TeamStats,
  OrganizationHierarchy,
} from '@/types/team.types';

export const teamsApi = {
  getTeams: async (filters?: {
    company?: number;
    branch?: number;
    department?: number;
    team_type?: string;
  }): Promise<Team[]> => {
    const response = await api.get<Team[]>('/api/teams/', { params: filters });
    return response.data;
  },

  getTeam: async (id: number): Promise<Team> => {
    const response = await api.get<Team>(`/api/teams/${id}/`);
    return response.data;
  },

  createTeam: async (data: CreateTeamData): Promise<Team> => {
    const response = await api.post<Team>('/api/teams/', data);
    return response.data;
  },

  updateTeam: async (id: number, data: Partial<CreateTeamData>): Promise<Team> => {
    const response = await api.put<Team>(`/api/teams/${id}/`, data);
    return response.data;
  },

  deleteTeam: async (id: number): Promise<void> => {
    await api.delete(`/api/teams/${id}/`);
  },

  addMember: async (
    teamId: number,
    userId: number,
    role: 'leader' | 'member'
  ): Promise<{ message: string; member: TeamMember }> => {
    const response = await api.post(`/api/teams/${teamId}/add_member/`, {
      user_id: userId,
      role,
    });
    return response.data;
  },

  removeMember: async (teamId: number, userId: number): Promise<{ message: string }> => {
    const response = await api.post(`/api/teams/${teamId}/remove_member/`, {
      user_id: userId,
    });
    return response.data;
  },

  changeMemberRole: async (
    teamId: number,
    userId: number,
    newRole: 'leader' | 'member'
  ): Promise<{ message: string; member: TeamMember }> => {
    const response = await api.post(`/api/teams/${teamId}/change_member_role/`, {
      user_id: userId,
      new_role: newRole,
    });
    return response.data;
  },

  getTeamStats: async (teamId: number): Promise<TeamStats> => {
    const response = await api.get<TeamStats>(`/api/teams/${teamId}/stats/`);
    return response.data;
  },

  getHierarchy: async (companyId: number): Promise<OrganizationHierarchy> => {
    const response = await api.get<OrganizationHierarchy>('/api/teams/hierarchy/', {
      params: { company_id: companyId },
    });
    return response.data;
  },

  getEmployeeTeams: async (userId: number): Promise<any> => {
    const response = await api.get(`/api/employees/${userId}/teams/`);
    return response.data;
  },
};
