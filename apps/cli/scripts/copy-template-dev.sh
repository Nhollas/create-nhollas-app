#!/bin/bash

# Source and destination directories
SRC_DIR="$1"
DEST_DIR="$2"

# Blacklist of folders and files to ignore
BLACKLIST=("node_modules" ".next" ".env.local" "next-env.d.ts" "package.json" "pnpm-lock.yaml" "docker-compose.yaml" "test-results" "playwright-report" "tsconfig.tsbuildinfo")

# Check if source and destination directories are provided
if [ -z "$SRC_DIR" ] || [ -z "$DEST_DIR" ]; then
    echo "Usage: $0 <source_directory> <destination_directory>"
    exit 1
fi

# Check if source directory exists
if [ ! -d "$SRC_DIR" ]; then
    echo "Error: Source directory does not exist."
    exit 1
fi

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Function to check if a file or directory is blacklisted
is_blacklisted() {
    local item="$1"
    for blacklisted_item in "${BLACKLIST[@]}"; do
        if [[ "$item" == "$blacklisted_item" ]]; then
            return 0 # It's blacklisted
        fi
    done
    return 1 # It's not blacklisted
}

# Copy files and directories recursively
copy_directory() {
    local src="$1"
    local dest="$2"

    shopt -s dotglob  # Include hidden files and folders in globbing
    for item in "$src"/*; do
        local base_item="$(basename "$item")"
        if is_blacklisted "$base_item"; then
            echo "Skipping blacklisted item: $base_item"
            continue
        fi

        if [ -d "$item" ]; then
            echo "Copying directory: $item"
            mkdir -p "$dest/$base_item"
            copy_directory "$item" "$dest/$base_item"
        else
            echo "Copying file: $item"
            cp "$item" "$dest/"
        fi
    done
    shopt -u dotglob  # Reset globbing behavior
}

# Start the copy process
copy_directory "$SRC_DIR" "$DEST_DIR"

echo "Copy completed."