#!/bin/bash

TEMPLATE_DIR="../../docs/.templates"
TARGET_DIRS=("core" "database" "decorators" "discord" "logger" "media" "network" "types" "utils")

for dir in "${TARGET_DIRS[@]}"
do
  echo ":arrows_counterclockwise: Copying templates to $dir..."
  mkdir -p "./packages/$dir/src"

  TARGET_PATH="./packages/$dir/package.json"
  if [ -f "$TARGET_PATH" ]; then
    read -p ":warning:  $TARGET_PATH already exists. Overwrite? (y/N): " confirm
    if [[ "$confirm" == [yY] ]]; then
      sed "s/PACKAGE_NAME/$dir/g" "$TEMPLATE_DIR/package.template.json" > "$TARGET_PATH"
    fi
  else
    sed "s/PACKAGE_NAME/$dir/g" "$TEMPLATE_DIR/package.template.json" > "$TARGET_PATH"
  fi

  for file in tsconfig.json .swcrc
  do
    TARGET_FILE="./packages/$dir/$file"
    if [ -f "$TARGET_FILE" ]; then
      read -p ":warning:  $TARGET_FILE already exists. Overwrite? (y/N): " confirm
      if [[ "$confirm" == [yY] ]]; then
        cp "$TEMPLATE_DIR/$file.template.json" "$TARGET_FILE"
      fi
    else
      cp "$TEMPLATE_DIR/$file.template.json" "$TARGET_FILE"
    fi
  done
done

echo ":white_check_mark: Done!"