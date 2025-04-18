# 🧠 Behavioral Change Platform Schema

This markdown file defines the entire relational schema for the Behavioral Change Platform. It is designed for schema understanding and prompt-based completions within **Cursor**.

_Last updated: 2025-04-18 04:32:50_

---

## ⚠️ Cursor Prompt Notes

- 🔒 **UUID vs Number Types**: Ensure that `UUID` and `Number` are never confused. All identifiers like `id`, `worker_id`, `organization_id`, etc., should always be handled as `UUID`. Avoid inferring `Number` types unless explicitly mentioned.
- 🧠 Use this schema as reference for schema-aware autocompletions, query building, and model generation.
- ✅ Relationships are bidirectionally represented.

---

## 🔧 Entity Relationship Tables

### 🏢 ORGANIZATION

| Column            | Type     | Description                          |
|------------------|----------|--------------------------------------|
| id               | UUID     | Primary key                          |
| name             | String   | Organization name                    |
| type             | Enum     | "client" or "expert"                 |
| subscription_tier| String   | Tier of service                      |
| created_at       | DateTime | Created timestamp                    |
| updated_at       | DateTime | Last updated timestamp               |

---

### 👤 USER

| Column            | Type     | Description                          |
|------------------|----------|--------------------------------------|
| id               | UUID     | Primary key                          |
| organization_id  | UUID     | FK → ORGANIZATION.id                |
| email            | String   | Unique user email                    |
| role             | String   | User role (admin, viewer, etc.)      |
| display_name     | String   | Display name                         |
| created_at       | DateTime | Created timestamp                    |
| updated_at       | DateTime | Last updated timestamp               |

---

### 👷 WORKER

| Column              | Type     | Description                        |
|--------------------|----------|------------------------------------|
| id                 | UUID     | Primary key                        |
| organization_id    | UUID     | FK → ORGANIZATION.id              |
| full_name          | String   | Full name                          |
| phone_number       | String   | Contact number                     |
| well_being_score   | Float    | Well-being score                   |
| performance_metric | Float    | Performance score                  |
| created_at         | DateTime | Created timestamp                  |
| updated_at         | DateTime | Last updated timestamp             |

---

### 🧩 SEGMENT

| Column            | Type     | Description                          |
|------------------|----------|--------------------------------------|
| id               | UUID     | Primary key                          |
| organization_id  | UUID     | FK → ORGANIZATION.id                |
| name             | String   | Segment name                         |
| rule_definition  | JSON     | Segment logic                        |
| created_at       | DateTime | Created timestamp                    |
| updated_at       | DateTime | Last updated timestamp               |

#### 🔗 WORKER_SEGMENT (Link Table)

| Column       | Type     | Description               |
|--------------|----------|---------------------------|
| worker_id    | UUID     | FK → WORKER.id            |
| segment_id   | UUID     | FK → SEGMENT.id           |
| assigned_at  | DateTime | Assignment time           |

---

### 📘 JOURNEY_BLUEPRINT

| Column            | Type     | Description                          |
|------------------|----------|--------------------------------------|
| id               | UUID     | Primary key                          |
| organization_id  | UUID     | FK → ORGANIZATION.id                |
| title            | String   | Journey title                         |
| purpose          | String   | Purpose                              |
| created_by       | UUID     | FK → USER.id                         |
| updated_by       | UUID     | FK → USER.id                         |
| created_at       | DateTime | Created timestamp                    |
| updated_at       | DateTime | Last updated timestamp               |

---

### 🔀 PHASE

| Column              | Type     | Description                        |
|--------------------|----------|------------------------------------|
| id                 | UUID     | Primary key                        |
| journey_blueprint_id | UUID   | FK → JOURNEY_BLUEPRINT.id         |
| name               | String   | Phase name                         |
| sequence_order     | Integer  | Order of the phase                 |

---

### 📎 TOUCHPOINT

| Column        | Type     | Description                          |
|--------------|----------|--------------------------------------|
| id           | UUID     | Primary key                          |
| phase_id     | UUID     | FK → PHASE.id                       |
| content_id   | UUID     | FK → CONTENT.id                     |
| rule_logic   | JSON     | Custom logic                         |
| created_at   | DateTime | Created timestamp                    |
| updated_at   | DateTime | Last updated timestamp               |

