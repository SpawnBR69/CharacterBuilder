export interface Spell {
  name: string;
  level: number;
  school?: string;
  cast_time: string;
  range: string;
  components: string;
  material_desc: string | null;
  duration: string;
  desc: string;
  classes: string[];
  ritual: boolean;
}