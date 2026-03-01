import crypto from 'crypto';

export interface AuditEntry {
  id: string;
  userId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// In-memory persistent audit ledger
const memoryAuditLog: AuditEntry[] = [];

export class AuditService {
  public static async log(entry: Omit<AuditEntry, 'id' | 'createdAt'>): Promise<AuditEntry> {
    const record: AuditEntry = {
      id: `audit-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      ...entry,
      createdAt: new Date().toISOString(),
    };

    memoryAuditLog.unshift(record);

    // Keep recent 1,000 entries in ring buffer
    if (memoryAuditLog.length > 1000) {
      memoryAuditLog.pop();
    }

    // Also output structured JSON in production logs
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[AUDIT] ${record.action} on ${record.resourceType}:${record.resourceId || 'none'} by user:${record.userId || 'anonymous'}`);
    }

    return record;
  }

  public static getRecentLogs(limit = 50): AuditEntry[] {
    return memoryAuditLog.slice(0, limit);
  }

  public static getLogsForResource(resourceType: string, resourceId: string): AuditEntry[] {
    return memoryAuditLog.filter(
      (log) => log.resourceType === resourceType && log.resourceId === resourceId
    );
  }
}
