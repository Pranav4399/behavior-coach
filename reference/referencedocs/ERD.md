Below is a two-part deliverable capturing both (1) a very detailed Entity Relationship Diagram (ERD) overview and (2) representative schemas for key tables in the system. The ERD focuses on visualizing entities, their attributes, and how they interrelate. The schemas expand on this by specifying table definitions, columns, data types, relationships, and some best-practice constraints. Both documents are derived directly from the Product Overview and Architecture Overview you provided.

---

## 1. Detailed ERD Document

### 1.1 Purpose and Scope

This ERD (Entity Relationship Diagram) provides a high-level yet detailed view of the major entities in the Behavioral Coaching Platform and how they connect. Its primary focus is on data management for:
- Multi-tenancy
- Content creation and sharing (Journey blueprints, modules)
- Program deployment and execution
- Audience/Worker management
- Experimentation at both Journey and Program levels
- Gamification, segmentation, and feedback loops

Where possible, relevant fields are highlighted, especially those that are critical to capturing relationships (primary keys, foreign keys, and linking tables).

---

### 1.2 Key Entities Overview

Below is a short description of each entity, leading into a relationship diagram:

1. **Organization**  
   - Represents a tenant within the platform (Client Organization or Expert Organization).
   - Houses users (e.g., Admins, Managers) and workers (frontline audiences).
   - Manages subscription tier settings.

2. **User**  
   - A staff account within an Organization.
   - Has a role such as Organization Admin, Training Manager, Program Manager, or Content Specialist (in Expert Organizations).
   - Manages or creates resources (Journey blueprints, content, programs, experiments).

3. **Worker**  
   - Also referred to as the frontline audience or “Audience Member.”
   - Enrolled in programs, assigned to segments, and can receive content or feedback via WhatsApp or other channels.
   - Has well-being indicators, performance metrics, and other custom fields.

4. **Segment**  
   - Groups Workers based on criteria (location, performance, etc.).
   - Used to target subsets of workers in Programs or experiments.

5. **Content**  
   - Individual training or well-being modules (text, audio, video, quizzes, etc.).
   - May be developed internally or published on the Marketplace by Expert Organizations.
   - Tied to one or more Journey Touchpoints.

6. **JourneyBlueprint**  
   - A reusable template that structures sequences of Content (Touchpoints), rules, branching, and pacing logic.
   - No direct link to actual worker progress: that belongs in **Program**.

7. **Program**  
   - Operational deployment of one or more JourneyBlueprints to real Workers (via segments).
   - Tracks scheduling, real-time progress, completion metrics, etc.
   - Coordinates daily/weekly tasks, reminders, well-being checks, etc.

8. **WorkerAssignment**  
   - A bridging entity between **Program** and **Worker**.
   - Tracks which workers are enrolled in which Program instance and their current states.

9. **WorkerProgress**  
   - Logs progress details at the Touchpoint or Phase level within a Journey.
   - Helps measure completion, quiz results, reflection responses.

10. **Experiment**  
    - Defines either a Journey-level (content-focused) or Program-level (implementation-focused) test.
    - Contains associated experiment **Variant** records.
    - Tracks success metrics and random assignment details.

11. **ExperimentAssignment**  
    - Links Workers (or segments) to a specific experiment variant.
    - Allows for group assignment or random distribution of individuals.

12. **MarketplaceListing** (or “Marketplace” reference)  
    - A simplified notion representing published modules or Journey Blueprints in the Marketplace.
    - Tied to licensing and usage analytics.

13. **Gamification** (Badges/Achievements, Challenges, Leaderboards)  
    - These can be separate tables or an aggregate domain, referencing **Workers** and **Programs**.
    - Award references stored under worker progress or a separate “achievements” entity.

---

### 1.3 Diagrammatic Representation (Textual)

A simplified textual ERD representation is shown below. Primary Keys (PK) are marked with `(PK)`, Foreign Keys (FK) with `(FK)`, and cardinalities are indicated alongside relationships.

