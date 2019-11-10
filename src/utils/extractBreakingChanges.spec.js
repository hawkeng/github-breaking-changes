import { expect } from "chai";
import extractBreakingChanges from "./extractBreakingChanges";

it("should extract list", () => {
  const releaseDescription =
    "sometext\r\n\r\n### breaking changes:\r\n* First change\r\n*  Subitem\r\n* Second change\r\n\r\nsometext";

  const result = extractBreakingChanges({ text: releaseDescription });

  expect(result).to.equal("* First change\r\n*  Subitem\r\n* Second change");
});

it("should extract list with emoji in heading", () => {
  const releaseDescription =
    "sometext\r\n\r\n#### :boom: Breaking Change\r\n* First change\r\n*  Subitem\r\n* Second change\r\n\r\nsometext";

  const result = extractBreakingChanges({ text: releaseDescription });

  expect(result).to.equal("* First change\r\n*  Subitem\r\n* Second change");
});
