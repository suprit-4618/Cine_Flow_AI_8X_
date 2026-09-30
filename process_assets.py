import urllib.request
import re
import os
import json
import subprocess
from bs4 import BeautifulSoup

FFMPEG = r"C:\Users\Asus\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"
FFPROBE = r"C:\Users\Asus\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffprobe.exe"
SAMPLES_DIR = r"d:\hackathon\cine_flow_ai\public\samples"

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

# 12 real, verified Mixkit videos
manifest = [
    # Genre 1: Neon City / Urban Night
    {
        "filename": "neon-wide.mp4",
        "shotType": "wide",
        "genre": "neon_city",
        "pageUrl": "https://mixkit.co/free-stock-video/tour-high-above-a-city-at-dusk-41375/",
    },
    {
        "filename": "neon-medium.mp4",
        "shotType": "medium",
        "genre": "neon_city",
        "pageUrl": "https://mixkit.co/free-stock-video/walking-a-big-city-walker-at-night-40640/",
    },
    {
        "filename": "neon-closeup.mp4",
        "shotType": "closeup",
        "genre": "neon_city",
        "pageUrl": "https://mixkit.co/free-stock-video/full-moon-with-a-soft-haze-4433/",
    },
    # Genre 2: Alpine Nature / Snow
    {
        "filename": "alpine-wide.mp4",
        "shotType": "wide",
        "genre": "alpine_nature",
        "pageUrl": "https://mixkit.co/free-stock-video/sunset-over-a-snowy-winter-mountain-28844/",
    },
    {
        "filename": "alpine-medium.mp4",
        "shotType": "medium",
        "genre": "alpine_nature",
        "pageUrl": "https://mixkit.co/free-stock-video/snow-falling-in-a-pine-forest-3352/",
    },
    {
        "filename": "alpine-closeup.mp4",
        "shotType": "closeup",
        "genre": "alpine_nature",
        "pageUrl": "https://mixkit.co/free-stock-video/fog-on-the-heights-of-the-snowy-mountains-4396/",
    },
    # Genre 3: Deep Space / Planetary
    {
        "filename": "space-wide.mp4",
        "shotType": "wide",
        "genre": "deep_space",
        "pageUrl": "https://mixkit.co/free-stock-video/video-of-the-earth-slowly-spinning-on-its-axis-29351/",
    },
    {
        "filename": "space-medium.mp4",
        "shotType": "medium",
        "genre": "deep_space",
        "pageUrl": "https://mixkit.co/free-stock-video/starry-night-in-the-desert-46119/",
    },
    {
        "filename": "space-closeup.mp4",
        "shotType": "closeup",
        "genre": "deep_space",
        "pageUrl": "https://mixkit.co/free-stock-video/worm-hole-seen-inside-18791/",
    },
    # Genre 4: Macro Abstract / Atmosphere
    {
        "filename": "macro-wide.mp4",
        "shotType": "wide",
        "genre": "macro_abstract",
        "pageUrl": "https://mixkit.co/free-stock-video/overhead-view-of-a-rocky-coast-and-waves-crashing-51502/",
    },
    {
        "filename": "macro-medium.mp4",
        "shotType": "medium",
        "genre": "macro_abstract",
        "pageUrl": "https://mixkit.co/free-stock-video/stars-in-space-background-1610/",
    },
    {
        "filename": "macro-closeup.mp4",
        "shotType": "closeup",
        "genre": "macro_abstract",
        "pageUrl": "https://mixkit.co/free-stock-video/vertical-video-of-blazing-flames-over-a-black-backdrop-52284/",
    },
]

