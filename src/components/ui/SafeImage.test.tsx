import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SafeImage } from './SafeImage';

describe('SafeImage', () => {
  it('updates the rendered image when src changes after initial render', () => {
    const fallbackSrc = 'https://example.com/fallback.jpg';
    const uploadedSrc = 'https://example.com/uploaded.jpg';

    const { rerender } = render(
      <SafeImage src="" fallbackSrc={fallbackSrc} alt="Uploaded media" />,
    );

    expect(screen.getByAltText('Uploaded media').getAttribute('src')).toBe(fallbackSrc);

    rerender(
      <SafeImage src={uploadedSrc} fallbackSrc={fallbackSrc} alt="Uploaded media" />,
    );

    expect(screen.getByAltText('Uploaded media').getAttribute('src')).toBe(uploadedSrc);
  });
});
