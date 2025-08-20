#!/bin/bash

# Test script to validate deployment readiness
echo "🧪 Testing deployment readiness..."

# Check if package.json exists and has required fields
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
fi

# Extract version from package.json
VERSION=$(node -p "require('./package.json').version")
echo "📦 Package version: $VERSION"

# Validate version format
if [[ ! $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$ ]]; then
    echo "❌ Invalid version format: $VERSION"
    exit 1
fi

echo "✅ Version format is valid"

# Check if build works
echo "🔨 Testing build..."
if pnpm build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Check if dist directory exists and has content
if [ ! -d "dist" ] || [ ! "$(ls -A dist)" ]; then
    echo "❌ dist directory is empty or doesn't exist"
    exit 1
fi

echo "✅ dist directory has content"

# Check required files
REQUIRED_FILES=("package.json" "README.md" "CHANGELOG.md")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Required file missing: $file"
        exit 1
    fi
    echo "✅ $file exists"
done

# Check publishConfig
PUBLISH_CONFIG=$(node -p "JSON.stringify(require('./package.json').publishConfig || {})")
if [[ "$PUBLISH_CONFIG" == "{}" ]]; then
    echo "⚠️  No publishConfig found - might need 'access: public' for scoped packages"
else
    echo "✅ publishConfig found: $PUBLISH_CONFIG"
fi

echo ""
echo "🎉 All checks passed! Ready for deployment"
echo ""
echo "To deploy:"
echo "  1. git tag v$VERSION"
echo "  2. git push origin main --tags"
echo ""