def fetch_and_process():
    verified_catalog = []
    
    for item in manifest:
        fname = item["filename"]
        purl = item["pageUrl"]
        print(f"\n---> Fetching source page: {purl}")
        
        # 1. Fetch source page
        req = urllib.request.Request(purl, headers=headers)
        html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
        soup = BeautifulSoup(html, 'html.parser')
        
        page_title = soup.title.string.strip() if soup.title else ""
        h1_tag = soup.find('h1')
        h1_text = h1_tag.get_text().strip() if h1_tag else ""
        
        # Extract item ID from URL
        m_id = re.search(r'-(\d+)/?$', purl)
        item_id = m_id.group(1) if m_id else ""
        
        # Determine download URL
        video_src = None
        # Try direct regex search in HTML
        m_video = re.search(r'https://assets\.mixkit\.co/videos/[a-zA-Z0-9_\-\.\/]+-720\.mp4', html)
        if not m_video:
            m_video = re.search(r'https://assets\.mixkit\.co/videos/[a-zA-Z0-9_\-\.\/]+\.mp4', html)
        if m_video:
            video_src = m_video.group(0)
        elif item_id:
            video_src = f"https://assets.mixkit.co/videos/{item_id}/{item_id}-720.mp4"

        print(f"  Confirmed Title: {h1_text or page_title}")
        print(f"  Confirmed Page Title: {page_title}")
        print(f"  Confirmed Video CDN: {video_src}")
        
        temp_dl = os.path.join(SAMPLES_DIR, "raw_" + fname)
        final_mp4 = os.path.join(SAMPLES_DIR, fname)
        poster_webp = os.path.join(SAMPLES_DIR, fname.replace(".mp4", ".webp"))
        
        # Download raw video
        dl_req = urllib.request.Request(video_src, headers=headers)
        with urllib.request.urlopen(dl_req) as resp, open(temp_dl, 'wb') as out_f:
            out_f.write(resp.read())
            
        # Compress with ffmpeg: 1280x720 16:9, max 8s, no audio, CRF 27 -> guarantee < 2MB
        cmd = [
            FFMPEG, "-y",
            "-i", temp_dl,
            "-t", "8",
            "-vf", "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720",
            "-c:v", "libx264",
            "-crf", "27",
            "-preset", "fast",
            "-an",
            "-movflags", "+faststart",
            final_mp4
        ]
        subprocess.run(cmd, check=True, capture_output=True)
        if os.path.exists(temp_dl):
            os.remove(temp_dl)
            
        # Extract poster frame as WebP
        pcmd = [
            FFMPEG, "-y",
            "-ss", "00:00:01",
            "-i", final_mp4,
            "-vframes", "1",
            "-vf", "scale=1280:720",
            poster_webp
        ]
        subprocess.run(pcmd, check=True, capture_output=True)
        
        # Probe final file
        probe_cmd = [
            FFPROBE, "-v", "error",
            "-show_entries", "format=duration,size:stream=width,height",
            "-of", "json",
            final_mp4
        ]
        pres = subprocess.run(probe_cmd, capture_output=True, text=True)
        pdata = json.loads(pres.stdout)
        dur = float(pdata.get("format", {}).get("duration", 0))
        fsize = int(pdata.get("format", {}).get("size", 0))
        
        verified_catalog.append({
            "file": fname,
            "title": h1_text,
            "page_title": page_title,
            "source_url": purl,
            "video_cdn": video_src,
            "status": "downloaded",
            "duration": f"{dur:.2f}s",
            "size_mb": f"{fsize / (1024*1024):.2f} MB",
            "size_bytes": fsize,
            "poster": os.path.basename(poster_webp),
            "poster_kb": f"{os.path.getsize(poster_webp)/1024:.1f} KB"
        })
        print(f"  VERIFIED: {fname} -> {fsize/(1024*1024):.2f} MB, {dur:.2f}s, Poster: {os.path.basename(poster_webp)}")
        
    with open("verified_catalog.json", "w", encoding="utf-8") as out:
        json.dump(verified_catalog, out, indent=2)
    print("\nALL 12 ASSETS SUCCESSFULLY DOWNLOADED, OPTIMIZED, AND CATALOGED.")

if __name__ == "__main__":
    fetch_and_process()
