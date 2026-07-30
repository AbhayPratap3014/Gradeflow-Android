import { AlertCircle, Cloud, LoaderCircle, RefreshCw } from 'lucide-react';

export function SyncStatus({loading,syncing,error,onRetry}:{loading:boolean;syncing:boolean;error:string|null;onRetry:()=>void}){
  if(loading||syncing)return <div className="syncStatus"><LoaderCircle className="spin"/><span>Syncing Gradeflow…</span></div>;
  if(error)return <div className="syncStatus syncError"><AlertCircle/><div><b>Cloud sync failed</b><span>Showing cached data.</span></div><button onClick={onRetry}><RefreshCw/> Retry</button></div>;
  return <div className="syncStatus syncOk"><Cloud/><span>Synced with Gradeflow</span></div>;
}
