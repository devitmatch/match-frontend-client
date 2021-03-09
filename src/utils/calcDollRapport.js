export default function calcDollRapport(printWidth, printHeight, dollMeasure) {
  const dollMeasureProportion = dollMeasure || 26;
  if (printWidth < printHeight) {
    const width = (dollMeasureProportion * printWidth) / 32;
    const height = (width * printHeight) / printWidth;
    return height;
  }
  const height = (dollMeasureProportion * printHeight) / 32;

  return height;
}
