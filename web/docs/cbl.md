# CBL progress

## Engage

I wanted to make a website for the existing Usof API. Users needed a clear way to find questions, ask questions, and write replies. The site also needed to show different actions to users and administrators.

## Investigate

I learned how to build the interface with React, Redux Toolkit, RTK Query, and React Router. I used URL parameters for filters and pages so links can be reloaded or shared. The API checks permissions for protected actions. I used native form controls and dialogs for keyboard support.

## Act: Basic

I built sign-in, registration, email confirmation, and password reset screens. Users can edit their profiles and manage their questions and replies. The question feed supports search, categories, dates, sorting, and pagination. Replies can be nested, and users can react to questions and replies.

I also added favorites, account deletion, reaction-member lists, direct links to replies, and administrator screens for managing users and content. The API remains responsible for permission checks.

## Act: Creative

I used xp.css to give the site a Windows XP style. Clip, Scout, Wisp, and Byte appear in the shared layout and relevant forms. The home tip changes its character and advice. I added clear question and favorite actions, post sharing, and visual details while keeping the content readable and supporting reduced motion.

## Whole-program algorithm

1. The API reads its settings and connects to MySQL. The frontend starts its Redux store and checks a saved session with `/auth/me`.
2. React Router opens the requested page. The shared layout shows navigation, search, the user session, and a companion character.
3. Page controllers read and validate route and URL values. RTK Query sends requests to the API, which checks the input and permissions before reading or changing the database.
4. Components show the returned questions, replies, profiles, and available actions. Forms send their data to the API, which checks ownership and user roles.
5. After a successful change, RTK Query refreshes related data. The page keeps its URL state and shows a result or an error beside the affected content.
6. Email confirmation and password reset use one-time links from the API. Signing out, session expiry, and account deletion clear local session data. Unexpected page errors show a recovery screen.
