// src/lib/constants.ts

export const CATEGORY_META = {
  tech: {
    label: 'Tech',
    icon: 'solar:code-bold',
    tagClass: 'tag-tech',
  },

  design: {
    label: 'Design',
    icon: 'solar:palette-bold',
    tagClass: 'tag-design',
  },

  startup: {
    label: 'Startup',
    icon: 'solar:rocket-bold',
    tagClass: 'tag-startup',
  },

  career: {
    label: 'Career',
    icon: 'solar:case-bold',
    tagClass: 'tag-career',
  },

  community: {
    label: 'Community',
    icon: 'solar:users-group-rounded-bold',
    tagClass: 'tag-community',
  },
} as const

export type CategoryKey = keyof typeof CATEGORY_META
