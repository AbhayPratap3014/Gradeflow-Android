import { BookOpen, ChartNoAxesCombined, Home, Plus, UserRound } from 'lucide-react';
export type AppTab = 'home'|'progress'|'semester'|'you';
export function BottomNav({tab,onTab,onAdd}:{tab:AppTab;onTab:(tab:AppTab)=>void;onAdd:()=>void}) {
  const item=(id:AppTab,label:string,icon:React.ReactNode)=><button className={tab===id?'active':''} onClick={()=>onTab(id)}>{icon}<span>{label}</span></button>;
  return <nav className="bottomNav">{item('home','Home',<Home/>)}{item('progress','Progress',<ChartNoAxesCombined/>)}<button className="add" aria-label="Add to Gradeflow" onClick={onAdd}><Plus/></button>{item('semester','Semester',<BookOpen/>)}{item('you','You',<UserRound/>)}</nav>;
}
