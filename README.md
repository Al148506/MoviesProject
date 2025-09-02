# 🎬 Movies Full-Stack Project
> **Live URL**: [https://portfolioacg.ddnsfree.com](https://portfolioacg.ddnsfree.com)  
A complete cinema management system built with **Angular** for the
frontend and **ASP.NET Core Web API** for the backend.\
It allows users to browse movies, watch trailers, and view details,
while administrators can manage all entities in the system.

------------------------------------------------------------------------

## 🏗️ Architecture

``` text
[Browser / Angular Frontend] <--> [ASP.NET Core Web API] <--> [SQL Server Database]
                       |
                       v
             [Docker / portfolioacg.com Hosting]
                  |
                  v
           [CI/CD via GitHub Actions]
```

------------------------------------------------------------------------

## ✨ Features

### 👤 General Users

-   Browse available movies.\
-   Filter by genre, cinema, title, or release date.\
-   Search movies by keyword.\
-   View detailed movie info (poster, synopsis, cast, trailer, cinema
    locations).

### 🛠️ Administrators

-   Full CRUD management for:
    -   Movies\
    -   Actors\
    -   Genres\
    -   Cinemas\
    -   Users\
-   Upload and manage movie posters.\
-   Drag & drop for selecting actors/genres.\
-   Role-based access to management tools.

------------------------------------------------------------------------

## 🔗 API Endpoints (summary)

-   **Public (users)**
    -   `GET /api/movies` → list movies\
    -   `GET /api/movies/{id}` → movie details\
    -   `GET /api/movies/filter` → search/filter movies\
    -   `GET /api/genres` → list genres\
    -   `GET /api/cinemas` → list cinemas
-   **Private (admin, with JWT)**
    -   Full CRUD for movies, actors, genres, and cinemas.\
    -   User management and role assignment.

------------------------------------------------------------------------

## 🔐 Authentication & Authorization

-   Based on **JWT tokens**.\
-   Angular guards (`AuthGuard`, `AdminGuard`).\
-   Main roles:
    -   `User`: access to public endpoints.\
    -   `Admin`: full access to management endpoints.

------------------------------------------------------------------------

## ⚙️ CI/CD

-   **GitHub Actions** set up for:
    -   Running tests on every push/pull request.\
    -   Building Angular frontend and .NET API.\
    -   Creating Docker images and deploying automatically to the
        server.

------------------------------------------------------------------------

## 🚀 Deployment

-   **Frontend**: Angular 17, compiled and served with **Nginx** inside
    Docker.\
-   **Backend**: ASP.NET Core Web API (.NET 7) + SQL Server,
    orchestrated with **docker-compose**.\
-   **Hosting**: Linux server with custom domain:
    <https://portfolioacg.ddnsfree.com>.\> 
-   **CI/CD**: Continuous integration & deployment via **GitHub
    Actions**.

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **Frontend**: Angular, Bootstrap, SCSS, RxJS, Angular Router.\
-   **Backend**: ASP.NET Core Web API, Entity Framework Core,
    AutoMapper, FluentValidation.\
-   **Database**: SQL Server.\
-   **Infrastructure**: Docker, Nginx, Linux.\
-   **Auth**: JWT.\
-   **CI/CD**: GitHub Actions.\
-   **Extras**: Swagger (API docs), SweetAlert2 (notifications), Angular
    Material (UI components).
