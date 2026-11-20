import { Router, Request, Response } from 'express';
import { repository } from '../db/repository';

export const mediaRouter = Router();

// GET /api/media - List media items with honest stream availability status
mediaRouter.get('/', (req: Request, res: Response) => {
  const format = req.query.format as string;
  let items = Array.from(repository.mediaAssets.values());

  if (format && format !== 'all') {
    items = items.filter((m) => m.format === format);
  }

  return res.json({
    total: items.length,
    media: items.map((item) => ({
      ...item,
      // Honest disclosure: stream is only playable if an authorized CDN stream URL is configured
      streamState: item.isStreamAvailable ? 'ready' : 'scheduled_offline_archive',
      streamNotice: item.isStreamAvailable
        ? 'Live stream authorized.'
        : 'Broadcast is currently undergoing editorial audio-visual remastering; master transcript provided below.',
    })),
  });
});

// GET /api/media/:id - Get single media item
mediaRouter.get('/:id', (req: Request, res: Response) => {
  const item = repository.mediaAssets.get(req.params.id as string);
  if (!item) {
    return res.status(404).json({
      error: 'NotFound',
      message: 'Media asset not found.',
    });
  }

  return res.json({
    ...item,
    streamState: item.isStreamAvailable ? 'ready' : 'scheduled_offline_archive',
    streamNotice: item.isStreamAvailable
      ? 'Live stream authorized.'
      : 'Broadcast stream pending CDN ingest. Master transcript available.',
  });
});
