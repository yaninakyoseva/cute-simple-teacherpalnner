import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
export type Student = Database['public']['Tables']['students']['Row'];
export type Lesson = Database['public']['Tables']['lessons']['Row'];
const sampleStudents: Student[] = [
 ['11111111-1111-4111-8111-111111111111','Emma Wilson','Grade 8','Rosewood School','Mathematics','pink'],
 ['22222222-2222-4222-8222-222222222222','Oliver Davis','Grade 6','Maplewood Academy','English','lavender'],
 ['33333333-3333-4333-8333-333333333333','Sofia Martinez','Grade 9','Oakridge School','Biology','sage'],
 ['44444444-4444-4444-8444-444444444444','Liam Thompson','Grade 7','Rosewood School','Mathematics','peach'],
].map(([id,name,grade,school,subject,color])=>({id,name,grade,school,subject,color,owner_id:null,email:'',notes:''}));
function samples(): Lesson[] { const now = new Date(); const base = new Date(now); base.setHours(9,0,0,0); const hours = [9,11,14,16]; return hours.map((hour,i)=>{const date=new Date(base);date.setHours(hour);return {id:`sample-${i}`,owner_id:'sample',student_id:sampleStudents[i].id,subject:sampleStudents[i].subject,topic:['Linear equations & practice','Reading comprehension','Cells & living organisms','Fractions & decimals'][i],starts_at:date.toISOString(),duration:60,completed:i===0};}); }
const Context = createContext<{user:User|null;ready:boolean}>({user:null,ready:false});
export function PlannerProvider({children}:{children:ReactNode}) { const [user,setUser]=useState<User|null>(null);const [ready,setReady]=useState(false);const qc=useQueryClient();useEffect(()=>{supabase.auth.getSession().then(({data})=>{setUser(data.session?.user??null);setReady(true)});const {data}=supabase.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_IN'||event==='SIGNED_OUT'||event==='USER_UPDATED'){setUser(session?.user??null);qc.invalidateQueries({queryKey:['planner']})}});return()=>data.subscription.unsubscribe()},[qc]);return <Context.Provider value={{user,ready}}>{children}</Context.Provider> }
export function usePlanner() { const {user,ready}=useContext(Context);const [demoLessons,setDemoLessons]=useState<Lesson[]>([]);useEffect(()=>setDemoLessons(samples()),[]); const query=useQuery({queryKey:['planner',user?.id],enabled:ready&&!!user,queryFn:async()=>{const [s,l]=await Promise.all([supabase.from('students').select('*').eq('owner_id',user?.id??''),supabase.from('lessons').select('*').order('starts_at')]);if(s.error)throw s.error;if(l.error)throw l.error;return {students:s.data,lessons:l.data}}});const qc=useQueryClient();return {user,ready,students:user?(query.data?.students??[]):sampleStudents,lessons:user?(query.data?.lessons??[]):demoLessons,loading:!!user&&query.isPending,error:query.error,refresh:()=>qc.invalidateQueries({queryKey:['planner']}),toggleDemo:(id:string)=>setDemoLessons(prev=>prev.map(l=>l.id===id?{...l,completed:!l.completed}:l))}; }
