# CBL progress

## Engage

I started by understanding the task. The goal was to make an API for a programming discussion service. I listed the main things that users need: accounts, posts, comments, reactions, and ratings. I also understood that an administrator needs a separate way to manage the data.

## Investigate

I learned how an API server works with Express and a MySQL database. I looked at user roles, email confirmation, password reset, and file uploads. I chose an MVC structure because it separates routes, controllers, and database models. I also chose AdminJS for the admin panel instead of building a second interface from scratch.

## Act: Basic

I built the server and database for the Basic part. The project has user and admin roles, authentication, posts, categories, comments, reactions, ratings, and avatar uploads. The database can be created or recreated with scripts. I added test data and checked the admin panel and main API routes.

I kept post and comment text protected from admin editing. Admins can still change status and categories when moderation is needed. This makes the rules clear for users and admins.

## Program algorithm

1. The app reads its settings and connects to MySQL. The setup script creates the database, tables, and test data when needed.
2. A request enters a route. The route checks the request data and the user role before calling a controller.
3. The controller asks a model to read or change the database. The model returns safe data or an informative error.
4. Users can create and manage their own posts, comments, and reactions. Reactions recalculate the author rating.
5. Email confirmation and password reset create secure tokens and send a message through the configured mail mode.
6. AdminJS uses the same models for admin work. Only administrators can open the admin panel and manage protected data.
