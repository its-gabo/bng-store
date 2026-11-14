import { MigrationInterface, QueryRunner } from 'typeorm';

const CURRENCY = 'PLN';
const YEARLY_PRICE_IN_MONTHS = 10;

const PLACEHOLDER_APPLICATION_SLUGS = [
  'photo-studio',
  'photo-library',
  'vector-studio',
  'layout-studio',
  'video-studio',
  'motion-studio',
  'audio-studio',
  'pdf-studio',
];

const PLACEHOLDER_BUNDLE_SLUGS = ['photography', 'design', 'video', 'all-apps'];

const APPLICATIONS = [
  {
    slug: 'photocraft',
    name: 'PhotoCraft',
    description: 'Edit, retouch and composite photos and images.',
    monthlyAmountMinor: 4999,
  },
  {
    slug: 'lightcraft',
    name: 'LightCraft',
    description: 'Organize your photo library and develop raw files locally.',
    monthlyAmountMinor: 2499,
  },
  {
    slug: 'vectorcraft',
    name: 'VectorCraft',
    description: 'Draw logos, icons and illustrations with vector graphics.',
    monthlyAmountMinor: 4999,
  },
  {
    slug: 'designcraft',
    name: 'DesignCraft',
    description: 'Lay out pages for print and digital publishing.',
    monthlyAmountMinor: 4499,
  },
  {
    slug: 'figcraft',
    name: 'FigCraft',
    description: 'Design and prototype user interfaces.',
    monthlyAmountMinor: 3999,
  },
  {
    slug: 'filmcraft',
    name: 'FilmCraft',
    description: 'Edit and produce video for film, TV and the web.',
    monthlyAmountMinor: 5999,
  },
  {
    slug: 'effectcraft',
    name: 'EffectCraft',
    description: 'Build motion graphics and visual effects.',
    monthlyAmountMinor: 5999,
  },
  {
    slug: 'anicraft',
    name: 'AniCraft',
    description: 'Create 2D vector animation.',
    monthlyAmountMinor: 3999,
  },
  {
    slug: 'soundcraft',
    name: 'SoundCraft',
    description: 'Record, edit and mix audio.',
    monthlyAmountMinor: 3999,
  },
  {
    slug: 'texturecraft',
    name: 'TextureCraft',
    description: 'Paint textures directly onto 3D models.',
    monthlyAmountMinor: 4499,
  },
  {
    slug: 'materialcraft',
    name: 'MaterialCraft',
    description: 'Author procedural materials with a node graph.',
    monthlyAmountMinor: 3999,
  },
  {
    slug: 'cadcraft',
    name: 'CADCraft',
    description: 'Draft and model with computer-aided design tools.',
    monthlyAmountMinor: 6999,
  },
  {
    slug: 'pdfcraft',
    name: 'PdfCraft',
    description: 'Read, organize, merge, split and secure PDF documents.',
    monthlyAmountMinor: 2999,
  },
  {
    slug: 'wordcraft',
    name: 'WordCraft',
    description: 'Write and format documents.',
    monthlyAmountMinor: 1999,
  },
  {
    slug: 'deckcraft',
    name: 'DeckCraft',
    description: 'Build and present slide decks.',
    monthlyAmountMinor: 1999,
  },
  {
    slug: 'gridcraft',
    name: 'GridCraft',
    description: 'Work with spreadsheets and analyze data.',
    monthlyAmountMinor: 1999,
  },
  {
    slug: 'craft-anything',
    name: 'Craft Anything',
    description: 'Explore how software works and build your own version.',
    monthlyAmountMinor: 2999,
  },
];

const BUNDLES = [
  {
    slug: 'photography',
    name: 'Photography',
    description: 'Edit, organize and develop your photos.',
    sortOrder: 1,
    monthlyAmountMinor: 5499,
    applicationSlugs: ['photocraft', 'lightcraft'],
  },
  {
    slug: 'design',
    name: 'Design',
    description: 'Image, vector, layout and interface tools for designers.',
    sortOrder: 2,
    monthlyAmountMinor: 11999,
    applicationSlugs: ['photocraft', 'vectorcraft', 'designcraft', 'figcraft'],
  },
  {
    slug: 'video',
    name: 'Video',
    description: 'Edit footage, animate, add effects and polish the sound.',
    sortOrder: 3,
    monthlyAmountMinor: 12999,
    applicationSlugs: ['filmcraft', 'effectcraft', 'anicraft', 'soundcraft'],
  },
  {
    slug: '3d',
    name: '3D',
    description: 'Texture, material and CAD tools for 3D work.',
    sortOrder: 4,
    monthlyAmountMinor: 9999,
    applicationSlugs: ['texturecraft', 'materialcraft', 'cadcraft'],
  },
  {
    slug: 'office',
    name: 'Office',
    description: 'Documents, slides, spreadsheets and PDFs.',
    sortOrder: 5,
    monthlyAmountMinor: 5999,
    applicationSlugs: ['wordcraft', 'deckcraft', 'gridcraft', 'pdfcraft'],
  },
  {
    slug: 'all-apps',
    name: 'All Apps',
    description: 'Every Craft app in the store.',
    sortOrder: 6,
    monthlyAmountMinor: 27999,
    applicationSlugs: APPLICATIONS.map(({ slug }) => slug),
  },
];

