import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import archiver from 'archiver';
import { PrismaClient } from '@prisma/client';

const execAsync = promisify(exec);

export async function POST() {
  try {
    const prisma = new PrismaClient();
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not defined');
    }

    // Parse database URL
    const url = new URL(dbUrl);
    const database = url.pathname.slice(1);
    const username = url.username;
    const password = url.password;
    const host = url.hostname;
    const port = url.port;

    // Create temporary directory for backup
    const tempDir = path.join(process.cwd(), 'tmp');
    const backupPath = path.join(tempDir, 'backup.sql');
    const zipPath = path.join(tempDir, 'backup.zip');

    // Ensure temp directory exists
    await fs.mkdir(tempDir, { recursive: true });

    // Create backup using pg_dump
    const pgDumpCmd = `PGPASSWORD=${password} pg_dump -h ${host} -p ${port} -U ${username} -F p ${database} > ${backupPath}`;
    await execAsync(pgDumpCmd);

    // Create zip file
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    archive.pipe(output);
    archive.file(backupPath, { name: 'backup.sql' });
    await archive.finalize();

    // Read the zip file
    const fileBuffer = await fs.readFile(zipPath);

    // Clean up temporary files
    await fs.unlink(backupPath);
    await fs.unlink(zipPath);
    await fs.rmdir(tempDir);

    // Send the zip file
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=backup-${new Date().toISOString().split('T')[0]}.zip`
      }
    });
  } catch (error) {
    console.error('Backup failed:', error);
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
} 