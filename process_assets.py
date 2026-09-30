import os
import subprocess
import json

FFMPEG = r"C:\Users\Asus\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"
FFPROBE = r"C:\Users\Asus\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffprobe.exe"
SAMPLES_DIR = r"d:\hackathon\cine_flow_ai\public\samples"

files = [
    "neon-wide.mp4",
    "neon-medium.mp4",
    "neon-closeup.mp4",
    "alpine-wide.mp4",
    "alpine-medium.mp4",
    "alpine-closeup.mp4",
    "space-wide.mp4",
    "space-medium.mp4",
    "space-closeup.mp4",
    "macro-wide.mp4",
    "macro-medium.mp4",
    "macro-closeup.mp4",
]

def probe_file(filepath):
    cmd = [
        FFPROBE,
        "-v", "error",
        "-show_entries", "format=duration,size:stream=width,height,codec_name,r_frame_rate",
        "-of", "json",
        filepath
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        return None
    data = json.loads(res.stdout)
    duration = float(data.get("format", {}).get("duration", 0))
    size = int(data.get("format", {}).get("size", 0))
    video_stream = next((s for s in data.get("streams", []) if s.get("codec_name") in ["h264", "hevc", "vp9", "av1", "mpeg4"]), None)
    width = video_stream.get("width", 0) if video_stream else 0
    height = video_stream.get("height", 0) if video_stream else 0
    return {
        "duration": duration,
        "size": size,
        "width": width,
        "height": height,
        "codec": video_stream.get("codec_name") if video_stream else "unknown"
    }

print("=== STANDARDIZING ALL 12 CLIPS TO 1280x720 16:9, NO AUDIO, <2MB ===")
for fname in files:
    fpath = os.path.join(SAMPLES_DIR, fname)
    temp_path = os.path.join(SAMPLES_DIR, "std_" + fname)
    poster_path = os.path.join(SAMPLES_DIR, fname.replace(".mp4", ".webp"))
    
    cmd = [
        FFMPEG, "-y",
        "-i", fpath,
        "-vf", "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720",
        "-c:v", "libx264",
        "-crf", "26",
        "-preset", "slow",
        "-an",
        "-movflags", "+faststart",
        temp_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        os.replace(temp_path, fpath)
        print(f"Standardized {fname} to 1280x720.")
    else:
        print(f"Error {fname}: {res.stderr}")

    # Extract poster frame as WebP
    poster_cmd = [
        FFMPEG, "-y",
        "-ss", "00:00:01",
        "-i", fpath,
        "-vframes", "1",
        "-vf", "scale=1280:720",
        poster_path
    ]
    pres = subprocess.run(poster_cmd, capture_output=True, text=True)
    if pres.returncode == 0:
        print(f"Extracted poster {os.path.basename(poster_path)}")

print("\n=== FINAL VERIFIED AUDIT ===")
final_report = []
for fname in files:
    fpath = os.path.join(SAMPLES_DIR, fname)
    info = probe_file(fpath)
    poster_name = fname.replace(".mp4", ".webp")
    poster_path = os.path.join(SAMPLES_DIR, poster_name)
    poster_exists = os.path.exists(poster_path)
    poster_size = os.path.getsize(poster_path) if poster_exists else 0
    final_report.append({
        "file": fname,
        "width": info["width"],
        "height": info["height"],
        "duration": f"{info['duration']:.2f}s",
        "size_mb": f"{info['size'] / (1024*1024):.2f} MB",
        "size_bytes": info["size"],
        "poster": poster_name,
        "poster_kb": f"{poster_size / 1024:.1f} KB"
    })
    print(f"VERIFIED: {fname:<20} | {info['width']}x{info['height']} | {info['duration']:.2f}s | {info['size']/(1024*1024):.2f} MB | Poster: {poster_name} ({poster_size/1024:.1f} KB)")

with open("asset_report.json", "w") as f:
    json.dump(final_report, f, indent=2)
