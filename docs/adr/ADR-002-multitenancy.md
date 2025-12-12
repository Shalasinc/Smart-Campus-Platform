# ADR-002: Schema-per-Tenant Multi-Tenancy

- **Status**: Accepted
- **Context**: Faculties require isolation with independent lifecycle (backups, migrations) while keeping operational cost reasonable.
- **Decision**: Use schema-per-tenant on a shared PostgreSQL cluster. Tenant ID is carried in JWT (`tenant_id`) and forwarded by Gateway as `X-Tenant-Id`. Services use a tenant-aware DataSource resolver to set `search_path` per request or prefix schema in queries.
- **Consequences**:
  - ✅ Isolation between faculties; simpler than DB-per-tenant and lighter than shared-schema.
  - ✅ Can onboard new tenant by creating schema + seeding roles.
  - ⚠️ Needs connection pool segregation to avoid leaking `search_path`.
  - ⚠️ Cross-tenant reporting requires a safe read-only role or data warehouse.

## Sample DDL
```sql
-- Per-tenant schema
CREATE SCHEMA IF NOT EXISTS faculty_eng AUTHORIZATION app_user;
CREATE TABLE faculty_eng.courses (
    id UUID PRIMARY KEY,
    professor_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE faculty_eng.bookings (
    id UUID PRIMARY KEY,
    resource_id UUID NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uniq_resource_window UNIQUE (resource_id, starts_at, ends_at)
);
```

## Sample Tenant Resolver Snippet
```java
String tenant = request.getHeader("X-Tenant-Id");
jdbcTemplate.execute("SET LOCAL search_path TO " + tenant);
```

