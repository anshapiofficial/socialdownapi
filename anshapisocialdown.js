export default {
  async fetch(request) {

    const url = new URL(request.url);

    const json = (obj, code=200)=> new Response(JSON.stringify(obj, null,2),{
      status: code,
      headers:{
        "Access-Control-Allow-Origin":"*",
        "Content-Type":"application/json"
      }
    });

    async function processUrl(videoUrl){

      try {
        let search = await fetch("https://www.videofk.com/search?url="+encodeURIComponent(videoUrl),{
          headers:{ "user-agent":"Mozilla/5.0" }
        });

        let html = await search.text();

        let title = "media_download";
        let t = html.match(/<title>(.*?)<\/title>/i);
        if(t) title = t[1].replace(/[\n\r]/g,"").trim();
        title = title.replace(/[\\\/:*?"<>|]/g,"");

        // 🔥 Extract encrypted links like #url=XXXXX
        const encrypted_links = [...html.matchAll(/href="([^"]*#url=([^"]+))"/g)]
          .map(m=>({ encrypted:m[2], text:m[1].toLowerCase() }));

        if(encrypted_links.length===0)
          return {error:"Download links not found"};

        let media_items=[];
        let best_video={size:0,url:null,quality:"unknown"};
        let best_audio={url:null,bitrate:"unknown"};
        let no_watermark=null;

        for(let item of encrypted_links){

          let dec = await fetch("https://downloader.twdown.online/load_url?url="+item.encrypted,{
            headers:{ "user-agent":"Mozilla/5.0" }
          });

          let final = (await dec.text()).trim();
          if(!final.startsWith("http")) continue;

          let is_audio = /mp3|m4a|aac|kbps|audio/.test(item.text);
          let quality = (item.text.match(/(\d+p|\d+kbps)/)||["unknown"])[0];

          if(is_audio){
            if(!best_audio.url) best_audio={url:final,bitrate:quality,title};
            media_items.push({type:"audio",url:final,quality});
            continue;
          }

          let size=0;
          try{
            let head= await fetch(final,{method:"HEAD"});
            size=parseInt(head.headers.get("content-length")||"0");
          }catch{}

          if(/no watermark|without water/i.test(item.text)){
            no_watermark={url:final,size,quality,title};
          }

          if(size>best_video.size)
            best_video={url:final,size,quality,title};

          media_items.push({type:"video",url:final,quality,size});
        }

        let out={
          success:true,
          title,
          original_url:videoUrl,
          formats:media_items.length,
          media:media_items,
          credit: {
            name: "Ansh API",
            developer: "t.me/anshapi",
            website: "https://t.me/anshapi"
          }
        };

        if(no_watermark) out.video_no_watermark=no_watermark
        else if(best_video.url) out.video_best=best_video;

        if(best_audio.url) out.audio_best=best_audio;

        return out;

      }catch(err){
        return {error:"unexpected: "+err}
      }
    }

    // ROUTES ===========================

    if(url.pathname==="/download"){
      const link=url.searchParams.get("url");
      if(!link) return json({error:"url missing"},400);
      return json(await processUrl(link));
    }
    
    if(url.pathname==="/info"){
      const link=url.searchParams.get("url");
      if(!link) return json({error:"url missing"},400);
      const r=await processUrl(link);

      if(r.error) return json(r,400);

      return json({
        success:true,
        title:r.title,
        formats:r.formats,
        has_video:!!r.video_best || !!r.video_no_watermark,
        has_audio:!!r.audio_best,
        qualities:[...new Set(r.media.map(v=>v.quality))],
        credit: {
          name: "Ansh API",
          developer: "t.me/anshapi",
          website: "https://t.me/anshapi"
        }
      });
    }

    if(url.pathname.startsWith("/direct/")){
      const encrypted=url.searchParams.get("url");
      if(!encrypted) return json({error:"encrypted url missing"},400);

      let a=await fetch("https://downloader.twdown.online/load_url?url="+encrypted,{
        headers:{ "user-agent":"Mozilla/5.0" }
      });

      let res=(await a.text()).trim();
      if(!res.startsWith("http")) return json({error:"decrypt failed"},400);

      return json({
        success:true,
        direct_url:res,
        credit: {
          name: "Ansh API",
          developer: "t.me/anshapi",
          website: "https://t.me/anshapi"
        }
      });
    }

    if(url.pathname==="/"){
      return json({
        name: "Video Downloader API",
        developer: "Ansh API",
        credit: "t.me/anshapi",
        endpoints: {
          "/download?url=": "Full result + direct download links",
          "/info?url=": "Only video/audio information",
          "/direct/{type}?url=": "Decrypt encrypted URL"
        },
        version: "1.0.0",
        contact: "https://t.me/anshapi"
      });
    }

    return json({error:"Not found"},404);
  }
}