# Book*Swap*

## Content

* [Overview](#overview)
* [Features](#features)
* [Some UI Previews](#some-ui-previews)
* [Technologies Used](#technologies-used)
  * [Frontend](#frontend)
  * [Backend](#backend)
* [License](#license)

## Overview

Book*Swap* is a full-stack application that provides users with the ability to comfortably exchange books. 
The application offers functionalities such as user registration, book management, writing revievs, exchange approval, one-on-one chatting, profile and wishlist management. It is designed using REST API principles for efficient communication between the frontend and backend, 
and JWT tokens for secure authentication. The [backend](https://github.com/artsol0/BookSwap-SpringBoot-Backend) is developed using Spring Boot 3, while the [frontend](https://github.com/artsol0/BookSwap-Angular-Frontend) is developed using Angular 17.

## Features

* User Registration and Authentication: Users can register accounts and log in to them.
* Email Confirmation: Accounts are activated after confirming email via a received link.
* Password Recovery: Users can reset their password if forgotten via a link received in their email.
* Book Searching: Users can search for books by various attributes (genre, language, quality, status) and keywords.
* Book Management: Users can create, update, and delete their own books.
* Writing Revievs: Users can add their reviews to books.
* Wishlist Management: Users can add books to their wishlist and remove them.
* One-on-One Chatting: Users can chat with each other directly.
* Profile Management: Users can change their avatar, password, or location.
* Exchange Approval: Users can send exchange offers to each other and confirm or delete them.

## Some UI Previews

### Book serach page

![books_search](https://github.com/artsol0/BookSwap-Angular-Frontend/assets/108554037/6fb4ba80-84f0-4582-a19b-a9f0de1fce34)

### Book profile page

![book_page](https://github.com/artsol0/BookSwap-Angular-Frontend/assets/108554037/cc616598-a16b-4338-a0c8-9efc42952bfe)

### User exchanges page

![exchanges-page](https://github.com/artsol0/BookSwap-Angular-Frontend/assets/108554037/1884ffdb-88e1-4a74-a13d-26da415612bb)

## Technologies Used

### Frontend
* Angular 17
* Tailwind CSS
* SockJS
* Angular Materil Library

### Backend
* Spring Boot 3
* Spring Security 6 with JWT Token Authentication
* Spring Web
* Spring Data JPA
* Spring WebSocket
* Spring Validation
* MySQL Driver
* H2 Database
* Thymeleaf
* Java Mail Sender
* Mockito with JUnit 5
* Lombok

## License

This project is licensed under MIT License. See the [LICENSE](https://github.com/artsol0/BookSwap-Angular-Frontend/blob/main/LICENSE) file for details.
