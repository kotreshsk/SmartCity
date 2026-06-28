export const ISSUE_CATEGORIES = {
  POTHOLE: 'pothole_road_damage',
  WATER: 'water_leakage_flooding',
  STREETLIGHT: 'broken_streetlight',
  WASTE: 'waste_garbage_overflow',
  PROPERTY: 'damaged_public_property',
  TREE: 'fallen_tree_obstruction',
  OTHER: 'other_uncategorized'
};

export const CATEGORY_LABELS = {
  [ISSUE_CATEGORIES.POTHOLE]: 'Pothole / Road Damage',
  [ISSUE_CATEGORIES.WATER]: 'Water Leakage / Flooding',
  [ISSUE_CATEGORIES.STREETLIGHT]: 'Broken Streetlight',
  [ISSUE_CATEGORIES.WASTE]: 'Waste / Garbage Overflow',
  [ISSUE_CATEGORIES.PROPERTY]: 'Damaged Public Property',
  [ISSUE_CATEGORIES.TREE]: 'Fallen Tree / Obstruction',
  [ISSUE_CATEGORIES.OTHER]: 'Other / Uncategorized'
};

export const PIN_COLORS = {
  [ISSUE_CATEGORIES.POTHOLE]: '#EF4444',
  [ISSUE_CATEGORIES.WATER]: '#3B82F6',
  [ISSUE_CATEGORIES.STREETLIGHT]: '#F59E0B',
  [ISSUE_CATEGORIES.WASTE]: '#22C55E',
  [ISSUE_CATEGORIES.PROPERTY]: '#F97316',
  [ISSUE_CATEGORIES.TREE]: '#92400E',
  [ISSUE_CATEGORIES.OTHER]: '#9CA3AF'
};

export const SLA_HOURS = {
  [ISSUE_CATEGORIES.WATER]: 48,
  [ISSUE_CATEGORIES.TREE]: 48,
  [ISSUE_CATEGORIES.WASTE]: 72,
  [ISSUE_CATEGORIES.STREETLIGHT]: 120,
  [ISSUE_CATEGORIES.POTHOLE]: 168,
  [ISSUE_CATEGORIES.PROPERTY]: 168,
  [ISSUE_CATEGORIES.OTHER]: 168
};

export const ISSUE_STATUSES = {
  RECEIVED: 'received',
  REVIEWED: 'reviewed',
  PROGRESS: 'under_progress',
  RESOLVED_PENDING: 'resolved_pending',
  VERIFIED_CLOSED: 'verified_closed'
};

export const BADGES = [
  { id: 'first_responder', name: 'First Responder', description: 'First report in an area', icon: 'Flag', condition: 'first_report_in_area' },
  { id: 'community_watchdog', name: 'Community Watchdog', description: '5 verified reports', icon: 'Eye', condition: 'verified_reports >= 5' },
  { id: 'ground_verifier', name: 'Ground Verifier', description: 'Verified a contractor fix in person', icon: 'CheckCircle', condition: 'verified_fix' },
  { id: 'problem_solver', name: 'Problem Solver', description: 'Issue you reported gets resolved', icon: 'Wrench', condition: 'own_issue_resolved' },
  { id: 'active_citizen', name: 'Active Citizen', description: '10 upvotes spent on resolved issues', icon: 'ThumbsUp', condition: 'upvotes_on_resolved >= 10' }
];

export const APP_CONFIG = {
  MAP_RADIUS_KM: parseInt(import.meta.env.VITE_MAP_RADIUS_KM || '5'),
  MERGE_RADIUS_METERS: parseInt(import.meta.env.VITE_MERGE_RADIUS_METERS || '20'),
  MAX_VIDEO_DURATION_SECONDS: parseInt(import.meta.env.VITE_MAX_VIDEO_DURATION_SECONDS || '20'),
  UPVOTES_PER_WEEK: parseInt(import.meta.env.VITE_UPVOTES_PER_WEEK || '3'),
  VERIFICATION_WINDOW_HOURS: parseInt(import.meta.env.VITE_VERIFICATION_WINDOW_HOURS || '72')
};
