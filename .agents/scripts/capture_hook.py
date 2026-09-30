import sys
import json
import os
import re
import glob
from datetime import datetime

def extract_prompt_text(content):
    if not content:
        return ""
    # Extract inner content between <USER_REQUEST> and </USER_REQUEST> if present
    match = re.search(r'<USER_REQUEST>(.*?)</USER_REQUEST>', content, re.DOTALL)
    if match:
        text = match.group(1)
        return text.strip("\r\n")
    # If no tag, strip additional metadata tags if present
    cleaned = re.sub(r'<ADDITIONAL_METADATA>.*?</ADDITIONAL_METADATA>', '', content, flags=re.DOTALL)
    cleaned = re.sub(r'<USER_SETTINGS_CHANGE>.*?</USER_SETTINGS_CHANGE>', '', cleaned, flags=re.DOTALL)
    return cleaned.strip("\r\n")

def find_latest_transcript(app_data_dir, session_id=None):
    if session_id:
        for sub in ["antigravity-ide", "antigravity", "antigravity-cli"]:
            p_full = os.path.join(app_data_dir, ".gemini", sub, "brain", session_id, ".system_generated", "logs", "transcript_full.jsonl")
            if os.path.isfile(p_full):
                return p_full, session_id
            p_short = os.path.join(app_data_dir, ".gemini", sub, "brain", session_id, ".system_generated", "logs", "transcript.jsonl")
            if os.path.isfile(p_short):
                return p_short, session_id

    # Search for latest transcript in all brain directories
    candidates = []
    for sub in ["antigravity-ide", "antigravity", "antigravity-cli"]:
        pattern = os.path.join(app_data_dir, ".gemini", sub, "brain", "*", ".system_generated", "logs", "transcript_full.jsonl")
        for f in glob.glob(pattern):
            try:
                mtime = os.path.getmtime(f)
                sid = os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(f))))
                candidates.append((mtime, f, sid))
            except Exception:
                pass
    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1], candidates[0][2]
    return None, None

