

## Fix iOS Capacitor Build Errors

### Problem
The Xcode project references Capacitor plugins (`@capacitor/app`, `@capacitor/browser`, `@capacitor/device`, `@capacitor/preferences`, `@capacitor/push-notifications`) that are not declared in `package.json`, causing build failures.

### What Will Change

**File: `package.json`** -- Add 5 missing dependencies (lines 14-20, inserting after existing Capacitor entries):
- `"@capacitor/app": "^8.0.0"`
- `"@capacitor/browser": "^8.0.0"`
- `"@capacitor/device": "^8.0.0"`
- `"@capacitor/preferences": "^8.0.0"`
- `"@capacitor/push-notifications": "^8.0.0"`

All at `^8.0.0` to match the existing Capacitor packages.

### What Won't Change
- No `ios/` directory exists, so nothing to delete
- `capacitor.config.ts` already has correct `appId`, `appName`, and `webDir: "dist"`
- No app logic, UI, or other dependencies will be touched

### After Implementation (Your Local Steps)
1. `git pull` the updated project
2. `npm install` to install the new packages
3. Delete your local `ios/` folder if it exists
4. `npx cap add ios`
5. `npm run build`
6. `npx cap sync ios`
7. Open in Xcode: `npx cap open ios`
8. Accept any recommended Xcode setting updates

