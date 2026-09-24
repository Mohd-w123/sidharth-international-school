export const ROLES = {
  SUPER_ADMIN: "super-admin",
  SCHOOL_ADMIN: "school-admin",
  CONTENT_EDITOR: "content-editor",
  ADMISSION_MANAGER: "admission-manager",
} as const;

export type RoleSlug = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  // Pages
  "pages.view": "View pages",
  "pages.create": "Create pages",
  "pages.update": "Update pages",
  "pages.delete": "Delete pages",
  "pages.publish": "Publish pages",

  // Homepage
  "homepage.view": "View homepage config",
  "homepage.update": "Update homepage config",
  "homepage.publish": "Publish homepage",

  // Menus
  "menus.view": "View menus",
  "menus.create": "Create menus",
  "menus.update": "Update menus",
  "menus.delete": "Delete menus",

  // Media
  "media.view": "View media",
  "media.upload": "Upload media",
  "media.update": "Update media",
  "media.delete": "Delete media",

  // News
  "news.view": "View news",
  "news.create": "Create news",
  "news.update": "Update news",
  "news.delete": "Delete news",
  "news.publish": "Publish news",

  // Events
  "events.view": "View events",
  "events.create": "Create events",
  "events.update": "Update events",
  "events.delete": "Delete events",
  "events.publish": "Publish events",

  // Gallery
  "gallery.view": "View gallery",
  "gallery.create": "Create albums",
  "gallery.update": "Update albums",
  "gallery.delete": "Delete albums",
  "gallery.publish": "Publish albums",

  // Faculty
  "faculty.view": "View faculty",
  "faculty.create": "Create faculty",
  "faculty.update": "Update faculty",
  "faculty.delete": "Delete faculty",

  // Academics
  "academics.view": "View academics",
  "academics.create": "Create academics",
  "academics.update": "Update academics",
  "academics.delete": "Delete academics",

  // Admissions
  "admissions.view": "View admissions",
  "admissions.create": "Create admissions",
  "admissions.update": "Update admissions",
  "admissions.delete": "Delete admissions",
  "admissions.publish": "Publish admissions",

  // Disclosure
  "disclosure.view": "View disclosure",
  "disclosure.create": "Create disclosure",
  "disclosure.update": "Update disclosure",
  "disclosure.delete": "Delete disclosure",

  // Results
  "results.view": "View results",
  "results.create": "Create results",
  "results.update": "Update results",
  "results.delete": "Delete results",
  "results.publish": "Publish results",

  // Transfer Certificates
  "tc.view": "View transfer certificates",
  "tc.create": "Create transfer certificates",
  "tc.update": "Update transfer certificates",
  "tc.delete": "Delete transfer certificates",

  // Forms
  "forms.view": "View forms",
  "forms.create": "Create forms",
  "forms.update": "Update forms",
  "forms.delete": "Delete forms",
  "forms.submissions": "View form submissions",

  // Users
  "users.view": "View users",
  "users.create": "Create users",
  "users.update": "Update users",
  "users.delete": "Delete users",

  // Roles
  "roles.view": "View roles",
  "roles.update": "Update roles",

  // Settings
  "settings.view": "View settings",
  "settings.update": "Update settings",

  // Audit
  "audit.view": "View audit logs",
} as const;

export type Permission = keyof typeof PERMISSIONS;

export const ROLE_PERMISSIONS: Record<RoleSlug, Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.keys(PERMISSIONS) as Permission[],

  [ROLES.SCHOOL_ADMIN]: Object.keys(PERMISSIONS).filter(
    (p) => !p.startsWith("roles.") && p !== "audit.view"
  ) as Permission[],

  [ROLES.CONTENT_EDITOR]: [
    "pages.view",
    "pages.create",
    "pages.update",
    "pages.publish",
    "homepage.view",
    "homepage.update",
    "homepage.publish",
    "menus.view",
    "menus.update",
    "media.view",
    "media.upload",
    "media.update",
    "news.view",
    "news.create",
    "news.update",
    "news.publish",
    "events.view",
    "events.create",
    "events.update",
    "events.publish",
    "gallery.view",
    "gallery.create",
    "gallery.update",
    "gallery.publish",
    "faculty.view",
    "faculty.update",
    "academics.view",
    "academics.update",
    "results.view",
    "results.update",
    "disclosure.view",
    "disclosure.update",
  ],

  [ROLES.ADMISSION_MANAGER]: [
    "admissions.view",
    "admissions.create",
    "admissions.update",
    "admissions.publish",
    "forms.view",
    "forms.create",
    "forms.update",
    "forms.submissions",
    "media.view",
    "media.upload",
    "tc.view",
    "tc.create",
    "tc.update",
  ],
};
