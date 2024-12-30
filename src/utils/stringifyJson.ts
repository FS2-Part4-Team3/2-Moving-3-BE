export default function stringifyJson(target: object) {
  return JSON.stringify(target, null, 2);
}
