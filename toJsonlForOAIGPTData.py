import json

def create_jsonl(input_file, output_file):
    with open(input_file, encoding="utf-8") as f:
        lines = f.readlines()

    json_lines = []
    role = None
    content = ""

    for line in lines:
        line = line.strip()
        if line.endswith(":"):
            if role is not None and content.strip():
                # Store the content when a new role is encountered
                json_lines.append({"role": role.lower(), "content": content.strip()})
                content = ""
            role = line[:-1]  # Extracting the role name without the ":"
        else:
            if role is not None:
                content += line + " "  # Collecting content under the current role

    if role is not None and content.strip():
        # Capture the content of the last role
        json_lines.append({"role": role.lower(), "content": content.strip()})

    # Convert to a list of JSON strings
    json_data = [json.dumps(line) for line in json_lines]

    # Write to the output file
    with open(output_file, 'w', encoding="utf-8") as out_file:
        out_file.write('\n'.join(json_data))

# Usage
create_jsonl("LMTrainData/train/Example of Completed Scripts for Di.txt", "LMTrainData/train_data2.jsonl")

