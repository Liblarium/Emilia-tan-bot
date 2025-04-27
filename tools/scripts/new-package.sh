#!/bin/bash

if [ -z "$1" ]; then
  echo "❌ Please provide a package name."
  exit 1
fi

PACKAGE_NAME=$1
TEMPLATE_DIR="../../docs/.templates"
TARGET_DIR="./packages/$PACKAGE_NAME"

if [ -d "$TARGET_DIR" ]; then
  echo "⚠️  Package '$PACKAGE_NAME' already exists at $TARGET_DIR."
  exit 1
fi

echo "🚀 Creating new package: $PACKAGE_NAME..."

mkdir -p "$TARGET_DIR/src"

sed "s/PACKAGE_NAME/$PACKAGE_NAME/g" "$TEMPLATE_DIR/package.template.json" > "$TARGET_DIR/package.json"
cp "$TEMPLATE_DIR/tsconfig.template.json" "$TARGET_DIR/tsconfig.json"
cp "$TEMPLATE_DIR/.swcrc.template.json" "$TARGET_DIR/.swcrc"

echo "✅ Package '$PACKAGE_NAME' created successfully!"
