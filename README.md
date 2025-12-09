# E-Banking Application

Application bancaire complète avec backend Spring Boot et frontend React.

## Structure du Projet

- **Backend**: Spring Boot (Java) - API REST
- **Frontend**: React - Interface utilisateur

## Prérequis

- Java 21
- Maven 3.6+
- Node.js 16+ et npm
- MySQL 8.0+

## Configuration Backend

1. Configurez votre base de données MySQL dans `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/E-bank?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
server.port=8085
```

2. Compilez et lancez le backend:
```bash
mvn clean install
mvn spring-boot:run
```

Le backend sera accessible sur `http://localhost:8085`

## Configuration Frontend

1. Installez les dépendances:
```bash
cd frontend
npm install
```

2. Lancez le frontend:
```bash
npm start
```

Le frontend sera accessible sur `http://localhost:3000`

## Fonctionnalités

### Backend (API REST)

- **Gestion des Clients** (`/api/customers`)
  - Créer, lire, mettre à jour, supprimer des clients
  - Rechercher des clients

- **Gestion des Comptes** (`/api/accounts`, `/api/bankAccounts`)
  - Créer des comptes courants (Current Account)
  - Créer des comptes épargne (Saving Account)
  - Lister tous les comptes
  - Obtenir les détails d'un compte

- **Opérations Bancaires** (`/api/accounts`)
  - Créditer un compte
  - Débiter un compte
  - Transférer de l'argent entre comptes
  - Consulter l'historique des opérations

### Frontend (React)

- **Page Clients**: Gestion complète des clients (CRUD)
- **Page Comptes**: Création et visualisation des comptes bancaires
- **Page Opérations**: Effectuer des opérations bancaires et consulter l'historique

## API Endpoints

### Customers
- `GET /api/customers` - Liste tous les clients
- `GET /api/customers/{id}` - Obtenir un client par ID
- `POST /api/customers` - Créer un nouveau client
- `PUT /api/customers/{id}` - Mettre à jour un client
- `DELETE /api/customers/{id}` - Supprimer un client
- `GET /api/customers/search?keyword={keyword}` - Rechercher des clients

### Bank Accounts
- `GET /api/accounts` - Liste tous les comptes
- `GET /api/accounts/{accountId}` - Obtenir un compte par ID
- `POST /api/bankAccounts/currentAccount` - Créer un compte courant
- `POST /api/bankAccounts/savingAccount` - Créer un compte épargne
- `GET /api/accounts/{accountId}/history` - Historique des opérations
- `GET /api/accounts/{accountId}/pageHistory` - Historique paginé

### Operations
- `POST /api/accounts/debit` - Débiter un compte
- `POST /api/accounts/credit` - Créditer un compte
- `POST /api/accounts/transfer` - Transférer de l'argent

## Technologies Utilisées

### Backend
- Spring Boot 4.0.0
- Spring Data JPA
- MySQL
- Lombok
- Maven

### Frontend
- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.2
- CSS3

## Notes

- Assurez-vous que MySQL est en cours d'exécution avant de lancer le backend
- Le backend crée automatiquement les tables nécessaires au démarrage
- CORS est configuré pour permettre les requêtes depuis le frontend

