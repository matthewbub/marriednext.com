#!/bin/bash

CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
GREEN='\033[0;32m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}▸ Cleaning webapp...${NC}"
rm -rf apps/webapp/node_modules apps/webapp/.turbo apps/webapp/dist apps/webapp/package-lock.json apps/webapp/pnpm-lock.json apps/webapp/.next

echo -e "${MAGENTA}▸ Cleaning style-shelf...${NC}"
rm -rf packages/style-shelf/node_modules packages/style-shelf/.turbo packages/style-shelf/dist packages/style-shelf/package-lock.json packages/style-shelf/pnpm-lock.json

echo -e "${YELLOW}▸ Cleaning component-shelf...${NC}"
rm -rf packages/component-shelf/node_modules packages/component-shelf/.turbo packages/component-shelf/dist packages/component-shelf/package-lock.json packages/component-shelf/pnpm-lock.json

echo -e "${BLUE}▸ Cleaning label-shelf...${NC}"
rm -rf packages/label-shelf/node_modules packages/label-shelf/.turbo packages/label-shelf/dist packages/label-shelf/package-lock.json packages/label-shelf/pnpm-lock.json

echo -e "${RED}▸ Cleaning orm-shelf...${NC}"
rm -rf packages/orm-shelf/node_modules packages/orm-shelf/.turbo packages/orm-shelf/dist packages/orm-shelf/package-lock.json packages/orm-shelf/pnpm-lock.json

echo -e "${CYAN}▸ Cleaning root...${NC}"
rm -rf package-lock.json pnpm-lock.json dist node_modules .turbo

echo -e "${BOLD}${GREEN}✓ Clean complete${NC}"
