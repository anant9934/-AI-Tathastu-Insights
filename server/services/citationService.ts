/**
 * Citation and BibTeX Generation Service
 */

export interface CitationMetadata {
  title: string;
  authors: Array<{ name: string }>;
  year: number | string;
  journal?: string;
  volume?: number | string;
  issue?: number | string;
  pages?: string;
  publisher?: string;
  doi?: string;
  url?: string;
  isVerified?: boolean;
}

export class CitationService {
  /**
   * Format authors into "Last, F. and Last, F."
   */
  public static formatBibtexAuthors(authors: Array<{ name: string }>): string {
    if (!authors || authors.length === 0) return 'Tathastu Research Collective';
    return authors.map((a) => {
      const parts = a.name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0];
      const last = parts[parts.length - 1];
      const rest = parts.slice(0, parts.length - 1).join(' ');
      return `${last}, ${rest}`;
    }).join(' and ');
  }

  /**
   * Generate valid BibTeX string
   */
  public static generateBibtex(meta: CitationMetadata, citationKey?: string): string {
    const key = citationKey || meta.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16) + meta.year;
    const authorStr = this.formatBibtexAuthors(meta.authors);
    const lines = [
      `@article{${key},`,
      `  title={${meta.title}},`,
      `  author={${authorStr}},`,
      `  journal={${meta.journal || 'AI Tathastu Insights'}},`,
      `  year={${meta.year}},`,
    ];

    if (meta.volume) lines.push(`  volume={${meta.volume}},`);
    if (meta.issue) lines.push(`  number={${meta.issue}},`);
    if (meta.pages) lines.push(`  pages={${meta.pages}},`);
    if (meta.publisher) lines.push(`  publisher={${meta.publisher}},`);
    if (meta.doi) lines.push(`  doi={${meta.doi}},`);
    if (meta.url) lines.push(`  url={${meta.url}},`);
    if (meta.isVerified === false) {
      lines.push(`  note={Demonstration Record - Pending Peer Review & Crossref DOI Minting},`);
    }

    lines.push(`}`);
    return lines.join('\n');
  }

  /**
   * Format APA 7th edition citation string
   */
  public static generateApa(meta: CitationMetadata): string {
    const authorStr = meta.authors.length > 0
      ? meta.authors.map((a) => a.name).join(', ')
      : 'AI Tathastu Insights Research Group';
    
    let citation = `${authorStr} (${meta.year}). ${meta.title}. *${meta.journal || 'AI Tathastu Insights'}*`;
    if (meta.volume) citation += `, ${meta.volume}`;
    if (meta.issue) citation += `(${meta.issue})`;
    if (meta.pages) citation += `, ${meta.pages}`;
    citation += '.';
    if (meta.doi) citation += ` https://doi.org/${meta.doi}`;
    return citation;
  }
}
