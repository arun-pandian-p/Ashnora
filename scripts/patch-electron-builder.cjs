const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('node_modules/app-builder-lib/out/targets/nsis/NsisTarget.js');
const utilFile = path.resolve('node_modules/app-builder-lib/out/targets/nsis/nsisUtil.js');

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');

  // Patch 1: Native uninstaller extraction without wine error
  if (content.includes('if ((0, macosVersion_1.isMacOsCatalina)())')) {
    const oldCode = `        if ((0, macosVersion_1.isMacOsCatalina)()) {
            try {
                await nsisUtil_1.UninstallerReader.exec(installerPath, uninstallerPath);
            }
            catch (error) {
                builder_util_1.log.warn(\`packager.vm is used: \${error.message}\`);
                const vm = await packager.vm.value;
                await vm.exec(installerPath, []);
                // Parallels VM can exit after command execution, but NSIS continue to be running
                let i = 0;
                while (!(await (0, builder_util_1.exists)(uninstallerPath)) && i++ < 100) {
                    // noinspection JSUnusedLocalSymbols
                    await new Promise((resolve, _reject) => setTimeout(resolve, 300));
                }
            }
        }
        else {
            const wineVm = new WineVm_1.WineVmManager((_a = packager.config.toolsets) === null || _a === void 0 ? void 0 : _a.wine);
            await wineVm.exec(installerPath, [], { env: { __COMPAT_LAYER: "RunAsInvoker" } });
        }`;

    const newCode = `        try {
            await nsisUtil_1.UninstallerReader.exec(installerPath, uninstallerPath);
        }
        catch (error) {
            const wineVm = new WineVm_1.WineVmManager((_a = packager.config.toolsets) === null || _a === void 0 ? void 0 : _a.wine);
            await wineVm.exec(installerPath, [], { env: { ...process.env, __COMPAT_LAYER: "RunAsInvoker" } });
        }`;

    content = content.replace(oldCode, newCode);
    console.log('✓ Successfully patched app-builder-lib for Windows NSIS uninstaller generation');
  }

  // Patch 2: Preserve Ashnora-1.0.0-Setup_uninstaller.exe in release
  if (!content.includes('Ashnora-1.0.0-Setup_uninstaller.exe')) {
    const targetBlock = `await this.executeMakensis(defines, commands, sharedHeader + (await this.computeFinalScript(rawScript, true, archs)), { skipSizeVerification: isPortable || isCustomScript });`;
    const replacementBlock = `await this.executeMakensis(defines, commands, sharedHeader + (await this.computeFinalScript(rawScript, true, archs)), { skipSizeVerification: isPortable || isCustomScript });
            if (defines.UNINSTALLER_OUT_FILE != null && (0, fs_extra_1.existsSync)(defines.UNINSTALLER_OUT_FILE)) {
                try {
                    const releaseUninstaller = path.join(this.outDir, 'Ashnora-1.0.0-Setup_uninstaller.exe');
                    await (0, fs_extra_1.copyFile)(defines.UNINSTALLER_OUT_FILE, releaseUninstaller);
                } catch (e) {}
            }`;
    content = content.replace(targetBlock, replacementBlock);
    console.log('✓ Successfully patched app-builder-lib to preserve uninstaller executable');
  }

  fs.writeFileSync(targetFile, content, 'utf8');
}

// Patch 3: Handle OneDrive lock during temporary 7z file cleanup
if (fs.existsSync(utilFile)) {
  let utilContent = fs.readFileSync(utilFile, 'utf8');
  if (utilContent.includes('await Promise.all(filesToDelete.map(it => fs.unlink(it)));')) {
    utilContent = utilContent.replace(
      'await Promise.all(filesToDelete.map(it => fs.unlink(it)));',
      'await Promise.all(filesToDelete.map(it => fs.unlink(it).catch(() => {})));'
    );
    fs.writeFileSync(utilFile, utilContent, 'utf8');
    console.log('✓ Successfully patched nsisUtil to safely handle temporary file unlink');
  }
}
