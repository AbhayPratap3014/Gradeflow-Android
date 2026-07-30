import type { Mark } from '../types/academic';
import { cloud } from './cloud';

const MARKS_KEY='gradeflow.marks.v2',STATE_KEY='gradeflow.app-state.v1';
export type WebCourse={code:string;name:string;cr:number;grade:number};
export type GradeflowState={target:number;s3:WebCourse[];sim1:WebCourse[];sim2:WebCourse[];month:number};
const cacheMarks=(v:Mark[])=>localStorage.setItem(MARKS_KEY,JSON.stringify(v));
const cacheState=(v:GradeflowState)=>localStorage.setItem(STATE_KEY,JSON.stringify(v));
const fromCloud=(x:any):Mark=>({id:String(x.id),semester:Number(x.sem),subjectCode:String(x.sub),assessment:String(x.type),score:Number(x.score),max:Number(x.max),createdAt:String(x.created_at||new Date().toISOString())});
const fallback:GradeflowState={target:8.5,s3:[],sim1:[],sim2:[],month:6};
export const academicRepository={
 getCachedMarks():Mark[]{try{return JSON.parse(localStorage.getItem(MARKS_KEY)||'[]')}catch{return[]}},
 getCachedState():GradeflowState{try{return{...fallback,...JSON.parse(localStorage.getItem(STATE_KEY)||'{}')}}catch{return fallback}},
 async getState():Promise<GradeflowState>{if(!cloud)return this.getCachedState();const{data,error}=await cloud.from('app_state').select('state').eq('id','main').maybeSingle();if(error)throw error;const state={...fallback,...(data?.state||{})} as GradeflowState;cacheState(state);return state},
 async saveState(next:GradeflowState){cacheState(next);if(!cloud)return;const{error}=await cloud.from('app_state').upsert({id:'main',state:next,updated_at:new Date().toISOString()},{onConflict:'id'});if(error)throw error},
 async getMarks():Promise<Mark[]>{if(!cloud)return this.getCachedMarks();const{data,error}=await cloud.from('marks').select('*').order('created_at',{ascending:false});if(error)throw error;const marks=(data||[]).map(fromCloud);cacheMarks(marks);return marks},
 async addMark(mark:Omit<Mark,'id'|'createdAt'>):Promise<Mark>{if(!cloud)throw new Error('Gradeflow cloud is not configured');const{data,error}=await cloud.from('marks').insert({sem:mark.semester,sub:mark.subjectCode,type:mark.assessment,score:mark.score,max:mark.max,date:new Date().toLocaleDateString('en-IN'),created_at:new Date().toISOString()}).select().single();if(error)throw error;const created=fromCloud(data);cacheMarks([created,...this.getCachedMarks().filter(m=>m.id!==created.id)]);return created},
 async updateMark(id:string,patch:Partial<Mark>):Promise<Mark>{if(!cloud)throw new Error('Gradeflow cloud is not configured');const p:any={};if(patch.semester!=null)p.sem=patch.semester;if(patch.subjectCode!=null)p.sub=patch.subjectCode;if(patch.assessment!=null)p.type=patch.assessment;if(patch.score!=null)p.score=patch.score;if(patch.max!=null)p.max=patch.max;const{data,error}=await cloud.from('marks').update(p).eq('id',id).select().single();if(error)throw error;const updated=fromCloud(data);cacheMarks(this.getCachedMarks().map(m=>m.id===id?updated:m));return updated},
 async deleteMark(id:string){if(!cloud)throw new Error('Gradeflow cloud is not configured');const{error}=await cloud.from('marks').delete().eq('id',id);if(error)throw error;cacheMarks(this.getCachedMarks().filter(m=>m.id!==id))}
};
