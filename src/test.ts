// const x = [];

// x.push(`let s = /** @type {import("@/type").TypeOfSubject} */ ();`);
// x.push(`/** @type {import("@/type").TypeOfSubject[]} */`);
// x.push(`/** @type {import("@/type").TypeOfSubject} */`);
// x.push(
//   `* @param {import("@/app/api/siswa/add/route").ApiSiswaAddPayload} students`
// );
// x.push(`let s = /** @type {import("@/type").TypeOfSubject[]} */ ([]);`);

// for (const s of x) {
//   console.log(docParse(s));
// }

/**
 *
 * @param {string} s
 */
function docParse(s: string) {
  const m = s.match(/(.*?)(\*.*})(.*)/);

  const path = m?.[2].match(/(.*\{)(.*\))/)?.[2];
  const x1 = m?.[1].replace("/", "").trim();
  const x2 = m?.[2]
    .replace(/.*\./, "")
    .replace("}", "")
    .replace("[]", "")
    .trim();
  const x3 = m?.[3].replace("*/", "").trim();

  const prefix = m?.[0].indexOf("@param") !== -1 ? "* @param" : "/** @type";
  const isArray = m?.[2].indexOf("[]") !== -1 ? "[]" : "";

  const typedef = `/** @typedef {${path}.${x2}} ${x2} */`;
  let type = "";
  if (prefix === "* @param") {
    type = `${x1} ${prefix} {${x2}${isArray}} ${x3}`;
  } else {
    type = `${x1} ${prefix} {${x2}${isArray}} */ ${x3}`;
  }
  return { x1, x2, x3, path, typedef, type };
}

export { docParse };