```
 ┌────────────────────────┐
 |     ORGANIZATION       |
 | (PK) id                |
 |     name               |
 |     type (client/expert)   
 |     subscription_tier  |
 |     created_at         |
 |     updated_at         |
 └─────────┬──────────────┘
           │ (1) has many
           │
 ┌────────────────────────┐
 |         USER           |
 | (PK) id                |
 | (FK) organization_id   |
 |     email              |
 |     role               |
 |     display_name       |
 |     created_at         |
 |     updated_at         |
 └─────────┬──────────────┘
           │ (1) created by
           │
 ┌────────────────────────┐
 |        WORKER          |
 | (PK) id                |
 | (FK) organization_id   |
 |     full_name          |
 |     phone_number       |
 |     well_being_score   |
 |     performance_metric |
 |     created_at         |
 |     updated_at         |
 └─────────┬──────────────┘
           │ (many to many via WorkerSegment)
           │
 ┌────────────────────────┐              ┌──────────────────────────┐
 |        SEGMENT         |              |    WORKER_SEGMENT (link) |
 | (PK) id                |              | (PK)(FK) worker_id       |
 | (FK) organization_id   |              | (PK)(FK) segment_id      |
 |     name               |              |     assigned_at          |
 |     rule_definition    |              └──────────────────────────┘
 |     created_at         |
 |     updated_at         |
 └────────────────────────┘

 ┌────────────────────────┐           ┌────────────────────────┐
 |    JOURNEY_BLUEPRINT   |           |        CONTENT         |
 | (PK) id                |           | (PK) id                |
 | (FK) organization_id   |           | (FK) organization_id   |
 |     title              |           |     type (video/text)  |
 |     purpose            |           |     title              |
 |     created_by (FK->User)          |     description        |
 |     updated_by (FK->User)          |     media_url          |
 |     created_at         |           |     license_type       |
 |     updated_at         |           |     created_at         |
 └───────┬────────────────┘           |     updated_at         |
         │ (1 to many)                └─────────┬──────────────┘
         │                                      │ (1 to many usage in Touchpoint)
 ┌────────────────────────┐                     │
 |       PHASE            |                     │
 | (PK) id                |                     │
 | (FK) journey_blueprint_id                   │
 |     name               |                     │
 |     sequence_order     |                     │
 └───────┬────────────────┘                     │
         │ (1 to many)                          │
 ┌────────────────────────┐                     │
 |      TOUCHPOINT        |                     │
 | (PK) id                |                     │
 | (FK) phase_id          |                     │
 | (FK) content_id        |<--------------------┘
 |     rule_logic         |
 |     created_at         |
 |     updated_at         |
 └────────────────────────┘

 ┌────────────────────────┐    ┌────────────────────────┐
 |        PROGRAM         |    |    WORKER_ASSIGNMENT   |
 | (PK) id                |    | (PK) id                |
 | (FK) organization_id   |    | (FK) program_id        |
 |     name               |    | (FK) worker_id         |
 |     start_date         |    |     enrollment_date    |
 |     end_date           |    |     status             |
 |     created_by (FK->User)   |     created_at         |
 |     updated_by (FK->User)   |     updated_at         |
 |     created_at         |    └─────────┬──────────────┘
 |     updated_at         |              │ (1 to many)
 └───────┬────────────────┘              │
         │ (many to many via WorkerAssignment)
         │
         ┌────────────────────────┐
         |   PROGRAM_BLUEPRINT    | 
         | (PK) id                |
         | (FK) program_id        |
         | (FK) journey_blueprint_id
         |     order_in_program   |
         └────────────────────────┘

 ┌────────────────────────┐    ┌────────────────────────┐
 |     WORKER_PROGRESS    |    |      EXPERIMENT        |
 | (PK) id                |    | (PK) id                |
 | (FK) worker_assignment_id   | (FK) organization_id   |
 | (FK) touchpoint_id     |    |     experiment_type    |
 |     started_at         |    |     name               |
 |     completed_at       |    |     status             |
 |     score              |    |     start_date         |
 |     feedback_text      |    |     end_date           |
 |     created_at         |    |     created_by (FK->User)
 |     updated_at         |    |     updated_by (FK->User)
 └────────────────────────┘    └─────────┬──────────────┘
                                        │ (1 to many)
                              ┌──────────────────────────┐
                              |     EXPERIMENT_VARIANT   |
                              | (PK) id                  |
                              | (FK) experiment_id       |
                              |     variant_name         |
                              |     variant_details      |
                              |     created_at           |
                              |     updated_at           |
                              └───────┬──────────────────┘
                                      │ (1 to many)
                              ┌──────────────────────────┐
                              | EXPERIMENT_ASSIGNMENT    |
                              | (PK) id                  |
                              | (FK) experiment_variant_id
                              | (FK) worker_id           |
                              |     assigned_at          |
                              └──────────────────────────┘
```

