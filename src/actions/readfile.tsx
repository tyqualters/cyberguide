'use server';

import * as fs from "fs";
import * as path from "path";

export async function ReadFile(filePath: string): Promise<string | null> {
  const _filePath: string = path.join(process.cwd(), filePath);
  try {
    const content: string = await fs.promises.readFile(_filePath, "utf-8");
    return content;
  } catch (error: unknown) {
    console.error(`Error reading file at ${_filePath}:`, error);
    return null;
  }
}