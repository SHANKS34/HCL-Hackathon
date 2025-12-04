# WellnessConnect Frontend – Flow Overview

This document describes the **frontend user flow** for the WellnessConnect application.  
The app supports **two roles**:

- **Patient**
- **Doctor**

Registration is only available for **patients**. Doctor accounts are **pre-created** and doctors log in using their existing IDs.

---

## 1. Authentication & Role Selection

### 1.1 Landing (Login / Register) Screen

- Users arrive on a **combined Login / Register page**.
- There is a **role toggle**: `Patient | Doctor`.

#### Patient Mode
- **Login form** for existing patients.
- **Register form** for new patients:
  - Basic details (name, age, contact, etc.).
  - Health-related fields if needed (e.g., existing conditions) – optional at this stage.
- On successful login / registration:
  - User is redirected to **Patient Dashboard**.

#### Doctor Mode
- **Only Login** is allowed (no registration form).
- Doctors log in using their **pre-existing credentials**.
- On successful login:
  - User is redirected to **Doctor Dashboard**.

---

## 2. Patient Experience

### 2.1 Patient Dashboard Layout

After login (as **Patient**), the user sees:

- **Sidebar (left)** with navigation items:
  1. **My Profile**
  2. **Set Wellness Goals**
  3. **Appointment Status**
  4. **Latest Health Information**
  5. **Logout**

- **Top bar / header**:
  - On the **top right**, show **Assigned Doctor Status**:
    - Doctor’s name / specialty.
    - Status (e.g., “Assigned”, “Pending assignment”).

- **Main content area (Patient Landing Page)**:
  - **Current Goals Match Status**
    - A summary card or progress visualization showing how well the patient is meeting their **Wellness Goals**.
    - Example: percentage completion, streaks, or “On Track / Needs Attention”.
  - **Upcoming Health Schedules**
    - List of upcoming check-ups, follow-up visits, tests, or reminders.
  - **Doctor’s Advised Tips**
    - Cards or list of recommendations given by the assigned doctor, such as:
      - Lifestyle changes
      - Medication reminders (non-prescriptive UI only)
      - General wellbeing tips

---

### 2.2 Patient – Sidebar Pages

#### 2.2.1 My Profile (Patient)

- Shows **patient details**:
  - Name, age, gender (if collected), contact, etc.
  - Basic health information (chronic conditions, allergies, etc. if available).
- Optionally allow editing of non-critical fields (depending on design).

#### 2.2.2 Set Wellness Goals

- Page where the patient can:
  - **Create / update wellness goals**:
    - e.g., “Walk 8,000 steps daily”, “Sleep 7 hours”, “Meditate 10 mins/day”.
  - See **active goals** and their **status**:
    - In progress / achieved / overdue.
- The **Dashboard landing page** pulls from these goals to compute:
  - **“Current goals matched”** or progress summary.

#### 2.2.3 Appointment Status (Patient)

- **Current Appointments**
  - List of upcoming and past appointments with:
    - Doctor name, date, time, and status (Scheduled / Completed / Cancelled).
- **Book New Appointment**
  - A section / button to **book an appointment**:
    - Flow can be:
      1. Select **Ailment / Reason** (e.g., “Diabetes follow-up”, “General check-up”).
      2. Filter / auto-assign doctor based on ailment or as a **routine checkup**.
      3. Select from available **time slots**.
      4. Confirm booking → appointment appears in **Current Appointments** and also on the **Dashboard** as upcoming health schedule.

#### 2.2.4 Latest Health Information

- Shared content module (used by both roles).
- Shows **curated health articles / tips / news**:
  - General health awareness.
  - Condition-specific articles.
- For frontend: this can be a list of **cards** fetched from an API or static curated content.

#### 2.2.5 Logout

- Logs the patient out and returns them to the **Login / Register** screen.
- Clears role-specific state on the frontend where appropriate.

---

## 3. Doctor Experience

### 3.1 Doctor Dashboard Layout

After login (as **Doctor**), the user sees:

