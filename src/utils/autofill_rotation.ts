/** Count selectable qualifications without applying date-specific availability. */
export const getAutofillRotationPoolSizes = (
  eligibility: ReadonlyMap<number, ReadonlySet<string>>,
  selectablePersonUIDs: ReadonlySet<string>
) =>
  new Map(
    [...eligibility].map(([code, qualifiedUIDs]) => [
      code,
      [...qualifiedUIDs].filter((uid) => selectablePersonUIDs.has(uid)).length,
    ])
  );
