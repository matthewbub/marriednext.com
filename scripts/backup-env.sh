#!/bin/bash
timestamp=$(date +%Y%m%d_%H%M%S)
backup_dir=".env-backups/$timestamp"
mkdir -p "$backup_dir"
cp apps/webapp/.env.local "$backup_dir/webapp.env" 2>/dev/null
cp packages/component-shelf/.env.local "$backup_dir/component-shelf.env" 2>/dev/null
echo "Backed up to $backup_dir"