**Notes on Key Relationships:**

- **Organization** → **User**, **Worker**, **Segment**, **JourneyBlueprint**, **Program**: One-to-many; each Organization has many of these records.
- **Worker** ↔ **Segment**: Many-to-many via a link table.  
- **JourneyBlueprint** → **Phase** → **Touchpoint** → **Content**: Typically one-to-many relationships.  
- **Program** ↔ **JourneyBlueprint**: Many-to-many if a Program includes multiple Journey Blueprints, or one-to-many if you adopt a “ProgramBlueprint” bridging table.  
- **Program** ↔ **Worker**: Many-to-many through **WorkerAssignment**.  
- **Experiment** → **ExperimentVariant** → **ExperimentAssignment**: One-to-many, then one-to-many.

---

## 2. Schemas Document

Below are sample table schema definitions for critical tables in the system. These definitions assume a PostgreSQL database with typical indexing, constraints, and naming conventions. Adjust field names or data types to match your coding style or ORM conventions (e.g., Prisma’s naming).

### 2.1 Organizations

```sql
CREATE TABLE organizations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(255) NOT NULL,
  type              VARCHAR(50) NOT NULL CHECK (type IN ('client', 'expert')),
  subscription_tier VARCHAR(50) NOT NULL CHECK (subscription_tier IN ('basic', 'standard', 'premium')),
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_org_name ON organizations (name);
```
- **type** indicates whether it is a Client Organization or Expert Organization.
- **subscription_tier** enforces tier-based constraints.

---

### 2.2 Users

```sql
CREATE TABLE users (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id    UUID NOT NULL,
  email              VARCHAR(255) UNIQUE NOT NULL,
  role               VARCHAR(50) NOT NULL,  -- e.g., 'org_admin', 'training_manager', etc.
  display_name       VARCHAR(100),
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_users_org FOREIGN KEY (organization_id)
    REFERENCES organizations (id) ON DELETE CASCADE
);

CREATE INDEX idx_users_org ON users (organization_id);
CREATE INDEX idx_users_email ON users (email);
```
- The **role** column could be further broken out or placed in a roles table if needed.
- Cascading delete ensures if an organization is removed, associated users are removed.

---

### 2.3 Workers

```sql
CREATE TABLE workers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     UUID NOT NULL,
  full_name           VARCHAR(255) NOT NULL,
  phone_number        VARCHAR(50),
  well_being_score    INTEGER,  -- For aggregated well-being metrics
  performance_metric  INTEGER,  -- Aggregated or updated from quiz/task results
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_workers_org FOREIGN KEY (organization_id)
    REFERENCES organizations (id) ON DELETE CASCADE
);

CREATE INDEX idx_workers_org ON workers (organization_id);
CREATE INDEX idx_workers_name ON workers (full_name);
```
- Additional fields like `language_preference` or `location` can be added depending on segmentation logic.

---

### 2.4 Segments

```sql
CREATE TABLE segments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL,
  name              VARCHAR(255) NOT NULL,
  rule_definition   TEXT,  -- JSON or text describing advanced logic
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_segments_org FOREIGN KEY (organization_id)
    REFERENCES organizations (id) ON DELETE CASCADE
);

CREATE TABLE worker_segment (
  worker_id  UUID NOT NULL,
  segment_id UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (worker_id, segment_id),
  CONSTRAINT fk_ws_worker FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
  CONSTRAINT fk_ws_segment FOREIGN KEY (segment_id) REFERENCES segments(id) ON DELETE CASCADE
);

CREATE INDEX idx_segment_name ON segments (name);
CREATE INDEX idx_ws_worker ON worker_segment (worker_id);
CREATE INDEX idx_ws_segment ON worker_segment (segment_id);
```
- `rule_definition` can store the logic for dynamic updates, using JSON for complex criteria.

---

### 2.5 Content

