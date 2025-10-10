import os
from parse_core import parse_core

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAMPLES_DIR = os.path.join(BASE_DIR, "samples")
OUTPUT_FILE = os.path.join(SAMPLES_DIR, "parsed.txt")

URL = "https://job-boards.greenhouse.io/honehealth/jobs/4945588008"


def choose_sample():
    files = sorted(
        [f for f in os.listdir(SAMPLES_DIR) if f.endswith(
            ".html") or f.endswith(".htm")]
    )

    if not files:
        print(f"No .html files found in {SAMPLES_DIR}")
        return []

    print("\nAvailable HTML samples:\n")
    for i, name in enumerate(files, start=1):
        print(f"  [{i}] {name}")
    print("  [0] All files\n")

    try:
        choice = int(input("Select a file number (or 0 for all): ").strip())
    except ValueError:
        print("Invalid input.")
        return []

    if choice == 0:
        return [os.path.join(SAMPLES_DIR, f) for f in files]
    elif 1 <= choice <= len(files):
        return [os.path.join(SAMPLES_DIR, files[choice - 1])]
    else:
        print("Invalid selection.")
        return []


if __name__ == "__main__":
    selected_files = choose_sample()
    if not selected_files:
        exit()

    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        for file_path in selected_files:
            print(f"Parsing: {os.path.basename(file_path)}")
            with open(file_path, "r", encoding="utf-8") as f:
                html = f.read()

            parsed = parse_core(html)

            out.write("=" * 70 + "\n")
            out.write(f"Parsed file: {os.path.basename(file_path)}\n")
            out.write("-" * 70 + "\n")
            for k, v in parsed.items():
                out.write(f"{k}: {v}\n")
            out.write("\n\n")

    print(f"\n✅ Parsing complete. Results written to:\n{OUTPUT_FILE}")
