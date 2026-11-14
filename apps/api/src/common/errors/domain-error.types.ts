import type { DOMAIN_ERROR_KINDS } from './domain-error.constants';

export type DomainErrorKind =
  (typeof DOMAIN_ERROR_KINDS)[keyof typeof DOMAIN_ERROR_KINDS];

export type DomainErrorDefinition<TCode extends string = string> = {
  kind: DomainErrorKind;
  code: TCode;
  message: string;
  reason: string;
};

/** One error definition per key of `TCodes`, each bound to exactly that key's code. */
export type DomainErrorCatalog<TCodes extends Record<string, string>> = {
  readonly [Name in keyof TCodes]: DomainErrorDefinition<TCodes[Name]>;
};
