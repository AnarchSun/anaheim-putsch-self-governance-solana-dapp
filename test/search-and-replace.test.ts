// test/search-and-replace.test.ts
import * as mockFs from 'mock-fs';
import { access, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { searchAndReplace } from '../src-recov-red/utils/search-and-replace';
import fs from 'node:fs';
import 'core-js/stable';
import 'regenerator-runtime/runtime'; // Utile pour async/await
beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  mockFs.restore(); // Restore mock-fs after each test if used
});

vi.spyOn(fs, 'readFile').mockImplementation((path, options) => {
  if (typeof path !== 'string') {
    return Promise.reject(new Error('Path must be a string'));
  }

  if (typeof options === 'object' || typeof options === 'string') {
    return Promise.reject(new Error(`Simulated read error for path: ${path}`));
  }

  return Promise.reject(new Error('Invalid options passed to readFile'));
});

describe('searchAndReplace', () => {
  let tempDir: string;

  beforeEach(async () => {
    // Create a temporary directory for each test
    tempDir = await mkdtemp(join(tmpdir(), 'search-replace-test-'));

    // Create a test file structure
    await mkdir(join(tempDir, 'subdir'));
    await writeFile(join(tempDir, 'file1.txt'), 'Hello world');
    await writeFile(join(tempDir, 'subdir', 'file2.txt'), 'Hello universe');
    await writeFile(join(tempDir, 'oldname.txt'), 'Old content');
  });

  afterEach(async () => {
    // Clean up the temporary directory after each test
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should replace content and rename files in dry run mode without making changes', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log');

    try {
      await searchAndReplace(tempDir, ['Hello', 'oldname'], ['Hi', 'newname'], true, true);

      // Verify that no actual changes were made
      expect(await readFile(join(tempDir, 'file1.txt'), 'utf8')).toBe('Hello world');
      expect(await readFile(join(tempDir, 'subdir', 'file2.txt'), 'utf8')).toBe('Hello universe');
      expect(await readFile(join(tempDir, 'oldname.txt'), 'utf8')).toBe('Old content');

      // Check that the correct log messages were printed
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[Dry Run] File modified:'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[Dry Run] Renamed:'));
      expect(consoleLogSpy).toHaveBeenCalledWith('Dry run completed');
    } finally {
      consoleLogSpy.mockRestore();
    }
  });

  it('should replace content and rename files in actual run mode', async () => {
    await searchAndReplace(tempDir, ['Hello', 'oldname'], ['Hi', 'newname'], false, true);

    // Check that the content in the files has been modified
    expect(await readFile(join(tempDir, 'file1.txt'), 'utf8')).toBe('Hi world');
    expect(await readFile(join(tempDir, 'subdir', 'file2.txt'), 'utf8')).toBe('Hi universe');
    expect(await readFile(join(tempDir, 'newname.txt'), 'utf8')).toBe('Old content');

    // Verify that the old file was renamed
    await expect(access(join(tempDir, 'oldname.txt'))).rejects.toThrow();
  });

  it('should exclude directories like node_modules and .git from processing', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log');

    try {
      // Create excluded directories
      await mkdir(join(tempDir, 'node_modules'));
      await mkdir(join(tempDir, '.git'));

      await searchAndReplace(tempDir, ['Hello'], ['Hi'], true, true);

      // Check that the excluded directories were logged and skipped
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Skipping excluded directory:'));
    } finally {
      consoleLogSpy.mockRestore();
    }
  });

  it('should handle symbolic links and skip them', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log');

    try {
      // Create symbolic link
      const symLinkPath = join(tempDir, 'symlink');
      const targetPath = join(tempDir, 'file1.txt');
      await symlink(targetPath, symLinkPath);

      await searchAndReplace(tempDir, ['Hello'], ['Hi'], true, true);

      // Verify that the symbolic link was skipped
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Skipping symbolic link:'));
    } finally {
      consoleLogSpy.mockRestore();
    }
  });
});
