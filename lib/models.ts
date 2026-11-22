export const NICE_WEIGHTS = [88761,71755,56483,46273,36291,29154,23254,18705,14949,11916,9548,7620,6100,4904,3906,3121,2501,1991,1586,1277,1024,820,655,526,423,335,272,215,172,137,110,87,70,56,45,36,29,23,18,15] as const;
export function weight(n: number) { if (!Number.isInteger(n) || n < -20 || n > 19) throw new RangeError('Nice must be an integer from -20 to 19'); return NICE_WEIGHTS[n+20]; }
export function shares(nices: number[]) { const weights=nices.map(weight); const total=weights.reduce((a,b)=>a+b,0); return weights.map(w=>({weight:w, percent:100*w/total})); }
export interface ForkNode {id:number; parent:number|null; born:number;}
export interface ForkPosition extends ForkNode {x:number; y:number; depth:number; childIndex:number; siblingCount:number;}
export interface ForkTreeLayout {nodes:ForkPosition[]; width:number; height:number; leafCount:number; maxDepth:number;}

/**
 * Build the process genealogy for an unconditional fork() inside a loop.
 * Every process that exists at the start of a round forks once. `born` is
 * the loop round in which a process was created; `parent` is its one true
 * creator. This yields P0 -> P1, then P0 -> P2 and P1 -> P3, etc.
 */
export function forkTree(iterations:number): ForkNode[] {
  if(!Number.isInteger(iterations)||iterations<0||iterations>6) throw new RangeError('0–6 iterations only');
  const nodes:ForkNode[]=[{id:0,parent:null,born:0}];
  for(let round=1;round<=iterations;round++) {
    const existing=[...nodes];
    for(const p of existing) nodes.push({id:nodes.length,parent:p.id,born:round});
  }
  return nodes;
}

/**
 * Lay out the actual parent/child tree (not creation-round rows).
 * Leaves receive consecutive x positions; each parent is centered over its
 * own first and last child. This keeps every parent-child edge independent
 * and prevents the shared horizontal "bus" that made branches look merged.
 */
export function layoutForkTree(
  nodes:ForkNode[],
  horizontalGap=154,
  verticalGap=104,
  minWidth=1050,
):ForkTreeLayout {
  if(nodes.length===0) return {nodes:[],width:minWidth,height:180,leafCount:0,maxDepth:0};
  const children=new Map<number,ForkNode[]>();
  for(const node of nodes) children.set(node.id,[]);
  for(const node of nodes) if(node.parent!==null) children.get(node.parent)?.push(node);
  for(const list of children.values()) list.sort((a,b)=>a.id-b.id);

  const xById=new Map<number,number>();
  const depthById=new Map<number,number>();
  let leafCursor=0;
  let maxDepth=0;
  const leafStart=58;
  const place=(id:number,depth:number):number=>{
    depthById.set(id,depth);
    maxDepth=Math.max(maxDepth,depth);
    const descendants=children.get(id)??[];
    if(descendants.length===0){
      const x=leafStart+leafCursor*horizontalGap;
      leafCursor++;
      xById.set(id,x);
      return x;
    }
    const childXs=descendants.map(child=>place(child.id,depth+1));
    const x=(childXs[0]+childXs[childXs.length-1])/2;
    xById.set(id,x);
    return x;
  };
  const root=nodes.find(node=>node.parent===null)??nodes[0];
  place(root.id,0);

  const nodeWidth=56;
  const rawWidth=leafStart*2+Math.max(0,leafCursor-1)*horizontalGap+nodeWidth;
  const width=Math.max(minWidth,rawWidth);
  const offset=(width-rawWidth)/2;
  const top=58;
  const nodeHeight=42;
  const height=top+maxDepth*verticalGap+nodeHeight/2+42;
  const positions=nodes.map(node=>{
    const siblings=node.parent===null?[]:(children.get(node.parent)??[]);
    return {
      ...node,
      x:(xById.get(node.id)??width/2)+offset,
      y:top+(depthById.get(node.id)??0)*verticalGap,
      depth:depthById.get(node.id)??0,
      childIndex:node.parent===null?0:siblings.findIndex(sibling=>sibling.id===node.id),
      siblingCount:siblings.length,
    };
  });
  return {nodes:positions,width,height,leafCount:leafCursor,maxDepth};
}
export type SchedEvent='tick'|'block'|'wake';
export interface Scheduler {running:string|null; ready:string[]; sleeping:string[]; history:string[]; message:string;}
export function initialScheduler():Scheduler {return {running:'A',ready:['B','C'],sleeping:['D'],history:['A'],message:'A is executing. B and C are ready; D is waiting for input.'};}
export function advanceScheduler(s:Scheduler,event:SchedEvent):Scheduler {let running=s.running,ready=[...s.ready],sleeping=[...s.sleeping],message=''; const next=()=>ready.shift()??null;
 if(event==='tick'){if(running)ready.push(running); const old=running; running=next(); message=old===running?'No other runnable task: the same task continues.':`Timer / reschedule: ${old??'idle'} → ${running??'idle'}. Illustrative rotation.`;}
 if(event==='block'){if(!running)message='CPU is idle; no executing task to block.'; else {const old=running;sleeping.push(old);running=next();message=`${old} blocks voluntarily. ${running??'Idle'} receives the CPU.`;}}
 if(event==='wake'){const w=sleeping.shift();if(!w)message='No sleeping task to wake.';else{if(running)ready.push(running);running=w;message=`${w} wakes and is selected in this illustrative preemption scenario. Actual Linux may defer preemption.`;}}
 return {running,ready,sleeping,history:[...s.history,running??'idle'].slice(-12),message};}
export type EevdfTask={id:string;lag:number;deadline:number};
export function chooseEligible(tasks:EevdfTask[]){return tasks.filter(t=>t.lag>=0).sort((a,b)=>a.deadline-b.deadline||a.id.localeCompare(b.id))[0]??null;}
