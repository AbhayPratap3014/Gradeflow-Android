import { cloud } from './cloud';

export type SemesterSnapshot = {
  id: string;
  semester: number;
  predictedSgpa: number | null;
  actualSgpa: number | null;
  createdAt?: string;
};

const mapSnapshot=(x:any):SemesterSnapshot=>({id:String(x.id),semester:Number(x.semester),predictedSgpa:x.predicted_sgpa==null?null:Number(x.predicted_sgpa),actualSgpa:x.actual_sgpa==null?null:Number(x.actual_sgpa),createdAt:x.created_at});

export const progressRepository={
 async getSnapshots():Promise<SemesterSnapshot[]>{if(!cloud)return[];const{data,error}=await cloud.from('semester_snapshots').select('*').order('semester',{ascending:false});if(error)throw error;return(data||[]).map(mapSnapshot)},
 async saveSnapshot(v:{semester:number;predictedSgpa:number;actualSgpa?:number|null}){if(!cloud)throw new Error('Supabase not configured');const{data,error}=await cloud.from('semester_snapshots').upsert({semester:v.semester,predicted_sgpa:v.predictedSgpa,actual_sgpa:v.actualSgpa??null},{onConflict:'semester'}).select().single();if(error)throw error;return mapSnapshot(data)},
 async deleteSnapshot(id:string){if(!cloud)throw new Error('Supabase not configured');const{error}=await cloud.from('semester_snapshots').delete().eq('id',id);if(error)throw error;}
};