```sql
CREATE TABLE content (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     UUID NOT NULL,
  type                VARCHAR(50) NOT NULL,  -- e.g., 'text', 'video', 'quiz'
  title               VARCHAR(255),
  description         TEXT,
  media_url           TEXT,  -- link to AWS S3 or similar
  license_type        VARCHAR(50),  -- e.g., 'free', 'paid', 'subscription'
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_content_org FOREIGN KEY (organization_id)
    REFERENCES organizations (id) ON DELETE CASCADE
);

CREATE INDEX idx_content_org ON content (organization_id);
CREATE INDEX idx_content_type ON content (type);
```
- Could expand with a more sophisticated licensing schema if needed.

---

### 2.6 Journey Blueprints and Related Tables

```sql
CREATE TABLE journey_blueprints (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL,
  title             VARCHAR(255) NOT NULL,
  purpose           TEXT,
  created_by        UUID,  -- references users.id
  updated_by        UUID,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_jb_org FOREIGN KEY (organization_id)
    REFERENCES organizations (id) ON DELETE CASCADE,
  CONSTRAINT fk_jb_created_by FOREIGN KEY (created_by)
    REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT fk_jb_updated_by FOREIGN KEY (updated_by)
    REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE phases (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_blueprint_id UUID NOT NULL,
  name                 VARCHAR(255) NOT NULL,
  sequence_order       INT NOT NULL,
  CONSTRAINT fk_phase_jb FOREIGN KEY (journey_blueprint_id)
    REFERENCES journey_blueprints (id) ON DELETE CASCADE
);

CREATE TABLE touchpoints (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id    UUID NOT NULL,
  content_id  UUID NOT NULL,
  rule_logic  TEXT, -- for branching or specialized conditions
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_tp_phase FOREIGN KEY (phase_id)
    REFERENCES phases (id) ON DELETE CASCADE,
  CONSTRAINT fk_tp_content FOREIGN KEY (content_id)
    REFERENCES content (id) ON DELETE RESTRICT
);

CREATE INDEX idx_phase_sequence ON phases(journey_blueprint_id, sequence_order);
CREATE INDEX idx_touchpoint_phase ON touchpoints (phase_id);
```
- **phases** define large sections of a Journey, while **touchpoints** are discrete steps referencing content.

---

### 2.7 Programs

```sql
CREATE TABLE programs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL,
  name              VARCHAR(255) NOT NULL,
  start_date        DATE,
  end_date          DATE,
  created_by        UUID,
  updated_by        UUID,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_program_org FOREIGN KEY (organization_id)
    REFERENCES organizations (id) ON DELETE CASCADE,
  CONSTRAINT fk_program_created_by FOREIGN KEY (created_by)
    REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT fk_program_updated_by FOREIGN KEY (updated_by)
    REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE program_blueprints (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id          UUID NOT NULL,
  journey_blueprint_id UUID NOT NULL,
  order_in_program    INT NOT NULL,
  CONSTRAINT fk_pb_program FOREIGN KEY (program_id) 
    REFERENCES programs (id) ON DELETE CASCADE,
  CONSTRAINT fk_pb_jb FOREIGN KEY (journey_blueprint_id)
    REFERENCES journey_blueprints (id) ON DELETE RESTRICT
);

CREATE INDEX idx_program_org ON programs (organization_id);
CREATE INDEX idx_pb_program ON program_blueprints (program_id);
```
- **program_blueprints** is an optional linking table if multiple Journey Blueprints are part of a single Program.

---

### 2.8 Worker Assignment and Progress

```sql
CREATE TABLE worker_assignments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id     UUID NOT NULL,
  worker_id      UUID NOT NULL,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  status         VARCHAR(50) NOT NULL DEFAULT 'active', -- e.g., 'active', 'completed', 'dropped'
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_wa_program FOREIGN KEY (program_id) REFERENCES programs (id) ON DELETE CASCADE,
  CONSTRAINT fk_wa_worker  FOREIGN KEY (worker_id)  REFERENCES workers (id) ON DELETE CASCADE
);

CREATE TABLE worker_progress (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_assignment_id UUID NOT NULL,
  touchpoint_id       UUID NOT NULL,
  started_at          TIMESTAMP WITH TIME ZONE,
  completed_at        TIMESTAMP WITH TIME ZONE,
  score               DECIMAL(5,2),  -- or integer-based
  feedback_text       TEXT,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_wp_wa FOREIGN KEY (worker_assignment_id) 
    REFERENCES worker_assignments (id) ON DELETE CASCADE,
  CONSTRAINT fk_wp_tp FOREIGN KEY (touchpoint_id) 
    REFERENCES touchpoints (id) ON DELETE CASCADE
);

CREATE INDEX idx_wa_program_worker ON worker_assignments (program_id, worker_id);
CREATE INDEX idx_wp_wa_tp ON worker_progress (worker_assignment_id, touchpoint_id);
```
- Worker progress is typically logged at the **touchpoint** level, capturing start/complete times and feedback.

