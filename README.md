## User Management App

### Description
A minimal, beginner-friendly React application for managing users. It demonstrates client-side routing, global state management, and basic CRUD-style interactions using a public API. You can browse and search users, view a details page, add a user locally, sort the list, and update or delete users via Redux state.

### Features
- **Fetch users**: Loads users from `https://jsonplaceholder.typicode.com/users` with loading and error states.
- **Search**: Real-time filtering by name or email.
- **User details page**: View address (street, suite, city, zipcode), phone, and website.
- **Add user form**: Client-side validation (required name and email), prepends to the list (local state via Redux store, no API).
- **Sorting**: Sort by name or email, ascending/descending.
- **Update/Delete (Redux)**: Edit user name/email and delete users using Redux Toolkit reducers.
- **Routing**: Vite + React Router for `Home`, `Users`, and `User Details` routes.

### Tech Stack
- **React** 19
- **Vite** (fast dev server and build)
- **React Router** 7
- **Redux Toolkit** 2 + **React Redux** 9
- **TypeScript** 5
- Styling: minimal inline styles (no UI library)

### Getting Started
1. Clone the repository and install dependencies:
```bash
npm install
```
2. Start the development server:
```bash
npm run dev
```
The server will start on a local port (e.g., `http://localhost:5173` or `5174` if the default is in use).

3. Build for production (optional):
```bash
npm run build
npm run preview
```

### Screenshots
Add screenshots to help reviewers quickly understand the app. Place files in a `docs/` folder and reference them here.

```md
![Home](docs/home.png)
![Users List](docs/users-list.png)
![User Details](docs/user-details.png)
```

### Author / Contact
Built by [Your Name] for React Internship Challenge.

Feel free to reach out: `[your.email@example.com]` • `[LinkedIn/GitHub URL]`

