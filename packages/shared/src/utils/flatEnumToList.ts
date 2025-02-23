export const flatEnumToList = <T extends string>(obj: Record<string, T>): [T, ...T[]] => {
    const values = Object.values(obj);
    if (values.length === 0) {
        throw new Error('Enum object must contain at least one value.');
    }
    return values as [T, ...T[]];
};