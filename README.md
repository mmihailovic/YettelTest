> **Napomena: .env fajlove sam pushovao radi lakšeg pregledanja, znam da ne bi trebalo.**

# Uputstvo za pokretanje
- Aplikacija je **dokerizovana** i može se pokrenuti komandom **docker compose up**.
- Za **pokretanje testova** potrebno je:
  - Pokrenuti instancu baze preko Docker-a i kreirati bazu za testove.
  - Podesiti kredencijale i konfiguraciju baze u **.env.test** fajlu.
    - `DB_HOST` – adresa baze (npr. localhost)
    - `DB_PORT` – port baze (npr. 5432)
    - `DB_USER` – username za pristup bazi
    - `DB_PASSWORD` – password za pristup bazi
    - `DB_NAME` – naziv baze
    - `DB_DIALECT` – (npr. `postgres`)
  - Trebalo bi da može da se koristi bilo koja relaciona baza, ali sam testirao samo sa PostgreSQL-om.
  - Pokrenuti testove **npm run test** komandom.
- Aplikacija može da se **pokrene i van Docker-a, direktno iz terminala,** i potrebno je:
  - Pokrenuti instancu baze preko Docker-a i kreirati bazu.
  - Podesiti kredencijale i konfiguraciju baze u **.env.development** fajlu.
  - Pokrenuti komandom **npm run dev**

# Napomene
- Aplikacija koristi layered arhitekturu sa `routes`, `controller`, `service`, `repository` i `model`. Možda je overengineering za ovaj test, ali je dobar pristup za veće projekte i želeo sam da pokažem da razumem takav dizajn.
- API dokumentaciju sam napravio pomoću Swagger-a i dostupna je na ruti `/api-docs`.
- Za autentifikaciju sam koristio JWT. Hteo sam da token čuvam u HttpOnly cookie zbog bezbednosti, ali sam ostavio ovako radi lakšeg testiranja.
- Implementirano je da se svi podaci korisnika zahtevaju prilikom update-a, a mogao bih da uradim i delimični update tako što bih napravio novu rutu sa `PATCH` metodom, uz dodatnu logiku da se ažuriraju samo polja koja nisu `null`.
- Dodatno sam implementirao validaciju inputa pomoću Zod i error handling.

# Tehnologije
- PostgreSQL baza
- Sequelize ORM
- Jest za e2e testove
- Zod za validaciju inputa
- JWT za autentifikaciju
- Swagger za API dokumentaciju
