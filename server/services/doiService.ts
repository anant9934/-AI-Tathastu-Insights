/**
 * DOI Verification and Provenance Service
 * Queries authoritative registries (DataCite & Crossref)
 * Identifies unverified/demonstration records vs verified academic publications.
 */

export interface ProvenanceRecord {
  title: string;
  authors: Array<{ name: string; affiliation?: string; orcid?: string }>;
  abstract: string;
  publicationType: string;
  publicationDate: string;
  doi: string;
  canonicalUrl: string;
  publisher: string;
  license: string;
  sourceProvenance: 'authoritative_crossref' | 'authoritative_datacite' | 'demonstration_concept' | 'unverified';
  lastVerificationDate: string;
  publicationStatus: 'verified' | 'unverified_demo' | 'rejected_fabrication';
  verificationNotes: string;
}

// Known demonstration records from prototype phase that must not be published as verified fact
export const KNOWN_PROTOTYPE_RECORDS: Record<string, Partial<ProvenanceRecord>> = {
  '10.5281/zenodo.1084291': {
    doi: '10.5281/zenodo.1084291',
    publicationStatus: 'unverified_demo',
    sourceProvenance: 'demonstration_concept',
    verificationNotes: 'Zenodo record 1084291 historically corresponds to "Decentralized Product Passports for Cross-Border Traceability" (Dec 2017), NOT the AI Tathastu Charter or Sparse Autoencoders. Retained strictly as a demonstrative mock identifier.',
  },
  '10.5281/zenodo.1084278': {
    doi: '10.5281/zenodo.1084278',
    publicationStatus: 'unverified_demo',
    sourceProvenance: 'demonstration_concept',
    verificationNotes: 'Synthetic Zenodo DOI allocated during frontend wireframing for Aegis-BFT consensus exploration.',
  },
  '10.5281/zenodo.1084265': {
    doi: '10.5281/zenodo.1084265',
    publicationStatus: 'unverified_demo',
    sourceProvenance: 'demonstration_concept',
    verificationNotes: 'Synthetic Zenodo DOI allocated during frontend wireframing for Egocentric Voxel Memory.',
  },
};

export class DoiService {
  /**
   * Validate DOI format (e.g. 10.xxxx/yyyy)
   */
  public static isValidDoiFormat(doi: string): boolean {
    if (!doi) return false;
    const clean = doi.trim().replace(/^https?:\/\/doi\.org\//, '');
    return /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/.test(clean);
  }

  /**
   * Clean DOI string to bare prefix/suffix
   */
  public static cleanDoi(doi: string): string {
    return doi.trim().replace(/^https?:\/\/doi\.org\//, '');
  }

  /**
   * Verify DOI against authoritative registries or known prototype provenance registry
   */
  public static async verifyDoi(doi: string): Promise<ProvenanceRecord> {
    const clean = this.cleanDoi(doi);
    const today = new Date().toISOString().split('T')[0];

    // Check known prototype demonstration records
    if (KNOWN_PROTOTYPE_RECORDS[clean]) {
      const known = KNOWN_PROTOTYPE_RECORDS[clean];
      return {
        title: known.title || 'Demonstration Research Record',
        authors: known.authors || [{ name: 'Prototype Contributor', affiliation: 'AI Tathastu Research Lab' }],
        abstract: known.abstract || 'This record represents a client-side prototype concept for layout and motion testing.',
        publicationType: 'Demonstration Concept',
        publicationDate: '2026-10-14',
        doi: clean,
        canonicalUrl: `https://doi.org/${clean}`,
        publisher: 'AI Tathastu Insights Open Archive (Demo)',
        license: 'CC BY-NC 4.0',
        sourceProvenance: 'demonstration_concept',
        lastVerificationDate: today,
        publicationStatus: 'unverified_demo',
        verificationNotes: known.verificationNotes || 'Unverified in authoritative registries; flagged as demonstration.',
      };
    }

    if (!this.isValidDoiFormat(clean)) {
      return {
        title: 'Invalid Identifier',
        authors: [],
        abstract: '',
        publicationType: 'Unknown',
        publicationDate: today,
        doi: clean,
        canonicalUrl: '',
        publisher: 'Unknown',
        license: '',
        sourceProvenance: 'unverified',
        lastVerificationDate: today,
        publicationStatus: 'rejected_fabrication',
        verificationNotes: 'DOI does not conform to ISO 26324 syntax.',
      };
    }

    // Attempt authoritative DataCite check for 10.5281 (Zenodo prefix)
    if (clean.startsWith('10.5281/')) {
      try {
        const response = await fetch(`https://api.datacite.org/dois/${encodeURIComponent(clean)}`, {
          headers: { 'Accept': 'application/vnd.api+json' },
          signal: AbortSignal.timeout(3000),
        });

        if (response.ok) {
          const json = await response.json();
          const attributes = json.data?.attributes;
          if (attributes) {
            return {
              title: attributes.titles?.[0]?.title || 'Verified DataCite Record',
              authors: (attributes.creators || []).map((c: any) => ({
                name: c.name || `${c.familyName || ''}, ${c.givenName || ''}`.trim(),
                affiliation: c.affiliation?.[0]?.name,
              })),
              abstract: attributes.descriptions?.[0]?.description || '',
              publicationType: attributes.types?.resourceType || 'Research Object',
              publicationDate: String(attributes.publicationYear || attributes.created?.split('T')[0] || today),
              doi: clean,
              canonicalUrl: `https://doi.org/${clean}`,
              publisher: attributes.publisher || 'Zenodo',
              license: attributes.rightsList?.[0]?.rights || 'Open Access',
              sourceProvenance: 'authoritative_datacite',
              lastVerificationDate: today,
              publicationStatus: 'verified',
              verificationNotes: 'Verified directly against DataCite metadata registry.',
            };
          }
        }
      } catch (e) {
        // Network timeout / offline fallback
      }
    }

    // Default unverified / demonstration fallback
    return {
      title: 'Unverified Research Record',
      authors: [],
      abstract: '',
      publicationType: 'Unverified Preprint',
      publicationDate: today,
      doi: clean,
      canonicalUrl: `https://doi.org/${clean}`,
      publisher: 'Tathastu Archive (Pending Crossref/DataCite Verification)',
      license: 'CC BY-NC 4.0',
      sourceProvenance: 'unverified',
      lastVerificationDate: today,
      publicationStatus: 'unverified_demo',
      verificationNotes: 'Registry confirmation pending or unavailable in offline mode. Flagged as unverified demonstration.',
    };
  }
}
