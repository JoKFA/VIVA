import type { Partner } from '../../types';

interface PartnerStripProps {
  partners: Partner[];
}

export function PartnerStrip({ partners }: PartnerStripProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center justify-start md:justify-center gap-8 md:gap-12 py-8 px-4 min-w-max md:min-w-0">
        {partners.map((partner) => (
          <a
            key={partner.id}
            href={partner.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex-shrink-0"
          >
            <img
              src={partner.logoUrl}
              alt={partner.name}
              className="h-12 md:h-16 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
