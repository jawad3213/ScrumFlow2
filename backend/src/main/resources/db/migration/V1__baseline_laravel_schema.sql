-- Baseline: the schema produced by the former Laravel migrations (database/migrations, up to
-- 2026_03_03_021124), consolidated into its final state. Table, column and constraint names are
-- unchanged so an existing Laravel database is already at this version.
--
-- Existing databases: Flyway runs with baseline-on-migrate, so a non-empty schema is marked as
-- version 1 and this script is skipped. Fresh databases: this script creates everything.
--
-- Laravel-only infrastructure tables (migrations, sessions, cache, cache_locks) are not created;
-- they are left untouched where they already exist.

create table "specializations" (
    "id" bigserial not null primary key,
    "name" varchar(255) not null,
    "level" varchar(255) not null,
    "salary" decimal(10, 2) not null,
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null
);

create table "users" (
    "id" bigserial not null primary key,
    "first_name" varchar(255) not null,
    "last_name" varchar(255) not null,
    "email" varchar(255) not null,
    "avatar" varchar(255) null,
    "password" varchar(255) null,
    "role" varchar(255) check ("role" in ('chef', 'employee')) not null default 'employee',
    "specialization_id" bigint null,
    "is_engaged" boolean not null default '0',
    "remember_token" varchar(100) null,
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null,
    "google_id" varchar(255) null
);
alter table "users" add constraint "users_specialization_id_foreign" foreign key ("specialization_id") references "specializations" ("id") on delete set null;
alter table "users" add constraint "users_email_unique" unique ("email");
alter table "users" add constraint "users_google_id_unique" unique ("google_id");

create table "projects" (
    "id" bigserial not null primary key,
    "name" varchar(255) not null,
    "user_id" bigint null,
    "start_date" date null,
    "planned_end_date" date null,
    "actual_end_date" date null,
    "description" text null,
    "estimated_duration_months" decimal(8, 2) null,
    "total_capex" decimal(15, 2) not null default '0',
    "total_opex" decimal(15, 2) not null default '0',
    "total_project_cost" decimal(15, 2) null,
    "total_gain_value" decimal(15, 2) null,
    "annual_opex_value" decimal(15, 2) not null default '0',
    "roi_percentage" decimal(8, 2) null,
    "break_even_point_months" decimal(8, 2) null,
    "roi_analysis_summary" text null,
    "stack_analysis_data" json null,
    "architecture_plan" json null,
    "recommended_stack" json null,
    "stack_name" varchar(255) null,
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null
);
alter table "projects" add constraint "projects_user_id_foreign" foreign key ("user_id") references "users" ("id") on delete cascade;

create table "personal_access_tokens" (
    "id" bigserial not null primary key,
    "tokenable_type" varchar(255) not null,
    "tokenable_id" bigint not null,
    "name" text not null,
    "token" varchar(64) not null,
    "abilities" text null,
    "last_used_at" timestamp(0) without time zone null,
    "expires_at" timestamp(0) without time zone null,
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null
);
create index "personal_access_tokens_tokenable_type_tokenable_id_index" on "personal_access_tokens" ("tokenable_type", "tokenable_id");
alter table "personal_access_tokens" add constraint "personal_access_tokens_token_unique" unique ("token");
create index "personal_access_tokens_expires_at_index" on "personal_access_tokens" ("expires_at");

create table "password_reset_tokens" (
    "email" varchar(255) not null,
    "token" varchar(255) not null,
    "created_at" timestamp(0) without time zone null
);
alter table "password_reset_tokens" add primary key ("email");

create table "employees" (
    "id" bigserial not null primary key,
    "user_id" bigint not null,
    "first_name" varchar(255) not null,
    "last_name" varchar(255) not null,
    "email" varchar(255) not null,
    "specialization_id" bigint null,
    "is_engaged" boolean not null default '0',
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null
);
alter table "employees" add constraint "employees_user_id_foreign" foreign key ("user_id") references "users" ("id") on delete cascade;
alter table "employees" add constraint "employees_specialization_id_foreign" foreign key ("specialization_id") references "specializations" ("id") on delete set null;

