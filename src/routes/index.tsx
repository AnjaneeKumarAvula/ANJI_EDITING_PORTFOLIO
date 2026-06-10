import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useState } from "react";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Avula Anjanee Kumar — Creative Video & Photo Editor" },
      { name: "description", content: "Cinematic portfolio of Avula Anjanee Kumar — Creative Video Editor & Photo Editor. Transforming ideas into visual stories." },
      { property: "og:title", content: "Avula Anjanee Kumar — Creative Video & Photo Editor" },
      { property: "og:description", content: "Transforming ideas into visual stories." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@500;700;800&display=swap" },
      { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" },
    ],
    scripts: [
      { src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js", defer: true },
      { src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js", defer: true },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  useEffect(() => {
    // ---------- Theme ----------
    const saved = localStorage.getItem("theme");
    if (saved === "light") document.documentElement.classList.add("light");
    const themeBtn = document.getElementById("themeBtn");
    themeBtn?.addEventListener("click", () => {
      document.documentElement.classList.toggle("light");
      const isLight = document.documentElement.classList.contains("light");
      localStorage.setItem("theme", isLight ? "light" : "dark");
      const i = themeBtn.querySelector("i");
      if (i) i.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
    });
    const isLight0 = document.documentElement.classList.contains("light");
    const ti = themeBtn?.querySelector("i");
    if (ti) ti.className = isLight0 ? "fa-solid fa-moon" : "fa-solid fa-sun";

    // ---------- Custom Cursor ----------
    const dot = document.querySelector<HTMLDivElement>(".cursor-dot");
    const ring = document.querySelector<HTMLDivElement>(".cursor-ring");
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dot) { dot.style.left = mx + "px"; dot.style.top = my + "px"; }
      document.documentElement.style.setProperty("--mx", mx + "px");
      document.documentElement.style.setProperty("--my", my + "px");
    };
    window.addEventListener("mousemove", onMove);
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
      requestAnimationFrame(tick);
    };
    tick();
    document.querySelectorAll("a, button, .vcard, .ph, .svc, .soc").forEach(el => {
      el.addEventListener("mouseenter", () => ring?.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring?.classList.remove("hover"));
    });

    // ---------- Particle Canvas ----------
    const canvas = document.getElementById("bg-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    type P = { x:number; y:number; vx:number; vy:number; r:number; depth:number; hue:number; life?:number; baseLife?:number };
    const particles: P[] = [];
    const COUNT = Math.min(140, Math.floor((W*H)/14000));
    for (let i=0;i<COUNT;i++){
      particles.push({
        x: Math.random()*W, y: Math.random()*H,
        vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
        r: Math.random()*1.8+.4, depth: Math.random()*1+.2,
        hue: 220 + Math.random()*100
      });
    }
    const orbs = Array.from({length:6},()=>({
      x: Math.random()*W, y: Math.random()*H,
      r: 80+Math.random()*140,
      vx:(Math.random()-.5)*.15, vy:(Math.random()-.5)*.15,
      hue: 220 + Math.random()*100
    }));
    const bursts: P[] = [];

    canvas.style.pointerEvents = "auto";
    canvas.addEventListener("click", (e) => {
      for (let i=0;i<40;i++){
        const a = (i/40)*Math.PI*2;
        bursts.push({
          x:e.clientX, y:e.clientY,
          vx:Math.cos(a)*(2+Math.random()*3),
          vy:Math.sin(a)*(2+Math.random()*3),
          r:1.5+Math.random()*1.5, depth:1,
          hue:200+Math.random()*120,
          life:60, baseLife:60
        });
      }
    });
    canvas.style.pointerEvents = "none";
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.closest("a,button,.vcard,.ph,.svc,.soc,input,textarea,.theme-btn,.to-top")) return;
      for (let i=0;i<40;i++){
        const a = (i/40)*Math.PI*2;
        bursts.push({
          x:e.clientX, y:e.clientY,
          vx:Math.cos(a)*(2+Math.random()*3),
          vy:Math.sin(a)*(2+Math.random()*3),
          r:1.5+Math.random()*1.5, depth:1,
          hue:200+Math.random()*120,
          life:60, baseLife:60
        });
      }
    });

    let raf = 0;
    const draw = () => {
      const isLight = document.documentElement.classList.contains("light");
      ctx.clearRect(0,0,W,H);

      // orbs
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.x<-o.r) o.x = W+o.r; if (o.x>W+o.r) o.x = -o.r;
        if (o.y<-o.r) o.y = H+o.r; if (o.y>H+o.r) o.y = -o.r;
        const g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r);
        g.addColorStop(0,`hsla(${o.hue},90%,60%,${isLight?0.10:0.18})`);
        g.addColorStop(1,`hsla(${o.hue},90%,60%,0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(o.x,o.y,o.r,0,Math.PI*2); ctx.fill();
      });

      // particles
      for (let i=0;i<particles.length;i++){
        const p = particles[i];
        const dx = mx - p.x, dy = my - p.y;
        const d = Math.hypot(dx,dy);
        if (d < 220){
          const f = (1-d/220)*0.08*p.depth;
          p.vx += (dx/d)*f; p.vy += (dy/d)*f;
        }
        p.vx *= .96; p.vy *= .96;
        p.x += p.vx + (Math.random()-.5)*.05;
        p.y += p.vy + (Math.random()-.5)*.05;
        if (p.x<0) p.x=W; if (p.x>W) p.x=0;
        if (p.y<0) p.y=H; if (p.y>H) p.y=0;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue},90%,${isLight?50:65}%,${isLight?0.55:0.85})`;
        ctx.shadowBlur = 12; ctx.shadowColor = `hsla(${p.hue},90%,60%,.8)`;
        ctx.arc(p.x,p.y,p.r*p.depth,0,Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // connections
      ctx.lineWidth = 1;
      for (let i=0;i<particles.length;i++){
        for (let j=i+1;j<particles.length;j++){
          const a=particles[i], b=particles[j];
          const dx=a.x-b.x, dy=a.y-b.y;
          const d=Math.hypot(dx,dy);
          if (d<110){
            const alpha = (1-d/110)*(isLight?0.18:0.28);
            ctx.strokeStyle = `hsla(${(a.hue+b.hue)/2},90%,65%,${alpha})`;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
        // line to cursor
        const dx = a_to_mouse(particles[i].x, mx), dy = a_to_mouse(particles[i].y, my);
        const dm = Math.hypot(dx,dy);
        if (dm<160){
          ctx.strokeStyle = `hsla(${particles[i].hue},90%,70%,${(1-dm/160)*0.35})`;
          ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(mx,my); ctx.stroke();
        }
      }
      // bursts
      for (let i=bursts.length-1;i>=0;i--){
        const b = bursts[i];
        b.x += b.vx; b.y += b.vy; b.vx*=.96; b.vy*=.96;
        b.life! -= 1;
        const alpha = (b.life!/b.baseLife!);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${b.hue},95%,65%,${alpha})`;
        ctx.shadowBlur=14; ctx.shadowColor=`hsla(${b.hue},95%,60%,1)`;
        ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
        if (b.life! <= 0) bursts.splice(i,1);
      }
      raf = requestAnimationFrame(draw);
    };
    const a_to_mouse = (a:number,b:number)=>a-b;
    draw();
    // ---------- Loader ----------
    const loader = document.querySelector<HTMLDivElement>(".loader");
    const bar = document.querySelector<HTMLElement>(".loader .bar i");
    let prog = 0;
    const intv = setInterval(()=>{
      prog = Math.min(100, prog + 8 + Math.random()*12);
      if (bar) bar.style.width = prog + "%";
      if (prog>=100){
        clearInterval(intv);
        setTimeout(()=>{
          loader?.classList.add("hide");
          startHero();
        }, 200);
      }
    }, 100);
    // ---------- GSAP Hero ----------
    const startHero = () => {
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;
      if (!gsap) return;
      gsap.from(".hero h1 .line span", { y:"110%", duration:1.2, stagger:.1, ease:"power4.out", delay:.1 });
      gsap.from(".hero .sub", { y:30, opacity:0, duration:1, delay:.6, ease:"power3.out" });
      gsap.from(".hero .role", { y:30, opacity:0, duration:1, delay:.7, ease:"power3.out" });
      gsap.from(".cta-row .btn", { y:30, opacity:0, duration:.9, stagger:.12, delay:.8, ease:"power3.out" });
      gsap.from(".nav", { y:-30, opacity:0, duration:1, ease:"power3.out" });
      gsap.to(".blob.b1", { x:60, y:40, duration:8, yoyo:true, repeat:-1, ease:"sine.inOut" });
      gsap.to(".blob.b2", { x:-40, y:-50, duration:9, yoyo:true, repeat:-1, ease:"sine.inOut" });
      gsap.to(".blob.b3", { x:80, y:-30, duration:7, yoyo:true, repeat:-1, ease:"sine.inOut" });
      if (ScrollTrigger){
        gsap.registerPlugin(ScrollTrigger);
        document.querySelectorAll(".reveal").forEach(el=>{
          gsap.fromTo(el,{y:60,opacity:0},{y:0,opacity:1,duration:1.1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 85%"}});
        });
        // counters
        document.querySelectorAll<HTMLElement>(".num[data-to]").forEach(el=>{
          const to = +el.dataset.to!;
          const obj = {v:0};
          gsap.to(obj,{v:to,duration:2,ease:"power2.out",scrollTrigger:{trigger:el,start:"top 85%"},onUpdate:()=>{ el.textContent = Math.round(obj.v) + (el.dataset.suf||""); }});
        });
      }
    };
    // fallback reveal via IO
    const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("in"); }),{threshold:.15});
    document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
    // ---------- 3D card tilt ----------
    document.querySelectorAll<HTMLElement>(".vcard, .glass.about-card, .glass.stat").forEach(card=>{
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left)/r.width - .5;
        const py = (e.clientY - r.top)/r.height - .5;
        card.style.transform = `perspective(1000px) rotateY(${px*8}deg) rotateX(${-py*8}deg) translateZ(0)`;
      });
      card.addEventListener("mouseleave", ()=>{ card.style.transform = ""; });
    });
    // ---------- Magnetic buttons ----------
    document.querySelectorAll<HTMLElement>(".btn, .soc, .theme-btn, .to-top").forEach(el=>{
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width/2);
        const y = e.clientY - (r.top + r.height/2);
        el.style.transform = `translate(${x*.25}px, ${y*.35}px)`;
      });
      el.addEventListener("mouseleave", ()=>{ el.style.transform = ""; });
    });
    // ---------- Before / After ----------
    const ba = document.querySelector<HTMLDivElement>(".ba");
    if (ba){
      const after = ba.querySelector<HTMLDivElement>(".after")!;
      const handle = ba.querySelector<HTMLDivElement>(".handle")!;
      let dragging = false;
      const set = (clientX:number) => {
        const r = ba.getBoundingClientRect();
        let pct = ((clientX - r.left)/r.width)*100;
        pct = Math.max(0,Math.min(100,pct));
        after.style.clipPath = `inset(0 0 0 ${pct}%)`;
        handle.style.left = pct + "%";
      };
      ba.addEventListener("mousedown", e=>{dragging=true; set(e.clientX);});
      window.addEventListener("mousemove", e=>{ if(dragging) set(e.clientX); });
      window.addEventListener("mouseup", ()=>dragging=false);
      ba.addEventListener("touchstart", e=>set(e.touches[0].clientX));
      ba.addEventListener("touchmove", e=>set(e.touches[0].clientX));
    }
    // ---------- Scroll progress + to top ----------
    const prgEl = document.querySelector<HTMLDivElement>(".progress");
    const top = document.querySelector<HTMLButtonElement>(".to-top");
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop/(h.scrollHeight - h.clientHeight))*100;
      if (prgEl) prgEl.style.width = pct + "%";
      if (top) top.classList.toggle("show", h.scrollTop > 600);
    };
    window.addEventListener("scroll", onScroll);
    top?.addEventListener("click", ()=>window.scrollTo({top:0,behavior:"smooth"}));
    // Smooth anchor
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(a=>{
      a.addEventListener("click",(e)=>{
        const id = a.getAttribute("href")!;
        if (id.length<2) return;
        const t = document.querySelector(id);
        if (t){ e.preventDefault(); t.scrollIntoView({behavior:"smooth"}); }
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  const videos = [
    { cat:"Duel-Role", title:"Cinematic", span:"span8", video:"/Videos/Varun.mp4", mute:true },
    { cat:"Cricket",title:"Urban Pulse",span:"span4",video:"/Videos/Dhoni.mp4" },
    { cat:"Beat Cut", title:"Velocity — Product Launch", span:"span4",  video:"/Videos/bahubali.mp4" },
    { cat:"Lyrics", title:"Aurora Campaign", span:"span4",  video:"/Videos/love.mp4" },
    { cat:"Attitude", title:"Cinematic Travel Cut", span:"span4",  video:"/Videos/hardhik.mp4" },
    { cat:"Team", title:"Lumen — Tech Teaser", span:"span6", video:"/Videos/mumbai.mp4" },
    { cat:"Elevation", title:"Studio Sessions", span:"span6",  video:"/Videos/salaar.mp4" },
  ];
  const photos = [
    { tag:"Portrait", img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80" },
    { tag:"Color Grade", img:"https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=900&q=80" },
    { tag:"Manipulation", img:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&q=80" },
    { tag:"Social", img:"https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=80" },
    { tag:"Portrait", img:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80" },
    { tag:"Color Grade", img:"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=80" },
    { tag:"Manipulation", img:"https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?w=900&q=80" },
    { tag:"Social", img:"https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?w=900&q=80" },
    { tag:"Portrait", img:"https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=900&q=80" },
  ];
  const services = [
    { n:"01", icon:"fa-solid fa-film", title:"Video Editing", desc:"Cinematic cuts, color grading, motion graphics & sound design for reels, shorts and brand films." },
    { n:"02", icon:"fa-solid fa-camera-retro", title:"Photo Editing", desc:"High-end retouching, mood-driven color, creative composites and lifestyle imagery." },
    { n:"03", icon:"fa-solid fa-wand-magic-sparkles", title:"Content Enhancement", desc:"Restore, upscale and elevate footage and photos into scroll-stopping premium content." },
    { n:"04", icon:"fa-solid fa-grip", title:"Social Visuals", desc:"Reels, carousels, thumbnails & ad creatives engineered for engagement and brand recall." },
  ];
  return (
    <>
      <div className="loader">
        <div style={{textAlign:"center"}}>
          <div className="mark">AVULA · ANJANEE · KUMAR</div>
          <div className="bar"><i /></div>
        </div>
      </div>
      <div className="cursor-dot" />
      <div className="cursor-ring" />
      <canvas id="bg-canvas" />
      <div className="spotlight" />
      <div className="progress" />
      <nav className="nav">
        <div className="logo"><span>.</span></div>
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#work">Video Works</a></li>
          <li><a href="#photo">Photo Works</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button className="theme-btn" id="themeBtn" aria-label="Toggle theme"><i className="fa-solid fa-sun" /></button>
      </nav>
      <main>
        <section className="hero">
          <div className="hero-floats">
            <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
          </div>
          <div className="container">
            <h1>
              <span className="line"><span>AVULA</span></span>
            <span className="line"><span className="grad">ANJANEE</span></span>
              <span className="line"><span>KUMAR.</span></span>
            </h1>
            <div className="role">Creative <b>Video Editor</b> &nbsp;·&nbsp; <b>Photo Editor</b></div>
            <p className="sub">Transforming ideas into visual stories — cinematic edits, mood-rich color, and design that moves.</p>
            <div className="cta-row">
              <a className="btn primary" href="#work">View Portfolio <i className="fa-solid fa-arrow-right" /></a>
              <a className="btn" href="https://t.me/anjiyadav5301" target="_blank" rel="noopener noreferrer">Contact Me <i className="fa-regular fa-paper-plane" /></a>
            </div>
          </div>
          <div className="scroll-cue">SCROLL<div className="bar" /></div>
        </section>
        <section id="about">
          <div className="container">
            <div className="sec-head reveal">
              <div>
                <span className="label">About</span>
                <h2>A storyteller behind the timeline & the lens.</h2>
              </div>
              <p>Crafting visuals that don't just look good — they feel inevitable. Every frame, every cut, every grade.</p>
            </div>
            <div className="about-grid">
              <div className="glass about-card reveal">
                <h3>Hi, I'm Anjanee Kumar.</h3>
                <p>I'm a creative video & photo editor obsessed with rhythm, light and emotion. I work with creators, founders and brands to turn raw footage and images into stories people remember.</p>
                <p>From punchy social reels to cinematic brand films and mood-rich portrait retouching — every project gets the same craft.</p>
                <div style={{marginTop:28, display:"flex", gap:12, flexWrap:"wrap"}}>
                  {["Premiere Pro","Picsart","CapCut","Photoshop","Lightroom","Inshot","Aligh Motion","Hypic"].map(t=>(
                    <span key={t} style={{padding:"8px 14px",borderRadius:999,background:"var(--card)",border:"1px solid var(--border)",fontSize:12,letterSpacing:".15em",textTransform:"uppercase",color:"var(--muted)"}}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="stats">
                {[
                  {n:30,s:"+",l:"Projects"},
                  {n:20,s:"+",l:"Happy Clients"},
                  {n:2,s:"+",l:"Years"},
                  {n:5,s:"M+",l:"Views"},
                ].map((s,i)=>(
                  <div className="glass stat reveal" key={i}>
                    <div className="num" data-to={s.n} data-suf={s.s}>0{s.s}</div>
                    <div className="lbl">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section id="work">
          <div className="container">
            <div className="sec-head reveal">
              <div>
                <span className="label">Video Editing</span>
                <h2>Selected motion work.</h2>
              </div>
              <p>
                Reels, shorts, promos and social cuts — built to stop the scroll and earn the watch.
              </p>
            </div>

            <div className="video-grid">
  {videos.map((v, i) => (
    <div
  key={i}
  className={`vcard ${v.span} reveal`}
  onClick={(e) => {
  const video = e.currentTarget.querySelector("video") as HTMLVideoElement;

  if (!video) return;

  if (playingVideo === i) {
    video.pause();
    setPlayingVideo(null);
  } else {
    video.currentTime = 0;
    video.muted = !!v.mute;
    video.play();
    setPlayingVideo(i);
  }
}}
>
                  <video
  className="thumb"
  src={v.video}
  playsInline
  muted={v.mute || playingVideo !== i}
  preload="metadata"
  onEnded={(e) => {
  e.currentTarget.currentTime = 0;
  setPlayingVideo(null);
}}
  onClick={(e) => {
    e.stopPropagation();
    setSelectedVideo(v.video);
  }}
/>
                  <div className="overlay">
                    <div className="cat">{v.cat}</div>
                    <div className="title">{v.title}</div>
                  </div>

                  <div
  className="play"
  onClick={(e) => {
  e.stopPropagation();
  setSelectedVideo(v.video);
}}
>
  <i
  className={`fa-solid ${
    playingVideo === i ? "fa-pause" : "fa-play"
  }`}
/>
</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="photo">
          <div className="container">
            <div className="sec-head reveal">
              <div>
                <span className="label">Photo Editing</span>
                <h2>Retouching, color & creative composites.</h2>
              </div>
              <p>Drag the slider to compare before / after. Below, a curated gallery of recent edits.</p>
            </div>

            <div className="ba glass reveal">
              <div className="layer" style={{backgroundImage:"url(https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1600&q=80&sat=-100&con=-20)"}} />
              <div className="layer after" style={{backgroundImage:"url(https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1600&q=80)"}} />
              <div className="handle" />
              <div className="lbl b">Before</div>
              <div className="lbl a">After</div>
            </div>

            <div className="masonry reveal" style={{marginTop:60}}>
              {photos.map((p,i)=>(
                <div className="ph" key={i}>
                  <img src={p.img} alt={p.tag} loading="lazy" />
                  <div className="tag">{p.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services">
          <div className="container">
            <div className="sec-head reveal">
              <div>
                <span className="label">Services</span>
                <h2>What I craft.</h2>
              </div>
              <p>Hover the cards — they flip like premium playing cards.</p>
            </div>
            <div className="services">
              {services.map((s,i)=>(
                <div className="svc reveal" key={i}>
                  <div className="svc-inner">
                    <div className="svc-face svc-front">
                      <div className="num">{s.n}</div>
                      <div>
                        <div className="icon"><i className={s.icon} /></div>
                        <h3 style={{marginTop:24}}>{s.title}</h3>
                      </div>
                    </div>
                    <div className="svc-face svc-back">
                      <div className="num" style={{color:"rgba(255,255,255,.7)"}}>{s.n}</div>
                      <div>
                        <h3>{s.title}</h3>
                        <p style={{marginTop:14}}>{s.desc}</p>
                      </div>
                      <div className="arrow"><i className="fa-solid fa-arrow-right" /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="container">
            <div className="glass contact-wrap reveal">
              <h2>Let's create<br/><span className="grad">something cinematic.</span></h2>
              <p>Available for freelance video & photo editing projects, brand collaborations and content partnerships.</p>
              <div className="socials">
                <a className="soc"href="https://mail.google.com/mail/?view=cm&fs=1&to=anjanikumaravula@gmail.com"target="_blank"rel="noopener noreferrer"aria-label="Email"><i className="fa-solid fa-envelope" /></a>
                <a className="soc" href="https://www.linkedin.com/in/anjanee-kumar-avula-0a57a2291/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in" /></a>
                <a className="soc" href="https://www.instagram.com/_.all__in__one_?igsh=MTN0bW1wZWRzOHE0bQ==" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
                <a className="soc" href="https://wa.me/917032345301 " target="_blank" rel="noreferrer" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp" /></a>
              </div>
              <div style={{marginTop:48}}>
                <a className="btn primary"href="https://t.me/anjiyadav5301"target="_blank"rel="noopener noreferrer">Start a Project <i className="fa-solid fa-arrow-right" /></a>
              </div>
            </div>
          </div>
        </section>
        <footer>
          <div>© 2026 Avula Anjanee Kumar</div>
          <div>Crafted with motion & light</div>
        </footer>
        {selectedVideo && (
  <div
    className="video-modal"
    onClick={() => setSelectedVideo(null)}
  >
    <div
      className="video-modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="close-btn"
        onClick={() => setSelectedVideo(null)}
      >
        ✕
      </button>

      <video
        src={selectedVideo}
        controls
        autoPlay
        className="popup-video"
      />
    </div>
  </div>
)}
      </main>

      <button className="to-top" aria-label="Scroll to top"><i className="fa-solid fa-arrow-up" /></button>
    </>
  );
}