- **Sidebar (left)** with navigation items:
  1. **My Profile**
  2. **Active Appointment Status**
  3. **Latest Health Information**
  4. **Logout**

- **Top bar / header**:
  - On the **top right**, show **Doctor Status** (e.g., “On Duty / Offline”) and possibly a count of active patients.

- **Main content area (Doctor Landing Page)**:
  - **Current Goals Overview (Aggregated)**
    - High-level visibility into patient wellness goals status (e.g., percentage of patients on track).
  - **Upcoming Health Schedules (Doctor’s View)**
    - The doctor’s own scheduled appointments, rounds, or sessions.
  - Optionally show:
    - Quick summary of **critical patients** or priority alerts.

> Note: “Status of current goals matched” for doctor can be designed as either:
> - Aggregate statistics across assigned patients, or
> - A summarized feed (e.g., “X patients on track, Y need attention”).

---

### 3.2 Doctor – Sidebar Pages

#### 3.2.1 My Profile (Doctor)

- Shows **doctor’s details**:
  - Name, specialization, years of experience, contact info (as needed).
  - Hospital / clinic affiliations.
- This is **read-only** or minimally editable on frontend (depending on backend rules).

#### 3.2.2 Active Appointment Status

- Key page for doctors.
- Shows:
  - **Total patients assigned** to the doctor.
  - **List of active appointments**:
    - For each appointment: patient name, date, time, ailment, priority.
  - **Priority buckets** to help scheduling:
    - **Critical**
    - **Moderate**
    - **Regular / Routine**
- The UI should clearly show:
  - **Patients already scheduled** (with appointment slot).
  - **Leftover patients** (assigned but not yet scheduled) so that the doctor can:
    - Decide whom to schedule first based on **priority**.
    - Plan their day / week effectively.

Possible UI ideas:
- Tabs or filters: `All | Critical | Moderate | Regular`
- Counters at the top: `Critical: 3 | Moderate: 7 | Regular: 12`

#### 3.2.3 Latest Health Information

- Same module as patient view, but tuned to doctor needs if desired.
- Contains:
  - Latest health guidelines.
  - Research summaries / clinical updates.
  - General health news.

#### 3.2.4 Logout

- Logs the doctor out and returns to the **Login** screen (in Doctor mode by default or neutral).

---

## 4. Role-Based Routing Summary

High-level navigation logic (frontend):

- On successful authentication:
  - If `role === 'patient'` → navigate to **`/patient/dashboard`**
  - If `role === 'doctor'` → navigate to **`/doctor/dashboard`**

- Sidebar items and available pages are **role-dependent**:
  - Patient: `Profile`, `Set Goals`, `Appointments`, `Latest Info`, `Logout`
  - Doctor: `Profile`, `Active Appointments`, `Latest Info`, `Logout`

- Shared features:
  - `My Profile` page (role-specific data).
  - `Latest Health Information` page.

---

## 5. Frontend Notes (Optional Implementation Hints)

> This section is just for implementation clarity; adjust based on actual tech stack.

- **Role-based layout**:
  - Use a common `DashboardLayout` with:
    - Left sidebar navigation items defined per role.
    - Top bar displaying role-specific info (assigned doctor / doctor status).
- **State management**:
  - Store user role and basic info in a global store (Context / Redux / Zustand, etc.) after login.
  - Clear state on logout.
- **Protected routes**:
  - `/patient/*` accessible only if authenticated as Patient.
  - `/doctor/*` accessible only if authenticated as Doctor.

---

## 6. Summary

This frontend flow ensures:

- **Clear separation** between Patient and Doctor experiences.
- **Simple onboarding**:
  - Patients can self-register.
  - Doctors can only log in with existing IDs (no duplicate profiles).
- **Goal-centric patient view** focused on wellbeing tracking.
- **Appointment-centric doctor view** focused on managing assigned patients and priorities.
- Shared **Latest Health Information** to keep both patients and doctors updated.

This README should act as a reference for implementing the UI structure, routing, and role-based rendering in the frontend.