create table "assigned_engineers" (
    "id" bigserial not null primary key,
    "project_id" bigint not null,
    "specialization_id" bigint not null,
    "phase" varchar(255) not null,
    "months_assigned" decimal(8, 2) not null,
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null,
    "employee_id" bigint null
);
alter table "assigned_engineers" add constraint "assigned_engineers_project_id_foreign" foreign key ("project_id") references "projects" ("id") on delete cascade;
alter table "assigned_engineers" add constraint "assigned_engineers_specialization_id_foreign" foreign key ("specialization_id") references "specializations" ("id") on delete cascade;
alter table "assigned_engineers" add constraint "assigned_engineers_employee_id_foreign" foreign key ("employee_id") references "employees" ("id") on delete set null;

create table "estimated_gains" (
    "id" bigserial not null primary key,
    "project_id" bigint not null,
    "item_name" varchar(255) not null,
    "cost_mad" decimal(15, 2) not null,
    "formule" varchar(255) null,
    "description" text null,
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null
);
alter table "estimated_gains" add constraint "estimated_gains_project_id_foreign" foreign key ("project_id") references "projects" ("id") on delete cascade;

create table "infrastructure_costs" (
    "id" bigserial not null primary key,
    "project_id" bigint not null,
    "type" varchar(255) not null,
    "item_name" varchar(255) not null,
    "cost_mad" decimal(15, 2) not null,
    "formule" varchar(255) null,
    "description" text null,
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null
);
alter table "infrastructure_costs" add constraint "infrastructure_costs_project_id_foreign" foreign key ("project_id") references "projects" ("id") on delete cascade;

create table "roi_projections" (
    "id" bigserial not null primary key,
    "project_id" bigint not null,
    "year_number" integer not null,
    "cumulative_costs" decimal(15, 2) not null,
    "cumulative_gains" decimal(15, 2) not null,
    "net_cash_flow" decimal(15, 2) not null,
    "roi_percentage" decimal(10, 2) not null,
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null
);
alter table "roi_projections" add constraint "roi_projections_project_id_foreign" foreign key ("project_id") references "projects" ("id") on delete cascade;

create table "project_kpis" (
    "id" bigserial not null primary key,
    "project_id" bigint not null,
    "metric_name" varchar(255) not null,
    "target_value" varchar(255) not null,
    "measurement_method" varchar(255) not null,
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null
);
alter table "project_kpis" add constraint "project_kpis_project_id_foreign" foreign key ("project_id") references "projects" ("id") on delete cascade;

create table "project_risks" (
    "id" bigserial not null primary key,
    "project_id" bigint not null,
    "risk_name" varchar(255) not null,
    "impact" varchar(255) not null,
    "probability" varchar(255) not null,
    "mitigation_strategy" text not null,
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null
);
alter table "project_risks" add constraint "project_risks_project_id_foreign" foreign key ("project_id") references "projects" ("id") on delete cascade;

create table "project_epics" (
    "id" bigserial not null primary key,
    "project_id" bigint not null,
    "title" varchar(255) not null,
    "description" text null,
    "external_id" varchar(255) null,
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null
);
alter table "project_epics" add constraint "project_epics_project_id_foreign" foreign key ("project_id") references "projects" ("id") on delete cascade;

create table "project_stories" (
    "id" bigserial not null primary key,
    "project_epic_id" bigint not null,
    "title" varchar(255) not null,
    "description" text null,
    "story_points" integer not null default '0',
    "acceptance_criteria" json null,
    "external_id" varchar(255) null,
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null
);
alter table "project_stories" add constraint "project_stories_project_epic_id_foreign" foreign key ("project_epic_id") references "project_epics" ("id") on delete cascade;

create table "project_blueprint_tasks" (
    "id" bigserial not null primary key,
    "project_story_id" bigint not null,
    "role" varchar(255) not null,
    "level" varchar(255) null,
    "title" varchar(255) not null,
    "instructions" text null,
    "hours" integer not null default '0',
    "external_id" varchar(255) null,
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null
);
alter table "project_blueprint_tasks" add constraint "project_blueprint_tasks_project_story_id_foreign" foreign key ("project_story_id") references "project_stories" ("id") on delete cascade;

create table "refresh_tokens" (
    "id" bigserial not null primary key,
    "user_id" bigint not null,
    "token" varchar(64) not null,
    "expires_at" timestamp(0) without time zone null,
    "created_at" timestamp(0) without time zone null,
    "updated_at" timestamp(0) without time zone null
);
alter table "refresh_tokens" add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "users" ("id") on delete cascade;
alter table "refresh_tokens" add constraint "refresh_tokens_token_unique" unique ("token");