def process_transcript(conversation_id=None, transcript_path=None, workspace_dir=None, model_name=None):
    if not workspace_dir:
        # Default to workspace root (2 levels up from scripts dir or current working dir)
        workspace_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    
    app_data = os.environ.get("USERPROFILE", "C:\\Users\\Asus")
    
    actual_transcript = None
    if transcript_path and os.path.isfile(transcript_path):
        if transcript_path.endswith("transcript.jsonl"):
            full = transcript_path.replace("transcript.jsonl", "transcript_full.jsonl")
            if os.path.isfile(full):
                actual_transcript = full
            else:
                actual_transcript = transcript_path
        else:
            actual_transcript = transcript_path

    if not actual_transcript:
        actual_transcript, found_sid = find_latest_transcript(app_data, conversation_id)
        if not conversation_id and found_sid:
            conversation_id = found_sid

    if not actual_transcript or not os.path.isfile(actual_transcript):
        return

    if not conversation_id:
        conversation_id = os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(actual_transcript))))

    steps = []
    with open(actual_transcript, "r", encoding="utf-8", errors="replace") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                steps.append(json.loads(line))
            except Exception:
                continue

    # Extract exchanges
    exchanges = []
    current_exchange = None
    
    for step in steps:
        step_type = step.get("type")
        source = step.get("source")
        content = step.get("content", "")
        created_at = step.get("created_at", "")
        
        if step_type == "USER_INPUT" and source in ("USER_EXPLICIT", "USER"):
            if current_exchange:
                exchanges.append(current_exchange)
            current_exchange = {
                "prompt": extract_prompt_text(content),
                "prompt_time": created_at,
                "response": "",
                "response_time": "",
                "model": model_name or "Gemini 3.7 Flash"
            }
        elif step_type == "PLANNER_RESPONSE" and current_exchange is not None:
            # Check if this planner response has content (final response text)
            if content and content.strip():
                current_exchange["response"] = content.strip("\r\n")
                current_exchange["response_time"] = created_at
    
    if current_exchange:
        exchanges.append(current_exchange)

    if not exchanges:
        return

    # Metadata for frontmatter
    session_id = conversation_id or "unknown-session"
    short_session = session_id[:8] if len(session_id) >= 8 else session_id
    first_prompt_time = exchanges[0]["prompt_time"] or (datetime.utcnow().isoformat() + "Z")
    last_prompt_time = exchanges[-1]["prompt_time"] or first_prompt_time
    
    # Parse date from first_prompt_time
    try:
        date_str = first_prompt_time.split("T")[0]
        time_part = first_prompt_time.split("T")[1].replace(":", "-").split(".")[0].replace("Z", "")
        timestamp_prefix = f"{date_str}_{time_part}"
    except Exception:
        date_str = datetime.utcnow().strftime("%Y-%m-%d")
        timestamp_prefix = datetime.utcnow().strftime("%Y-%m-%d_%H-%M-%S")
        
    author = "suprit-4618"
    project = os.path.basename(os.path.normpath(workspace_dir)) or "cine_flow_ai"
    display_model = "Gemini 3.7 Flash"
    tool_name = "antigravity"
    
    log_dir = os.path.join(workspace_dir, ".agent-logs")
    os.makedirs(log_dir, exist_ok=True)
    
    # Check if a log file for this session already exists
    target_filename = f"{timestamp_prefix}_{session_id}.md"
    for existing_file in os.listdir(log_dir):
        if existing_file.endswith(f"_{session_id}.md") or existing_file.endswith(f"_{short_session}.md"):
            target_filename = existing_file
            break
            
    log_file_path = os.path.join(log_dir, target_filename)

    # Build markdown content
    md_lines = [
        "---",
        f"session_id: {session_id}",
        f"date: {date_str}",
        f"author: {author}",
        f"model: {display_model}",
        f"tool: {tool_name}",
        f"project: {project}",
        f"total_exchanges: {len(exchanges)}",
        f"first_prompt_time: {first_prompt_time}",
        f"last_prompt_time: {last_prompt_time}",
        "---",
        "",
        f"# Session Log - {date_str}",
        "",
        f"Session: `{short_session}` | Project: `{project}` | Author: `{author}`",
        "",
        "---",
        ""
    ]

    for idx, ex in enumerate(exchanges, start=1):
        md_lines.append(f"[LOG_ENTRY type=PROMPT num={idx} session={short_session}]")
        md_lines.append(f"timestamp: {ex['prompt_time']}")
        md_lines.append(f"model: {ex['model']}")
        md_lines.append("")
        md_lines.append(ex["prompt"])
        md_lines.append("")
        md_lines.append("")
        
        if ex["response"]:
            md_lines.append(f"[LOG_ENTRY type=RESPONSE num={idx} session={short_session}]")
            md_lines.append(f"timestamp: {ex['response_time'] or ex['prompt_time']}")
            md_lines.append(f"model: {ex['model']}")
            md_lines.append("")
            md_lines.append(ex["response"])
            md_lines.append("")
            md_lines.append("")

    with open(log_file_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md_lines).rstrip() + "\n")

def main():
    raw_input = ""
    if not sys.stdin.isatty():
        try:
            raw_input = sys.stdin.read()
        except Exception:
            raw_input = ""

    payload = {}
    if raw_input and raw_input.strip():
        try:
            payload = json.loads(raw_input)
        except Exception:
            pass

    conversation_id = payload.get("conversationId")
    transcript_path = payload.get("transcriptPath")
    workspace_paths = payload.get("workspacePaths", [])
    workspace_dir = workspace_paths[0] if workspace_paths else None
    model_name = payload.get("modelName")

    # If conversation_id not passed via stdin, check if passed via args
    if not conversation_id and len(sys.argv) > 1:
        conversation_id = sys.argv[1]

    # Process transcript
    try:
        process_transcript(
            conversation_id=conversation_id,
            transcript_path=transcript_path,
            workspace_dir=workspace_dir,
            model_name=model_name
        )
    except Exception as e:
        sys.stderr.write(f"Error processing transcript: {e}\n")

    # Antigravity hook stdout contract expects JSON object
    sys.stdout.write(json.dumps({}))

if __name__ == "__main__":
    main()
