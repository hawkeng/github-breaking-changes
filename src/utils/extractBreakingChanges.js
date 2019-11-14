/**
 * The purpose of the following regex is to capture the markdown list that
 * exists between the (possibly) heading of "Breaking changes"
 * (case-insensitive) and the next double line-break (\r\n\r\n)
 *
 * Regex Explanation:
 * #{0,6}\s? - Matches from 0 to 6 `#` characters (markdown heading) followed by
 * and optional space character.
 *
 * (?::\w*:\s)? - Non-capturing group to match optional emoji syntax
 * (e.g. :nail_care:) followed by a space character.
 *
 * breaking.?changes?:?\r\n(?:\r\n)? - Matches "breaking" followed by optional
 * character like a space or dash followed by "change" or "changes" followed by
 * optional `:` character followed by a line-break optionally followed by
 * another (non-capturing) line-break.
 *
 * ([*+-][\s\S]*?)\r\n\r\n - Non-greedy capture of all whitespace and
 * non-whitespace characters after a `*`, `+` or * `-` symbol and before a
 * double line-break, this is because unordered markdown lists start with such
 * characters.
 */
const EXTRACT_REGEX = /#{0,6}\s?(?::\w*:\s)?breaking.?changes?:?\r\n(?:\r\n)?([*+-][\s\S]*?)\r\n\r\n/gi;

/**
 * @param {Object} options
 * @param {String} options.text - Release description where the list of breaking
 *  changes should be
 * @param {RegExp} [options.regex=EXTRACT_REGEX] - Optional regex to get the
 *  breaking changes markdown string
 * @returns {String|null} - Full breaking changes markdown string
 */
export default function extractBreakingChanges({
  text,
  regex = EXTRACT_REGEX
} = {}) {
  let result = "";
  let match;
  while ((match = regex.exec(text)) !== null) {
    const [_, captureGroup] = match;
    result += captureGroup;
  }

  return result.length ? result : null;
}