---

### 2.9 Experimentation Tables

```sql
CREATE TABLE experiments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL,
  experiment_type   VARCHAR(50) NOT NULL, -- e.g., 'journey_level', 'program_level'
  name              VARCHAR(255) NOT NULL,
  status            VARCHAR(50) NOT NULL DEFAULT 'active', -- e.g., 'draft', 'active', 'completed'
  start_date        TIMESTAMP WITH TIME ZONE,
  end_date          TIMESTAMP WITH TIME ZONE,
  created_by        UUID,
  updated_by        UUID,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_expt_org FOREIGN KEY (organization_id)
    REFERENCES organizations (id) ON DELETE CASCADE,
  CONSTRAINT fk_expt_created_by FOREIGN KEY (created_by)
    REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT fk_expt_updated_by FOREIGN KEY (updated_by)
    REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE experiment_variants (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id     UUID NOT NULL,
  variant_name      VARCHAR(255) NOT NULL,
  variant_details   JSONB,  -- Could store details of content or approach changes
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_var_expt FOREIGN KEY (experiment_id) 
    REFERENCES experiments (id) ON DELETE CASCADE
);

CREATE TABLE experiment_assignments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_variant_id UUID NOT NULL,
  worker_id             UUID, 
  assigned_at           TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_ea_variant FOREIGN KEY (experiment_variant_id) 
    REFERENCES experiment_variants (id) ON DELETE CASCADE,
  CONSTRAINT fk_ea_worker FOREIGN KEY (worker_id) 
    REFERENCES workers (id) ON DELETE CASCADE
);

CREATE INDEX idx_expt_org ON experiments (organization_id);
CREATE INDEX idx_variant_expt ON experiment_variants (experiment_id);
CREATE INDEX idx_ea_variant ON experiment_assignments (experiment_variant_id);
CREATE INDEX idx_ea_worker ON experiment_assignments (worker_id);
```
- **variant_details** in `experiment_variants` can store A/B settings or program-level differences.
- Additional tables for experiment metrics or analysis can be included.

---

### 2.10 Gamification (Optional Example)

```sql
CREATE TABLE badges (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID NOT NULL,
  name             VARCHAR(100) NOT NULL,
  description      TEXT,
  icon_url         TEXT,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_badge_org FOREIGN KEY (organization_id)
    REFERENCES organizations (id) ON DELETE CASCADE
);

CREATE TABLE worker_badges (
  worker_id  UUID NOT NULL,
  badge_id   UUID NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY(worker_id, badge_id),
  CONSTRAINT fk_worker_badge_worker FOREIGN KEY (worker_id)
    REFERENCES workers (id) ON DELETE CASCADE,
  CONSTRAINT fk_worker_badge_badge FOREIGN KEY (badge_id)
    REFERENCES badges (id) ON DELETE CASCADE
);
```
- Could be extended to handle “challenges,” “leaderboards,” or “points systems.”

---

## Final Thoughts on Schema and ERD

1. **Tenant Isolation**: Nearly all tables carry `organization_id` to ensure data belonging to one Organization is not visible to another.  
2. **Flexible Experimentation**: The experiment tables are designed to handle both content-level and program-level testing, with additional metrics captured via separate tables (e.g., `experiment_metrics`) if needed.  
3. **Scalability**: Indexing strategy (e.g., multi-column indexes for frequent queries) will be key when handling large volumes of workers, messages, or content.  
4. **Extensions**: Additional relationships or bridging tables may be introduced for advanced features like custom licensing, partial Marketplace listing usage, or hierarchical segment definitions.

Taken together, the ERD and schemas demonstrate how the Behavioral Coaching Platform’s key entities interact and where data is stored. Organizations can customize or extend these definitions based on specific domain needs—such as additional well-being fields, specialized analytics for donors, or more refined experiment tracking. Nonetheless, this structure provides a solid foundation for a multi-tenant SaaS focused on delivering and continuously improving behavioral coaching interventions.