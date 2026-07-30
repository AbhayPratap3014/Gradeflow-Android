import { useCallback, useEffect, useState } from 'react';
import { progressRepository, type SemesterSnapshot } from '../services/progressRepository';

export function useProgressState(){
 const[snapshots,setSnapshots]=useState<SemesterSnapshot[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState<string|null>(null);
 const refresh=useCallback(async()=>{setLoading(true);setError(null);try{setSnapshots(await progressRepository.getSnapshots())}catch(e){setError(e instanceof Error?e.message:'Could not load prediction history')}finally{setLoading(false)}},[]);
 useEffect(()=>{void refresh()},[refresh]);
 const save=async(v:{semester:number;predictedSgpa:number;actualSgpa?:number|null})=>{const row=await progressRepository.saveSnapshot(v);setSnapshots(p=>[row,...p.filter(x=>x.semester!==row.semester)].sort((a,b)=>b.semester-a.semester));return row};
 const remove=async(id:string)=>{await progressRepository.deleteSnapshot(id);setSnapshots(p=>p.filter(x=>x.id!==id))};
 return{snapshots,loading,error,refresh,save,remove};
}
