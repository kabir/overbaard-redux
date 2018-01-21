import {IssueHeightCalculator, LineFitter, LineOverflowFitter, WordAndWidthSplitter} from './issue-height-calculator';

describe('Issue Size Calculator Tests', () => {
  describe('Splitting and word counts', () => {
    it ('Test', () => {
      checkSplit('ABC', 'ABC');
      checkSplit('    ABC', 'ABC');
      checkSplit('ABC     ', 'ABC');
      checkSplit('ABC DEFG', 'ABC', 'DEFG');
      checkSplit('ABC      DEFG IJK   LMNOPQ', 'ABC', 'DEFG', 'IJK', 'LMNOPQ');
      checkSplit('     ABC      DEFG IJK   LMNOPQ      ', 'ABC', 'DEFG', 'IJK', 'LMNOPQ');
    });

    function checkSplit(s: string, ...expectedWords: string[]) {
      const splitter: WordAndWidthSplitter = WordAndWidthSplitter.create(s, character => 1);
      expect(splitter.words).toEqual(expectedWords);
      expect(splitter.wordWidths).toEqual(expectedWords.map(word => word.length));
    }
  });

  describe('Line counting', () => {
    describe('Full summary', () => {
      it ('One line', () => {
        let fitter: LineFitter = createFitter(
          ['abc', 'de'], 7, 0);
        expect(fitter.summaryLines).toEqual(['abc de']);

        fitter = createFitter(
          ['abc', 'def'], 7, 0);
        expect(fitter.summaryLines).toEqual(['abc def']);

        fitter = createFitter(
          ['abc', 'de', 'i'], 8, 0);
        expect(fitter.summaryLines).toEqual(['abc de i']);
      });

      it ('Normal line break', () => {
        let fitter: LineFitter = createFitter(
          ['abc', 'def', 'ijkl'], 8, 0);
        expect(fitter.summaryLines).toEqual(['abc def', 'ijkl']);

        fitter = createFitter(
          ['abc', 'def', 'ij'], 8, 0);
        expect(fitter.summaryLines).toEqual(['abc def', 'ij']);

        fitter = createFitter(
          ['abc', 'defg', 'ijkl', 'mno'], 8, 0);
        expect(fitter.summaryLines).toEqual(['abc defg', 'ijkl mno']);

        fitter = createFitter(
          ['abc', 'def', 'ijkl', 'mnop'], 8, 0);
        expect(fitter.summaryLines).toEqual(['abc def', 'ijkl', 'mnop']);

        fitter = createFitter(
          ['abc', 'defg', 'ijkl', 'mnop', 'qrs'], 8, 0);
        expect(fitter.summaryLines).toEqual(['abc defg', 'ijkl', 'mnop qrs']);

        fitter = createFitter(
          ['abc', 'def', 'ijkl', 'mnop', 'qrst'], 8, 0);
        expect(fitter.summaryLines).toEqual(['abc def', 'ijkl', 'mnop', 'qrst']);
      });

      describe('Long overflowing word', () => {
        it('2 line word', () => {
          let fitter: LineFitter = createFitter(
            ['abcdef'], 5, 0);
          expect(fitter.summaryLines).toEqual(['abcde', 'f']);

          fitter = createFitter(
            ['a', 'bcdefgh'], 5, 0);
          expect(fitter.summaryLines).toEqual(['a bcd', 'efgh']);

          fitter = createFitter(
            ['ab', 'cdefgh'], 5, 0);
          expect(fitter.summaryLines).toEqual(['ab cd', 'efgh']);


          fitter = createFitter(
            ['abc', 'defghi'], 5, 0);
          expect(fitter.summaryLines).toEqual(['abc d', 'efghi']);

          fitter = createFitter(
            ['abcd', 'efghij'], 5, 0);
          expect(fitter.summaryLines).toEqual(['abcd ', 'efghi', 'j']);

          fitter = createFitter(
            ['a', 'b', 'cd', 'ef', 'ghijkl'], 5, 0);
          expect(fitter.summaryLines).toEqual(['a b', 'cd ef', 'ghijk', 'l']);

          fitter = createFitter(
            ['a', 'b', 'cd', 'efghij', 'kl'], 5, 0);
          expect(fitter.summaryLines).toEqual(['a b', 'cd ef', 'ghij', 'kl']);

        });
        it('3 line word', () => {
          let fitter: LineFitter = createFitter(
            ['abcdefghijklmno'], 5, 0);
          expect(fitter.summaryLines).toEqual(['abcde', 'fghij', 'klmno']);
          fitter = createFitter(
            ['a', 'bcdefghijklmno'], 5, 0);
          expect(fitter.summaryLines).toEqual(['a bcd', 'efghi', 'jklmn', 'o']);

          fitter = createFitter(
            ['abcd', 'efghijklmno'], 5, 0);
          expect(fitter.summaryLines).toEqual(['abcd ', 'efghi', 'jklmn', 'o']);
        });

        it ('Mixed short and long words', () => {
          let fitter: LineFitter = createFitter(
            ['a', 'bcde', 'f', 'ghijk', 'l'], 4, 0);
          expect(fitter.summaryLines).toEqual(['a', 'bcde', 'f gh', 'ijk', 'l']);

          fitter = createFitter(
            ['ab', 'cdefgh', 'i', 'jklmn', 'pq', 'rstuvwxyz'], 4, 0);
          expect(fitter.summaryLines).toEqual(['ab c', 'defg', 'h i ', 'jklm', 'n pq', 'rstu', 'vwxy', 'z']);
        });
      });
    });

    function createFitter(words: string[], lineWidth: number, maxLines: number): LineFitter {
      const wordWidths: number[] = words.map(word => word.length);
      return LineFitter.create(words, wordWidths, maxLines, character => 1, line =>  lineWidth);
    }
  });
})
