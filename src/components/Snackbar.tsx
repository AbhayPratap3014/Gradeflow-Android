import { AnimatePresence, motion } from 'framer-motion';

export function Snackbar({message,action,onAction}:{message:string|null;action?:string;onAction?:()=>void}){
 return <AnimatePresence>{message&&<motion.div className="snackbar" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}}><span>{message}</span>{action&&onAction&&<button onClick={onAction}>{action}</button>}</motion.div>}</AnimatePresence>;
}
