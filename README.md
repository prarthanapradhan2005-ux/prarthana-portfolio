# Prarthana Pradhan — Aerospace Portfolio

A responsive, public aerospace portfolio inspired by the structure of https://irtaza.xyz/, with a pure-black background and animated constellation canvas. Public visitors can browse the site; only the pre-authorized owner account can access the dashboard and modify content.

## Features
- Dark constellation background with reduced-motion support.
- Sections for introduction, projects, skills, experience, certificates, writing, resume and contact.
- Responsive desktop/mobile navigation and project cards with source/demo links and preview images.
- Private dashboard at `/#admin` with Supabase email/password authentication.
- JSON editors for every portfolio section.
- Upload PDF certificates/resume and images through the dashboard to a public Supabase Storage bucket.
- Supabase Row Level Security (RLS) protects database writes and Storage uploads/updates/deletes.
- GitHub Actions deployment to GitHub Pages.

## Important: deployment is not yet connected
This is the website source package. It is not live until you create/configure the GitHub repository and Supabase project, add the two GitHub Actions secrets, and deploy it.

## 1. GitHub Pages
1. Create a **public** GitHub repository named `portfolio`.
2. Upload the contents of this folder to the repository root (not the containing folder).
3. Keep the branch named `main`.
4. In repository Settings → Pages, set the build source to **GitHub Actions**.
5. The workflow in `.github/workflows/deploy.yml` builds and deploys the site after each push.
6. The expected public URL is `https://YOUR-GITHUB-USERNAME.github.io/portfolio/`.

If you use a repository name other than `portfolio`, change `base: '/portfolio/'` in `vite.config.js` to `base: '/YOUR-REPOSITORY-NAME/'`.

## 2. Supabase database and owner authentication
1. Create a project at https://supabase.com/dashboard.
2. Open SQL Editor and run the complete `supabase/schema.sql` file.
3. In Authentication → Providers → Email, enable email/password sign-in.
4. Disable public sign-ups. Do not allow public account creation.
5. In Authentication → Users, create the sole owner account `prarthanapradhan2005@gmail.com` and set a strong password.
6. In Project Settings → API, copy the Project URL and the publishable/anon key. Never use a service-role key in the website.

## 3. GitHub Actions secrets
In GitHub repository Settings → Secrets and variables → Actions, add:
- `VITE_SUPABASE_URL` = your Supabase Project URL
- `VITE_SUPABASE_ANON_KEY` = your Supabase publishable/anon key

The anon/publishable key is expected to be visible to browser clients. Security comes from Supabase RLS policies, not from hiding this key. Never expose the service-role key.

## 4. Owner dashboard
After deployment, open:
`https://YOUR-GITHUB-USERNAME.github.io/portfolio/#admin`

Sign in with the owner email and password created in Supabase. The dashboard is not a public registration page. The front-end also checks the owner email, but the actual security boundary is the database and Storage RLS policy.

## 5. Editing and uploading
- Edit the JSON section fields in the dashboard, preserving valid JSON syntax.
- Click **Save & publish changes** to update the public website.
- To add a certificate PDF or resume: select `Resume / certificate PDF`, choose a PDF and upload. Copy the returned public URL into the relevant `file` or `resume` field in the Profile/Certificates JSON.
- To add a profile or project image: select `Profile or project image`, upload the image and copy its public URL into `profile.photo` or the project's `image` field.
- Project source code URLs go in `source`; demo URLs go in `demo`.
- To add a blog post or article, add an object to `posts` or `articles` with `title`, `description`, `url`, `date`, and optional `type`.

Example project object:
```json
{
  "title": "New Aerospace Project",
  "category": "Aerodynamics",
  "description": "A short explanation of the project.",
  "tags": ["CFD", "Aircraft"],
  "source": "https://github.com/username/repository",
  "demo": "https://example.com",
  "image": "https://your-public-image-url"
}
```

Example certificate object:
```json
{
  "title": "Certificate Name",
  "issuer": "Issuing Organization",
  "date": "2026",
  "file": "https://your-public-pdf-url",
  "credential": ""
}
```

## Visibility and security
- The portfolio content and files uploaded to the public bucket are intentionally public and viewable by anyone.
- Only the owner account can change the portfolio record or upload/update/delete files through Supabase.
- The GitHub repository is public, so its source code is visible. Do not commit passwords, service-role keys, private documents or personal secrets.
- Do not upload sensitive documents: files in the public bucket can be opened by anyone with the URL.
- If you want to change the authorized owner email, update `OWNER_EMAIL` in `src/supabase.js` and every owner-email condition in `supabase/schema.sql`, then rerun the SQL policies.

## Local preview
Install Node.js 22 or later, then:
```bash
npm install
cp .env.example .env.local
# Add your Supabase URL and publishable/anon key to .env.local
npm run dev
```
