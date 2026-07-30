import {useCallback,useEffect,useState} from 'react';
import {progressRepository,type SemesterSnapshot} from '../services/progressRepository';

export function useProgressState(){
 const[snapshots,setSnapshots]=useState<SemesterSnapshot[]>([]),[loading,setLoading]=useState(true),[syncing,setSyncing]=useState(false),[error,setError]=useState<string|null>(null);
 const refresh=useCallback(async(quiet=false)=>{if(!quiet)setLoading(true);else setSyncing(true);setError(null);try{setSnapshots(await progressRepository.getSnapshots())}catch(e){setError(e instanceof Error?e.message:'Could not load prediction history')}finally{setLoading(false);setSyncing(false)}},[]);
 useEffect(()=>{void refresh()},[refresh]);
 useEffect(()=>{const visible=()=>{if(document.visibilityState==='visible')void refresh(true)};const focus=()=>void refresh(true);document.addEventListener('visibilitychange',visible);window.addEventListener('focus',focus);const timer=window.setInterval(()=>{if(document.visibilityState==='visible')void refresh(true)},30000);return()=>{document.removeEventListener('visibilitychange',visible);window.removeEventListener('focus',focus);window.clearInterval(timer)}},[refresh]);
 const save=async(v:{semester:number;predictedSgpa:number;actualSgpa?:number|null})=>{setError(null);try{const row=await progressRepository.saveSnapshot(v);setSnapshots(p=>[row,...p.filter(x=>x.semester!==row.semester)].sort((a,b)=>b.semester-a.semester));return row}catch(e){setError(e instanceof Error?e.message:'Could not save prediction');throw e}};
 const remove=async(id:string)=>{const previous=snapshots;setSnapshots(p=>p.filter(x=>x.id!==id));setError(null);try{await progressRepository.deleteSnapshot(id)}catch(e){setSnapshots(previous);setError(e instanceof Error?e.message:'Could not delete prediction');throw e}};
 return{snapshots,loading,syncing,error,refresh,save,remove};
}