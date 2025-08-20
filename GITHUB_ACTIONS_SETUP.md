# GitHub Actions Setup Guide

## 🔧 Setting up the Deploy Workflow

### Prerequisites

You need to set up the following secrets in your GitHub repository:

1. **NPM_TOKEN** - Your npm authentication token
2. **GITHUB_TOKEN** - Automatically provided by GitHub (no setup needed)

### Setting up NPM_TOKEN

1. **Generate an npm access token:**
   ```bash
   npm login
   npm token create --type=automation
   ```
   
2. **Add the token to GitHub Secrets:**
   - Go to your GitHub repository
   - Click on `Settings` → `Secrets and variables` → `Actions`
   - Click `New repository secret`
   - Name: `NPM_TOKEN`
   - Value: Your npm token (starts with `npm_`)

### How to Use

1. **Update version in package.json:**
   ```bash
   # Update version manually or use npm version
   npm version patch  # for 1.1.4 → 1.1.5
   npm version minor  # for 1.1.4 → 1.2.0
   npm version major  # for 1.1.4 → 2.0.0
   ```

2. **Create and push a tag:**
   ```bash
   git add .
   git commit -m "Release v1.1.2"
   git tag v1.1.5
   git push origin main --tags
   ```

3. **The workflow will automatically:**
   - ✅ Validate the semantic version
   - ✅ Check that package.json version matches the tag
   - ✅ Install dependencies
   - ✅ Build the project
   - ✅ Generate a changelog
   - ✅ Create a GitHub release
   - ✅ Publish to npm

### Supported Tag Formats

- `v1.1.4` (recommended)
- `1.1.4`
- `v1.2.0-beta.1` (pre-release)
- `2.0.0-alpha.1` (pre-release)

### Troubleshooting

**If the workflow fails:**

1. **Version mismatch error:**
   - Make sure package.json version matches your git tag
   - If tag is `v1.1.5`, package.json should have `"version": "1.1.5"`

2. **NPM authentication error:**
   - Check that NPM_TOKEN secret is set correctly
   - Verify the token has publish permissions

3. **Build errors:**
   - Make sure your code builds successfully locally: `pnpm build`
   - Check TypeScript compilation errors

4. **Permission errors:**
   - Ensure your npm token has publish access to @rnwonder scope
   - Check that the package name in package.json is correct

### Example Release Process

```bash
# 1. Make your changes and commit
git add .
git commit -m "feat: add awesome new feature"

# 2. Update version
npm version minor  # This updates package.json and creates a git tag

# 3. Push to trigger deployment
git push origin main --tags

# 4. Watch the GitHub Actions tab for deployment status
```
