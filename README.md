# Cointab SE-ASSIGNMENT

This is a simple 2-page website using Node.js and SQL database.

### Frontend Deploy
#-[Live Frontend](https://cointab-assignment-alpha.vercel.app/) 

### Backend Deploy
#-[Live Backend](https://dull-ruby-dugong-cap.cyclic.app)

### Watch Video
#-[Watch Video](https://drive.google.com/file/d/19FR_sYG3Tdh1DZmwzXkE_AEDCOLfsuUB/view?usp=sharing)
>>>>>>> 1614d45066192b35e27929a972dd90ce7e68baaa

## Clone Repository
   ```bash
  git clone https://github.com/bethimanideep/CointabAssignment
  cd CointabAssignment
   ```

## Installation For Frontend
   ```bash
  cd Client
  npm i
  npm run dev
   ```
## Installation For Backend
   ```bash
  cd Server
  npm i
  node index.js
   ```

## Page 1: Home Page

- Upon opening the website, there should be a prominent heading stating "Cointab SE-ASSIGNMENT."
- Include a button named "All Users" on the webpage.
- When the "All Users" button is clicked, the website should fetch data from the specified API ('<https://jsonplaceholder.typicode.com/users>').
- Display essential user information, including:
  - Name
  - Email
  - Phone
  - Website
  - City
  - Company
- Alongside the displayed user information, provide two buttons, "Open" and "Add.".
  (only “Add” button is visible)
- Clicking the "Add" button should store all the user information coming from the API in the database.
- If the database contains the user's entry, show the "Open" button and hide the “Add” button.
- Clicking the "Open" button should open a new Post page.

## Page 2: Post Page

- Fetch data from the API ('<https://jsonplaceholder.typicode.com/posts?userId=${userId}>') for the specific userId stored in the database.
- Display essential user information, including:
  - Name (corresponding to the specific userId)
  - Title
  - Body
  - Company (associated with the particular userId)
- Place two buttons at the top of the page: "Bulk Add" and "Download In Excel." Initially, only the "Bulk Add" button is visible.
- Clicking the "Bulk Add" button should store all the posts present on that page into the database.
- If the database contains post entries for the specific userId, hide the "Bulk Add" button and show the "Download in Excel" button.
- Clicking the "Download in Excel" button should initiate the download of an Excel file containing all the post information for that particular user.

Email: bethimanideep@gmail.com
