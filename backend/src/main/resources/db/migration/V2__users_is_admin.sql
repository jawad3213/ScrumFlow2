-- Only admins may change the shared specializations catalogue (roles, levels, salaries).
-- The seeded admin account (SEED_ADMIN_EMAIL) is flagged by the DatabaseSeeder.
alter table "users" add column "is_admin" boolean not null default false;
