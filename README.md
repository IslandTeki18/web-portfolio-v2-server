# Web Portfolio Server
This is the backend server for a web portfolio application. It is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and provides APIs for managing projects, users, contacts, blogs, and file uploads.

### Purpose
The purpose of this server is to provide a robust backend for a web portfolio application. It handles CRUD operations for various resources such as projects, users, contacts, and blogs. It also supports file uploads and integrates with AWS S3 for file storage.

### Structure
The project structure is as follows:
```
.env
.gitignore
package.json
Procfile
server.js
src/
    api/
        blog.api.js
        contact.api.js
        project.api.js
        upload.api.js
        user.api.js
    config/
        db.js
    middleware/
        auth.middleware.js
        error.middleware.js
        upload.middleware.js
    models/
        blog.model.js
        contact.model.js
        project.model.js
        user.model.js
    seeder.js
    services/
        blog.service.js
        contact.service.js
        project.service.js
        upload.service.js
        user.service.js
    tempdata/
        projects.js
        users.js
    utils/
        ...
```
### Key Directories and Files
- **server.js**: Entry point of the application.
- **src/api/**: Contains route handlers for different resources.
- **src/config/**: Contains configuration files, such as database configuration.
- **src/middleware/**: Contains middleware functions for authentication, error handling, and file uploads.
- **src/models/**: Contains Mongoose models for different resources.
- **src/services/**: Contains service functions that handle business logic.
- **src/tempdata/**: Contains temporary data for seeding the database.
- **package.json**: Contains project metadata and dependencies.
- **Procfile**: Used for deployment on platforms like Heroku.

## How to Run

### Prerequisites
- Node.js
- MongoDB
- AWS S3 (for file uploads)

### Setup
1. Clone the repository:
```
git clone <repo-url>
cd web-portfolio-v2-server
```
2. Install dependencies:
```
npm install
```
3. Create a `.env` file in the root directory and add the following environment variables:
```
NODE_ENV=development
PORT=5000
MONGO_URI=<your-mongodb-uri>
AWS_S3_REGION=<your-aws-s3-region>
AWS_S3_ACCESSKEYID=<your-aws-access-key-id>
AWS_S3_SECRETACCESSKEY=<your-aws-secret-access-key>
CORS_ORIGIN=<your-cors-origin>
```

## How to Contribute
1. Fork the repository.
2. Create a new branch:
```
git checkout -b feature/your-feature-name
```
3. Make your changes.
4. Commit your changes:
```
git commit -m "Add your commit message
```
5. Push to the branch:
```
git push origin feature/your-feature-name
```
6. Open a pull request.

## License
This project is licensedunder the MIT License.

## Author
Landon Mckell
