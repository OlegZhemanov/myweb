import os
import shutil
import zipfile
from pathlib import Path

def create_archive(html_file):
    # Get the base name without extension
    base_name = os.path.splitext(html_file)[0]
    
    # Create a temporary directory for organizing files
    temp_dir = f"temp_{base_name}"
    os.makedirs(temp_dir, exist_ok=True)
    
    try:
        # Create public directory in temp
        public_dir = os.path.join(temp_dir, "public")
        os.makedirs(public_dir, exist_ok=True)
        
        # Copy the HTML file to public directory and rename it to index.html
        shutil.copy2(os.path.join("public", html_file), os.path.join(public_dir, "index.html"))
        
        # Copy lambda.mjs and rename it to index.mjs
        shutil.copy2("lambda.mjs", os.path.join(temp_dir, "index.mjs"))
        
        # Copy package.json
        shutil.copy2("package.json", temp_dir)
        
        # Create the zip archive
        zip_filename = f"{base_name}.zip"
        with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, _, files in os.walk(temp_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, temp_dir)
                    zipf.write(file_path, arcname)
        
        print(f"Created archive: {zip_filename}")
        
    finally:
        # Clean up temporary directory
        shutil.rmtree(temp_dir)

def main():
    # Find all HTML files in the public directory
    html_files = [f for f in os.listdir('public') if f.endswith('.html')]
    
    if not html_files:
        print("No HTML files found in the public directory")
        return
    
    for html_file in html_files:
        create_archive(html_file)

if __name__ == "__main__":
    main()
