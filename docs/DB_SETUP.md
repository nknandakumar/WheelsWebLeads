# Postgres Setup

Create a local `.env.local` at the project root with your database credentials:

```
PGHOST=127.0.0.1
PGPORT=5432
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=your_db
# Optional: set to true when using managed providers requiring SSL
PGSSL=false
```

Then create tables:

```
psql "host=$PGHOST port=$PGPORT dbname=$PGDATABASE user=$PGUSER password=$PGPASSWORD" -f sql/init.sql
```

The app expects:
- `leads` table with unique `loan_id` used as the public identifier.
- `disbursement` table with unique `loan_id` as well.

## Start the app

Install dependencies and run the dev server:

```
npm install
npm run dev
```

API endpoints used by the frontend:
- `GET /api/leads?offset=0&limit=50`
- `POST /api/leads`
- `GET /api/leads/[loan_id]`
- `PUT /api/leads/[loan_id]`
- `DELETE /api/leads/[loan_id]`
- `GET /api/leads/count`
- `GET /api/disbursements?offset=0&limit=50`
- `POST /api/disbursements`
- `GET /api/disbursements/[loan_id]`
- `PUT /api/disbursements/[loan_id]`
- `DELETE /api/disbursements/[loan_id]`
- `GET /api/disbursements/count`

Notes:
- `src/lib/db.ts` reads the above env vars to create a singleton Pool.
- The UI still generates the next loan id client-side via `getNextLoanId()`; you can later move this to the backend if desired.
