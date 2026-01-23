step 1 :docker compose up -d
step 2 :.env files in /apps/web, /packages/db
step 3 :pnpm -F db generate
step 4 :pnpm -F db migrate
step 5 :pnpm -F web seed:admin
step 6 :pnpm -F web gen:auth-secret
step 7 :pnpm -F web dev
