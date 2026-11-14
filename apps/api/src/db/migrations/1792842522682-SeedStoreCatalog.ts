import { MigrationInterface, QueryRunner } from 'typeorm';

const CURRENCY = 'PLN';
const YEARLY_PRICE_IN_MONTHS = 10;

const APPLICATIONS = [
  {
    slug: 'photo-studio',
    name: 'Photo Studio',
    description: 'Edit, retouch and composite photos and images.',
    monthlyAmountMinor: 4999,
  },
  {
    slug: 'photo-library',
    name: 'Photo Library',
    description: 'Organize, sync and quickly develop your photo collection.',
    monthlyAmountMinor: 2499,
  },
  {
    slug: 'vector-studio',
    name: 'Vector Studio',
    description: 'Create logos, icons and illustrations with vector graphics.',
    monthlyAmountMinor: 4999,
  },
  {
    slug: 'layout-studio',
    name: 'Layout Studio',
    description: 'Design page layouts for print and digital publishing.',
    monthlyAmountMinor: 4999,
  },
  {
    slug: 'video-studio',
    name: 'Video Studio',
    description: 'Edit and produce videos for film, TV and the web.',
    monthlyAmountMinor: 5999,
  },
  {
    slug: 'motion-studio',
    name: 'Motion Studio',
    description: 'Build motion graphics, animations and visual effects.',
    monthlyAmountMinor: 5999,
  },
  {
    slug: 'audio-studio',
    name: 'Audio Studio',
    description: 'Record, mix and restore audio.',
    monthlyAmountMinor: 3999,
  },
  {
    slug: 'pdf-studio',
    name: 'PDF Studio',
    description: 'Create, edit, sign and share PDF documents.',
    monthlyAmountMinor: 2999,
  },
];

const BUNDLES = [
  {
    slug: 'photography',
    name: 'Photography',
    description: 'Everything you need to edit and organize your photos.',
    sortOrder: 1,
    monthlyAmountMinor: 5499,
    applicationSlugs: ['photo-studio', 'photo-library'],
  },
  {
    slug: 'design',
    name: 'Design',
    description: 'Image, vector and layout tools for designers.',
    sortOrder: 2,
    monthlyAmountMinor: 10999,
    applicationSlugs: ['photo-studio', 'vector-studio', 'layout-studio'],
  },
  {
    slug: 'video',
    name: 'Video',
    description: 'Edit footage, add motion graphics and polish the sound.',
    sortOrder: 3,
    monthlyAmountMinor: 11999,
    applicationSlugs: ['video-studio', 'motion-studio', 'audio-studio'],
  },
  {
    slug: 'all-apps',
    name: 'All Apps',
    description: 'Every application in the store.',
    sortOrder: 4,
    monthlyAmountMinor: 24999,
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

export class SeedStoreCatalog1792842522682 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { manager } = queryRunner;

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
  }
}
