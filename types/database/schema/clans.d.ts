export interface IClans {
  id: string;
  type: string;
  info: {
    name: string;
    master: string;
    deputu?: Record<string, { id: string; username: string; user: string }>;
    positions: Record<string, { position: number }>;
    limit?: number;
    position_limit?: number;
    members?: Record<string, { id?: string; position?: number }>;
    elite_max?: number;
    upgrade?: { count?: number; max?: number };
    deputu_max?: number;
  };
}