---

### 🎞️ CONTENT

| Column        | Type     | Description                          |
|--------------|----------|--------------------------------------|
| id           | UUID     | Primary key                          |
| organization_id | UUID  | FK → ORGANIZATION.id                |
| type         | Enum     | "video", "text"                      |
| title        | String   | Title                                |
| description  | String   | Optional description                 |
| media_url    | String   | Link to content                      |
| license_type | String   | License info                         |
| created_at   | DateTime | Created timestamp                    |
| updated_at   | DateTime | Last updated timestamp               |

---

### 🧠 PROGRAM

| Column        | Type     | Description                          |
|--------------|----------|--------------------------------------|
| id           | UUID     | Primary key                          |
| organization_id | UUID  | FK → ORGANIZATION.id                |
| name         | String   | Program name                         |
| start_date   | Date     | Program start                        |
| end_date     | Date     | Program end                          |
| created_by   | UUID     | FK → USER.id                         |
| updated_by   | UUID     | FK → USER.id                         |
| created_at   | DateTime | Created timestamp                    |
| updated_at   | DateTime | Last updated timestamp               |

#### 🔗 WORKER_ASSIGNMENT

| Column          | Type     | Description                      |
|----------------|----------|----------------------------------|
| id             | UUID     | Primary key                      |
| program_id     | UUID     | FK → PROGRAM.id                 |
| worker_id      | UUID     | FK → WORKER.id                  |
| enrollment_date| Date     | Enrollment date                  |
| status         | String   | Status (active, completed, etc.)|
| created_at     | DateTime | Created timestamp                |
| updated_at     | DateTime | Last updated timestamp           |

---

### 🔧 PROGRAM_BLUEPRINT

| Column               | Type     | Description                       |
|----------------------|----------|-----------------------------------|
| id                   | UUID     | Primary key                       |
| program_id           | UUID     | FK → PROGRAM.id                  |
| journey_blueprint_id | UUID     | FK → JOURNEY_BLUEPRINT.id        |
| order_in_program     | Integer  | Order of execution                |

---

### 📊 WORKER_PROGRESS

| Column              | Type     | Description                        |
|--------------------|----------|------------------------------------|
| id                 | UUID     | Primary key                        |
| worker_assignment_id | UUID   | FK → WORKER_ASSIGNMENT.id         |
| touchpoint_id      | UUID     | FK → TOUCHPOINT.id                |
| started_at         | DateTime | Start time                         |
| completed_at       | DateTime | End time                           |
| score              | Float    | Progress score                     |
| feedback_text      | String   | Feedback                           |
| created_at         | DateTime | Created timestamp                  |
| updated_at         | DateTime | Last updated timestamp             |

---

### 🧪 EXPERIMENT

| Column        | Type     | Description                          |
|--------------|----------|--------------------------------------|
| id           | UUID     | Primary key                          |
| organization_id | UUID  | FK → ORGANIZATION.id                |
| experiment_type | String| Type (A/B, multi-variate)            |
| name         | String   | Experiment name                      |
| status       | String   | Current status                       |
| start_date   | Date     | Start date                           |
| end_date     | Date     | End date                             |
| created_by   | UUID     | FK → USER.id                         |
| updated_by   | UUID     | FK → USER.id                         |

#### 🧬 EXPERIMENT_VARIANT

| Column         | Type     | Description                     |
|---------------|----------|---------------------------------|
| id            | UUID     | Primary key                     |
| experiment_id | UUID     | FK → EXPERIMENT.id              |
| variant_name  | String   | Variant name                    |
| variant_details | JSON   | Config                          |
| created_at    | DateTime | Created timestamp               |
| updated_at    | DateTime | Last updated timestamp          |

#### 🔗 EXPERIMENT_ASSIGNMENT

| Column                | Type     | Description                 |
|-----------------------|----------|-----------------------------|
| id                    | UUID     | Primary key                 |
| experiment_variant_id | UUID     | FK → EXPERIMENT_VARIANT.id |
| worker_id             | UUID     | FK → WORKER.id              |
| assigned_at           | DateTime | Timestamp                   |
