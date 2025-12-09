# Guide de Démarrage - E-Banking Application

## ⚠️ IMPORTANT - Ordre de Démarrage

Pour que l'application fonctionne correctement, vous devez démarrer les services dans cet ordre :

### 1️⃣ Démarrer MySQL
Assurez-vous que MySQL est en cours d'exécution sur votre machine.

### 2️⃣ Démarrer le Backend (Spring Boot)

```bash
# Dans le répertoire racine du projet
mvn clean install
mvn spring-boot:run
```

**Vérification** : Le backend doit démarrer sur `http://localhost:8085`
Vous devriez voir dans la console :
```
Started EbankingBachendApplication in X.XXX seconds
```

### 3️⃣ Démarrer le Frontend (React)

Ouvrez un **nouveau terminal** et exécutez :

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances (première fois seulement)
npm install

# Démarrer l'application React
npm start
```

**Vérification** : Le frontend doit démarrer sur `http://localhost:3000`
Le navigateur s'ouvrira automatiquement.

## 🔍 Vérification de la Connexion

Une fois les deux applications démarrées :

1. **Dans le navigateur**, vous devriez voir en haut de la page un indicateur de connexion :
   - ✅ **Vert** = Connecté au backend
   - ❌ **Rouge** = Problème de connexion

2. **Si vous voyez une erreur rouge** :
   - Vérifiez que le backend est bien démarré sur le port 8085
   - Vérifiez la console du navigateur (F12) pour voir les erreurs détaillées
   - Vérifiez que MySQL est en cours d'exécution

## 🐛 Résolution des Problèmes

### Problème : "Cannot connect to backend server"

**Solutions** :
1. Vérifiez que le backend est bien démarré :
   ```bash
   # Dans le terminal du backend, vous devriez voir :
   "Started EbankingBachendApplication"
   ```

2. Testez manuellement l'API :
   ```bash
   # Dans un navigateur ou avec curl
   http://localhost:8085/api/customers
   ```
   Vous devriez voir `[]` (liste vide) ou une liste JSON de clients.

3. Vérifiez le port dans `application.properties` :
   ```properties
   server.port=8085
   ```

### Problème : Erreur de connexion MySQL

**Solutions** :
1. Vérifiez que MySQL est démarré
2. Vérifiez les identifiants dans `application.properties` :
   ```properties
   spring.datasource.username=root
   spring.datasource.password=votre_mot_de_passe
   ```
3. Créez la base de données si nécessaire :
   ```sql
   CREATE DATABASE IF NOT EXISTS `E-bank`;
   ```

### Problème : Le frontend reste statique

**Solutions** :
1. Vérifiez que le backend est démarré **AVANT** le frontend
2. Vérifiez la console du navigateur (F12) pour les erreurs
3. Redémarrez le frontend après avoir démarré le backend
4. Vérifiez que l'URL dans `frontend/src/services/api.js` est correcte :
   ```javascript
   const API_BASE_URL = 'http://localhost:8085/api';
   ```

## 📝 Configuration des Ports

- **Backend** : Port `8085` (configuré dans `application.properties`)
- **Frontend** : Port `3000` (par défaut avec React)
- **MySQL** : Port `3306` (par défaut)

## ✅ Test Rapide

Une fois tout démarré, testez ces fonctionnalités :

1. **Créer un client** :
   - Cliquez sur "Customers" dans le menu
   - Cliquez sur "Add New Customer"
   - Remplissez le formulaire et cliquez sur "Create"

2. **Créer un compte** :
   - Cliquez sur "Accounts" dans le menu
   - Cliquez sur "Create New Account"
   - Sélectionnez un client et remplissez les informations

3. **Effectuer une opération** :
   - Cliquez sur "Operations" dans le menu
   - Sélectionnez un compte
   - Effectuez un crédit ou un débit

## 🎯 URLs Importantes

- Frontend : http://localhost:3000
- Backend API : http://localhost:8085/api
- API Customers : http://localhost:8085/api/customers
- API Accounts : http://localhost:8085/api/accounts

