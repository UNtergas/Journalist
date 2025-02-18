import { Phase, PHASE } from "../model/activity.dto"
import { SkillType, SKILLTYPE } from "../model/skill.dto"

export const skillPhaseMapping: Record<Phase, SkillType[]>  = {
    [PHASE.STUDY]:[
        SKILLTYPE.ANALYTICAL,
        SKILLTYPE.PLANNING,
        SKILLTYPE.ADHESION,
    ],
    [PHASE.ACTION]:[
        SKILLTYPE.RESOURCE_MANAGEMENT,
        SKILLTYPE.INFOMATION_PROCESSING,
        SKILLTYPE.RISK_MANAGEMENT,
        SKILLTYPE.OPERATION_IMPLEMENTATION,
        SKILLTYPE.CONTROL,
    ],
    [PHASE.IMPROVEMENT]:[
        SKILLTYPE.CORRECTION,
        SKILLTYPE.MONITORING,
    ]
}

export function isValidSkillForPhase(skillType: SkillType, phase: Phase): boolean {
    return skillPhaseMapping[phase].includes(skillType);
}