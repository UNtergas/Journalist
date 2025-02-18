import { LEVEL, SKILLTYPE, SkillValidationMap } from "../model/skill.dto";

const LEVEL_VALUES: Record<keyof typeof LEVEL, number> = {
    BASIC: 1,
    INTERMEDIATE: 2,
    ADVANCED: 3,
    EXPERT: 4,
};

export const mapSkillWithValidationLevel = (validatedSkills: SkillValidationMap[]) => {
    // Initialize all skill types with a default level of 0
    const skillMap: Record<string, number> = Object.keys(SKILLTYPE).reduce((acc, key) => {
        acc[key] = 0;
        return acc;
    }, {} as Record<string, number>);

    // Update the map with actual validated levels
    validatedSkills.forEach(({ skillType, validatedLevel }) => {
        if (skillType in skillMap) {
        skillMap[skillType] = LEVEL_VALUES[validatedLevel as keyof typeof LEVEL] || 0;
        }
    });
    // Convert to an array for Mantine Radar Chart
    return Object.entries(skillMap).map(([skill, value]) => ({
        skill,
        value,
    }));
};
  