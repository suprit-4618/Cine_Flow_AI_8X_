# Public Samples Directory

This folder holds local video clips and poster frames for CineFlow AI's cinematic simulation engine.

## License & Redistribution Policy
All video assets are sourced from [Mixkit](https://mixkit.co/) under the **Mixkit Stock Video Free License**.

### Relevant License Clauses:
> *"Items under the Mixkit Stock Video Free License can be used in personal and commercial video projects."*
> *"Attribution is not required, but appreciated."*
> *"What is not permitted: Resell or redistribute the item(s) as standalone stock files, or include the item(s) in a media library, application, or template for download as raw stock footage."*

Because raw stock videos should not be redistributed as standalone files in public version control repositories, the `.mp4` video files are excluded via `.gitignore`. The lightweight WebP posters (`*.webp`) and procedural SVG fallbacks are included in the repository so the UI works 100% out of the box without any network downloads.

## Downloading Video Files Locally
To download and optimize all 12 video clips locally:
```bash
python process_assets.py
```
This fetches the original 1080p/720p streams from Mixkit, normalizes them to 1280x720 16:9, strips audio (`-an`), compresses them under 2 MB with H.264 CRF 26, and generates WebP posters.
