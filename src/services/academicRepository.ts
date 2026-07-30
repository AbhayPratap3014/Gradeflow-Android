import type { Mark } from '../types/academic';
import { cloud } from './cloud';

const MARKS_KEY = 'gradeflow.marks.v1';
const TARGET_KEY = 'gradeflow.target.v1';
const cache = (marks: Mark[]) => localStorage.setItem(MARKS_KEY, JSON.stringify(marks));
const fromCloud = (x: any): Mark => ({ id:String(x.id), semester:Number(x.sem), subjectCode:String(x.sub), assessment:String(x.type), score:Number(x.score), max:Number(x.max), createdAt:String(x.created_at || new Date().toISOString()) });

export const academicRepository = {
  getCachedMarks(): Mark[] { try { return JSON.parse(localStorage.getItem(MARKS_KEY) || '[]') as Mark[]; } catch { return []; } },
  async getMarks(): Promise<Mark[]> {
    if (!cloud) return this.getCachedMarks();
    const { data, error } = await cloud.from('marks').select('*').order('created_at',{ascending:false}).limit(100);
    if (error) throw error;
    const marks=(data||[]).map(fromCloud); cache(marks); return marks;
  },
  async addMark(mark: Omit<Mark,'id'|'createdAt'>): Promise<Mark> {
    if (!cloud) { const created={...mark,id:crypto.randomUUID(),createdAt:new Date().toISOString()}; cache([created,...this.getCachedMarks()]); return created; }
    const { data,error }=await cloud.from('marks').insert({sem:mark.semester,sub:mark.subjectCode,type:mark.assessment,score:mark.score,max:mark.max,date:new Date().toLocaleDateString('en-IN')}).select().single();
    if(error)throw error; const created=fromCloud(data); cache([created,...this.getCachedMarks().filter(m=>m.id!==created.id)]); return created;
  },
  async updateMark(id:string,patch:Partial<Mark>):Promise<Mark>{
    if(!cloud){const next=this.getCachedMarks().map(m=>m.id===id?{...m,...patch}:m);cache(next);return next.find(m=>m.id===id)!;}
    const payload:any={};if(patch.semester!=null)payload.sem=patch.semester;if(patch.subjectCode!=null)payload.sub=patch.subjectCode;if(patch.assessment!=null)payload.type=patch.assessment;if(patch.score!=null)payload.score=patch.score;if(patch.max!=null)payload.max=patch.max;
    const{data,error}=await cloud.from('marks').update(payload).eq('id',id).select().single();if(error)throw error;const updated=fromCloud(data);cache(this.getCachedMarks().map(m=>m.id===id?updated:m));return updated;
  },
  async deleteMark(id:string){
    if(cloud){const{error}=await cloud.from('marks').delete().eq('id',id);if(error)throw error;}cache(this.getCachedMarks().filter(m=>m.id!==id));
  },
  getTarget(defaultValue=9){const value=Number(localStorage.getItem(TARGET_KEY));return Number.isFinite(value)&&value>=0&&value<=10?value:defaultValue;},
  saveTarget(target:number){localStorage.setItem(TARGET_KEY,String(target));},
};
