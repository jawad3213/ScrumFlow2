/**
 * User Roles
 * Defines the available roles in the system.
 */
export const USER_ROLES = {
    MANAGER: 'chef',
    MEMBER: 'membre' // Assuming 'membre' is the other role, but 'chef' is the only critical one we've seen logic for.
};

/**
 * Project Statuses
 */
export const PROJECT_STATUS = {
    ACTIVE: 'active',
    PENDING: 'pending',
    COMPLETED: 'completed',
    ARCHIVED: 'archived'
};

/**
 * Role Levels and Hierarchy
 */
export const ROLE_LEVELS = {
    'Frontend Developer': ['Intern', 'Junior', 'Mid-level', 'Senior', 'Staff Engineer', 'Software Architect'],
    'Backend Developer': ['Intern', 'Junior', 'Mid-level', 'Senior', 'Staff Engineer', 'Software Architect'],
    'Fullstack Developer': ['Intern', 'Junior', 'Mid-level', 'Senior', 'Tech Lead', 'Software Architect'],
    'UI/UX Designer': ['Junior', 'Mid-level', 'Senior', 'Lead Designer', 'Design Principal'],
    'DevOps Engineer': ['Junior', 'Mid-level', 'Senior', 'SRE', 'Cloud Architect'],
    'Project Manager': ['Junior PM', 'Project Manager', 'Senior PM', 'Program Manager', 'Portfolio Manager'],
    'QA Engineer': ['Junior', 'Mid-level', 'Senior', 'QA Lead', 'SDET'],
};

export const ALL_ROLES = Object.keys(ROLE_LEVELS);

export const LEVEL_ORDER = [
    'Intern',
    'Junior PM',
    'Junior',
    'Mid-level',
    'Project Manager',
    'Senior PM',
    'Senior',
    'QA Lead',
    'Lead Designer',
    'Tech Lead',
    'Staff Engineer',
    'SRE',
    'Program Manager',
    'Design Principal',
    'Software Architect',
    'Cloud Architect',
    'Portfolio Manager',
    'SDET'
];
