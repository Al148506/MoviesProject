# 🎬 MoviesAPI - Cinema Management System


> ASP.NET Web API backend for a full-stack cinema system using Angular, SQL Server, and Docker.  
> **Live URL**: [https://portfolioacg.com](https://portfolioacg.com)  
> **Backend Repo**: [https://github.com/Al148506/MoviesAPI](https://github.com/Al148506/MoviesAPI)
 **Frontend Repo**: [https://github.com/Al148506/MoviesAngular](https://github.com/Al148506/MoviesAngular) 

---


## 📖Appendix

 [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [API Endpoints](#api-endpoints)
  - [Public Endpoints (General Users)](#public-endpoints-general-users)
  - [Admin Endpoints](#admin-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Database Structure](#database-structure)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)

---



## 🧩Overview

**MoviesAPI** is the backend component of a full-stack cinema system that supports movie discovery for users and administrative control for authorized personnel. It allows general users to browse and search for movies, while administrators can manage all entities in the system including movies, actors, genres, cinemas, and users.

---
## 🏗️Architecture
~~~text
[Angular Frontend]
        |
        v
[ASP.NET Web API] <--> [SQL Server Database]
        |
        v
[Docker / Hosted @ portfolioacg.com]
~~~
## ✨Features
👤 General Users

    View a list of all currently available movies

    Filter movies by genre, cinema, title, or release date

    Search movies by title or keyword

    View detailed movie information

🛠️ Administrators

    Full CRUD operations on:

        Movies

        Actors

        Genres

        Cinemas

        Users

    Manage file uploads for movie posters

    Handle many-to-many relationships (e.g., movie-actor, movie-genre)
## 🔗API Endpoints
Public Endpoints (General Users)
| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| GET    | `/api/movies`        | List all available movies          |
| GET    | `/api/movies/{id}`   | Get details of a specific movie    |
| GET    | `/api/movies/filter` | Filter/search movies by parameters |
| GET    | `/api/genres`        | Get list of all genres             |
| GET    | `/api/cinemas`       | Get list of all cinema locations   |

Admin Endpoints

    🔐 All admin endpoints require authorization with an Admin role.

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/api/movies`           | Add a new movie             |
| PUT    | `/api/movies/{id}`      | Update an existing movie    |
| DELETE | `/api/movies/{id}`      | Delete a movie              |
| POST   | `/api/actors`           | Add a new actor             |
| PUT    | `/api/actors/{id}`      | Update actor details        |
| DELETE | `/api/actors/{id}`      | Remove an actor             |
| POST   | `/api/genres`           | Add a new genre             |
| POST   | `/api/cinemas`          | Add a new cinema            |
| GET    | `/api/users`            | Get list of users           |
| PUT    | `/api/users/{id}/roles` | Assign or change user roles |

## 🔐Authentication & Authorization

Uses JWT Bearer tokens for stateless authentication.

Authorization managed using ASP.NET's [Authorize] attribute and role policies.

Two main roles:

    User: Can access public data

    Admin: Full access to management endpoints
## 🗃️ Database Structure
Uses Entity Framework Core with Code-First migrations. Main tables include:

    Movies

    Actors

    Genres

    Cinemas

    Users

    MovieGenres, MovieActors, MovieCinemas (Join tables for relationships)
## 🚀 Deployment
Dockerized using docker-compose

SQL Server database runs as a container

Hosted on custom domain: https://portfolioacg.com

Production-ready configuration for CORS, HTTPS, and error handling
## 🛠️ Technologies Used

Backend: ASP.NET Core Web API (.NET 7)

Frontend: Angular

Database: SQL Server

ORM: Entity Framework Core

Hosting: Docker + Linux-based server

Auth: JWT

Others: AutoMapper, FluentValidation, Swagger