const toMonthlyAndYearlyPrices = (monthlyAmountMinor: number) => [
  { billingPeriod: 'monthly', amountMinor: monthlyAmountMinor },
  {
    billingPeriod: 'yearly',
    amountMinor: monthlyAmountMinor * YEARLY_PRICE_IN_MONTHS,
  },
];

/**
 * Retires the placeholder catalog instead of deleting it, because existing
 * orders and subscriptions still reference it, and seeds the Craft apps.
 * Placeholder bundle slugs are reused, so they are renamed before retiring.
 */
export class ReplaceStoreCatalogWithCraftApps1794653408975 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { manager } = queryRunner;

    await manager
      .createQueryBuilder()
      .update('applications')
      .set({ isActive: false })
      .where('slug IN (:...slugs)', { slugs: PLACEHOLDER_APPLICATION_SLUGS })
      .execute();

    for (const slug of PLACEHOLDER_BUNDLE_SLUGS) {
      await manager
        .createQueryBuilder()
        .update('bundles')
        .set({ slug: `retired-${slug}`, isActive: false })
        .where('slug = :slug', { slug })
        .execute();
    }

    const insertedApplications = await manager
      .createQueryBuilder()
      .insert()
      .into('applications')
      .values(
        APPLICATIONS.map(({ slug, name, description }) => ({
          slug,
          name,
          description,
        })),
      )
      .returning('"id", "slug"')
      .execute();

    const applicationIdBySlug = new Map(
      (insertedApplications.raw as { id: string; slug: string }[]).map(
        ({ id, slug }) => [slug, id],
      ),
    );

    await manager
      .createQueryBuilder()
      .insert()
      .into('application_prices')
      .values(
        APPLICATIONS.flatMap(({ slug, monthlyAmountMinor }) =>
          toMonthlyAndYearlyPrices(monthlyAmountMinor).map((price) => ({
            applicationId: applicationIdBySlug.get(slug),
            ...price,
            currency: CURRENCY,
          })),
        ),
      )
      .execute();

    const insertedBundles = await manager
      .createQueryBuilder()
      .insert()
      .into('bundles')
      .values(
        BUNDLES.map(({ slug, name, description, sortOrder }) => ({
          slug,
          name,
          description,
          sortOrder,
        })),
      )
      .returning('"id", "slug"')
      .execute();

    const bundleIdBySlug = new Map(
      (insertedBundles.raw as { id: string; slug: string }[]).map(
        ({ id, slug }) => [slug, id],
      ),
    );

    await manager
      .createQueryBuilder()
      .insert()
      .into('bundle_applications')
      .values(
        BUNDLES.flatMap(({ slug, applicationSlugs }) =>
          applicationSlugs.map((applicationSlug) => ({
            bundleId: bundleIdBySlug.get(slug),
            applicationId: applicationIdBySlug.get(applicationSlug),
          })),
        ),
      )
      .execute();

    await manager
      .createQueryBuilder()
      .insert()
      .into('bundle_prices')
      .values(
        BUNDLES.flatMap(({ slug, monthlyAmountMinor }) =>
          toMonthlyAndYearlyPrices(monthlyAmountMinor).map((price) => ({
            bundleId: bundleIdBySlug.get(slug),
            ...price,
            currency: CURRENCY,
          })),
        ),
      )
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { manager } = queryRunner;

    await manager
      .createQueryBuilder()
      .delete()
      .from('bundles')
      .where('slug IN (:...slugs)', { slugs: BUNDLES.map(({ slug }) => slug) })
      .execute();

    await manager
      .createQueryBuilder()
      .delete()
      .from('applications')
      .where('slug IN (:...slugs)', {
        slugs: APPLICATIONS.map(({ slug }) => slug),
      })
      .execute();

    for (const slug of PLACEHOLDER_BUNDLE_SLUGS) {
      await manager
        .createQueryBuilder()
        .update('bundles')
        .set({ slug, isActive: true })
        .where('slug = :retiredSlug', { retiredSlug: `retired-${slug}` })
        .execute();
    }

    await manager
      .createQueryBuilder()
      .update('applications')
      .set({ isActive: true })
      .where('slug IN (:...slugs)', { slugs: PLACEHOLDER_APPLICATION_SLUGS })
      .execute();
  }
}
