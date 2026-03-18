This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

`pg` package is used for PostgreSQL connection in `lib/db.js`.

Create `.env.local` from `.env.example` and set:

```bash
APP_TIMEZONE=Asia/Kolkata
AUTH_SECRET=replace-with-a-strong-random-secret
DATABASE_URL=postgresql://postgres:password@localhost:5432/swadpoint_db
POSTGRES_SSL=false
POSTGRES_SSL_REJECT_UNAUTHORIZED=false

# optional local fallback (used when DATABASE_URL is not set)
PGUSER=postgres
PGHOST=localhost
PGDATABASE=swadpoint_db
PGPASSWORD=123456
PGPORT=5432
```

Initialize tables manually from:

- `documentation/sql/postgres-init.sql`

Production (Vercel) checklist:

1. Create PostgreSQL database (Neon/Supabase/RDS or your own server).
2. Run `documentation/sql/postgres-init.sql` once in pgAdmin Query Tool.
3. In Vercel project settings, add environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `APP_TIMEZONE` (optional)
   - `POSTGRES_SSL=true` for managed cloud PostgreSQL
4. Redeploy your Vercel project.

Main API routes using PostgreSQL:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET, PUT /api/menu`
- `GET, POST, PATCH, DELETE /api/inventory`
- `GET, POST /api/payments`
- `GET, POST, PATCH /api/orders`

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.






welcompage--login page ,signup page 

1.70%-width---welcome conent background 
2. 30%-width login page ,signup

dashboard---header,siderbar,footer

- make component shortcut---rafce
- app folder ni andar jetala folder bane e atale route 
    ex: localhost:3000/login
    -login (folder) 
-best practices to make route 
1.folder(<route name>) -> file (page.jsx)
2.run project ->npm run dev 
 
 * swadpoint folder structure :
 1.app -> route name(page name)

2.component ->common component (je ek karata vadhare use thata hoy te ne kevay)
- funtion component banvanu ene page ni andar import karanu 
- component ni indar je file bane ano first latter always capital rakhavano nahitar import no thay
-ek j div return karshe component 
- jo tamare main div ni jarur no hoy to tame opening and close tag kari devanu jene react fragment kevay.
    ex:<> </>

3. public folder 
1.assets name nu folder banashe eni andar badhi image Avshe

4.helper folder
utilis name ni file che jema common funtion hashe normal funtion badha hashe 


