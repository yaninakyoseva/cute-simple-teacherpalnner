import { createFileRoute } from '@tanstack/react-router';
import Planner from '@/components/planner/Planner';
export const Route = createFileRoute('/schedule')({head:()=>({meta:[{title:'My schedule — Petal'},{name:'description',content:'Plan your teaching week and mark your lessons complete with Petal.'},{property:'og:title',content:'My schedule — Petal'},{property:'og:description',content:'Your lessons, students, and teaching week in one peaceful place.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:()=> <Planner view="schedule"/>});
