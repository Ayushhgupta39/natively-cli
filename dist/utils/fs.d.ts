export declare const fs_utils: {
    exists: (filePath: string) => boolean;
    ensureDir: (dirPath: string) => void;
    writeFile: (filePath: string, content: string) => void;
    copyTemplate: (templatePath: string, destPath: string, replacements?: Record<string, string>) => void;
};
