# Civic Compass

Build a full-stack, minimalist, highly aesthetic Civic & Campus Grievance Triage Platform with responsive layouts using React, Tailwind CSS, Lucide icons, and integrated directly with our existing Supabase backend.

### 🎨 Visual Theme & Design Guidelines (Crucial)

- **Aesthetic:** Minimalist, editorial, modern civic-tech. Crisp borders (`border-neutral-200 dark:border-neutral-800`), clean typography (Inter or Geist), subtle micro-interactions, soft shadows (`shadow-sm`), and generous whitespace.

- **Color Palette:** Strictly NO high-saturation neon. Use a refined monochrome/neutral slate & zinc base with understated, purposeful accents:

  - Primary: Deep slate / Charcoal (`#0f172a` in light, `#f8fafc` in dark).

  - Scope Accents: Muted Emerald for Campus/Institute, Subdued Indigo/Cobalt for Civic/Municipality.

  - Status Indicators: Subtle pill badges with muted background tints (e.g., `bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300`).

- **Theme Support:** Global Dark Mode / Light Mode toggle in the navbar with smooth transitions and persistence in `localStorage`.

---

### 1. Supabase Schema & Auth Alignment

The database already has these tables and storage buckets:

- `profiles`: `id (uuid, FK auth.users)`, `email`, `full_name`, `role` (`'student' | 'citizen' | 'institute_admin' | 'municipality_admin'`), `institution_name`, `points`, `lat`, `lng`.

- `grievances`: `id`, `user_id`, `scope` (`'institute' | 'civic'`), `institution_name`, `title`, `description`, `image_url`, `lat`, `lng`, `status` (`'pending' | 'in_progress' | 'resolved'`), `resolution_proof_url`, `resolved_by`, `upvotes_count`, `is_anonymous`.

- `votes`: `id`, `grievance_id`, `user_id` (unique constraint per user/issue).

- `budget_proposals`: `id`, `title`, `description`, `category`, `estimated_cost`, `votes_count`, `scope`.

- Storage Buckets: `grievance-images` and `resolution-proofs`.

---

### 2. Navigation & Layout

- **Minimal Header:** App brand name ("CIVIC TRIAGE / S36"), Theme toggle (Sun/Moon icon), Scope filter tabs ("All", "Campus", "Civic"), Points badge pill with current user points, and Profile/Logout dropdown.

- **Main View Tabs:** Clean segmented controller switching between:

  1. "Active Grievances"

  2. "Participatory Budgeting"

---

### 3. Authentication (/login & /signup)

- Sleek, centered auth card with a clean 4-role selector tab: **Student**, **Citizen**, **Institute Authority**, **Municipality Authority**.

- Captures `full_name`, `email`, `password`, and optional `institution_name` (visible only for Student/Institute roles).

- Browser GPS auto-capture button ("Detect My Location") to populate `lat`/`lng` coordinates during signup.

- Auto-creates profile record on signup and redirects to dashboard.

---

### 4. Issue Submission Modal ("+ Report Issue")

- Clean sliding dialog or modal:

  - **Scope Selector:** If logged in as Student, show an intuitive pill toggle ("Campus Issue" vs "City / Civic Issue"). If Citizen, fixed to Civic.

  - **Form Fields:** Issue Title, Clean Textarea for Description, File dropzone for photo (uploads directly to `grievance-images` storage bucket), and a sleek "Post Anonymously" switch.

  - **Location:** Auto-grabs coordinates with an inline map preview pin.

  - **Deduplication Check:** Real-time client check against open issues within 150m radius. If a similar issue is nearby, show a polite inline banner: *"A similar issue was recently reported nearby. You can upvote the existing report to boost its priority."*

---

### 5. Grievance Feed & Card Components

- **Card Design:** Minimal border, structured metadata header (Author / Anonymous, timestamp, category pill, distance indicator).

- **Interactive Upvote Button:** One-click upvote connected to `votes` table that animates and increments count.

- **Resolution Proof View:** If `status == 'resolved'`, render a clean side-by-side Before/After comparison box displaying the original `image_url` alongside the mandatory `resolution_proof_url`.

---

### 6. Participatory Budgeting Tab

- Clean grid of community improvement proposals.

- Shows estimated budget, target scope, vote count, and a minimalistic percentage progress bar indicating community support.

- One-click voting button for registered citizens.

---

### 7. Authority Resolution Dashboard (/authority)

- Triage table / card deck visible strictly to `institute_admin` and `municipality_admin`.

- Filtered automatically to show only complaints matching their scope.

- **Resolution Action Modal:** Clicking "Mark Resolved" requires uploading an evidence image to the `resolution-proofs` bucket. The submit button is strictly disabled until the proof image is uploaded. Submitting updates the status to `resolved` and increments the submitter's points.

---

### 8. Gamification & Citizen Profile (/profile)

- Displays citizen stats: Total points earned, resolved issues count, and Level Tier badge (e.g., "Level 1: Active Citizen").

- Clean preview card for "Citizen Certificate" with a "Download Certificate" button.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f9d89a94-6995-4959-a716-5aec1a936a01).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
