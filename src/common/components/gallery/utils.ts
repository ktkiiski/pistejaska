// map from virtual index (any number) to array index to allow looping
// examples:
//  2 in [a,b,c] => c
//  4 in [a,b,c] => a
// -2 in [a,b,c] => b
export function mapVirtualIdxToArrayIdx(
  virtualIndex: number,
  arrLength: number
) {
  return ((virtualIndex % arrLength) + arrLength) % arrLength;
}
