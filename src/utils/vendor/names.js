export function names(name) {
    return {
        name,
        className: toClassName(name),
        propertyName: toPropertyName(name),
        constantName: toConstantName(name),
        fileName: toFileName(name),
    };
}
export function namesValues(name) {
    return Object.values(names(name));
}
/**
 * Hyphenated to UpperCamelCase
 */
function toClassName(string_) {
    return toCapitalCase(toPropertyName(string_));
}
/**
 * Hyphenated to lowerCamelCase
 */
function toPropertyName(s) {
    return s
        .replace(/([^\dA-Za-z])+(.)?/g, (_, __, chr) => (chr ? chr.toUpperCase() : ''))
        .replace(/[^\dA-Za-z]/g, '')
        .replace(/^([A-Z])/, (m) => m.toLowerCase());
}
/**
 * Hyphenated to CONSTANT_CASE
 */
function toConstantName(s) {
    const normalizedS = s.toUpperCase() === s ? s.toLowerCase() : s;
    return toFileName(toPropertyName(normalizedS))
        .replace(/([^\dA-Za-z])/g, '_')
        .toUpperCase();
}
/**
 * Upper camelCase to lowercase, hyphenated
 */
function toFileName(s) {
    return s
        .replace(/([\da-z])([A-Z])/g, '$1_$2')
        .toLowerCase()
        .replace(/(?!^_)[ _]/g, '-');
}
/**
 * Capitalizes the first letter of a string
 */
function toCapitalCase(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
