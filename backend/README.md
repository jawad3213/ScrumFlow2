# ScrumFlow backend (Spring Boot)

REST API for ScrumFlow, served under `/api`. It replaces the former Laravel backend and keeps
the same routes, request formats and JSON responses, so the React frontend works unchanged.

- Java 21, Spring Boot 4.1, Spring Security 7, Spring Data JPA (Hibernate 7), Flyway
- PostgreSQL only

## Run

```bash
export DB_HOST=localhost DB_PORT=5432 DB_DATABASE=growtrack_db DB_USERNAME=postgres DB_PASSWORD=...
mvn spring-boot:run          # http://localhost:8000
```

Flyway applies the database migrations at startup. With Docker Compose the backend reads
`backend/.env` (see `.env.example`).

## Seed data

The equivalent of `php artisan db:seed` loads the specialization catalogue, creates the admin
chef account and gives every chef the demo project and employees:

```bash
SEED_DATABASE=true SEED_ADMIN_PASSWORD=... SEED_EXIT=true mvn spring-boot:run
```

The admin account is created only when `SEED_ADMIN_PASSWORD` is set.

## Tests

The integration tests start the application and call it over HTTP against a real PostgreSQL database.

```bash
# settings, database included, in src/test/resources/test.env:
# localhost:5432/growtrack_testing, postgres / 12345 (the CI service)
mvn verify
```

## Configuration

All settings come from `backend/.env` (copy `.env.example`): `application.yml` has no fallback
values, so every variable must be defined, and the backend refuses to start when one is missing.
Spring reads `backend/.env` itself when started from `backend/`; in Docker the same keys come from
`env_file`, and real environment variables always take precedence over the file. Values are written
without quotes. The names are the ones the Laravel `.env` used; Laravel-only keys such as `APP_KEY`
and `SESSION_*` are ignored.

| Variable | Purpose |
|----------|---------|
| `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | PostgreSQL connection |
| `PORT` | HTTP port |
| `FRONTEND_URL` | Base of links in e-mails |
| `CORS_ALLOWED_ORIGINS` | Allowed browser origins, comma separated (none are built in) |
| `COOKIE_SECURE` | Marks the refresh cookie `Secure`; enable when serving over HTTPS |
| `JWT_SECRET` | Signs the access JWTs (at least 32 characters; empty = random key per run) |
| `FIREBASE_PROJECT_ID` | Firebase project whose Google sign-in tokens are accepted |
| `STORAGE_PATH` | Directory for uploaded avatars, served at `/storage/...` |
| `MAIL_MAILER` | `log` writes e-mails to the log, `smtp` sends them |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_SCHEME` | SMTP settings (`MAIL_SCHEME=smtps` for port 465) |
| `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME` | Sender |
| `SEED_DATABASE`, `SEED_EXIT`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | Seeding, see above |

## Migrating an existing Laravel database

No data migration is needed. Point the backend at the existing database and start it.

- **Schema.** `V1__baseline_laravel_schema.sql` is the final schema of the Laravel migrations,
  with the same table, column and constraint names. Flyway sees a non-empty database without its
  history table, records it as version 1 and does not run V1. New changes go in `V2__...sql`.
  The Laravel-only tables `migrations`, `sessions`, `cache` and `cache_locks` are left untouched.
- **Passwords.** bcrypt hashes from Laravel (`$2y$`) verify as they are. New hashes use the same format.
- **Sessions.** Access tokens use Sanctum's format and table (`personal_access_tokens`), and
  refresh tokens use the same cookie and table. Users who are logged in stay logged in.
- **Avatars.** Files from Laravel's `storage/app/public/avatars` must be copied into the
  backend storage volume (`/app/storage/avatars` in Docker), because the stored paths are relative.

## Package layout

| Package | Content |
|---------|---------|
| `web` | REST controllers and the JSON error handler |
| `security` | Access and refresh tokens, the bearer-token filter |
| `config` | Spring Security (filter chain, CORS, BCrypt), MVC, properties |
| `domain`, `repository` | JPA entities and Spring Data repositories |
| `service` | Blueprint import, dashboard, demo data, e-mail, response rendering (`Views`) |
| `support` | Laravel-compatible input normalisation and validation messages |
| `seed` | The database seeder |
